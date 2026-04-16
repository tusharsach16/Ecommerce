import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import API from "../axios";
import toast from "react-hot-toast";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      login(res.data);
      toast.success(`Welcome back, ${res.data.username}! 🎉`);
      navigate("/shop");
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <div className="auth-logo-icon">🛒</div>
          <h2 className="auth-brand-name">AuraMarket</h2>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">✉</span>
              <input
                id="email"
                name="email"
                type="email"
                className="auth-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">🔒</span>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword((p) => !p)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            id="login-submit-btn"
          >
            {loading ? (
              <span className="auth-spinner"></span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">Create one</Link>
        </p>

        <Link to="/" className="auth-back-link">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Login;
