# Тестовий інтернет-магазин (Rails + React)

Невеликий демонстраційний проєкт інтернет-магазину:

* бекенд: **Ruby on Rails (API) + PostgreSQL + Devise**
* фронтенд: **React (Create React App)**
* аутентифікація: email + пароль (через Devise), роль користувача (`user` / `admin`)
* основна логіка: вибір товарів, оформлення замовлення, перегляд власних замовлень, панель адміністратора

---

## Стек технологій

**Backend**

* Ruby (Rails 8.x, API mode)
* PostgreSQL
* Devise (аутентифікація)
* rack-cors (для CORS при локальній розробці за потреби)

**Frontend**

* React (Create React App)
* Axios (запити до API)

---

## Структура проєкту

```text
solwey-test/
  backend/   # Rails API
  frontend/  # React SPA
```

---

## Функціонал

### Ролі

**USER**

* реєстрація / логін
* редагування власних даних (ім’я, прізвище)
* перегляд списку товарів
* додавання товарів у «кошик»
* оформлення замовлення
* перегляд списку своїх замовлень та деталізації кожного

**ADMIN**

* все, що вміє USER
* перегляд списку користувачів
* редагування товарів (створення / оновлення / видалення)
* перегляд даних будь-якого користувача (через API)

---

## Модель даних (таблиці)

1. **users**

   * `first_name`
   * `last_name`
   * `email`
   * `encrypted_password` (Devise)
   * `role` (`admin` або `user`)

2. **items**

   * `name`
   * `description`
   * `price`

3. **orders**

   * `user_id` (звʼязок з users)
   * `amount` (загальна сума замовлення)

4. **order_descriptions**

   * `order_id` (звʼязок з orders)
   * `item_id` (звʼязок з items)
   * `quantity` (кількість одиниць товару в замовленні)

---

## Локальний запуск (development)

### Необхідні інструменти

* Ruby (версія, сумісна з Rails 8.x)
* PostgreSQL
* Node.js + npm
* Git

---

### 1. Налаштування backend (Rails API)

```bash
cd backend
bundle install
```

#### Конфігурація бази даних

У файлі `backend/config/database.yml` повинні бути налаштовані доступи до PostgreSQL, наприклад:

```yaml
default: &default
  adapter: postgresql
  encoding: unicode
  host: 127.0.0.1
  port: 5432
  username: postgres
  password: "your_password"
  pool: 5

development:
  <<: *default
  database: backend_development

test:
  <<: *default
  database: backend_test
```

#### Створення та міграція БД

```bash
bundle exec rails db:create
bundle exec rails db:migrate
bundle exec rails db:seed
```

Сіди створюють:

* адміністратора:

  * email: `admin@example.com`
  * пароль: `password123`
* звичайного користувача:

  * email: `user@example.com`
  * пароль: `password123`
* кілька тестових товарів (наприклад, Laptop, Mouse)

#### Запуск серверу

Рекомендовано запускати бекенд на порту **3001**:

```bash
bundle exec rails s -p 3001
```

Перевірка health-ендпоїнту:

```text
GET http://localhost:3001/api/v1/health
```

Очікується JSON-відповідь `{"status":"ok", ...}`.

---

### 2. Налаштування frontend (React)

В іншому терміналі:

```bash
cd frontend
npm install
```

У `frontend/package.json` налаштований proxy:

```json
"proxy": "http://localhost:3001"
```

У файлі `frontend/src/api.js` базовий шлях до API:

```js
const api = axios.create({
  baseURL: "/api/v1",
});
```

Це означає, що в development усі запити з React на `/api/v1/...` будуть проксуватися на `http://localhost:3001/api/v1/...`.

#### Запуск фронтенду

```bash
npm start
```

React буде доступний за адресою:

```text
http://localhost:3000
```

---

## Як користуватись додатком

1. Відкрити `http://localhost:3000`.
2. Спочатку відображається лише блок **авторизації / реєстрації**.
3. Можна:

   * увійти як:

     * `admin@example.com / password123`
     * `user@example.com / password123`
   * або зареєструвати нового користувача (роль за замовчуванням — `user`).

### Після авторизації

Зʼявляються вкладки:

* **Товари / замовлення**

  * список товарів
  * пошук за назвою
  * додавання товарів до «кошика» з вказанням кількості
  * кнопка «Оплатити» → створюється запис в `orders` та відповідні записи в `order_descriptions`

* **Мої замовлення**

  * список замовлень поточного користувача
  * для кожного замовлення:

    * сума
    * дата
    * деталізація (`items` + `quantity`) у розгорнутому вигляді

* **Профіль**

  * перегляд та редагування:

    * імʼя
    * прізвище
  * роль:

    * доступна для редагування лише якщо користувач — `admin`

* **Адмін** (видно тільки для `admin`)

  * **Користувачі**:

    * таблиця зі списком всіх користувачів (id, email, імʼя, прізвище, роль)
  * **Товари**:

    * створення нового товару
    * редагування назви, опису, ціни існуючих товарів
    * видалення товарів

---

## Авторизація на API

На боці бекенду використовується Devise для зберігання паролів та валідацій.

Для спрощення інтеграції з фронтом у цьому тестовому проєкті:

* логін викликається через:

  ```http
  POST /api/v1/login
  ```

  з тілом:

  ```json
  { "email": "user@example.com", "password": "password123" }
  ```

* у відповіді повертається JSON з `id`, `email`, `first_name`, `last_name`, `role`.

* фронтенд зберігає `id` користувача і передає його в заголовку `X-User-Id` в кожному запиті до API.

* на боці Rails в `ApplicationController` це використовується для визначення `current_user`.

> Для продакшен-рішень, звичайно, варто використовувати JWT / session cookies / Devise Token Auth.
> Тут реалізовано спрощений варіант з навчальною метою.

---

## Можливий продакшн-деплой (коротко)

Один із варіантів:

* **Backend (Rails + Postgres)** — деплой на Render.com (Web Service + PostgreSQL Free).
* **Frontend (React)** — деплой статичного білда (`npm run build`) на Netlify або Vercel.

У цьому випадку в `frontend` можна використати змінну оточення:

```env
REACT_APP_API_URL=https://your-backend.onrender.com/api/v1
```

та в `src/api.js` читати її через:

```js
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api/v1",
});
```

---

## Примітка

Цей проєкт призначений як тестове завдання:

* акцент зроблено на вміннях:

  * швидко розібратися з новим стеком (Rails + React),
  * побудувати просту архітектуру `API backend + SPA frontend`,
  * реалізувати базову бізнес-логіку інтернет-магазину.
* дизайн мінімалістичний, без фокусу на візуальну частину.
