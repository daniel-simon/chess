Rails.application.routes.draw do

  root 'sessions#new'

  resources :users,     only: [:new, :create, :destroy]
  resources :sessions,  only: [:new, :create, :destroy]
  resources :games,     only: [:index, :show, :new, :create]

  namespace :api do
    namespace :v1 do
      resources :games, only: [:index, :show, :create, :update] do
        resources :moves, only: :index
      end
      resources :moves, only: :create
    end
  end
end
