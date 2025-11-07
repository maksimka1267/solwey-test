// src/components/ItemsPage.js
import React, { useEffect, useState } from "react";
import { fetchItems, createOrder } from "../api";
import { useAuth } from "../AuthContext";

export default function ItemsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]); // [{item, quantity}]
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line
  }, []);

  const loadItems = async (q) => {
    const data = await fetchItems(q);
    setItems(data);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadItems(search);
  };

  const addToCart = (item) => {
    const q = parseInt(
      prompt(`Введите количество для "${item.name}"`, "1") || "0",
      10
    );
    if (!q || q <= 0) return;

    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + q } : c
        );
      }
      return [...prev, { item, quantity: q }];
    });
  };

  const handleCheckout = async () => {
    if (!user) {
      alert("Сначала войдите в систему");
      return;
    }
    if (cart.length === 0) {
      alert("Корзина пуста");
      return;
    }
    try {
      const payload = cart.map((c) => ({
        item_id: c.item.id,
        quantity: c.quantity,
      }));
      const order = await createOrder(payload);
      setMessage(`Заказ #${order.id} создан на сумму ${order.amount}`);
      setCart([]);
    } catch (err) {
      console.error(err);
      alert("Ошибка при создании заказа");
    }
  };

  const total = cart.reduce(
    (sum, c) => sum + parseFloat(c.item.price) * c.quantity,
    0
  );

  return (
    <div>
      <h3>Товары</h3>

      <form onSubmit={handleSearch} style={{ marginBottom: 10 }}>
        <input
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Найти</button>
      </form>

      <div style={{ display: "flex", gap: "40px" }}>
        <div>
          <h4>Список товаров</h4>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <b>{item.name}</b> — {item.description} — {item.price}
                <button
                  style={{ marginLeft: 8 }}
                  onClick={() => addToCart(item)}
                >
                  Добавить
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4>Корзина</h4>
          {cart.length === 0 && <div>Пусто</div>}
          {cart.length > 0 && (
            <>
              <ul>
                {cart.map((c) => (
                  <li key={c.item.id}>
                    {c.item.name} × {c.quantity} ={" "}
                    {parseFloat(c.item.price) * c.quantity}
                  </li>
                ))}
              </ul>
              <div>Итого: {total}</div>
              <button onClick={handleCheckout}>Оплатить (создать заказ)</button>
            </>
          )}
          {message && <div style={{ marginTop: 10 }}>{message}</div>}
        </div>
      </div>
    </div>
  );
}
