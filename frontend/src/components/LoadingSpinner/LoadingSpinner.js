import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ message = 'Yükleniyor...' }) => {
  return (
    <div className="loading-spinner-container">
      <div className="loading-spinner">
        <div className="spinner"></div>
        <div className="loading-message">{message}</div>
      </div>
    </div>
  );
};

export default LoadingSpinner;