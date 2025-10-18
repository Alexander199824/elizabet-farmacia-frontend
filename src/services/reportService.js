/**
 * @author Alexander Echeverria
 * @file reportService.js
 * @description Servicio completo de reportes y analíticas
 * @location /src/services/reportService.js
 */

import api from './api';

const reportService = {
  // ========== REPORTES DE VENTAS ==========
  
  /**
   * Reporte de ventas por período
   */
  getSalesReport: async (params = {}) => {
    try {
      const response = await api.get('/statistics/sales-report', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Ventas por vendedor
   */
  getSalesByVendor: async (startDate, endDate) => {
    try {
      const response = await api.get('/statistics/sales-by-vendor', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Ventas por categoría de producto
   */
  getSalesByCategory: async (startDate, endDate) => {
    try {
      const response = await api.get('/statistics/sales-by-category', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Productos más vendidos
   */
  getTopProducts: async (params = {}) => {
    try {
      const response = await api.get('/statistics/top-products', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ========== REPORTES DE INVENTARIO ==========
  
  /**
   * Reporte de inventario por categoría
   */
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

  /**
   * Reporte de movimientos de inventario
   */
  getInventoryMovements: async (startDate, endDate) => {
    try {
      const response = await api.get('/statistics/inventory-movements', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Productos con stock bajo
   */
  getLowStockReport: async () => {
    try {
      const response = await api.get('/alerts/low-stock');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Reporte de productos próximos a vencer
   */
  getExpirationReport: async (days = 30) => {
    try {
      const response = await api.get('/statistics/expiration', {
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ========== REPORTES FINANCIEROS ==========
  
  /**
   * Reporte de rentabilidad
   */
  getProfitabilityReport: async (params = {}) => {
    try {
      const response = await api.get('/statistics/profitability', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Reporte de métodos de pago
   */
  getPaymentMethodsReport: async (startDate, endDate) => {
    try {
      const response = await api.get('/statistics/payment-methods', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Comparativa de períodos
   */
  getPeriodComparison: async (currentStart, currentEnd, previousStart, previousEnd) => {
    try {
      const response = await api.get('/statistics/period-comparison', {
        params: { currentStart, currentEnd, previousStart, previousEnd }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ========== REPORTES DE CLIENTES ==========
  
  /**
   * Top clientes (mejores clientes)
   */
  getTopClients: async (params = {}) => {
    try {
      const response = await api.get('/statistics/top-clients', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Análisis de clientes
   */
  getClientAnalysis: async (startDate, endDate) => {
    try {
      const response = await api.get('/statistics/client-analysis', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // ========== REPORTES GENERALES ==========
  
  /**
   * Dashboard ejecutivo
   */
  getExecutiveDashboard: async (startDate, endDate) => {
    try {
      const response = await api.get('/statistics/executive-dashboard', {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Exportar reporte a PDF
   */
  exportToPDF: async (reportType, params = {}) => {
    try {
      const response = await api.get(`/reports/export/pdf/${reportType}`, {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  /**
   * Exportar reporte a Excel
   */
  exportToExcel: async (reportType, params = {}) => {
    try {
      const response = await api.get(`/reports/export/excel/${reportType}`, {
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default reportService;