# Создаём администратора
admin = User.find_or_create_by!(email: "admin@gmail.com") do |u|
  u.first_name = "Admin"
  u.last_name  = "User"
  u.role       = "admin"
  u.password   = "password123"
  u.password_confirmation = "password123"
end

# Обычный пользователь
user = User.find_or_create_by!(email: "user@gmail.com") do |u|
  u.first_name = "Regular"
  u.last_name  = "User"
  u.role       = "user"
  u.password   = "password123"
  u.password_confirmation = "password123"
end

# Пара товаров
Item.find_or_create_by!(name: "Laptop") do |i|
  i.description = "Simple test laptop"
  i.price = 999.99
end

Item.find_or_create_by!(name: "Mouse") do |i|
  i.description = "Wireless mouse"
  i.price = 25.50
end

puts "Seed done. Admin: admin@example.com / password123, User: user@example.com / password123"
