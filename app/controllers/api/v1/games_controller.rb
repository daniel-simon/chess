class Api::V1::GamesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    # for the games index page
    games = []
    game_models = Game.where(finished: false)
    game_models.each_with_index do |game_model, i|
      games[i] = game_model.serializable_hash(
        only: [
          :id,
          :started,
          :show_legal_moves,
          :created_at,
          :creator_id,
          :joiner_id
        ]
      )
      games[i]["my_game"] = false
      games[i]["playing_this_game"] = false
      games[i]["creator_name"] = User.find(game_model.creator_id).username
      if current_user.id == game_model.creator_id
        games[i]["my_game"] = true
        games[i]["playing_this_game"] = true
      elsif current_user.id == game_model.joiner_id
        games[i]["playing_this_game"] = true
      end
      if games[i]["playing_this_game"]
        games[i]["my_turn"] = false
        if game_model.active_player_id == current_user.id
          games[i]["my_turn"] = true
        end
      end
    end
    render json: { games: games }, adapter: :json
  end

  def show
    game_model = Game.find(game_id)
    game_data_hash = game_model.serializable_hash(
      except: [
        :active_player_id,
        :creator_id,
        :joiner_id,
        :winner_id,
        :loser_id
      ]
    )
    player_ids = [game_model.white_id, game_model.black_id]
    unless player_ids.include?(current_user.id)
      return render status: 403
    end
    opponent_id = player_ids.each do |id|
      break id unless current_user.id == id
    end
    opponent = User.find(opponent_id)
    user = current_user
    white = User.find(game_model.white_id)
    black = User.find(game_model.black_id)
    active_id = game_model.active_player_id
    game_data_hash["player_data"] = {
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
      initial_active_player_label: (active_id == user.id ? 'user' : 'opponent')
    }

    render json: { game_show_data: game_data_hash }, adapter: :json
  end

  def update
    game_update_request_hash = JSON.parse(request.body.read)
    game = Game.find(game_id)
    case game_update_request_hash["patchType"]
    when "join-game"
      white_id = game.white_id
      if game.update(joiner_id: current_user.id, started: true, active_player_id: white_id)
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

  def create
    create_game_request_hash = JSON.parse(request.body.read)
    show_legal_moves = create_game_request_hash["showLegalMoves"]
    new_game = Game.new(creator: current_user, show_legal_moves: show_legal_moves)
    if new_game.save
      render json: { new_game: new_game }, adapter: :json
    else
      render status: 422
    end
  end

  private

  def game_id
    params.require(:id)
  end

end
