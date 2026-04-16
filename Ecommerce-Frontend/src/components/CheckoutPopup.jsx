import React from 'react';
import { Modal } from 'react-bootstrap';

const CATEGORY_ICONS = {
  Laptop: "💻",
  Mobile: "📱",
  Headphone: "🎧",
  Electronics: "📺",
  Fashion: "👟",
  Toys: "🧸",
};

const CheckoutPopup = ({ show, handleClose, cartItems, totalPrice, handleCheckout, isLoading }) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="aura-modal">
      <Modal.Header closeButton className="aura-modal-header">
        <Modal.Title className="aura-modal-title">Confirm Purchase</Modal.Title>
      </Modal.Header>
      <Modal.Body className="aura-modal-body">
        <div className="checkout-summary">
          <p className="checkout-intro">You are about to purchase {cartItems.length} items.</p>
          
          <div className="checkout-list">
            {cartItems.map((item) => (
              <div key={item.id} className="checkout-row">
                <span className="checkout-item-icon">{CATEGORY_ICONS[item.category] || "📦"}</span>
                <div className="checkout-item-details">
                  <span className="checkout-item-name">{item.name}</span>
                  <span className="checkout-item-qty">Qty: {item.quantity}</span>
                </div>
                <span className="checkout-item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <div className="checkout-total-footer">
            <span className="total-label">Grand Total :</span>
            <span className="total-amount">₹{totalPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="aura-modal-footer">
        <button className="aura-btn-secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </button>
        <button className="aura-btn-primary" onClick={handleCheckout} disabled={isLoading}>
          {isLoading ? (
            <><span className="spinner-border spinner-border-sm me-2"></span> Processing...</>
          ) : (
            "Complete Order"
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CheckoutPopup;
