import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import API from "../axios";
import toast from "react-hot-toast";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      login(res.data);
      toast.success(`Welcome to AuraMarket, ${res.data.username}! 🚀`);
      navigate("/shop");
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    const p = form.password;
    if (!p) return null;
    if (p.length < 6) return { label: "Weak", cls: "strength-weak" };
    if (p.length < 10) return { label: "Fair", cls: "strength-fair" };
    return { label: "Strong", cls: "strength-strong" };
  };
  const strength = passwordStrength();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo-icon">🛒</div>
          <h2 className="auth-brand-name">AuraMarket</h2>
        </div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join thousands of happy shoppers</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="username">Username</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">👤</span>
              <input
                id="username"
                name="username"
                type="text"
                className="auth-input"
                placeholder="Your name"
                value={form.username}
                onChange={handleChange}
                autoComplete="name"
              />
            </div>
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="reg-email">Email Address</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">✉</span>
              <input
                id="reg-email"
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
            <label className="auth-label" htmlFor="reg-password">Password</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">🔒</span>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="auth-input"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
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
            {strength && (
              <div className="password-strength">
                <div className={`strength-bar ${strength.cls}`}></div>
                <span className="strength-label">{strength.label}</span>
              </div>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirm">Confirm Password</label>
            <div className="auth-input-wrap">
              <span className="auth-icon">🔒</span>
              <input
                id="confirm"
                name="confirm"
                type="password"
                className="auth-input"
                placeholder="Repeat password"
                value={form.confirm}
                onChange={handleChange}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            id="register-submit-btn"
          >
            {loading ? <span className="auth-spinner"></span> : "Create Account"}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">Sign in</Link>
        </p>

        <Link to="/" className="auth-back-link">← Back to Home</Link>
      </div>
    </div>
  );
};

export default Register;
