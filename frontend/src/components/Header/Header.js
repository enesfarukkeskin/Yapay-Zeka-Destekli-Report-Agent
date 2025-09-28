import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    onLogout();
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo" onClick={() => navigate('/')}>
          🤖 Report Agent
        </div>
        
        <nav className="nav">
          <button 
            className={location.pathname === '/' ? 'active' : ''}
            onClick={() => navigate('/')}
          >
            Dashboard
          </button>
          <button 
            className={location.pathname === '/upload' ? 'active' : ''}
            onClick={() => navigate('/upload')}
          >
            Rapor Yükle
          </button>
        </nav>

        <div className="header-actions">
          <div className="user-info">
            <span>👤 Kullanıcı</span>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Çıkış
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;