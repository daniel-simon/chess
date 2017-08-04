class UsersController < ApplicationController

  def new
    @user = User.new
    render :new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      flash[:notice] = "Account successfully created. Welcome, #{@user.username}!"
      redirect_to '/games'
    else
      flash[:alert] = "Failed to create account: #{@user.errors.full_messages.to_sentence}"
      render :new
    end
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation)
  end
end
