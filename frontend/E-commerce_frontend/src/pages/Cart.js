import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CartCard from "./CartCard";
import { usePoints } from './PointsContext';


const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finalTotal, setFinalTotal] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [taxAmount, setTaxAmount] = useState(0);
  const [totalWithTax, setTotalWithTax] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { points } = usePoints();

  const navigate = useNavigate();

  // ✅ Redirect to Home if payment was successful
  useEffect(() => {
    const paymentSuccess = localStorage.getItem("paymentSuccess");
    if (paymentSuccess === "true") {
      localStorage.removeItem("paymentSuccess");
      navigate("/dashboard");
    }
  }, [navigate]);

  // ✅ Fetch cart data and calculate total
  const fetchCartData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5087/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch cart products");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setCartProducts(data);

      const total = data.reduce((sum, item) => {
        const price = parseFloat(item.unitPrice) || 0;
        const qty = parseInt(item.quantity) || 0;
        return sum + price * qty;
      }, 0);

      setFinalTotal(total);
      localStorage.setItem("finalTotal", total.toString());
    } catch (error) {
      console.error("Error fetching cart products:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto refresh cart every second
  useEffect(() => {
    fetchCartData();
    const interval = setInterval(fetchCartData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handlePlaceOrder = () => {
    const tax = finalTotal * 0.18;
    const total = finalTotal + tax;
    setTaxAmount(tax.toFixed(2));
    setTotalWithTax(total.toFixed(2));
    setShowDialog(true);
  };

  const handleCloseDialog = () => setShowDialog(false);

const handlePayNow = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      return;
    }

    // Step 1: Generate Invoice
    const payload = {
      totalPayment: parseFloat(finalTotal),
      tax: parseFloat(taxAmount),
      finalPayment: parseFloat(totalWithTax),
    };

    const invoiceResponse = await fetch(
      "http://localhost:5087/api/Invoice/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!invoiceResponse.ok) {
      throw new Error("Failed to generate invoice");
    }

    // Step 2: Update User Points
    const updatePayload = {
      loyaltyPoints: points, // send your points here
    };

    // const updateResponse = await fetch(
    //   "http://localhost:5087/api/user/updateuser",
    //   {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${token}`,
    //     },
    //     body: JSON.stringify(updatePayload),
    //   }
    // );

    // if (!updateResponse.ok) {
    //   throw new Error("Failed to update loyalty points");
    // }

    // Step 3: Show success
    setShowDialog(false);
    setShowSuccessDialog(true);

  } catch (error) {
    console.error("Error processing payment:", error);
    alert("Failed to process payment. Please try again.");
  }
};

  const closeSuccessDialog = () => {
    setShowSuccessDialog(false);
    // ✅ Mark payment as successful for redirect
    localStorage.setItem("paymentSuccess", "true");
    navigate("/dashboard");
  };

  if (loading) {
    return <div>Loading your cart...</div>;
  }

  return (
    <div>
      <h2>Your Cart</h2>
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
      {cartProducts.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {/* Cart Items */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "16px",
            }}
          >
            {cartProducts.map((product) => (
              <CartCard key={product.productId} product={product} />
            ))}
          </div>

          <hr style={{ margin: "20px 0" }} />

          <h3>Final Total: ₹{finalTotal.toFixed(2)}</h3>

          <button
            style={{
              padding: "10px 20px",
              marginTop: "20px",
              cursor: "pointer",
            }}
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>

          {/* Order Summary Dialog */}
          {showDialog && (
            <div className="dialog-overlay">
              <div className="dialog-box">
                <h2>Order Summary</h2>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Final Total:</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>18% GST:</span>
                  <span>₹{taxAmount}</span>
                </div>

                <hr />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                  }}
                >
                  <span>Payable Amount:</span>
                  <span>₹{totalWithTax}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "20px",
                  }}
                >
                  <button
                    onClick={handleCloseDialog}
                    style={{ padding: "10px 20px", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayNow}
                    style={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      border: "none",
                    }}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Dialog */}
          {showSuccessDialog && (
            <div className="dialog-overlay">
              <div className="dialog-box" style={{ textAlign: "center" }}>
                <h2 style={{ color: "green" }}>✅ Payment Successful!</h2>
                <p>
                  Your payment of ₹{totalWithTax} has been processed
                  successfully.
                </p>
                <button
                  onClick={closeSuccessDialog}
                  style={{
                    padding: "10px 20px",
                    cursor: "pointer",
                    marginTop: "20px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {/* Inline CSS */}
          <style>{`
            .dialog-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0,0,0,0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
            }
            .dialog-box {
              background: #fff;
              padding: 30px;
              border-radius: 8px;
              width: 350px;
              max-width: 90%;
              box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
          `}</style>
        </>
      )}
    </div>
  );
};

export default Cart;
