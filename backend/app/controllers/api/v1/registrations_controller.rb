class Api::V1::RegistrationsController < ApplicationController
  # регистрация не требует быть залогиненным
  # authenticate_user! у нас вообще не before_action глобально, но на всякий случай:
  # skip_before_action :authenticate_user!, only: [:create]

  def create
    user = User.new(user_params)
    user.role ||= "user"  # обычный юзер по умолчанию

    if user.save
      render json: {
        id:         user.id,
        email:      user.email,
        first_name: user.first_name,
        last_name:  user.last_name,
        role:       user.role
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    # Devise сам захэширует пароль
    params.require(:user).permit(
      :first_name,
      :last_name,
      :email,
      :password,
      :password_confirmation
    )
  end
end
