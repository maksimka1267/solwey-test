// src/components/AdminPanel.js
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import {
  fetchAllUsers,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
} from "../api";

export default function AdminPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    if (user?.role === "admin") {
      loadUsers();
      loadItems();
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <div>Доступно только администратору.</div>;
  }

  const loadUsers = async () => {
    const data = await fetchAllUsers();
    setUsers(data);
  };

  const loadItems = async () => {
    const data = await fetchItems();
    setItems(data);
  };

  const handleNewItemChange = (e) => {
    const { name, value } = e.target;
    setNewItem((ni) => ({ ...ni, [name]: value }));
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    const payload = {
      name: newItem.name,
      description: newItem.description,
      price: parseFloat(newItem.price),
    };
    await createItem(payload);
    setNewItem({ name: "", description: "", price: "" });
    loadItems();
  };

  const handleUpdateItemField = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSaveItem = async (item) => {
    const payload = {
      name: item.name,
      description: item.description,
      price: parseFloat(item.price),
    };
    await updateItem(item.id, payload);
    loadItems();
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm("Удалить товар?")) return;
    await deleteItem(id);
    loadItems();
  };

  return (
    <div>
      <h3>Админ-панель</h3>

      <section style={{ marginBottom: 30 }}>
        <h4>Пользователи</h4>
        <table border="1" cellPadding="4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Email</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Роль</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.first_name}</td>
                <td>{u.last_name}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h4>Товары (редактирование)</h4>

        <form onSubmit={handleCreateItem} style={{ marginBottom: 15 }}>
          <div>
            <input
              placeholder="Название"
              name="name"
              value={newItem.name}
              onChange={handleNewItemChange}
            />
            <input
              placeholder="Описание"
              name="description"
              value={newItem.description}
              onChange={handleNewItemChange}
            />
            <input
              placeholder="Цена"
              name="price"
              value={newItem.price}
              onChange={handleNewItemChange}
            />
            <button type="submit">Добавить товар</button>
          </div>
        </form>

        <table border="1" cellPadding="4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Цена</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <input
                    value={item.name}
                    onChange={(e) =>
                      handleUpdateItemField(item.id, "name", e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    value={item.description || ""}
                    onChange={(e) =>
                      handleUpdateItemField(
                        item.id,
                        "description",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    value={item.price}
                    onChange={(e) =>
                      handleUpdateItemField(item.id, "price", e.target.value)
                    }
                  />
                </td>
                <td>
                  <button onClick={() => handleSaveItem(item)}>Сохранить</button>
                  <button onClick={() => handleDeleteItem(item.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
