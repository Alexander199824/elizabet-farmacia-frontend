/**
 * @author Alexander Echeverria
 * @file batchService.js
 * @description Servicio completo de gestión de lotes
 * @location /src/services/batchService.js
 */

import api from './api';

const batchService = {
  /**
   * CREATE - Crear nuevo lote
   * @param {Object} batchData - Datos del lote
   * @returns {Promise} Lote creado
   */
  createBatch: async (batchData) => {
    try {
      const response = await api.post('/batches', batchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * READ - Obtener todos los lotes con filtros y paginación
   * @param {Object} params - Parámetros de búsqueda
   * @returns {Promise} Lista de lotes
   */
  getAllBatches: async (params = {}) => {
    try {
      const response = await api.get('/batches', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * READ - Obtener lote por ID
   * @param {Number} id - ID del lote
   * @returns {Promise} Datos del lote
   */
  getBatchById: async (id) => {
    try {
      const response = await api.get(`/batches/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * UPDATE - Actualizar lote
   * @param {Number} id - ID del lote
   * @param {Object} batchData - Datos a actualizar
   * @returns {Promise} Lote actualizado
   */
  updateBatch: async (id, batchData) => {
    try {
      const response = await api.put(`/batches/${id}`, batchData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * DELETE - Eliminar lote
   * @param {Number} id - ID del lote
   * @returns {Promise} Confirmación
   */
  deleteBatch: async (id) => {
    try {
      const response = await api.delete(`/batches/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener lotes próximos a vencer
   * @param {Number} days - Días hasta vencimiento
   * @returns {Promise} Lotes próximos a vencer
   */
  getNearExpiryBatches: async (days = 30) => {
    try {
      const response = await api.get('/batches/near-expiry', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener lotes vencidos
   * @returns {Promise} Lotes vencidos
   */
  getExpiredBatches: async () => {
    try {
      const response = await api.get('/batches/expired');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener lotes por producto
   * @param {Number} productId - ID del producto
   * @returns {Promise} Lotes del producto
   */
  getBatchesByProduct: async (productId) => {
    try {
      const response = await api.get(`/batches/product/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener estadísticas de lotes
   * @returns {Promise} Estadísticas
   */
  getBatchStats: async () => {
    try {
      const response = await api.get('/batches/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Buscar lotes
   * @param {String} searchTerm - Término de búsqueda
   * @returns {Promise} Resultados de búsqueda
   */
  searchBatches: async (searchTerm) => {
    try {
      const response = await api.get('/batches', {
        params: { search: searchTerm }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Filtrar lotes por estado
   * @param {String} status - Estado del lote
   * @returns {Promise} Lotes filtrados
   */
  getByStatus: async (status) => {
    try {
      const response = await api.get('/batches', {
        params: { status }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener lotes por proveedor
   * @param {Number} supplierId - ID del proveedor
   * @returns {Promise} Lotes del proveedor
   */
  getBatchesBySupplier: async (supplierId) => {
    try {
      const response = await api.get('/batches', {
        params: { supplierId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Bloquear/Desbloquear lote
   * @param {Number} id - ID del lote
   * @param {Boolean} blocked - Estado de bloqueo
   * @returns {Promise} Lote actualizado
   */
  toggleBlockBatch: async (id, blocked) => {
    try {
      const response = await api.patch(`/batches/${id}/toggle-block`, { blocked });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Ajustar cantidad de lote
   * @param {Number} id - ID del lote
   * @param {Object} adjustmentData - Datos del ajuste
   * @returns {Promise} Lote actualizado
   */
  adjustQuantity: async (id, adjustmentData) => {
    try {
      const response = await api.post(`/batches/${id}/adjust`, adjustmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default batchService;