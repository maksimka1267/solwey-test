// src/components/LoginForm.js
import React, { useState } from "react";
import { login, register } from "../api";
import { useAuth } from "../AuthContext";

export default function LoginForm() {
  const { user, loginUser, logoutUser } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"

  // поля для логина
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("password123");

  // поля для регистрации
  const [reg, setReg] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await login(email, password);
      loginUser(data);
    } catch (err) {
      setError("Неверный email или пароль");
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setReg((r) => ({ ...r, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await register(reg);
      // после успешной регистрации сразу залогиним пользователя
      loginUser(data);
      // можно очистить форму регистрации
      setReg({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
      });
      setMode("login");
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors.join(", "));
      } else {
        setError("Ошибка регистрации");
      }
    }
  };

  // Если уже залогинен — показываем только инфо и кнопку выхода
  if (user) {
    return (
      <div>
        <p>
          Вы вошли как <b>{user.email}</b> ({user.role})
        </p>
        <button onClick={logoutUser}>Выйти</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400 }}>
      {/* переключатель режимов */}
      <div style={{ marginBottom: 10 }}>
        <button
          type="button"
          onClick={() => {
            setError("");
            setMode("login");
          }}
          style={{
            marginRight: 8,
            fontWeight: mode === "login" ? "bold" : "normal",
          }}
        >
          Вход
        </button>
        <button
          type="button"
          onClick={() => {
            setError("");
            setMode("register");
          }}
          style={{
            fontWeight: mode === "register" ? "bold" : "normal",
          }}
        >
          Регистрация
        </button>
      </div>

      {mode === "login" ? (
        <form onSubmit={handleLogin}>
          <h3>Вход</h3>
          <div>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button type="submit">Войти</button>
          <p style={{ fontSize: 12, marginTop: 8 }}>
            Для теста доступны:
            <br />
            admin@example.com / password123
            <br />
            user@example.com / password123
          </p>
        </form>
      ) : (
        <form onSubmit={handleRegister}>
          <h3>Регистрация</h3>
          <div>
            <label>Имя</label>
            <input
              name="first_name"
              value={reg.first_name}
              onChange={handleRegisterChange}
            />
          </div>
          <div>
            <label>Фамилия</label>
            <input
              name="last_name"
              value={reg.last_name}
              onChange={handleRegisterChange}
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={reg.email}
              onChange={handleRegisterChange}
            />
          </div>
          <div>
            <label>Пароль</label>
            <input
              type="password"
              name="password"
              value={reg.password}
              onChange={handleRegisterChange}
            />
          </div>
          <div>
            <label>Подтверждение пароля</label>
            <input
              type="password"
              name="password_confirmation"
              value={reg.password_confirmation}
              onChange={handleRegisterChange}
            />
          </div>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <button type="submit">Зарегистрироваться</button>
        </form>
      )}
    </div>
  );
}
