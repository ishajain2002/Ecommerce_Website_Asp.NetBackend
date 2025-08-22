import { createContext, useContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // ✅ Load from localStorage on first load
  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // ✅ Save to localStorage when cart changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // ✅ Add to cart (with quantity)
  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  // ✅ Increase quantity
  const increaseQty = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // ✅ Decrease quantity (remove if 0)
  const decreaseQty = (productId) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // ✅ Remove from cart
  const removeFromCart = (productId) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.id !== productId)
    );
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, removeFromCart, increaseQty, decreaseQty }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ✅ Hook to use cart
export const useCart = () => useContext(CartContext);





// // import React, { createContext, useContext, useEffect, useState } from "react";
// // import { getToken } from "../utils/auth";  // Adjust the path if needed

// // // Create the context
// // const CartContext = createContext();

// // // Custom hook to use the cart context
// // export const useCart = () => useContext(CartContext);

// // export const CartProvider = ({ children }) => {
// //   const [cartItems, setCartItems] = useState([]);
// //   const [loyaltyPoints, setLoyaltyPoints] = useState(0);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [isLoyalMember, setIsLoyalMember] = useState(true); // Hardcoded for demo

// //   // Hardcoded token for every request
// //   // const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJpc2hhMSIsImlhdCI6MTc1NDYyNjY5MCwiZXhwIjoxNzU0NjYyNjkwfQ.1u0kwryfNXJ_IVT80SZg1yaIdb2IxURw_R297gtpdqY";

// //   // Fetch cart items from backend
// //   const fetchCartItems = async () => {
// //     try {
// //       const response = await fetch("http://localhost:5087/api/cart", {
// //         headers: {
// //           Authorization: `Bearer ${getToken()}`,
// //         },
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to fetch cart items");
// //       }

// //       const data = await response.json();
// //       setCartItems(data);
// //     } catch (err) {
// //       console.error("Error fetching cart items:", err);
// //       setError("Failed to fetch cart items.");
// //       setCartItems([]);
// //     }
// //   };

// //   useEffect(() => {
// //     const initializeData = async () => {
// //       setLoading(true);
// //       await fetchCartItems();
// //       setLoyaltyPoints(5000); // Hardcoded loyalty points for demo
// //       setLoading(false);
// //       setIsLoyalMember(true); // Simulate user loyalty membership
// //     };
// //     initializeData();
// //   }, []);

// //   // Update quantity of existing cart item by calling backend
// //   const updateQuantity = async (cartDetailId, newQuantity) => {
// //     try {
// //       const updates = [{ cartDetailId, quantity: newQuantity }];

// //       const response = await fetch("http://localhost:5087/api/cart/update", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${getToken()}`,
// //         },
// //         body: JSON.stringify(updates),
// //       });

// //       if (!response.ok) {
// //         throw new Error("Failed to update cart quantity");
// //       }

// //       setCartItems(currentItems =>
// //         currentItems.map(item =>
// //           item.cartDetailId === cartDetailId
// //             ? { ...item, quantity: newQuantity, subtotal: item.unitPrice * newQuantity }
// //             : item
// //         )
// //       );
// //     } catch (error) {
// //       console.error("Error updating quantity:", error);
// //     }
// //   };

// //   // Add new item to cart by calling backend
// //   const addToCart = async (newItem) => {
// //     try {
// //       const response = await fetch("http://localhost:5087/api/cart/add", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${getToken()}`,
// //         },
// //         body: JSON.stringify({
// //           productId: newItem.productId,
// //           quantity: newItem.quantity,
// //           purchaseMode: newItem.purchaseMode,
// //         }),
// //       });

// //       if (!response.ok) throw new Error("Failed to add to cart");

// //       const createdCartItem = await response.json();
// //       setCartItems(items => [...items, createdCartItem]);
// //     } catch (error) {
// //       console.error("Failed to add item to cart:", error);
// //     }
// //   };

// //   // Remove item from cart with backend call
// //   const removeFromCart = async (cartDetailId) => {
// //     try {
// //       const response = await fetch(`http://localhost:5087/api/cart/delete/${cartDetailId}`, {
// //         method: "DELETE",
// //         headers: { Authorization: `Bearer ${getToken()}` },
// //       });

// //       if (!response.ok) throw new Error("Failed to remove cart item");

// //       setCartItems(currentItems => currentItems.filter(item => item.cartDetailId !== cartDetailId));
// //     } catch (error) {
// //       console.error("Failed to remove item:", error);
// //     }
// //   };

// //   return (
// //     <CartContext.Provider
// //       value={{
// //         cartItems,
// //         loyaltyPoints,
// //         setLoyaltyPoints,
// //         loading,
// //         error,
// //         isLoyalMember,
// //         addToCart,
// //         updateQuantity,
// //         removeFromCart,
// //       }}
// //     >
// //       {children}
// //     </CartContext.Provider>
// //   );
// // };