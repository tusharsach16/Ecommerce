import React, { useEffect, useState, useRef, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "../axios";
import { useAuth } from "../Context/AuthContext";
import AppContext from "../Context/Context";
import toast from "react-hot-toast";

const Navbar = ({ onSelectCategory }) => {
  const { user, isLoggedIn, logout } = useAuth();
  const { cart } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialTheme = () => localStorage.getItem("theme") || "dark-theme";
  const [selectedCategory, setSelectedCategory] = useState("");
  const [theme, setTheme] = useState(getInitialTheme());
  const [input, setInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Handle scroll for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = async (value) => {
    setInput(value);
    if (value.length >= 1) {
      setShowSearchResults(true);
      try {
        const response = await axios.get(
          `/products/search?keyword=${value}`
        );
        setSearchResults(response.data);
        setNoResults(response.data.length === 0);
      } catch (error) {
        console.error("Error searching:", error);
      }
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
      setNoResults(false);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onSelectCategory(category);
    if (location.pathname !== "/shop") {
      navigate("/shop");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark-theme" ? "light-theme" : "dark-theme";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    toast.success("Signed out successfully");
    navigate("/");
  };

  const categories = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`aura-nav ${isScrolled ? "nav-scrolled" : ""} ${theme}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link className="nav-logo" to="/">
          <span className="logo-icon">🛒</span>
          <span className="logo-text">AuraMarket</span>
        </Link>

        {/* Desktop Menu */}
        <div className="nav-main">
          <ul className="nav-links">
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""}>Home</Link>
            </li>
            <li>
              <Link to="/shop" className={isActive("/shop") ? "active" : ""}>Shop</Link>
            </li>
            <li className="nav-dropdown-wrap">
              <button className="nav-drop-btn">
                Categories <i className="bi bi-chevron-down"></i>
              </button>
              <div className="nav-dropdown-menu">
                <button onClick={() => handleCategorySelect("")}>All Products</button>
                {categories.map((cat) => (
                  <button key={cat} onClick={() => handleCategorySelect(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
            </li>
            <li>
              <Link to="/add_product" className={isActive("/add_product") ? "active" : ""}>Sell</Link>
            </li>
          </ul>
        </div>

        {/* Right Actions */}
        <div className="nav-actions">
          {/* Search */}
          <div className="nav-search" ref={searchRef}>
            <div className={`search-bar ${input ? "has-input" : ""}`}>
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={input}
                onChange={(e) => handleChange(e.target.value)}
                onFocus={() => input && setShowSearchResults(true)}
              />
              {input && (
                <button className="search-clear" onClick={() => handleChange("")}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
            {showSearchResults && (
              <div className="search-results-dropdown">
                {searchResults.length > 0 ? (
                  searchResults.map((p) => (
                    <Link 
                      key={p.id} 
                      to={`/product/${p.id}`} 
                      className="search-result-item"
                      onClick={() => setShowSearchResults(false)}
                    >
                      <div className="res-icon">📦</div>
                      <div className="res-info">
                        <span className="res-name">{p.name}</span>
                        <span className="res-meta">{p.brand} • ₹{p.price}</span>
                      </div>
                    </Link>
                  ))
                ) : (
                  noResults && <div className="search-no-results">No products found</div>
                )}
              </div>
            )}
          </div>

          <div className="nav-tools">
            <button className="tool-btn theme-toggle" onClick={toggleTheme} title="Toggle theme">
              {theme === "dark-theme" ? <i className="bi bi-moon-stars"></i> : <i className="bi bi-sun"></i>}
            </button>

            <Link to="/cart" className="tool-btn cart-btn" title="Your Cart">
              <i className="bi bi-bag"></i>
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </Link>

            {/* User Auth */}
            {isLoggedIn ? (
              <div className="nav-user-area" ref={userMenuRef}>
                <button 
                  className="user-profile-trigger" 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown-glass">
                    <div className="user-header">
                      <p className="u-name">{user.username}</p>
                      <p className="u-email">{user.email}</p>
                    </div>
                    <div className="user-menu-links">
                      <Link to="/profile" onClick={() => setShowUserMenu(false)}>
                        <i className="bi bi-person"></i> My Profile
                      </Link>
                      <Link to="/orders" onClick={() => setShowUserMenu(false)}>
                        <i className="bi bi-box"></i> My Orders
                      </Link>
                      <hr className="dropdown-divider" />
                      <button className="logout-item text-danger" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right"></i> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-auth-btn">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
