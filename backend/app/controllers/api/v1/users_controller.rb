class Api::V1::UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_user, only: [:show, :update]

  # GET /api/v1/users (только admin)
  def index
    require_admin!
    render json: User.all
  end

  # GET /api/v1/users/:id
  # admin может смотреть любого, user — только себя
  def show
    if current_user.role == "admin" || current_user.id == @user.id
      render json: @user
    else
      render json: { error: "Forbidden" }, status: :forbidden
    end
  end

  # PATCH/PUT /api/v1/users/:id
  # admin может менять всё, user — только свои first_name/last_name
  def update
    unless current_user.role == "admin" || current_user.id == @user.id
      return render json: { error: "Forbidden" }, status: :forbidden
    end

    permitted = [:first_name, :last_name]
    permitted << :role if current_user.role == "admin"

    if @user.update(params.require(:user).permit(permitted))
      render json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_user
    @user = User.find(params[:id])
  end
end
