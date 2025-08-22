// src/context/LoyaltyContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const LoyaltyContext = createContext();

export const LoyaltyProvider = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [virtualPoints, setVirtualPoints] = useState(user.loyaltyPoints || 300);

  const tryUsePoints = (requiredPoints) => {
    if (virtualPoints >= requiredPoints) {
      setVirtualPoints(prev => prev - requiredPoints);
      return true;
    }
    return false;
  };

  const refundPoints = (points) => {
    setVirtualPoints(prev => prev + points);
  };

  return (
    <LoyaltyContext.Provider value={{ virtualPoints, tryUsePoints, refundPoints }}>
      {children}
    </LoyaltyContext.Provider>
  );
};

export const useLoyalty = () => useContext(LoyaltyContext);
