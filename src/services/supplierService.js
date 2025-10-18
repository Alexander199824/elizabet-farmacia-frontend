/**
 * @author Alexander Echeverria
 * @file supplierService.js
 * @description Servicio completo de proveedores
 * @location /src/services/supplierService.js
 */

import api from './api';

const supplierService = {
  // CREATE
  createSupplier: async (supplierData) => {
    try {
      const response = await api.post('/suppliers', supplierData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // READ ALL
  getAllSuppliers: async (params = {}) => {
    try {
      const response = await api.get('/suppliers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // READ ONE
  getSupplierById: async (id) => {
    try {
      const response = await api.get(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // UPDATE
  updateSupplier: async (id, supplierData) => {
    try {
      const response = await api.put(`/suppliers/${id}`, supplierData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE
  deleteSupplier: async (id) => {
    try {
      const response = await api.delete(`/suppliers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Registrar pago
  registerPayment: async (id, paymentData) => {
    try {
      const response = await api.post(`/suppliers/${id}/register-payment`, paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Historial de pagos
  getPaymentHistory: async (id, params = {}) => {
    try {
      const response = await api.get(`/suppliers/${id}/payment-history`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Estadísticas
  getSupplierStats: async () => {
    try {
      const response = await api.get('/suppliers/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buscar
  searchSuppliers: async (searchTerm) => {
    try {
      const response = await api.get('/suppliers', {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Proveedores con deuda
  getSuppliersWithDebt: async () => {
    try {
      const response = await api.get('/suppliers', {
        params: { withDebt: true }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Activar/Desactivar
  toggleActive: async (id) => {
    try {
      const response = await api.patch(`/suppliers/${id}/toggle-active`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default supplierService;