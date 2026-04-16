import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppContext from "../Context/Context";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";
import CheckoutPopup from "./CheckoutPopup";
import toast from "react-hot-toast";

const CATEGORY_ICONS = {
  Laptop: "💻",
  Mobile: "📱",
  Headphone: "🎧",
  Electronics: "📺",
  Fashion: "👟",
  Toys: "🧸",
};

const Cart = () => {
  const { user } = useAuth();
  const { cart, removeFromCart, deleteFromCart, clearCart, addToCart } = useContext(AppContext);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  // Sync cart items with backend truth (ensure products still exist and have correct info)
  useEffect(() => {
    const updateCartItems = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products");
        const products = response.data;
        
        // Filter out items that might have been deleted from backend
        // Update price/info if they changed
        const validItems = cart.map(cartItem => {
          const latestProduct = products.find(p => p.id === cartItem.id);
          if (!latestProduct) return null;
          return { ...latestProduct, quantity: cartItem.quantity };
        }).filter(Boolean);

        setCartItems(validItems);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    if (cart.length) updateCartItems();
    else setCartItems([]);
  }, [cart]);

  // Calculate total price
  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  const handleIncrease = (itemId) => {
    const item = cartItems.find(i => i.id === itemId);
    if (item.quantity < item.stockQuantity) {
      addToCart(item); // AppContext's addToCart handles incrementing if exists
    } else {
      toast.error(`Only ${item.stockQuantity} items available in stock`);
    }
  };

  const handleDecrease = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login to complete your purchase");
      navigate("/login");
      return;
    }

    setIsCheckoutLoading(true);
    try {
      const orderPayload = {
        userId: user.id,
        totalAmount: totalPrice,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await axios.post("http://localhost:8080/api/orders", orderPayload);
      
      clearCart();
      toast.success("Order placed successfully!");
      setShowModal(false);
      navigate("/orders");
    } catch (error) {
      const backendError = error.response?.data;
      const displayMsg = typeof backendError === 'string' ? backendError : "Error during checkout. Please try again.";
      toast.error(displayMsg);
      console.error("Checkout error detail:", backendError || error.message);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="cart-empty-card">
          <div className="empty-icon">🛒</div>
          <h1>Your cart is empty</h1>
          <p>But it's not too late to add some magic! Explore our products and find something you love.</p>
          <Link to="/shop" className="continue-shopping">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-layout">
        <div className="cart-items-section">
          <div className="cart-header">
            <h1 className="cart-title">Shopping Bag</h1>
            <span className="item-count">{cartItems.length} Items</span>
          </div>

          <div className="cart-list">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-card">
                <div className="cart-product-visual">
                  <span className="cart-product-icon">
                    {CATEGORY_ICONS[item.category] || "📦"}
                  </span>
                </div>
                
                <div className="cart-product-info">
                  <p className="cart-item-brand">{item.brand}</p>
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-category">{item.category}</p>
                </div>

                <div className="cart-controls">
                  <div className="qty-picker">
                    <button onClick={() => handleDecrease(item.id)} className="qty-btn" title="Decrease">
                      <i className={`bi ${item.quantity > 1 ? "bi-dash" : "bi-trash"}`}></i>
                    </button>
                    <span className="qty-val">{item.quantity}</span>
                    <button onClick={() => handleIncrease(item.id)} className="qty-btn" title="Increase">
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                  
                  <div className="cart-item-price">
                    <span className="p-sym">₹</span>
                    {(item.price * item.quantity).toLocaleString("en-IN")}
                  </div>

                  <button 
                    className="cart-remove-top" 
                    onClick={() => deleteFromCart(item.id)}
                    title="Remove item"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="cart-footer-links">
            <Link to="/shop" className="back-to-shop">
              <i className="bi bi-arrow-left"></i> Continue Shopping
            </Link>
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Bag
            </button>
          </div>
        </div>

        <div className="cart-summary-section">
          <div className="summary-card">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-rows">
              <div className="s-row">
                <span>Subtotal</span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="s-row">
                <span>Shipping</span>
                <span className="free-shipping">FREE</span>
              </div>
              <div className="s-row">
                <span>Tax (GST)</span>
                <span>₹0</span>
              </div>
              <hr className="summary-divider" />
              <div className="s-row total-row">
                <span>Estimated Total</span>
                <span className="final-price">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button 
              className="checkout-btn" 
              onClick={() => setShowModal(true)}
              id="cart-checkout-btn"
            >
              Secure Checkout <i className="bi bi-shield-check ms-2"></i>
            </button>
            
            <div className="payment-badges">
              <i className="bi bi-credit-card"></i>
              <i className="bi bi-paypal"></i>
              <i className="bi bi-apple"></i>
              <i className="bi bi-google"></i>
            </div>
          </div>
        </div>
      </div>

      <CheckoutPopup
        show={showModal}
        handleClose={() => setShowModal(false)}
        cartItems={cartItems}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
        isLoading={isCheckoutLoading}
      />
    </div>
  );
};

export default Cart;
