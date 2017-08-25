class Api::V1::GamesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    if current_user
      user = current_user
    else
      return render status: 403
    end
    games = {
      pending_games: pending_games(user),
      active_games: active_games(user),
      available_games: available_games(user),
      user_id: user.id
    }
    return render json: { games_index_data: games }, adapter: :json
  end

  def show
    if current_user
      user = current_user
    else
      return render status: 403
    end
    game_model = Game.find(params_game_id)
    white = User.find(game_model.white_id)
    black = User.find(game_model.black_id)
    if [white.id, black.id].include?(user.id)
      opponent = User.find( get_opponent_id(white.id, black.id) )
    else
      return render status: 403
    end
    game_data_hash = game_model.serializable_hash(
      except: [
        :active_player_id,
        :creator_id,
        :joiner_id,
        :winner_id,
        :loser_id,
        :created_at,
        :updated_at
      ]
    )
    game_data_hash[:player_data] = {
      user: {
        id: user.id,
        username: user.username,
        color: (user.id == white.id ? "white" : "black")
      },
      opponent: {
        id: opponent.id,
        username: opponent.username,
        color: (opponent.id == white.id ? "white" : "black")
      },
      initial_active_player_label: (game_model.active_player_id == user.id ? 'user' : 'opponent')
    }
    render json: { game_show_data: game_data_hash }, adapter: :json
  end

  def update
    if current_user
      user = current_user
    else
      return render status: 403
    end
    game_update_request_hash = JSON.parse(request.body.read)["patchRequest"]
    game_model = Game.find(params_game_id)
    case game_update_request_hash["patchType"]
    when "switch-turns"
      active_player_id = get_opponent_id(game_model.white_id, game_model.black_id)
      if game_model.update(active_player_id: active_player_id)
        render json: { updated_game: game_model.serializable_hash }, adapter: :json
      end
    when "join-game"
      update_hash = {
        joiner_id: user.id,
        started: true,
      }
      if game_model.white_id.nil?
        update_hash[:white_id] = user.id
        update_hash[:active_player_id] = user.id
      else
        update_hash[:black_id] = user.id
        update_hash[:active_player_id] = game_model.white_id
      end
      if game_model.update(update_hash)
        ActionCable.server.broadcast("games_index", { type: "start_game", creator_id: game_model.creator_id })
        return redirect_to game_path(game_model)
      end
    end
  end

  def create
    if current_user
      user = current_user
    else
      return render status: 403
    end
    create_game_request_hash = JSON.parse(request.body.read)["postRequest"]
    creator_color = create_game_request_hash["creatorColor"]
    new_game = Game.new(creator: user)
    case creator_color
    when 'white'
      new_game.white_id = user.id
    when 'black'
      new_game.black_id = user.id
    end
    if new_game.save
      return render json: { new_game: new_game }, adapter: :json
    else
      return render status: 422
    end
  end

  private

  def available_games(user)
    games_list = non_started_games
    available_games = games_list.reject { |game_hash| game_hash["creator_id"] == user.id }
    return available_games
  end

  def pending_games(user)
    games_list = non_started_games
    pending_games = games_list.select { |game_hash| game_hash["creator_id"] == user.id }
    return pending_games
  end

  def non_started_games
    non_started_game_models = Game.where(started: false, finished: false).order(created_at: :desc)
    non_started_games = []
    non_started_game_models.each_with_index do |game_model, i|
      non_started_games << game_model.serializable_hash(
        only: [
          :id,
          :show_legal_moves,
          :created_at,
          :creator_id,
          :white_id,
          :black_id
        ]
      )
      non_started_games[i]["creator_username"] = User.find(game_model.creator_id).username
    end
    return non_started_games
  end

  def active_games(user)
    all_active_game_models = Game.where(started: true, finished: false)
    all_active_game_models.each do |game_model|
      if game_model.creator_id == game_model.joiner_id
        Game.find(game_model.id).destroy
      end
    end
    active_game_models = all_active_game_models.select do |game_model|
      game_model.creator_id == user.id || game_model.joiner_id == user.id
    end
    active_games = []
    active_game_models.each_with_index do |game_model, i|
      game_hash = game_model.serializable_hash(
        only: [
          :id,
          :show_legal_moves,
          :created_at,
          :creator_id,
          :active_player_id,
          :white_id,
          :black_id
        ]
      )
      active_games << game_hash
      game_moves = active_game_models[i].moves
      if game_moves.length > 0
        active_games[i]['relevant_timestamp'] = game_moves.last.created_at
      else
        active_games[i]['relevant_timestamp'] = active_games[i]['created_at']
      end
      active_games[i]['my_turn'] = (game_model.active_player_id == user.id)
      active_games[i]['moves_count'] = game_model.moves.count
      opponent = User.find( get_opponent_id(game_model.white_id, game_model.black_id) )
      active_games[i]['opponent_id'] = opponent.id
      active_games[i]['opponent_username'] = opponent.username
    end
    my_turn_games = active_games.select { |game_hash| game_hash["my_turn"] }
    my_turn_games.sort_by! { |game_hash| game_hash["updated_at"] }
    opponents_turn_games = active_games.select { |game_hash| !game_hash["my_turn"] }
    opponents_turn_games.sort_by! { |game_hash| game_hash["updated_at"] }

    sorted_active_games = my_turn_games.reverse + opponents_turn_games.reverse
    return sorted_active_games
  end

  def params_game_id
    params.require(:id)
  end
end
