import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePoints } from '../../pages/PointsContext';

const ProductCard = ({ product }) => {
  const [inCart, setInCart] = useState(false);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isPrimeCustomer, setIsPrimeCustomer] = useState(false);
  const navigate = useNavigate();
  const { points } = usePoints();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch("http://localhost:5087/api/user/me", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Failed to fetch user details");
        const userData = await response.json();
        setIsPrimeCustomer(!!userData.loyalty);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setIsPrimeCustomer(false);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchCartProducts = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await fetch("http://localhost:5087/api/cart", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error("Failed to fetch cart");
        const data = await response.json();
        const exists = Array.isArray(data) && data.some(
          item => item.productId === product.productId || item.product_id === product.productId
        );
        setInCart(exists);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setInCart(false);
      }
    };
    fetchCartProducts();
  }, [product.productId]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to add products to the cart.");
        return;
      }
      let purchaseMode = 'MRP';
      if (isPrimeCustomer) {
        if (useLoyaltyPoints && product.loyaltyPoints > 0) {
          if (points - product.loyaltyPoints < 0) {
            alert("Not enough points");
            return;
          }
          purchaseMode = 'LOYALTY_POINTS';
        } else if (product.loyalPrice && product.loyaltyPoints === 0) {
          purchaseMode = 'LOYAL_PRICE';
        }
      }
      const response = await fetch("http://localhost:5087/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product.productId,
          quantity: 1,
          purchaseMode
        })
      });
      if (!response.ok) throw new Error("Failed to add to cart");
      setInCart(true);
      setShowSuccessPopup(true);
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
    }
  };

  const handleCardClick = () => {
    navigate(`/productdetails/${product.productId}`);
  };

  const renderPriceSection = () => {
    if (!isPrimeCustomer) {
      if (product.loyalPrice) {
        return (
          <>
            <p><strong>MRP :</strong> ₹{product.mrpPrice}</p>
            <p style={{ fontSize: "0.9em", color: "#555" }}>
              Loyal Price: ₹{product.loyalPrice}
            </p>
          </>
        );
      }
      return <p><strong>MRP :</strong> ₹{product.mrpPrice}</p>;
    } else {
      if (product.loyaltyPoints && product.loyaltyPoints > 0) {
        return (
          <>
            <p><strong>MRP :</strong> ₹{product.mrpPrice}</p>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                fontSize: "0.9em",
                color: "#444",
                cursor: "pointer"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                checked={useLoyaltyPoints}
                onChange={() => setUseLoyaltyPoints(!useLoyaltyPoints)}
                style={{ marginRight: "6px" }}
              />
              Pay with Loyalty Points <br/> ({product.loyaltyPoints} points + ₹{ product.loyalPrice})
            </label>
          </>
        );
      } else if (product.loyalPrice) {
        return (
          <>
            <p style={{ textDecoration: "line-through", color: "#888" }}>
              ₹{product.mrpPrice}
            </p>
            <p><strong>Loyal Price:</strong> ₹{product.loyalPrice}</p>
          </>
        );
      }
      return <p><strong>MRP :</strong> ₹{product.mrpPrice}</p>;
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        style={{
          border: "1px solid #ddd",
          borderRadius: "8px",
          padding: "0",
          maxWidth: "250px",
          textAlign: "center",
          cursor: "pointer",
          userSelect: "none",
          position: "relative",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          display: "flex",
          flexDirection: "column"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.02)";
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Fixed height image container */}
        <div style={{
          height: "180px",
          overflow: "hidden",
          borderRadius: "8px 8px 0 0"
        }}>
          <img
            src={`/images/${product.productImg}`}
            alt={product.prodName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>

        {/* Product info area */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "12px"
        }}>
          <h3 style={{ margin: "8px 0", fontSize: "1.1em" }}>{product.prodName}</h3>
          {renderPriceSection()}
          {inCart ? (
            <button
              onClick={e => e.stopPropagation()}
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                padding: "8px 12px",
                border: "none",
                borderRadius: "5px",
                cursor: "not-allowed",
                width: "100%",
                marginTop: "10px"
              }}
              disabled
            >
              Added to Cart
            </button>
          ) : (
            <button
              onClick={e => {
                e.stopPropagation();
                handleAddToCart();
              }}
              style={{
                backgroundColor: "#007bff",
                color: "#fff",
                padding: "8px 12px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                width: "100%",
                marginTop: "10px"
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>

      {showSuccessPopup && (
        <div
          style={{
            position: "fixed",
            top: "20%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            padding: "20px 30px",
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            animation: "fadeIn 0.3s ease",
            zIndex: 9999
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              background: "#28a745",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold"
            }}
          >
            ✓
          </div>
          <span style={{ fontSize: "0.95em" }}>{product.prodName} added to cart!</span>
        </div>
      )}
    </>
  );
};

export default ProductCard;