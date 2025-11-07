// src/components/ProfilePage.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import { fetchUser, updateUser } from "../api";

export default function ProfilePage() {
  const { user, loginUser } = useAuth();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    role: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      loadProfile();
    }
    // eslint-disable-next-line
  }, [user]);

  const loadProfile = async () => {
    const data = await fetchUser(user.id);
    setForm({
      first_name: data.first_name || "",
      last_name: data.last_name || "",
      role: data.role || "",
    });
  };

  if (!user) return <div>Нужно войти.</div>;

  const isAdmin = user.role === "admin";

  const handleChange = (e) => {
    setMessage("");
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage("");
    const payload = {
      first_name: form.first_name,
      last_name: form.last_name,
    };
    if (isAdmin) {
      payload.role = form.role;
    }
    const updated = await updateUser(user.id, payload);
    loginUser(updated); // обновим контекст
    setMessage("Профиль обновлён");
  };

  return (
    <div>
      <h3>Мой профиль</h3>
      <form onSubmit={handleSave} style={{ maxWidth: 400 }}>
        <div>
          <label>Имя</label>
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Фамилия</label>
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input value={user.email} disabled />
        </div>
        <div>
          <label>Роль</label>
          <input
            name="role"
            value={form.role}
            onChange={handleChange}
            disabled={!isAdmin}
          />
        </div>
        <button type="submit">Сохранить</button>
        {message && <div style={{ marginTop: 5 }}>{message}</div>}
      </form>
    </div>
  );
}
