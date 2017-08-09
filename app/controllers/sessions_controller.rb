class SessionsController < ApplicationController
  def new
    if current_user
      redirect_to games_path
    else
      render :new
    end
  end

  def create
    @user = User.find_by(username: login_params[:username])
    if @user && @user.authenticate(login_params[:password])
      session[:user_id] = @user.id
      flash[:notice] = "Logged in successfully"
      redirect_to games_path
    else
      errors = ''
      if login_params[:username].blank?
        errors += "Please enter a username. "
      end
      if login_params[:password].blank?
        errors += "Please enter a password. "
      end
      if !(login_params[:username].strip.blank? || login_params[:password].strip.blank?)
        errors += "Invalid username or password."
      end
      flash[:alert] = errors
      render :new
    end
  end

  def destroy
    session[:user_id] = nil
    flash[:notice] = "Logged out successfully"
    redirect_to '/'
  end

  private

  def login_params
    params.require(:user).permit(:username, :password)
  end
end
