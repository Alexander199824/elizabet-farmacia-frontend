/**
 * @author Alexander Echeverria
 * @file statisticsService.js
 * @description Servicio de estadísticas
 * @location /src/services/statisticsService.js
 */

import api from './api';

const statisticsService = {
  // Dashboard principal
  getDashboard: async (params = {}) => {
    try {
      const response = await api.get('/statistics/dashboard', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Top productos más vendidos
  getTopProducts: async (limit = 10) => {
    try {
      const response = await api.get('/statistics/top-products', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reporte de ventas
  getSalesReport: async (startDate, endDate, groupBy = 'day') => {
    try {
      const response = await api.get('/statistics/sales-report', {
        params: { startDate, endDate, groupBy }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Análisis de rentabilidad
  getProfitability: async (params = {}) => {
    try {
      const response = await api.get('/statistics/profitability', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Top clientes
  getTopClients: async (limit = 10) => {
    try {
      const response = await api.get('/statistics/top-clients', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reporte de inventario
  getInventoryReport: async (category = '') => {
    try {
      const response = await api.get('/statistics/inventory', {
        params: category ? { category } : {}
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Reporte de vencimientos
  getExpirationReport: async (days = 30) => {
    try {
      const response = await api.get('/statistics/expiration', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default statisticsService;