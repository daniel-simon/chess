class GamesController < ApplicationController
  def index
    unless current_user
      redirect_to new_session_path
    else
      render :index
    end
  end

  def show
    unless current_user
      redirect_to new_session_path
    else
      render :show
    end
  end
end
