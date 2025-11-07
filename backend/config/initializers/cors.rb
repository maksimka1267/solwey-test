# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Откуда разрешаем запросы:
    origins "https://frontend-5v01.onrender.com",
            "http://localhost:3000"   # для локальной разработки

    # Какие ресурсы и методы разрешены
    resource "*",
             headers: :any,
             methods: %i[get post put patch delete options head],
             max_age: 600
  end
end
