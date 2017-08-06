Rails.application.routes.draw do

  root 'sessions#new'

  resources :users,    only: [:new, :create, :destroy]
  resources :sessions, only: [:new, :create, :destroy]
  resources :games,    only: [:index, :new, :create, :show]

  namespace :api do
    namespace :v1 do
      resources :games, only: [:index, :create, :update] do
        resources :moves, only: [:index]
      end
      resources :moves, only: [:create]
    end
  end
end
