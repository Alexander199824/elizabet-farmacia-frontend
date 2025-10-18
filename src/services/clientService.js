/**
 * @author Alexander Echeverria
 * @file clientService.js
 * @description Servicio completo de gestión de clientes
 * @location /src/services/clientService.js
 */

import api from './api';

const clientService = {
  // CREATE
  createClient: async (clientData) => {
    try {
      const response = await api.post('/users/register', {
        ...clientData,
        role: 'cliente'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // READ ALL
  getAllClients: async (params = {}) => {
    try {
      const response = await api.get('/users', {
        params: { ...params, role: 'cliente' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // READ ONE
  getClientById: async (id) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // UPDATE
  updateClient: async (id, clientData) => {
    try {
      const response = await api.put(`/users/${id}`, clientData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // DELETE
  deleteClient: async (id) => {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener historial de compras del cliente
  getClientPurchaseHistory: async (clientId, params = {}) => {
    try {
      const response = await api.get('/invoices', {
        params: { clientId, ...params }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener estadísticas del cliente
  getClientStats: async (clientId) => {
    try {
      const response = await api.get(`/users/${clientId}/stats`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Activar/Desactivar cliente
  toggleActive: async (id) => {
    try {
      const response = await api.patch(`/users/${id}/toggle-active`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Buscar clientes
  searchClients: async (searchTerm) => {
    try {
      const response = await api.get('/users', {
        params: { search: searchTerm, role: 'cliente' }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Obtener clientes con deuda
  getClientsWithDebt: async () => {
    try {
      const response = await api.get('/users', {
        params: { role: 'cliente', hasDebt: true }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Top clientes (mejores clientes)
  getTopClients: async (limit = 10) => {
    try {
      const response = await api.get('/statistics/top-clients', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default clientService;