class Api::V1::GamesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    if current_user
      user = current_user
    else
      return render status: 403
    end
    games = {
      active_games: active_games(user),
      available_games: available_games(user)
    }

    render json: { games_index_data: games }, adapter: :json
  end

  def show
    if current_user
      user = current_user
    else
      return render status: 403
    end
    game_model = Game.find(game_id)
    white = User.find(game_model.white_id)
    black = User.find(game_model.black_id)
    unless [white.id, black.id].include?(user.id)
      return render status: 403
    else
      opponent = User.find( get_opponent_id(white.id, black.id) )
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
    game_update_request_hash = JSON.parse(request.body.read)
    game = Game.find(game_id)
    case game_update_request_hash["patchType"]
    when "join-game"
      white_id = game.white_id
      if game.update(joiner_id: user.id, started: true, active_player_id: white_id)
        render json: { joined_game: game.serializable_hash }, adapter: :json
      end
    when "switch-turns"
      active_color = game_update_request_hash["activeColor"]
      active_player_id = (active_color == 'white') ? game.white_id : game.black_id
      if game.update(active_player_id: active_player_id)
        render json: { updated_game: game.serializable_hash }, adapter: :json
      end
    end
  end

  # def create
  #   if current_user
  #     user = current_user
  #   else
  #     return render status: 403
  #   end
  #   create_game_request_hash = JSON.parse(request.body.read)
  #   show_legal_moves = create_game_request_hash["showLegalMoves"]
  #   new_game = Game.new(creator: current_user, show_legal_moves: show_legal_moves)
  #   if new_game.save
  #     render json: { new_game: new_game }, adapter: :json
  #   else
  #     render status: 422
  #   end
  # end

  private

  def available_games(user)
    available_game_models = Game.where(started: false, finished: false)
    available_game_models = available_game_models.sort_by { |game| game.created_at }
    available_games = []
    available_game_models.each_with_index do |game_model, i|
      available_games << game_model.serializable_hash(
        only: [
          :id,
          :show_legal_moves,
          :created_at,
          :creator_id
        ]
      )
      available_games[i]["creator_username"] = User.find(game_model.creator_id).username
    end
    available_games = available_games.reject { |game_hash| game_hash["creator_id"] == user.id }
    return available_games
  end

  def active_games(user)
    all_active_game_models = Game.where(started: true, finished: false)
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

  def get_opponent_id(player1_id, player2_id)
    player_ids = [ player1_id, player2_id ]
    opponent_id = player_ids.each do |id|
      break id if id != current_user.id
    end
    return opponent_id
  end

  def game_id
    params.require(:id)
  end

end
