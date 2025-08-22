
import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { useParams } from 'react-router-dom';

const Products = () => {
  const { ctgId } = useParams();
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const token = localStorage.getItem("token"); // ⬅️ Get JWT from localStorage

  useEffect(() => {
    if (ctgId && token) {
      fetch(`http://localhost:5087/api/Home/Products/${ctgId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Network response was not ok");
          return res.json();
        })
        .then((data) => setProducts(Array.isArray(data) ? data : []))
        .catch((err) => console.error('Error fetching products:', err));
    }
  }, [ctgId, token]);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5087/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Cart fetch failed");
          return res.json();
        })
        .then((data) => setCartItems(data))
        .catch((err) => console.error("Error fetching cart items:", err));
    }
  }, [token]);

  return (
    <div>
      <h2>Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {products.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;

