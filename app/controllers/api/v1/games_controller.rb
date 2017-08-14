class Api::V1::GamesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    user = authorize_user
    games = {
      pending_games: pending_games(user),
      active_games: active_games(user),
      available_games: available_games(user),
      user_id: user.id
    }

    render json: { games_index_data: games }, adapter: :json
  end

  def show
    user = authorize_user
    game_model = Game.find(params_game_id)
    unless game_model.started
      if game_model.creator_id == user.id
        flash[:alert] = "Can't join a game that you also created"
        return redirect_to games_path
      else
        join_and_begin_game(user, game_model)
      end
    end
    white = User.find(game_model.white_id)
    black = User.find(game_model.black_id)
    if [white.id, black.id].include?(user.id)
      opponent = User.find( get_opponent_id(white.id, black.id, user) )
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
    user = authorize_user
    game_update_request_hash = JSON.parse(request.body.read)["patchRequest"]
    game_model = Game.find(params_game_id)
    case game_update_request_hash["patchType"]
    when "switch-turns"
      active_player_id = get_opponent_id(game_model.white_id, game_model.black_id, user)
      if game_model.update(active_player_id: active_player_id)
        render json: { updated_game: game_model.serializable_hash }, adapter: :json
      end
    end
  end

  def create
    user = authorize_user
    create_game_request_hash = JSON.parse(request.body.read)["postRequest"]
    new_game = Game.new(creator: user)
    if new_game.save
      render json: { new_game: new_game }, adapter: :json
    else
      render status: 422
    end
  end

  private

  def authorize_user
    if current_user
      return current_user
    else
      return render status: 403
    end
  end

  def join_and_begin_game(user, game_model)
    game_model.update(joiner_id: user.id, started: true, active_player_id: game_model.white_id)
  end

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
    non_started_game_models = Game.where(started: false, finished: false)
    non_started_game_models = non_started_game_models.sort_by { |game| game.created_at }
    non_started_games = []
    non_started_game_models.each_with_index do |game_model, i|
      non_started_games << game_model.serializable_hash(
        only: [
          :id,
          :show_legal_moves,
          :created_at,
          :creator_id
        ]
      )
      non_started_games[i]["creator_username"] = User.find(game_model.creator_id).username
    end
    return non_started_games.reverse
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
      active_games << game_model.serializable_hash(
        only: [
          :id,
          :show_legal_moves,
          :updated_at,
          :creator_id,
          :active_player_id
        ]
      )
      active_games[i]['white_id'] = game_model.white_id
      active_games[i]['black_id'] = game_model.black_id

      active_games[i]['my_turn'] = (game_model.active_player_id == user.id)
      active_games[i]['moves_count'] = game_model.moves.count

      opponent = User.find( get_opponent_id(game_model.white_id, game_model.black_id, user) )
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

  def get_opponent_id(player1_id, player2_id, player)
    player_ids = [ player1_id, player2_id ]
    opponent_id = player_ids.each do |id|
      break id if id != player.id
    end
    return opponent_id
  end

  def params_game_id
    params.require(:id)
  end

end
