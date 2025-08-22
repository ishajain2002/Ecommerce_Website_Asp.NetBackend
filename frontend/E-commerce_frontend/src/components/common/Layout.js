import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import SpecialOffers from '../SpecialOffers';

const Layout = ({ children }) => {
  const location = useLocation();

  // Show special offers only on root and subcategories pages
  const showSpecialOffers = location.pathname === '/dashboard' || location.pathname.startsWith('/subcategories');

  return (
    <>
      <Header />
      <main>
        {children}
        {showSpecialOffers && <SpecialOffers />}
      </main>
      <Footer />
    </>
  );
};

export default Layout;
