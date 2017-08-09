class GamesController < ApplicationController
  def index
    authorize_or_redirect
  end

  def show
    authorize_or_redirect
  end

  def new
    authorize_or_redirect
  end

  private

  def authorize_or_redirect
    unless current_user
      redirect_to new_session_path
    end
  end
end
