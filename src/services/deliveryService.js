/**
 * @author Alexander Echeverria
 * @file deliveryService.js
 * @description Servicio completo de entregas
 * @location /src/services/deliveryService.js
 */

import api from './api';

const deliveryService = {
  // CREATE
  createDelivery: async (deliveryData) => {
    try {
      const response = await api.post('/deliveries', deliveryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // READ ALL
  getAllDeliveries: async (params = {}) => {
    try {
      const response = await api.get('/deliveries', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // READ ONE
  getDeliveryById: async (id) => {
    try {
      const response = await api.get(`/deliveries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // UPDATE
  updateDelivery: async (id, deliveryData) => {
    try {
      const response = await api.put(`/deliveries/${id}`, deliveryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE
  deleteDelivery: async (id) => {
    try {
      const response = await api.delete(`/deliveries/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener entregas del día
  getTodayDeliveries: async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await api.get('/deliveries', {
        params: { date: today }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener entregas por repartidor
  getDeliveriesByDriver: async (driverId, params = {}) => {
    try {
      const response = await api.get('/deliveries', {
        params: { driverId, ...params }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar estado
  updateStatus: async (id, status) => {
    try {
      const response = await api.patch(`/deliveries/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Marcar como entregado
  markAsDelivered: async (id, deliveryData) => {
    try {
      const response = await api.post(`/deliveries/${id}/deliver`, deliveryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Iniciar entrega
  startDelivery: async (id) => {
    try {
      const response = await api.post(`/deliveries/${id}/start`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cancelar entrega
  cancelDelivery: async (id, reason) => {
    try {
      const response = await api.post(`/deliveries/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Estadísticas
  getDeliveryStats: async (params = {}) => {
    try {
      const response = await api.get('/deliveries/stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Entregas por estado
  getByStatus: async (status) => {
    try {
      const response = await api.get('/deliveries', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Historial de entregas
  getDeliveryHistory: async (params = {}) => {
    try {
      const response = await api.get('/deliveries/history', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Asignar repartidor
  assignDriver: async (id, driverId) => {
    try {
      const response = await api.patch(`/deliveries/${id}/assign`, { driverId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default deliveryService;