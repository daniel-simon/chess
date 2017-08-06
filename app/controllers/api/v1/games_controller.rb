class Api::V1::GamesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    # for the games index page
    games = []
    game_models = Game.where(finished: false)
    game_models.each_with_index do |game_model, i|
      games[i] = game_model.serializable_hash(only: [:id, :started, :show_legal_moves, :created_at, :creator_id, :joiner_id])
      games[i][:my_game] = false
      games[i][:playing_this_game] = false
      games[i][:creator_name] = User.find(game_model.creator_id).username
      if current_user.id == game_model.creator_id
        games[i][:my_game] = true
        games[i][:playing_this_game] = true
      elsif current_user.id == game_model.joiner_id
        games[i][:playing_this_game] = true
      end
    end
    render json: { games: games }, adapter: :json
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
  end

  private

  def game_id
    params.require(:id)
  end

end
