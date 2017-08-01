class SessionsController < ApplicationController
  def new
    flash[:errors] = ''
    flash[:alert] = ''
    render :new
  end

  def create
    flash[:errors] = ''
    flash[:alert] = ''
    @user = User.find_by(email: login_params[:email])
    if @user && @user.authenticate(login_params[:password])
      session[:user_id] = @user.id
      flash[:notice] = "Logged in successfully"
      redirect_to '/games'
    else
      errors = ''
      if login_params[:password].blank?
        errors << "Please enter a password\n"
      end
      if login_params[:email].blank?
        errors << "Please enter an email address\n"
      end
      if !(login_params[:email].strip.blank? || login_params[:password].strip.blank?)
        errors << "Invalid email address or password"
      end
      flash[:errors] = errors
      render :new
    end
  end

  def destroy
    session[:user_id] = nil
    redirect_to '/'
  end

  private

  def login_params
    params.require(:user).permit(:email, :password)
  end
end
