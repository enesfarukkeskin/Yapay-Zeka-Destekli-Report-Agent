import React, { useState } from 'react';
import './ActionItemsList.css';

const ActionItemsList = ({ actionItems = [] }) => {
  const [filter, setFilter] = useState('all');
  
  const getPriorityIcon = (priority) => {
    switch (priority.toLowerCase()) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  const getPriorityClass = (priority) => {
    return `priority-${priority.toLowerCase()}`;
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'marketing': return '📢';
      case 'sales': return '💼';
      case 'operations': return '⚙️';
      case 'finance': return '💰';
      case 'hr': return '👥';
      case 'it': return '💻';
      case 'strategy': return '🎯';
      default: return '📋';
    }
  };

  const filteredItems = actionItems.filter(item => {
    if (filter === 'all') return true;
    return item.priority.toLowerCase() === filter;
  });

  const priorities = ['all', 'high', 'medium', 'low'];

  return (
    <div className="action-items-list">
      <div className="action-items-header">
        <h3>✅ Eylem Planı</h3>
        <div className="filter-buttons">
          {priorities.map(priority => (
            <button
              key={priority}
              className={`filter-btn ${filter === priority ? 'active' : ''}`}
              onClick={() => setFilter(priority)}
            >
              {priority === 'all' ? 'Tümü' : 
               priority === 'high' ? 'Yüksek' :
               priority === 'medium' ? 'Orta' : 'Düşük'}
              {priority !== 'all' && (
                <span className="count">
                  {actionItems.filter(item => item.priority.toLowerCase() === priority).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="empty-action-items">
          <div className="empty-icon">📝</div>
          <p>
            {filter === 'all' 
              ? 'Henüz eylem maddesi belirlenmemiş.' 
              : `${filter} öncelikli eylem maddesi bulunamadı.`
            }
          </p>
        </div>
      ) : (
        <div className="action-items-grid">
          {filteredItems.map((item, index) => (
            <div key={index} className={`action-item ${getPriorityClass(item.priority)}`}>
              <div className="action-item-header">
                <div className="action-item-meta">
                  <span className="category-icon">{getCategoryIcon(item.category)}</span>
                  <span className="category-text">{item.category}</span>
                </div>
                <div className="priority-badge">
                  <span className="priority-icon">{getPriorityIcon(item.priority)}</span>
                  <span className="priority-text">{item.priority}</span>
                </div>
              </div>
              
              <div className="action-item-content">
                <h4 className="action-title">{item.title}</h4>
                <p className="action-description">{item.description}</p>
              </div>
              
              <div className="action-item-footer">
                <button className="action-btn">
                  Detay Görüntüle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="action-summary">
        <div className="summary-stats">
          <div className="summary-item">
            <span className="summary-label">Toplam Eylem:</span>
            <span className="summary-value">{actionItems.length}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Yüksek Öncelik:</span>
            <span className="summary-value high">
              {actionItems.filter(item => item.priority.toLowerCase() === 'high').length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Orta Öncelik:</span>
            <span className="summary-value medium">
              {actionItems.filter(item => item.priority.toLowerCase() === 'medium').length}
            </span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Düşük Öncelik:</span>
            <span className="summary-value low">
              {actionItems.filter(item => item.priority.toLowerCase() === 'low').length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionItemsList;