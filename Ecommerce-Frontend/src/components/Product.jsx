import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";
import "./ProductDetail.css";
import toast from "react-hot-toast";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `/product/${id}`
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/product/${id}`);
      removeFromCart(id);
      toast.success("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      toast.error("Error deleting product");
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const goBack = () => {
    navigate(-1);
  };

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Discovering brilliance...</p>
        </div>
      </div>
    );
  }

  // Placeholder image based on category
  const getProductImage = (category) => {
    const images = {
      Laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=800",
      Mobile: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=800",
      Headphone: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
      Electronics: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800",
      Fashion: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800",
      Toys: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&q=80&w=800",
    };
    return images[category] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800";
  };

  return (
    <div className="product-detail-page">
      <div className="product-card-container">
        
        {/* Left Column: Visuals */}
        <div className="product-image-section">
          <div className="category-floater">{product.category}</div>
          <img 
            src={getProductImage(product.category)} 
            alt={product.name} 
            className="product-main-view" 
          />
        </div>

        {/* Right Column: Information */}
        <div className="product-info-section">
          <button onClick={goBack} className="back-btn">
            <span>←</span> Back to Gallery
          </button>

          <span className="product-brand">{product.brand}</span>
          <h1 className="product-title">{product.name}</h1>
          
          <div className="product-meta">
            <span className="product-date">
              Released: {new Date(product.releaseDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <div className={`stock-status ${product.productAvailable ? 'in-stock' : 'out-stock'}`}>
              {product.productAvailable ? `● In Stock (${product.stockQuantity})` : '● Out of Stock'}
            </div>
          </div>

          <div className="description-area">
            <p className="description-label">The Details</p>
            <p className="product-desc">{product.description}</p>
          </div>

          <div className="price-action-area">
            <div className="price-tag">
              <span className="price-label">Investment Price</span>
              <span className="price-value">₹{product.price.toLocaleString()}</span>
            </div>

            <div className="buy-group">
              <button 
                className="btn-premium btn-add-cart"
                onClick={handlAddToCart}
                disabled={!product.productAvailable}
              >
                {product.productAvailable ? (
                  <><span>⚡</span> Add to Collection</>
                ) : 'Limited Availability'}
              </button>
              
              <button className="btn-premium btn-secondary">
                <span>♡</span> Save for Later
              </button>
            </div>

            <div className="admin-actions">
              <button onClick={handleEditClick} className="admin-btn">Edit Details</button>
              <button onClick={deleteProduct} className="admin-btn delete">Remove from Store</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;