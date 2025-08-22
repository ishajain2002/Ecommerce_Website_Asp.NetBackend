import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard/ProductCard';

const SpecialOffers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const token = localStorage.getItem('token'); // your JWT (string)

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1) fetch categories (ctg_master)
        const ctgRes = await fetch('http://localhost:5087/api/Home/offer', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          signal: controller.signal
        });

        if (!ctgRes.ok) throw new Error('Failed to fetch categories');
        const ctgList = await ctgRes.json();

        // If no categories, bail out early
        if (!Array.isArray(ctgList) || ctgList.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // 2) collect valid category ids (handle different naming conventions)
        const ctgIds = ctgList
          .map(ctg => ctg.ctgMasterId ?? ctg.ctg_master_id ?? ctg.id ?? ctg.ctgId)
          .filter(Boolean);

        if (ctgIds.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }

        // 3) fetch products for each category in parallel
        const productFetches = ctgIds.map(id =>
          fetch(`http://localhost:5087/api/Home/getspecialproduct/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token ? `Bearer ${token}` : undefined,
            },
            signal: controller.signal
          })
        );

        const responses = await Promise.all(productFetches);

        // check for any failed response
        const bad = responses.find(r => !r.ok);
        if (bad) throw new Error('Failed to fetch one or more product lists');

        // parse JSON for each
        const dataArrays = await Promise.all(responses.map(r => r.json()));

        // flatten: each item might be an array or a single object
        const flattened = dataArrays.flatMap(d => (Array.isArray(d) ? d : d ? [d] : []));

        setProducts(flattened);
      } catch (err) {
        if (err.name === 'AbortError') {
          // request cancelled, ignore
          return;
        }
        console.error('Error fetching special offers:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => {
      controller.abort();
    };
  }, []); // run once

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Special Offers</h2>

      {loading && <p>Loading offers...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {products.length === 0 && !loading && !error && <p>No special products found.</p>}

        {products.map(prod => (
          <ProductCard
            key={prod.productId ?? prod.product_id ?? `${prod.prodName ?? 'prod'}-${Math.random()}`}
            product={prod}
          />
        ))}
      </div>
    </div>
  );
};

export default SpecialOffers;
