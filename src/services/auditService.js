/**
 * @author Alexander Echeverria
 * @file auditService.js
 * @description Servicio para gestión de logs de auditoría
 * @location /src/services/auditService.js
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Configurar interceptor para agregar token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const auditService = {
  /**
   * Obtener todos los logs con filtros y paginación
   */
  getAllLogs: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/audit/logs`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener un log por ID
   */
  getLogById: async (logId) => {
    try {
      const response = await axios.get(`${API_URL}/audit/logs/${logId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener logs de un usuario específico
   */
  getLogsByUser: async (userId, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/audit/logs/user/${userId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener logs de una entidad específica
   */
  getLogsByEntity: async (entity, entityId = null, params = {}) => {
    try {
      const url = entityId 
        ? `${API_URL}/audit/logs/entity/${entity}/${entityId}`
        : `${API_URL}/audit/logs/entity/${entity}`;
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener estadísticas de auditoría
   */
  getAuditStats: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/audit/stats`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener actividad reciente
   */
  getRecentActivity: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/audit/recent`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Exportar logs a CSV
   */
  exportToCSV: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/audit/export/csv`, {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Exportar logs a Excel
   */
  exportToExcel: async (params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/audit/export/excel`, {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener logs por rango de fechas
   */
  getLogsByDateRange: async (startDate, endDate, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/audit/logs`, {
        params: {
          ...params,
          startDate,
          endDate
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Buscar logs por descripción o usuario
   */
  searchLogs: async (searchTerm, params = {}) => {
    try {
      const response = await axios.get(`${API_URL}/audit/logs`, {
        params: {
          ...params,
          search: searchTerm
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ========== TRAZABILIDAD ==========

  /**
   * ¿Quién creó este elemento?
   */
  whoCreated: async (entity, entityId) => {
    try {
      const logs = await auditService.getLogsByEntity(entity, entityId);
      return logs.find(log => log.action === 'CREATE') || null;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * ¿Quién modificó este elemento?
   */
  whoModified: async (entity, entityId, limit = 10) => {
    try {
      const logs = await auditService.getLogsByEntity(entity, entityId, { limit });
      return logs.filter(log => log.action === 'UPDATE');
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * ¿Quién eliminó este elemento?
   */
  whoDeleted: async (entity, entityId) => {
    try {
      const logs = await auditService.getLogsByEntity(entity, entityId);
      return logs.find(log => log.action === 'DELETE') || null;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Obtener historial completo de un elemento
   */
  getCompleteHistory: async (entity, entityId) => {
    try {
      const logs = await auditService.getLogsByEntity(entity, entityId);
      return {
        logs,
        creation: logs.find(log => log.action === 'CREATE'),
        updates: logs.filter(log => log.action === 'UPDATE'),
        deletion: logs.find(log => log.action === 'DELETE')
      };
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ========== MANTENIMIENTO ==========

  /**
   * Limpiar logs antiguos (solo ADMIN)
   */
  cleanOldLogs: async (days = 90) => {
    try {
      const response = await axios.delete(`${API_URL}/audit/clean`, { data: { days } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default auditService;