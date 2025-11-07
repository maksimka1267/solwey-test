class Api::V1::ItemsController < ApplicationController
  before_action :authenticate_user!, except: [:index, :show]
  before_action :require_admin!, only: [:create, :update, :destroy]
  before_action :set_item, only: [:show, :update, :destroy]

  # GET /api/v1/items
  # поиск по name через ?q=...
  def index
    if params[:q].present?
      @items = Item.where("name ILIKE ?", "%#{params[:q]}%")
    else
      @items = Item.all
    end

    render json: @items
  end

  # GET /api/v1/items/:id
  def show
    render json: @item
  end

  # POST /api/v1/items (только admin)
  def create
    item = Item.new(item_params)

    if item.save
      render json: item, status: :created
    else
      render json: { errors: item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/items/:id (только admin)
  def update
    if @item.update(item_params)
      render json: @item
    else
      render json: { errors: @item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/items/:id (только admin)
  def destroy
    @item.destroy
    head :no_content
  end

  private

  def set_item
    @item = Item.find(params[:id])
  end

  def item_params
    params.require(:item).permit(:name, :description, :price)
  end
end
