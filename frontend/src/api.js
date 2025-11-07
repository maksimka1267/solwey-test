// src/api.js
import axios from "axios";

// В продакшене берём URL из REACT_APP_API_URL,
// в девелопменте — "/api/v1" (через proxy "http://localhost:3001" из package.json)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/api/v1",
});

// сюда будем класть текущий userId, чтобы слать в X-User-Id
let currentUserId = null;

export function setCurrentUserId(id) {
  currentUserId = id;
}

// перехватчик — в каждый запрос добавляем X-User-Id, если есть
api.interceptors.request.use((config) => {
  if (currentUserId) {
    config.headers["X-User-Id"] = String(currentUserId);
  }
  return config;
});

// ================== АУТЕНТИФИКАЦИЯ ==================

// логин: email + password
export async function login(email, password) {
  const res = await api.post("/login", { email, password });
  // ожидаем формат: { id, email, first_name, last_name, role }
  return res.data;
}

// регистрация обычного пользователя
// user: { first_name, last_name, email, password, password_confirmation }
export async function register(user) {
  const res = await api.post("/register", { user });
  // возвращаем тот же формат, что и login
  return res.data;
}

// ================== ТОВАРЫ ==================

// список товаров (q — строка поиска по name)
export async function fetchItems(q) {
  const res = await api.get("/items", { params: q ? { q } : {} });
  return res.data;
}

// создать товар (только admin)
// payload: { name, description, price }
export async function createItem(payload) {
  const res = await api.post("/items", { item: payload });
  return res.data;
}

// обновить товар (только admin)
export async function updateItem(id, payload) {
  const res = await api.put(`/items/${id}`, { item: payload });
  return res.data;
}

// удалить товар (только admin)
export async function deleteItem(id) {
  await api.delete(`/items/${id}`);
}

// ================== ЗАКАЗЫ ==================

// создать заказ
// items: [{ item_id, quantity }]
export async function createOrder(items) {
  const res = await api.post("/orders", { items });
  return res.data;
}

// список заказов текущего юзера
export async function fetchOrders() {
  const res = await api.get("/orders");
  return res.data;
}

// ================== ПОЛЬЗОВАТЕЛИ ==================

// получить данные текущего (или любого) юзера
export async function fetchUser(id) {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

// обновить данные юзера
// payload: { first_name, last_name, role? }
export async function updateUser(id, payload) {
  const res = await api.put(`/users/${id}`, { user: payload });
  return res.data;
}

// список всех юзеров (только admin)
export async function fetchAllUsers() {
  const res = await api.get("/users");
  return res.data;
}
