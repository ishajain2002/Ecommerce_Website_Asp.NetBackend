import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { usePoints } from './PointsContext';


const SubCategories = () => {
  const { ctgId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [redirectToProducts, setRedirectToProducts] = useState(false);
    const { points } = usePoints();
  

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5087/api/Home/${ctgId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(async (res) => {
        if (!res.ok || res.status === 204) return null;
        const text = await res.text();
        if (!text) return null;
        return JSON.parse(text);
      })
      .then((data) => {
        if (!data || !Array.isArray(data) || data.length === 0) {
          setRedirectToProducts(true);
        } else {
          setSubcategories(data);
        }
      })
      .catch((error) => {
        console.error('Error fetching subcategories:', error);
      });
  }, [ctgId]);

  if (redirectToProducts) {
    return <Navigate to={`/products/${ctgId}`} />;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', color: '#333' }}>Subcategories</h2>
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
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          justifyContent: 'flex-start'
        }}
      >
        {subcategories.length === 0 ? (
          <p>Loading subcategories...</p>
        ) : (
          subcategories.map((sc) => (
            <div
              key={sc.ctgId}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '10px',
                width: '160px',
                height:'160px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                backgroundColor: '#fff'
              }}
              onClick={() => (window.location.href = `/subcategories/${sc.ctgId}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* <img
                src={sc.ctgImgPath || 'https://placehold.co/150x150'}
                alt={sc.ctgName}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '6px',
                  marginBottom: '8px'
                }}
              /> */}

              <img
  src={sc.ctgImgPath ? `/images/${sc.ctgImgPath}` : "https://placehold.co/150x150"}
  alt={sc.ctgName}
  style={{ width: '140px', height: '140px', objectFit: 'cover' }}
/>

              <h4 style={{ fontSize: '1em', color: '#555', margin: '5px 0 0' }}>
                {sc.ctgName}
              </h4>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubCategories;
