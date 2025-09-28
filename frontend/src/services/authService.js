class AuthService {
  async login(email, password) {
    // Demo amaçlı basit login
    if (email && password) {
      const token = 'demo-jwt-token-' + Date.now();
      localStorage.setItem('authToken', token);
      return { token, user: { email } };
    }
    throw new Error('Invalid credentials');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  logout() {
    localStorage.removeItem('authToken');
  }
}

export const authService = new AuthService();