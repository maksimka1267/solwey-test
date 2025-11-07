class Api::V1::SessionsController < ApplicationController
  # Логин по email + password, отдаём данные юзера
  def create
    user = User.find_for_database_authentication(email: params[:email])

    if user&.valid_password?(params[:password])
      render json: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role
      }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end
end
