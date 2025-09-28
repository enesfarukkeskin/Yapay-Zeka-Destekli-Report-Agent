import React, { useState } from 'react';
import './Login.css';
import { authService } from '../../services/authService';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.login(email, password);
      onLogin();
    } catch (error) {
      alert('Giriş hatası: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>🤖 Report Agent</h1>
          <p>AI destekli rapor analiz platformu</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="demo@example.com"
            />
          </div>

          <div className="form-group">
            <label>Şifre:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="demo123"
            />
          </div>

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <div className="demo-info">
          <h4>Demo Hesap</h4>
          <p>Email: demo@example.com</p>
          <p>Şifre: demo123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;