import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetails.css';
import { usePoints } from '../pages/PointsContext';

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [configDetails, setConfigDetails] = useState([]); // ✅ for product configuration
  const [loading, setLoading] = useState(true);
  const [isInCart, setIsInCart] = useState(false);
  const [useLoyalPoints, setUseLoyalPoints] = useState(false);
  const token = localStorage.getItem("token");
  const isPrimeCustomer = true; // adjust per actual user state
  const { points } = usePoints();

  // Fetch product details
  useEffect(() => {
    fetch(`http://localhost:5087/api/Home/getproduct/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error(error.message);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  // ✅ Fetch product configuration details
  useEffect(() => {
    if (!productId) return;
    fetch(`http://localhost:5087/api/Home/productdetail/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Config not found');
        return res.json();
      })
      .then((data) => {
        setConfigDetails(data || []);
      })
      .catch((err) => {
        console.error("Error fetching config details:", err);
        setConfigDetails([]);
      });
  }, [productId]);

  // Check if product is already in cart
  const fetchCartStatus = async () => {
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5087/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const cart = await res.json();
        const exists = cart.some(item => item.productId === parseInt(productId));
        setIsInCart(exists);
      } else {
        setIsInCart(false);
      }
    } catch (err) {
      console.error("Cart fetch failed", err);
      setIsInCart(false);
    }
  };

  useEffect(() => {
    if (productId) fetchCartStatus();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!token) {
      alert("You must be logged in to add products to the cart.");
      return;
    }

    try {
      let purchaseMode = 'MRP'; // default

      if (isPrimeCustomer) {
        if (useLoyalPoints && product?.loyaltyPoints > 0) {
          if (points - product.loyaltyPoints < 0) {
            alert("Not enough points");
            return;
          }
          purchaseMode = 'LOYALTY_POINTS';
        } else if (product?.loyalPrice && product?.loyaltyPoints === 0) {
          purchaseMode = 'LOYAL_PRICE';
        }
      }

      // Optional instant feedback
      setIsInCart(true);

      const res = await fetch("http://localhost:5087/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: parseInt(productId),
          quantity: 1,
          purchaseMode,
        }),
      });

      if (res.ok) {
        alert(`${product.prodName} added to cart!`);
      } else {
        const errorText = await res.text();
        alert("Failed to add to cart: " + errorText);
        setIsInCart(false); // rollback if failed
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      alert("Error adding to cart. Please try again.");
      setIsInCart(false); // rollback on error
    }
  };

  const handlePointsToggle = (e) => {
    e.stopPropagation();
    setUseLoyalPoints(e.target.checked);
  };

  if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;
  if (!product) return <p style={{ textAlign: 'center' }}>Product not found.</p>;

  const renderPriceSection = () => {
    if (!isPrimeCustomer) {
      return (
        <>
          <p><strong>MRP Price:</strong> ₹{product.mrpPrice}</p>
          {product.loyalPrice && (
            <p style={{ fontSize: '0.9em', color: 'gray' }}>
              Loyal Price: ₹{product.loyalPrice}
            </p>
          )}
        </>
      );
    } else {
      if (product.loyaltyPoints && product.loyaltyPoints > 0) {
        return (
          <>
            <p><strong>MRP Price:</strong> ₹{product.mrpPrice}</p>
            <label style={{ display: "block", marginBottom: "8px" }}>
              <input
                type="checkbox"
                checked={useLoyalPoints}
                onChange={handlePointsToggle}
                style={{ marginRight: "6px" }}
              />
              Pay with ({product.loyaltyPoints} points)
            </label>
          </>
        );
      } else if (product.loyalPrice) {
        return (
          <>
            <p>
              <span style={{ textDecoration: 'line-through', color: 'red' }}>
                ₹{product.mrpPrice}
              </span>{' '}
              <span style={{ fontWeight: 'bold', color: 'green' }}>
                ₹{product.loyalPrice}
              </span>
            </p>
          </>
        );
      } else {
        return <p><strong>MRP Price:</strong> ₹{product.mrpPrice}</p>;
      }
    }
  };

  return (
    <div className="product-details-container">
      <h3
  style={{
    position: 'absolute',
    top: '80px',
    right: '20px'
  }}
>
  <br></br>
  Your Points: {points}
</h3>
  <div className="product-card">
    <img
  src={`/images/${product.productImg}`}
      alt={product.prodName}
      className="product-image"
    />
    <div className="product-info">
      <h2 className="product-title">{product.prodName}</h2>
      {/* <h3>Available Points: {points}</h3> */}

      <p className="product-description">
        {product.prodSdesc || "No description available."}
      </p>
      <p className="product-description">
        {product.prodBdesc || "No description available."}
      </p>

      {configDetails.length > 0 && (
        <div className="product-description">
          <h4>Configuration Details</h4>
          <ul>
            {configDetails.map((cfg, index) => (
              <li key={index}>
                <strong>{cfg.configName}:</strong> {cfg.configDtls}
              </li>
            ))}
          </ul>
        </div>
      )}

      {renderPriceSection()}

      <button
        className={`add-to-cart-button ${isInCart ? "in-cart" : ""}`}
        onClick={handleAddToCart}
        disabled={isInCart}
      >
        {isInCart ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  </div>
</div>

  );
};

export default ProductDetails;
