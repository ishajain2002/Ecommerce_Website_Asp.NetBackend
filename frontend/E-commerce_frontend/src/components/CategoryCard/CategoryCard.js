import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/subcategories/${category.ctgId}`);
  };

  return (
    <div className="category-card" onClick={handleClick}>
      <style>
        {`
          .category-card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            width: 160px;
            height:160px;
            cursor: pointer;
            background-color: #fff;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
            text-align: center;
          }
          .category-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
          .category-card img {
            width: 100%;
            height: 120px;
            object-fit: cover;
            border-radius: 6px;
            margin-bottom: 8px;
          }
          .category-card h3 {
            font-size: 1rem;
            color: #2c3e50;
            margin: 0;
          }
        `}
      </style>
      {/* <img src={category.ctgImgPath} alt={category.ctgName} /> */}
<img
  src={`/images/${category.ctgImgPath}`}
  alt={category.ctgName}
  style={{ width: '140px', height: '140px', objectFit: 'cover' }}
/>

      <h3>{category.ctgName}</h3>
    </div>
  );
};

export default CategoryCard;
