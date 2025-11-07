// src/components/OrdersPage.js
import React, { useEffect, useState } from "react";
import { fetchOrders } from "../api";
import { useAuth } from "../AuthContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    const data = await fetchOrders();
    setOrders(data);
  };

  if (!user) {
    return <div>Нужно войти, чтобы видеть свои заказы.</div>;
  }

  return (
    <div>
      <h3>Мои заказы</h3>
      {orders.length === 0 && <div>Пока нет заказов.</div>}
      {orders.map((order) => (
        <div
          key={order.id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
        >
          <div>
            <b>Заказ #{order.id}</b> — сумма: {order.amount}
          </div>
          <div>Дата: {new Date(order.created_at).toLocaleString()}</div>
          <details style={{ marginTop: 5 }}>
            <summary>Показать состав заказа</summary>
            <ul>
              {order.order_descriptions?.map((od) => (
                <li key={od.id}>
                  {od.item?.name} — {od.quantity} шт × {od.item?.price}
                </li>
              ))}
            </ul>
          </details>
        </div>
      ))}
    </div>
  );
}
