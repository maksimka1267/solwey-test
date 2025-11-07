Rails.application.routes.draw do
  devise_for :users, defaults: { format: :json }

  namespace :api do
    namespace :v1 do
      get "health", to: "health#show"

      post "login",    to: "sessions#create"
      post "register", to: "registrations#create"

      resources :items
      resources :orders, only: [:index, :show, :create]
      resources :users,  only: [:index, :show, :update]
    end
  end
end
