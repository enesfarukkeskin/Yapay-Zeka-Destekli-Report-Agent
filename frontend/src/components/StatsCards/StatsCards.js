import React from 'react';
import './StatsCards.css';

const StatsCards = ({ stats }) => {
  return (
    <div className="stats-cards">
      <div className="stat-card">
        <div className="stat-icon">📊</div>
        <div className="stat-content">
          <div className="stat-number">{stats.totalReports}</div>
          <div className="stat-label">Toplam Rapor</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">✅</div>
        <div className="stat-content">
          <div className="stat-number">{stats.analyzedReports}</div>
          <div className="stat-label">Analiz Edildi</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">⏳</div>
        <div className="stat-content">
          <div className="stat-number">{stats.pendingReports}</div>
          <div className="stat-label">Beklemede</div>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">🎯</div>
        <div className="stat-content">
          <div className="stat-number">%{stats.successRate}</div>
          <div className="stat-label">Başarı Oranı</div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
