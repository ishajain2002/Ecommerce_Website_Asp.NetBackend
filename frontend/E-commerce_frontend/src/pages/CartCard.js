import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./CartCard.css";
import "./prompt.css";
import { usePoints } from "../pages/PointsContext";
import { useCartTotal } from "./CartTotalContext";

const CartCard = ({ product, onSave, onRemove }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [quantity, setQuantity] = useState(product.quantity || 1);
  const [oldQuantity, setOldQuantity] = useState(product.quantity || 1);
  const { points } = usePoints();
  const [availablePoints, setAvailablePoints] = useState(points);
  const [selectedPriceType, setSelectedPriceType] = useState(
    product.purchaseMode || null
  );
  const [modalRoot] = useState(() => document.createElement("div"));
  const { finalTotal, setFinalTotal } = useCartTotal();

  const subtotal = quantity * product.unitPrice;

  useEffect(() => {
    let storedTotal = parseFloat(localStorage.getItem("finalTotal")) || 0;
    const oldSubtotal = oldQuantity * product.unitPrice;
    storedTotal = storedTotal - oldSubtotal + subtotal;
    localStorage.setItem("finalTotal", storedTotal);
    setFinalTotal(storedTotal);
  }, [subtotal, oldQuantity, product.unitPrice, setFinalTotal]);

  useEffect(() => {
    modalRoot.className = "prompt-portal-root";
    document.body.appendChild(modalRoot);
    return () => {
      if (document.body.contains(modalRoot)) {
        document.body.removeChild(modalRoot);
      }
    };
  }, [modalRoot]);

  useEffect(() => {
    if (!showDialog) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showDialog]);

  useEffect(() => {
    setAvailablePoints(points);
  }, [points]);

  useEffect(() => {
    if (typeof onSave === "function") {
      onSave({
        ...product,
        quantity,
        purchaseMode: selectedPriceType || product.purchaseMode,
        subtotal,
      });
    }
  }, [quantity, selectedPriceType, subtotal, onSave, product]);

  const handleQuantityChange = (type) => {
    setQuantity((currentQty) => {
      if (type === "decrease") {
        return Math.max(1, currentQty - 1);
      } else {
        if (selectedPriceType === "LOYALTY_POINTS") {
          const pointsPerItem = product.loyaltyPoints ?? 0;
          const alreadyUsedPoints = oldQuantity * pointsPerItem;
          const sparePoints =
            availablePoints + alreadyUsedPoints - currentQty * pointsPerItem;

          if (sparePoints >= pointsPerItem) {
            return currentQty + 1;
          } else {
            alert("Not enough points to increase quantity.");
            return currentQty;
          }
        } else {
          return currentQty + 1;
        }
      }
    });
  };

  const handleSaveChanges = async () => {
    const pointsPerItem = product.loyaltyPoints ?? 0;
    const additionalPointsNeeded =
      selectedPriceType === "LOYALTY_POINTS"
        ? (quantity - oldQuantity) * pointsPerItem
        : 0;

    if (additionalPointsNeeded > availablePoints) {
      alert("Not enough points to make this purchase.");
      return;
    }

    const payload = {
      productId: product.productId,
      quantity,
      purchaseMode: selectedPriceType || product.purchaseMode,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5087/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update cart");
      }

      if (selectedPriceType === "LOYALTY_POINTS") {
        setAvailablePoints((prev) => prev - additionalPointsNeeded);
      }

      if (typeof onSave === "function") {
        onSave({
          ...product,
          quantity,
          purchaseMode: selectedPriceType || product.purchaseMode,
          subtotal,
        });
      }

      setOldQuantity(quantity);
      setShowDialog(false);
      window.location.reload();
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("Could not update cart");
    }
  };

  const handleRemove = async () => {
    if (!window.confirm("Are you sure you want to remove this item from the cart?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:5087/api/cart/delete/${product.cartDetailId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete cart item");
      }

      const storedTotal = parseFloat(localStorage.getItem("finalTotal")) || 0;
      const newTotal = storedTotal - subtotal;
      localStorage.setItem("finalTotal", newTotal);
      setFinalTotal(newTotal);

      if (typeof onRemove === "function") {
        onRemove(product.cartDetailId);
      }

      window.location.reload();
    } catch (error) {
      console.error("Error removing cart item:", error);
      alert("Could not remove item from cart");
    }
  };

  const renderPriceSection = () => {
    switch (product.purchaseMode) {
      case "MRP":
      case "LOYAL_PRICE":
        return (
          <div className="prompt-row">
            <strong>Price:</strong> ₹{product.unitPrice}
          </div>
        );

      case "LOYALTY_POINTS":
        return (
          <>
            <div className="prompt-row">
              <label>
                <input
                  type="radio"
                  name={`priceOption-${product.productId}`}
                  checked={selectedPriceType === "MRP"}
                  onChange={() => setSelectedPriceType("MRP")}
                />{" "}
                <strong>MRP:</strong> ₹{product.unitPrice}
              </label>
            </div>
            <div className="prompt-row">
              <label>
                <input
                  type="radio"
                  name={`priceOption-${product.productId}`}
                  checked={selectedPriceType === "LOYALTY_POINTS"}
                  onChange={() => setSelectedPriceType("LOYALTY_POINTS")}
                />{" "}
                <strong>Points:</strong> {product.loyaltyPoints ?? 0}
                <span className="prompt-available">
                  {" "}
                  (Available: {availablePoints})
                </span>
              </label>
            </div>
          </>
        );

      default:
        return (
          <div className="prompt-row">
            <strong>Price:</strong> ₹{product.unitPrice}
          </div>
        );
    }
  };

  const modalContent = (
    <div
      className="prompt-overlay"
      onClick={() => setShowDialog(false)}
      role="presentation"
    >
      <div
        className="prompt-box"
        role="dialog"
        aria-modal="true"
        aria-label={`Edit ${product.productName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="prompt-title">Edit Product</h2>
        {renderPriceSection()}
        <div className="prompt-quantity" aria-label="Quantity selector">
          <button
            type="button"
            className="prompt-qty-btn"
            onClick={() => handleQuantityChange("decrease")}
            aria-label="Decrease quantity"
          >
            -
          </button>
          <div className="prompt-qty-value" aria-live="polite">
            {quantity}
          </div>
          <button
            type="button"
            className="prompt-qty-btn"
            onClick={() => handleQuantityChange("increase")}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
        <div className="prompt-buttons">
          <button
            type="button"
            className="prompt-save-btn"
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
          <button
            type="button"
            className="prompt-cancel-btn"
            onClick={() => setShowDialog(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="cart-card">
        <img
            src={`/images/${product.productImg}`}
          alt={product.productName}
          className="cart-card-image"
        />
        {/* <img
            src={`/images/${product.productImg}`}
            alt={product.prodName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          /> */}
        <div className="cart-card-content">
          <h3>{product.productName}</h3>
          <p><strong>Price:</strong> ₹{product.unitPrice}</p>
          <p><strong>Purchase mode:</strong> {product.purchaseMode}</p>
          <p><strong>Quantity:</strong> {quantity}</p>
          <p><strong>Subtotal:</strong> ₹{subtotal}</p>
          <div style={{ display: "flex", gap: "10px" }}>
            <button className="remove-btn" onClick={handleRemove}>
              Remove
            </button>
            <button
              className="edit-btn"
              onClick={() => {
                setOldQuantity(product.quantity || 1);
                setQuantity(product.quantity || 1);
                setSelectedPriceType(product.purchaseMode || null);
                setShowDialog(true);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      {showDialog && ReactDOM.createPortal(modalContent, modalRoot)}
    </>
  );
};

export default CartCard;
