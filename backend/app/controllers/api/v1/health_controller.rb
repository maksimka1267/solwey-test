class Api::V1::HealthController < ApplicationController
  # Простой пинг, без авторизации
  def show
    render json: {
      status: "ok",
      time: Time.current,
      rails_env: Rails.env
    }
  end
end
