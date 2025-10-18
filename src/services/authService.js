/**
 * @author Alexander Echeverria
 * @file authService.js
 * @description Servicio de autenticación
 * @location /src/services/authService.js
 */

import api from './api';

const authService = {
  // Login tradicional
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Login con Google (token directo)
  loginWithGoogle: async (tokenId) => {
    try {
      const response = await api.post('/users/login-google', { tokenId });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Registro tradicional
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Registro con Google
  registerWithGoogle: async (tokenId) => {
    try {
      const response = await api.post('/users/register-google', { tokenId });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Obtener perfil
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default authService;