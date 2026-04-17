import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import toast from "react-hot-toast";

const CATEGORIES = ["Laptop", "Headphone", "Mobile", "Electronics", "Toys", "Fashion"];
const CATEGORY_ICONS = {
  Laptop: "💻",
  Mobile: "📱",
  Headphone: "🎧",
  Electronics: "📺",
  Fashion: "👟",
  Toys: "🧸",
};

const AddProduct = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: new Date().toISOString().split('T')[0],
    productAvailable: true,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct({ 
      ...product, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    
    // Simple validation
    if (!product.name || !product.brand || !product.category || !product.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    axios
      .post("/product", product)
      .then((response) => {
        toast.success("Product listed successfully!");
        navigate("/shop");
      })
      .catch((error) => {
        console.error("Error adding product:", error);
        toast.error("Failed to list product. Check your connection.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="sell-page">
      <div className="sell-container">
        <div className="sell-card">
          <div className="sell-header">
            <div className="sell-icon-wrap">🚀</div>
            <h1 className="sell-title">List New Product</h1>
            <p className="sell-subtitle">Share your product with the AuraMarket community</p>
          </div>

          <form className="sell-form" onSubmit={submitHandler}>
            <div className="form-grid">
              {/* Product Name */}
              <div className="form-group full">
                <label htmlFor="name">Product Name *</label>
                <div className="input-wrap">
                  <i className="bi bi-tag"></i>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="e.g. MacBook Pro M3"
                    value={product.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Brand */}
              <div className="form-group">
                <label htmlFor="brand">Brand *</label>
                <div className="input-wrap">
                  <i className="bi bi-building"></i>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    placeholder="e.g. Apple"
                    value={product.brand}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Category Visual Selection */}
              <div className="form-group full">
                <label>Select Category *</label>
                <div className="category-selection-grid">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`category-pill ${product.category === cat ? "active" : ""}`}
                      onClick={() => setProduct({ ...product, category: cat })}
                    >
                      <span className="pill-icon">{CATEGORY_ICONS[cat] || "📦"}</span>
                      <span className="pill-name">{cat}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="price">Price (₹) *</label>
                <div className="input-wrap">
                  <span className="input-addon">₹</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    placeholder="0.00"
                    value={product.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Stock */}
              <div className="form-group">
                <label htmlFor="stockQuantity">Initial Stock *</label>
                <div className="input-wrap">
                  <i className="bi bi-box-seam"></i>
                  <input
                    type="number"
                    id="stockQuantity"
                    name="stockQuantity"
                    placeholder="Quantity"
                    value={product.stockQuantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              {/* Release Date */}
              <div className="form-group">
                <label htmlFor="releaseDate">Launch Date</label>
                <div className="input-wrap">
                  <i className="bi bi-calendar-event"></i>
                  <input
                    type="date"
                    id="releaseDate"
                    name="releaseDate"
                    value={product.releaseDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

               {/* Availability */}
               <div className="form-group d-flex align-items-center">
                <div className="aura-switch">
                  <input
                    type="checkbox"
                    id="productAvailable"
                    name="productAvailable"
                    checked={product.productAvailable}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="productAvailable"></label>
                  <span className="switch-text">Instant Listing Availability</span>
                </div>
              </div>

              {/* Description */}
              <div className="form-group full">
                <label htmlFor="description">Product Description</label>
                <div className="input-wrap">
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    placeholder="Describe your product's key features and specs..."
                    value={product.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="sell-actions">
              <button type="button" className="sell-cancel" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="sell-submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span> Posting...</>
                ) : (
                  "List Product Now"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
