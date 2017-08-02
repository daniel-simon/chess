Rails.application.routes.draw do

  root 'sessions#new'

  get '/games', to: 'games#index'
  get '/games/:id', to: 'games#index'

  resources :users, only: [:new, :create, :destroy]
  resources :sessions, only: [:new, :create, :destroy]

  namespace :api do
    namespace :v1 do
      resources :games, only: [:new, :create, :show, :index, :update]
    end
  end
end
