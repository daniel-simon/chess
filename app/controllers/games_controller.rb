class GamesController < ApplicationController
  def index
    authorize
  end

  def show
    authorize
  end

  def new
    authorize
  end
end
