import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import { useAuth } from "../Context/AuthContext";

const categories = [
  { name: "Laptop", icon: "💻", color: "#6366f1" },
  { name: "Mobile", icon: "📱", color: "#8b5cf6" },
  { name: "Headphone", icon: "🎧", color: "#ec4899" },
  { name: "Electronics", icon: "📺", color: "#f59e0b" },
  { name: "Fashion", icon: "👟", color: "#10b981" },
  { name: "Toys", icon: "🧸", color: "#3b82f6" },
];

const features = [
  { icon: "🚀", title: "Fast Delivery", desc: "Get your orders delivered within 24 hours" },
  { icon: "🔒", title: "Secure Payments", desc: "100% encrypted and safe transactions" },
  { icon: "↩️", title: "Easy Returns", desc: "Hassle-free 30-day return policy" },
  { icon: "💎", title: "Top Quality", desc: "Only the best products from trusted brands" },
];

const LandingPage = () => {
  const { data, refreshData } = useContext(AppContext);
  const { isLoggedIn, user } = useAuth();
  const [heroVisible, setHeroVisible] = useState(false);

  // Trigger hero animation on mount + ensure fresh product data
  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    refreshData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Derived directly from context — no intermediate state, always in sync
  const featuredProducts = Array.isArray(data) ? data.slice(0, 4) : [];
  const isLoading = !Array.isArray(data) || (data.length === 0);

  return (
    <div className="landing-page">
      {/* ── HERO ── */}
      <section className={`landing-hero ${heroVisible ? "hero-visible" : ""}`}>
        <div className="hero-bg-shapes">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <div className="hero-content">
          <div className="hero-badge">✨ New Season Sale — Up to 50% Off</div>
          <h1 className="hero-title">
            Shop Smarter,<br />
            <span className="hero-gradient-text">Live Better</span>
          </h1>
          <p className="hero-subtitle">
            Discover thousands of premium products across electronics, fashion, and more —
            all in one place, delivered to your door.
          </p>
          <div className="hero-actions">
            <Link to="/shop" className="hero-btn-primary" id="hero-shop-btn">
              🛍 Shop Now
            </Link>
            {!isLoggedIn ? (
              <Link to="/register" className="hero-btn-secondary" id="hero-register-btn">
                Join Free
              </Link>
            ) : (
              <span className="hero-welcome">
                Welcome back, <strong>{user.username}</strong>! 👋
              </span>
            )}
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Products</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Happy Customers</span>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat">
              <span className="stat-number">4.9★</span>
              <span className="stat-label">Rating</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-float card-float-1">
            <span className="float-card-icon">📱</span>
            <div>
              <p className="float-card-title">iPhone 15 Pro</p>
              <p className="float-card-price">₹1,34,900</p>
            </div>
          </div>
          <div className="hero-card-float card-float-2">
            <span className="float-card-icon">💻</span>
            <div>
              <p className="float-card-title">MacBook Pro M3</p>
              <p className="float-card-price">₹1,69,900</p>
            </div>
          </div>
          <div className="hero-card-float card-float-3">
            <span className="float-card-icon">🎧</span>
            <div>
              <p className="float-card-title">Sony WH-1000XM5</p>
              <p className="float-card-price">₹29,900</p>
            </div>
          </div>
          <div className="hero-big-circle">
            <span className="hero-circle-emoji">🛒</span>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="landing-categories">
        <div className="section-header">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you're looking for</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/shop?category=${cat.name}`}
              className="category-card"
              id={`cat-${cat.name.toLowerCase()}`}
              style={{ "--cat-color": cat.color }}
            >
              <div className="category-icon-wrap">
                <span className="category-icon">{cat.icon}</span>
              </div>
              <span className="category-name">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="landing-featured">
        <div className="section-header">
          <h2 className="section-title">Featured Products</h2>
          <Link to="/shop" className="see-all-link">View all →</Link>
        </div>
        <div className="featured-grid">
          {isLoading ? (
            // Skeleton cards while data loads
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="featured-card featured-skeleton">
                <div className="skeleton-top"></div>
                <div className="skeleton-icon"></div>
                <div className="featured-card-body">
                  <div className="skeleton-line short"></div>
                  <div className="skeleton-line"></div>
                  <div className="skeleton-line long"></div>
                  <div className="skeleton-footer">
                    <div className="skeleton-price"></div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            featuredProducts.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="featured-card"
                id={`featured-product-${p.id}`}
              >
                <div className="featured-card-top">
                  <span className="featured-category-badge">{p.category}</span>
                  {!p.productAvailable && (
                    <span className="featured-out-badge">Out of Stock</span>
                  )}
                </div>
                <div className="featured-product-icon">
                  {categories.find((c) => c.name === p.category)?.icon || "📦"}
                </div>
                <div className="featured-card-body">
                  <p className="featured-brand">{p.brand}</p>
                  <h3 className="featured-name">{p.name}</h3>
                  <p className="featured-desc">{p.description?.substring(0, 60)}...</p>
                  <div className="featured-footer">
                    <span className="featured-price">₹{Number(p.price).toLocaleString("en-IN")}</span>
                    <span className="featured-arrow">→</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* ── FEATURES / USP ── */}
      <section className="landing-features">
        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon">{f.icon}</span>
              <div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      {!isLoggedIn && (
        <section className="landing-cta">
          <div className="cta-content">
            <h2 className="cta-title">Ready to start shopping?</h2>
            <p className="cta-subtitle">
              Create a free account and unlock exclusive deals, order tracking, and more.
            </p>
            <div className="cta-actions">
              <Link to="/register" className="cta-btn-primary" id="cta-register-btn">
                Get Started — It's Free
              </Link>
              <Link to="/login" className="cta-btn-secondary" id="cta-login-btn">
                Sign In
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">🛒 AuraMarket</span>
            <p className="footer-tagline">Your premium shopping destination</p>
          </div>
          <div className="footer-links">
            <Link to="/shop">Shop</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/login">Sign In</Link>
            <Link to="/register">Register</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 AuraMarket. Built with ❤️ using React + Spring Boot.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
