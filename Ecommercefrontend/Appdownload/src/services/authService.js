
import api from './api';

const AuthService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    
    if (!response.data || !response.data.token || !response.data.user) {
      throw new Error("Invalid response format");
    }
    
    localStorage.setItem('token', response.data.token);
    
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  }
};

export default AuthService;