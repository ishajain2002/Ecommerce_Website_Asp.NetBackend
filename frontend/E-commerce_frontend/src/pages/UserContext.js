import React, { createContext, useContext, useEffect, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [isLoyalCustomer, setIsLoyalCustomer] = useState(false);

  useEffect(() => {
    // 🔁 Fetch user loyalty info from localStorage or API
    const user = JSON.parse(localStorage.getItem("user")) || {};
    setLoyaltyPoints(user.loyaltyPoints || 0);
    setIsLoyalCustomer(user.isLoyalCustomer || false);
  }, []);

  return (
    <UserContext.Provider value={{ loyaltyPoints, isLoyalCustomer, setLoyaltyPoints }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
