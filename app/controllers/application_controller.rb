class ApplicationController < ActionController::Base
  # include Authentication
  protect_from_forgery with: :exception

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  end
  helper_method :current_user

  def authorize
    unless current_user && current_user.id == cookies.signed[:user_id]
      redirect_to new_session_path 
    end
  end
end
