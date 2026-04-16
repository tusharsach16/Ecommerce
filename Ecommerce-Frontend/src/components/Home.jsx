import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppContext from "../Context/Context";
import toast from "react-hot-toast";

const CATEGORY_ICONS = {
  Laptop: "💻",
  Mobile: "📱",
  Headphone: "🎧",
  Electronics: "📺",
  Fashion: "👟",
  Toys: "🧸",
};

const CATEGORIES = ["All", "Laptop", "Mobile", "Headphone", "Electronics", "Fashion", "Toys"];

const SORT_OPTIONS = [
  { label: "Default", value: "default" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name A–Z", value: "name_asc" },
];

const Home = ({ selectedCategory: propCategory }) => {
  const { data, isError, addToCart, refreshData } = useContext(AppContext);

  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedIds, setAddedIds] = useState({});

  // Sync propCategory from Navbar dropdown
  useEffect(() => {
    if (propCategory) setActiveCategory(propCategory);
    else setActiveCategory("All");
  }, [propCategory]);

  // Fetch on mount
  useEffect(() => {
    refreshData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const products = Array.isArray(data) ? data : [];
  const isLoading = products.length === 0 && !isError;

  // Filter
  let filtered = activeCategory === "All"
    ? products
    : products.filter((p) => p.category === activeCategory);

  if (searchQuery.trim()) {
    filtered = filtered.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "price_asc")  return Number(a.price) - Number(b.price);
    if (sortBy === "price_desc") return Number(b.price) - Number(a.price);
    if (sortBy === "name_asc")   return a.name.localeCompare(b.name);
    return 0;
  });

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    if (!product.productAvailable) return;
    addToCart(product);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    toast.success(`${product.name} added to cart!`);
    setTimeout(() => setAddedIds((prev) => ({ ...prev, [product.id]: false })), 1500);
  };

  if (isError) {
    return (
      <div className="shop-page">
        <div className="shop-error">
          <span className="shop-error-icon">🔌</span>
          <h2>Connection Lost</h2>
          <p>Unable to reach the server. Please check your backend.</p>
          <button className="shop-retry-btn" onClick={refreshData}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      {/* ── PAGE HEADER ── */}
      <div className="shop-header">
        <div className="shop-header-content">
          <h1 className="shop-title">
            {activeCategory === "All" ? "All Products" : `${CATEGORY_ICONS[activeCategory] || ""} ${activeCategory}`}
          </h1>
          <p className="shop-count">
            {isLoading ? "Loading…" : `${sorted.length} product${sorted.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Search + Sort */}
        <div className="shop-controls">
          <div className="shop-search-wrap">
            <span className="shop-search-icon">🔍</span>
            <input
              className="shop-search-input"
              type="text"
              placeholder="Search products or brands…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="shop-search-input"
            />
            {searchQuery && (
              <button className="shop-search-clear" onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>
          <select
            className="shop-sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="shop-sort-select"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div className="shop-categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`shop-cat-pill ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
            id={`cat-pill-${cat.toLowerCase()}`}
          >
            {CATEGORY_ICONS[cat] && <span>{CATEGORY_ICONS[cat]}</span>}
            {cat}
          </button>
        ))}
      </div>

      {/* ── PRODUCT GRID ── */}
      <div className="shop-grid">
        {isLoading ? (
          // Skeleton cards
          [1,2,3,4,5,6].map((i) => (
            <div key={i} className="shop-card shop-card-skeleton">
              <div className="shop-card-img-wrap skel-block"></div>
              <div className="shop-card-body">
                <div className="skel-line skel-short"></div>
                <div className="skel-line"></div>
                <div className="skel-line skel-long"></div>
                <div className="skel-footer">
                  <div className="skel-price"></div>
                  <div className="skel-btn"></div>
                </div>
              </div>
            </div>
          ))
        ) : sorted.length === 0 ? (
          <div className="shop-empty">
            <span className="shop-empty-icon">🛒</span>
            <h3>No products found</h3>
            <p>Try changing the category or search query</p>
            <button
              className="shop-empty-reset"
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          sorted.map((product) => {
            const { id, brand, name, price, productAvailable, category, stockQuantity } = product;
            const icon = CATEGORY_ICONS[category] || "📦";
            const wasAdded = addedIds[id];

            return (
              <div className={`shop-card ${!productAvailable ? "shop-card-oos" : ""}`} key={id} id={`product-card-${id}`}>
                {/* Availability badge */}
                {!productAvailable && (
                  <div className="shop-card-badge oos-badge">Out of Stock</div>
                )}
                {productAvailable && stockQuantity <= 5 && stockQuantity > 0 && (
                  <div className="shop-card-badge low-badge">Only {stockQuantity} left!</div>
                )}

                <Link to={`/product/${id}`} className="shop-card-link">
                  {/* Product icon / image area */}
                  <div className="shop-card-img-wrap">
                    <span className="shop-card-icon">{icon}</span>
                    <div className="shop-card-category-tag">{category}</div>
                  </div>

                  {/* Card body */}
                  <div className="shop-card-body">
                    <p className="shop-card-brand">{brand}</p>
                    <h3 className="shop-card-name">{name}</h3>

                    <div className="shop-card-footer">
                      <div className="shop-card-price">
                        <span className="price-symbol">₹</span>
                        {Number(price).toLocaleString("en-IN")}
                      </div>

                      <button
                        className={`shop-add-btn ${wasAdded ? "added" : ""} ${!productAvailable ? "disabled" : ""}`}
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!productAvailable}
                        id={`add-to-cart-${id}`}
                        title={productAvailable ? "Add to cart" : "Out of stock"}
                      >
                        {wasAdded ? "✓ Added" : productAvailable ? "+ Cart" : "Sold Out"}
                      </button>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Home;
