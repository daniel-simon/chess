class UsersController < ApplicationController

  def new
    @user = User.new
    flash[:errors] = ''
    flash[:alert] = ''
    render :new
  end
  def create
    flash[:errors] = ''
    flash[:alert] = ''
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      flash[:notice] = "Account created successfully"
      redirect_to '/'
    else
      flash[:alert] = "Failed to create account"
      flash[:errors] = @user.errors.full_messages.to_sentence
      render :new
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
end
