class Api::V1::OrdersController < ApplicationController
  before_action :authenticate_user!
  before_action :set_order, only: [:show]

  # GET /api/v1/orders
  # список заказов текущего юзера
  def index
    orders = current_user.orders.includes(order_descriptions: :item)
    render json: orders.as_json(include: { order_descriptions: { include: :item } })
  end

  # GET /api/v1/orders/:id
  def show
    unless @order.user_id == current_user.id || current_user.role == "admin"
      return render json: { error: "Forbidden" }, status: :forbidden
    end

    render json: @order.as_json(include: { order_descriptions: { include: :item } })
  end

  # POST /api/v1/orders
  # ожидаем payload:
  # { "items": [ { "item_id": 1, "quantity": 2 }, { "item_id": 3, "quantity": 1 } ] }
  def create
    items = params[:items] || []

    ActiveRecord::Base.transaction do
      order = current_user.orders.build
      total_amount = 0

      items.each do |entry|
        item = Item.find(entry[:item_id])
        quantity = entry[:quantity].to_i
        line_amount = item.price * quantity
        total_amount += line_amount

        order.order_descriptions.build(item: item, quantity: quantity)
      end

      order.amount = total_amount
      order.save!

      render json: order.as_json(include: { order_descriptions: { include: :item } }),
             status: :created
    end
  rescue ActiveRecord::RecordInvalid => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def set_order
    @order = Order.find(params[:id])
  end
end
