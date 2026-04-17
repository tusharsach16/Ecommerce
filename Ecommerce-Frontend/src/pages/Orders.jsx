import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import axios from "../axios";

const CATEGORY_ICONS = {
  Laptop: "💻",
  Mobile: "📱",
  Headphone: "🎧",
  Electronics: "📺",
  Fashion: "👟",
  Toys: "🧸",
};

const Orders = () => {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoggedIn && user?.id) {
      axios.get(`/orders/user/${user.id}`)
        .then(res => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching orders:", err);
          setLoading(false);
        });
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return (
      <div className="orders-page flex-center">
        <div className="auth-error-card">
          <h2>🔒 Members Only</h2>
          <p>Sign in to track and view your order history.</p>
          <Link to="/login" className="aura-btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-header">
          <h1 className="orders-title">Order History</h1>
        </div>
        <div className="orders-list">
          {[1,2,3].map(i => (
            <div key={i} className="order-item-skeleton"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="orders-title">Your Orders</h1>
        <p className="orders-subtitle">{orders.length} orders placed in total</p>
      </div>

      <div className="orders-container">
        {orders.length === 0 ? (
          <div className="no-orders-card">
            <span className="no-orders-icon">🛒</span>
            <h3>No orders yet</h3>
            <p>Ready to make your first purchase? Explore our collection!</p>
            <Link to="/shop" className="aura-btn-primary">Browse Shop</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-box">
                <div className="order-box-header">
                  <div className="o-meta">
                    <span className="o-date">{new Date(order.orderDate).toLocaleDateString()}</span>
                    <span className="o-id">ID: #{order.id}</span>
                  </div>
                  <div className={`o-status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                </div>

                <div className="order-items-minimal">
                  {order.items.map((item) => (
                    <div key={item.id} className="o-product-row">
                      <span className="o-prod-icon">
                        {CATEGORY_ICONS[item.product.category] || "📦"}
                      </span>
                      <div className="o-prod-info">
                        <span className="o-prod-name">{item.product.name}</span>
                        <span className="o-prod-qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="o-prod-price">₹{(item.price || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="order-box-footer">
                  <div className="o-total-area">
                    <span className="o-total-label">Total Amount</span>
                    <span className="o-total-val">₹{order.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="o-actions">
                    <Link to={`/product/${order.items[0]?.product.id}`} className="o-btn">Buy Again</Link>
                    <button className="o-btn secondary">Track Order</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
