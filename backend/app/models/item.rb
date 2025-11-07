class Item < ApplicationRecord
  has_many :order_descriptions, dependent: :destroy
end
