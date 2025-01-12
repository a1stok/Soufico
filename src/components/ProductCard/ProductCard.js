import React from 'react';
import './ProductCard.css';

const ProductCard = ({ name, price, image }) => {
  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-card-image" />
      <div className="product-card-content">
        <h3 className="product-card-title">{name}</h3>
        <p className="product-card-price">${price}</p>
        <button className="product-card-button">Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
