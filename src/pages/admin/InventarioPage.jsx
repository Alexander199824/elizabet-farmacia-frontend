/**
 * @author Alexander Echeverria
 * @file InventarioPage.jsx
 * @description Gestión completa del inventario
 * @location /src/pages/admin/InventarioPage.jsx
 */

import { useState, useEffect } from 'react';
import { FiSearch, FiFilter, FiDownload, FiAlertCircle, FiPackage } from 'react-icons/fi';
import productService from '../../services/productService';
import batchService from '../../services/batchService';
import { formatCurrency, formatDate, daysUntilExpiration } from '../../utils/helpers';
import toast from 'react-hot-toast';

const InventarioPage = () => {
  const [products, setProducts] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products'); // 'products' o 'batches'
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '', // 'ok', 'low', 'out'
    expiryStatus: '' // 'active', 'near_expiry', 'expired'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchBatches();
    }
    fetchStats();
  }, [activeTab, pagination.page, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      };

      const response = await productService.getAllProducts(params);
      
      setProducts(response.products || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm
      };

      const response = await batchService.getAllBatches(params);
      
      setBatches(response.batches || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching batches:', error);
      toast.error('Error al cargar lotes');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const productStats = await productService.getProductStats();
      const batchStats = await batchService.getBatchStats();
      
      setStats({
        products: productStats,
        batches: batchStats
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchBatches();
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getStockBadge = (product) => {
    if (product.stock <= 0) {
      return <span className="badge-danger">Agotado</span>;
    }
    if (product.stock <= product.minStock) {
      return <span className="badge-warning">Stock Bajo</span>;
    }
    return <span className="badge-success">Disponible</span>;
  };

  const getExpiryBadge = (batch) => {
    const days = daysUntilExpiration(batch.expirationDate);
    
    if (days < 0) {
      return <span className="badge-danger">Vencido</span>;
    }
    if (days <= 30) {
      return <span className="badge-warning">Por Vencer</span>;
    }
    return <span className="badge-success">Vigente</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Gestión de Inventario
          </h1>
          <p className="text-neutral-600 mt-1">
            Control completo del stock y lotes
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <FiDownload />
          <span>Exportar Inventario</span>
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-neutral-600">Total Productos</p>
            <p className="text-2xl font-bold text-primary-600">
              {stats.products?.total || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-neutral-600">Stock Bajo</p>
            <p className="text-2xl font-bold text-warning-600">
              {stats.products?.lowStock || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-neutral-600">Por Vencer</p>
            <p className="text-2xl font-bold text-warning-600">
              {stats.batches?.nearExpiry || 0}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-neutral-600">Valor Total</p>
            <p className="text-2xl font-bold text-success-600">
              {formatCurrency(stats.batches?.totalValue || 0)}
            </p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-card">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab('products');
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === 'products'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <FiPackage className="inline mr-2" />
              Productos
            </button>
            <button
              onClick={() => {
                setActiveTab('batches');
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className={`px-6 py-4 font-medium transition-colors border-b-2 ${
                activeTab === 'batches'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <FiAlertCircle className="inline mr-2" />
              Lotes
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <form onSubmit={handleSearch} className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder={activeTab === 'products' ? 'Buscar productos...' : 'Buscar lotes...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              </div>
            </form>

            {activeTab === 'products' && (
              <>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todas las categorías</option>
                  <option value="medicamento">Medicamentos</option>
                  <option value="vitamina">Vitaminas</option>
                  <option value="suplemento">Suplementos</option>
                  <option value="cuidado_personal">Cuidado Personal</option>
                </select>

                <select
                  value={filters.stockStatus}
                  onChange={(e) => setFilters({ ...filters, stockStatus: e.target.value })}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Todos los stocks</option>
                  <option value="ok">Stock OK</option>
                  <option value="low">Stock Bajo</option>
                  <option value="out">Agotados</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-x-auto">
          {activeTab === 'products' ? (
            <table className="w-full">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                      </div>
                    </td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {product.imageUrl && (
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-10 h-10 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium text-neutral-900">{product.name}</p>
                            <p className="text-sm text-neutral-500">{product.presentation}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-600">
                        {product.sku}
                      </td>
                      <td className="px-6 py-4 text-sm capitalize">
                        {product.category}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{product.stock}</p>
                          <p className="text-xs text-neutral-500">
                            Min: {product.minStock}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-primary-600">
                          {formatCurrency(product.price)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {getStockBadge(product)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-neutral-500">
                      No se encontraron productos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Lote
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Producto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Vencimiento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                      </div>
                    </td>
                  </tr>
                ) : batches.length > 0 ? (
                  batches.map((batch) => (
                    <tr key={batch.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-primary-600">
                          {batch.batchNumber}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-neutral-900">
                          {batch.product?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">
                            {batch.currentQuantity}
                          </p>
                          <p className="text-xs text-neutral-500">
                            de {batch.initialQuantity}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm">
                            {formatDate(batch.expirationDate)}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {daysUntilExpiration(batch.expirationDate)} días
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {batch.location || 'Sin asignar'}
                      </td>
                      <td className="px-6 py-4">
                        {getExpiryBadge(batch)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-neutral-500">
                      No se encontraron lotes
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Mostrando {activeTab === 'products' ? products.length : batches.length} de {pagination.total}
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded hover:bg-neutral-50 disabled:opacity-50"
              >
                Anterior
              </button>
              <span className="text-sm text-neutral-600">
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border rounded hover:bg-neutral-50 disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventarioPage;