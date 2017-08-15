class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  helper_method :current_user

  def get_opponent_id(player1_id, player2_id)
    player_ids = [ player1_id, player2_id ]
    opponent_id = player_ids.each do |id|
      break id if id != current_user.id
    end
    return opponent_id
  end
  helper_method :get_opponent_id

  def authorize
    unless current_user && current_user.id == cookies.signed[:user_id]
      redirect_to new_session_path
    end
  end
end
