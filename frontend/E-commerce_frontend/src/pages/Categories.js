import React, { useState, useEffect } from 'react';
import CategoryCard from '../components/CategoryCard/CategoryCard';
import { usePoints } from './PointsContext';

let renderCount = 0;

const Categories = () => {
  const { points } = usePoints();
  renderCount++;
  console.log(`🔁 Rendered ${renderCount} times`);

  const [categories, setCategories] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0);

  // Fetch categories from API
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5087/api/Home", {
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
    .then((data) => setCategories(data))
    .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // Read finalTotal from localStorage and update whenever it changes
  useEffect(() => {
    const updateTotal = () => {
      const total = parseFloat(localStorage.getItem("finalTotal")) || 0;
      setFinalTotal(total);
    };

    // Initial load
    updateTotal();

    // Listen for localStorage changes (in case multiple tabs)
    window.addEventListener("storage", updateTotal);

    return () => {
      window.removeEventListener("storage", updateTotal);
    };
  }, []);

  return (
    <div>
      {/* <h2>Cart Total: ₹{finalTotal}</h2> */}
      {/* <h2>Available Points: {points}</h2> */}

      <h2>Categories</h2>
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
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        {categories.map(cat => (
          <CategoryCard key={cat.ctgMasterId} category={cat} />
        ))}
      </div>
    </div>
  );
};

export default Categories;
