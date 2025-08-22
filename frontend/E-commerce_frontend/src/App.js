import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/common/Layout';
import Categories from './pages/Categories';
import SubCategories from './pages/SubCategories';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import { PointsProvider } from './pages/PointsContext';
import { CartTotalProvider } from "./pages/CartTotalContext";
// import Profile from './pages/Profile';
import ProfilePage from './pages/ProfilePage';
import InvoiceDetailsPage from './pages/InvoiceDetailsPage';
import OrdersPage from './pages/OrdersPage';

function App() {
  return (
    <Router>
      <CartTotalProvider>
      <PointsProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage/>}/>
          <Route path="/dashboard" element={<Categories />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/orders/:invoiceId" element={<InvoiceDetailsPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/subcategories/:ctgId" element={<SubCategories />}/>
          <Route path="/products/:ctgId" element={<Products />} />  // This matches correctly
          <Route path="/productdetails/:productId" element={<ProductDetails />} />       
        </Routes>
      </Layout>
      </PointsProvider>
      </CartTotalProvider>
    </Router>
  );
}

export default App;
