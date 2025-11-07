// src/App.js
import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import ItemsPage from "./components/ItemsPage";
import OrdersPage from "./components/OrdersPage";
import ProfilePage from "./components/ProfilePage";
import AdminPanel from "./components/AdminPanel";
import { useAuth } from "./AuthContext";

function AppInner() {
  const { user } = useAuth();
  const [tab, setTab] = useState("items"); // items | orders | profile | admin

  // Если не залогинен — показываем только форму авторизации/регистрации
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Тестовый интернет-магазин (Rails + React)</h2>
        <LoginForm />
      </div>
    );
  }

  // Вкладки для залогиненного пользователя
  const tabs = [
    { id: "items", label: "Товары / заказ" },
    { id: "orders", label: "Мои заказы" },
    { id: "profile", label: "Профиль" },
  ];
  if (user.role === "admin") {
    tabs.push({ id: "admin", label: "Админ" });
  }

  const renderTab = () => {
    switch (tab) {
      case "items":
        return <ItemsPage />;
      case "orders":
        return <OrdersPage />;
      case "profile":
        return <ProfilePage />;
      case "admin":
        return <AdminPanel />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Тестовый интернет-магазин (Rails + React)</h2>

      {/* В шапке — информация о пользователе и кнопка выхода */}
      <div style={{ marginBottom: 15 }}>
        <LoginForm />
      </div>

      {/* Вкладки */}
      <div style={{ marginBottom: 15 }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              marginRight: 8,
              fontWeight: tab === t.id ? "bold" : "normal",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Текущая страница */}
      <div>{renderTab()}</div>
    </div>
  );
}

export default function App() {
  return <AppInner />;
}
