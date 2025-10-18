/**
 * @author Alexander Echeverria
 * @file productService.js
 * @description Servicio de productos
 * @location /src/services/productService.js
 */

import api from './api';

const productService = {
  // Obtener todos los productos
  getAllProducts: async (params = {}) => {
    try {
      const response = await api.get('/products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener producto por ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buscar productos
  searchProducts: async (searchTerm) => {
    try {
      const response = await api.get('/products', {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Filtrar por categoría
  getByCategory: async (category) => {
    try {
      const response = await api.get('/products', {
        params: { category }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Productos con stock bajo
  getLowStockProducts: async () => {
    try {
      const response = await api.get('/products/low-stock');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Estadísticas de productos
  getProductStats: async () => {
    try {
      const response = await api.get('/products/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default productService;