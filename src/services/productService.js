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
  },

  // Crear producto (con soporte para imagen)
  createProduct: async (productData) => {
    try {
      // Si hay una imagen (File object), usar FormData
      if (productData.image && productData.image instanceof File) {
        const formData = new FormData();

        // Agregar todos los campos al FormData
        Object.keys(productData).forEach(key => {
          if (key === 'image') {
            formData.append('image', productData.image);
          } else {
            formData.append(key, productData[key]);
          }
        });

        const response = await api.post('/products', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        return response.data;
      } else {
        // Sin imagen, enviar JSON normal
        const response = await api.post('/products', productData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Actualizar producto (con soporte para imagen)
  updateProduct: async (id, productData) => {
    try {
      // Si hay una imagen nueva (File object), usar FormData
      if (productData.image && productData.image instanceof File) {
        const formData = new FormData();

        // Agregar todos los campos al FormData
        Object.keys(productData).forEach(key => {
          if (key === 'image') {
            formData.append('image', productData.image);
          } else {
            formData.append(key, productData[key]);
          }
        });

        const response = await api.put(`/products/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        return response.data;
      } else {
        // Sin imagen nueva, enviar JSON normal
        const response = await api.put(`/products/${id}`, productData);
        return response.data;
      }
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Eliminar producto
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/products/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Cambiar estado activo/inactivo
  toggleActive: async (id) => {
    try {
      const response = await api.patch(`/products/${id}/toggle-active`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default productService;