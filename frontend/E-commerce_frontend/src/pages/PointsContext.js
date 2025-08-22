import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const PointsContext = createContext();

export const PointsProvider = ({ children }) => {
  const [points, setPoints] = useState(0);

  const fetchPoints = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setPoints(0);
      return;
    }

    try {
      // 1️⃣ Get user's own points
      const userRes = await fetch("http://localhost:5087/api/user/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!userRes.ok) throw new Error("Failed to fetch user points");
      const userData = await userRes.json();
      const availablePoints = userData.loyaltyPoints || 0;

      // 2️⃣ Try fetching cart products (but don't throw for empty cart)
      let cartData = [];
      try {
        const cartRes = await fetch("http://localhost:5087/api/cart", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (cartRes.ok) {
          cartData = await cartRes.json();
        } else {
          cartData = []; // Treat non-OK as empty cart
        }
      } catch {
        cartData = []; // Network error → empty cart
      }

      // 3️⃣ If cart is empty → show full points
      if (!Array.isArray(cartData) || cartData.length === 0) {
        setPoints(availablePoints);
        return;
      }

      // 4️⃣ Calculate used points for LOYALTY_POINTS mode, multiplying points by quantity
      const totalPointsUsed = cartData
        .filter(item => item.purchaseMode === "LOYALTY_POINTS")
        .reduce((sum, item) => sum + ((item.loyaltyPoints || 0) * (item.quantity || 1)), 0);

      // 5️⃣ If no loyalty items → show full points
      if (totalPointsUsed === 0) {
        setPoints(availablePoints);
        return;
      }

      // 6️⃣ Otherwise deduct used points
      const remainingPoints = availablePoints - totalPointsUsed;
      setPoints(remainingPoints >= 0 ? remainingPoints : 0);

    } catch (err) {
      console.error("Error fetching points:", err);
    }
  }, []); // ✅ Stable reference

  useEffect(() => {
    fetchPoints(); // Immediate fetch
    const intervalId = setInterval(fetchPoints, 1000); // Fetch every second
    return () => clearInterval(intervalId);
  }, [fetchPoints]);

  return (
    <PointsContext.Provider value={{ points, setPoints }}>
      {children}
    </PointsContext.Provider>
  );
};

export const usePoints = () => useContext(PointsContext);
