/**
 * @author Alexander Echeverria
 * @file alertService.js
 * @description Servicio de alertas
 * @location /src/services/alertService.js
 */

import api from './api';

const alertService = {
  // Obtener todas las alertas
  getAllAlerts: async () => {
    try {
      const response = await api.get('/alerts');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Alertas de stock bajo
  getLowStockAlerts: async () => {
    try {
      const response = await api.get('/alerts/low-stock');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Alertas de productos por vencer
  getExpiringAlerts: async (days = 30) => {
    try {
      const response = await api.get('/alerts/expiring', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Alertas de productos vencidos
  getExpiredAlerts: async () => {
    try {
      const response = await api.get('/alerts/expired');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Alertas de aprobaciones pendientes
  getPendingApprovalsAlerts: async () => {
    try {
      const response = await api.get('/alerts/pending-approvals');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default alertService;