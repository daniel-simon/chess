Rails.application.routes.draw do

  root 'sessions#new'

  resources :users, only: [:new, :create, :destroy]
  resources :sessions, only: [:new, :create, :destroy]

end
