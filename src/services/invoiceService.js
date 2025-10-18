/**
 * @author Alexander Echeverria
 * @file invoiceService.js
 * @description Servicio de ventas/facturas
 * @location /src/services/invoiceService.js
 */

import api from './api';

const invoiceService = {
  // Crear venta
  createInvoice: async (invoiceData) => {
    try {
      const response = await api.post('/invoices', invoiceData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener todas las ventas
  getAllInvoices: async (params = {}) => {
    try {
      const response = await api.get('/invoices', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener venta por ID
  getInvoiceById: async (id) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener próximo número de factura
  getNextInvoiceNumber: async () => {
    try {
      const response = await api.get('/invoices/next-number');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Anular venta
  cancelInvoice: async (id, reason) => {
    try {
      const response = await api.post(`/invoices/${id}/cancel`, { reason });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Estadísticas de ventas
  getInvoiceStats: async (params = {}) => {
    try {
      const response = await api.get('/invoices/stats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default invoiceService;