// src/utils/LoyaltyPointsManager.js

let virtualLoyaltyPoints = 0;

export const initVirtualLoyaltyPoints = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  virtualLoyaltyPoints = user?.loyaltyPoints || 300;
};

export const getVirtualPoints = () => virtualLoyaltyPoints;

export const tryUsePoints = (requiredPoints) => {
  if (virtualLoyaltyPoints >= requiredPoints) {
    virtualLoyaltyPoints -= requiredPoints;
    return true;
  }
  return false;
};

export const refundPoints = (points) => {
  virtualLoyaltyPoints += points;
};

export const resetVirtualPoints = () => {
  initVirtualLoyaltyPoints();
};
