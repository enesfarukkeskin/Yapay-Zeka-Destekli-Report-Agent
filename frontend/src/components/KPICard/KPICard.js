import React from 'react';
import './KPICard.css';

const KPICard = ({ kpi }) => {
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'revenue': return '💰';
      case 'customer': return '👥';
      case 'quality': return '⭐';
      case 'performance': return '📈';
      case 'system': return '⚙️';
      default: return '📊';
    }
  };

  const formatValue = (value, unit) => {
    if (!unit) return value.toLocaleString();
    
    // Para birimi formatı
    if (unit.toLowerCase() === 'tl' || unit.toLowerCase() === 'try') {
      return `${value.toLocaleString()} ₺`;
    }
    
    // Yüzde formatı
    if (unit === '%') {
      return `%${value}`;
    }
    
    return `${value.toLocaleString()} ${unit}`;
  };

  return (
    <div className="kpi-card">
      <div className="kpi-header">
        <div className="kpi-icon">{getCategoryIcon(kpi.category)}</div>
        <div className="kpi-category">{kpi.category}</div>
      </div>
      
      <div className="kpi-content">
        <div className="kpi-value">{formatValue(kpi.value, kpi.unit)}</div>
        <div className="kpi-name">{kpi.name}</div>
      </div>
    </div>
  );
};

export default KPICard;