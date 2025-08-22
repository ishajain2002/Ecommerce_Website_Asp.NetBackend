// src/pages/CartTotalContext.js
import React, { createContext, useContext, useState } from "react";

const CartTotalContext = createContext();

export const CartTotalProvider = ({ children }) => {
  const [finalTotal, setFinalTotal] = useState(0);

  return (
    <CartTotalContext.Provider value={{ finalTotal, setFinalTotal }}>
      {children}
    </CartTotalContext.Provider>
  );
};

export const useCartTotal = () => useContext(CartTotalContext);
