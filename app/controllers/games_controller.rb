class GamesController < ApplicationController
  def index
    authorize
  end

  def show
    authorize
  end
end
