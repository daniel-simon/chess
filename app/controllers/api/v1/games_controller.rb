class Api::V1::GamesController < ApplicationController

  def index
    # for the games index page
    authorize
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
end
