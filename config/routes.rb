Rails.application.routes.draw do

  root 'sessions#new'

  resources    :users, only: [:new, :create, :destroy, :index, :show]
  resources :sessions, only: [:new, :create, :destroy]
  resources    :games, only: [:index, :show, :new]

  get '/sessions', to: 'sessions#new'
  get '/sessions/*', to: 'sessions#new'


  namespace :api do
    namespace :v1 do
      resources :games, only: [:index, :show, :create, :update] do
        resources :moves, only: [:index]
      end
      resources :moves, only: [:create]
    end
  end

end
