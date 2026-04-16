import React from "react";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return (
      <div className="profile-page flex-center">
        <div className="auth-error-card">
          <span className="error-icon">🔒</span>
          <h2>Access Denied</h2>
          <p>You need to be signed in to view your profile.</p>
          <Link to="/login" className="aura-btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  // Fallback for missing dates or info
  const memberSince = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : "Recently";

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Hero */}
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar-big">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="profile-hero-info">
            <h1 className="profile-name">{user.username}</h1>
            <p className="profile-status">Premium Member • {memberSince}</p>
          </div>
        </div>

        <div className="profile-grid">
          {/* Main info card */}
          <div className="profile-card info-card">
            <div className="p-card-header">
              <h3>Account Details</h3>
              <button className="p-edit-btn">Edit</button>
            </div>
            <div className="p-detail-row">
              <span className="p-label">Username</span>
              <span className="p-value">{user.username}</span>
            </div>
            <div className="p-detail-row">
              <span className="p-label">Email Address</span>
              <span className="p-value">{user.email}</span>
            </div>
            <div className="p-detail-row">
              <span className="p-label">Account Security</span>
              <span className="p-value">Password Protected</span>
            </div>
          </div>

          {/* Stats card */}
          <div className="profile-card stats-card">
            <div className="p-card-header">
              <h3>My Activity</h3>
            </div>
            <div className="p-stats-row">
              <div className="p-stat-item">
                <span className="p-stat-num">🚀</span>
                <span className="p-stat-label">Fast Shipping</span>
              </div>
              <div className="p-stat-item">
                <span className="p-stat-num">💎</span>
                <span className="p-stat-label">VIP Support</span>
              </div>
            </div>
            <hr className="p-divider" />
            <Link to="/orders" className="p-orders-link">
              View Order History →
            </Link>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="profile-card danger-zone">
          <h3>Account Management</h3>
          <p>Updating your profile or changing your password? Keep your details safe.</p>
          <div className="danger-actions">
            <button className="p-action-btn glass">Change Password</button>
            <button className="p-action-btn outline">Sign Out Items</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
