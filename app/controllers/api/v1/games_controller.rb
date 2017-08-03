class Api::V1::GamesController < ApplicationController
  def index
    # for the games index page
    games = Game.where(finished: false)
    render json: games, adapter: :json
  end
end
