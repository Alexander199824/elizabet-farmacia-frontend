/**
 * @author Alexander Echeverria
 * @file BodegaDashboard.jsx
 * @description Dashboard del encargado de bodega con datos reales
 * ✅ Accesos rápidos a Productos y Lotes
 * @location /src/pages/bodega/BodegaDashboard.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FiBox, FiAlertCircle, FiPackage, FiTrendingDown, 
  FiCalendar, FiPlus, FiLayers, FiGrid
} from 'react-icons/fi';
import StatCard from '../../components/dashboard/StatCard';
import productService from '../../services/productService';
import batchService from '../../services/batchService';
import alertService from '../../services/alertService';
import { formatDate, daysUntilExpiration } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BodegaDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [nearExpiryBatches, setNearExpiryBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWarehouseData();
  }, []);

  const fetchWarehouseData = async () => {
    setLoading(true);
    try {
      // Obtener estadísticas de inventario
      const productStats = await productService.getProductStats();
      setStats(productStats);

      // Obtener productos con stock bajo
      const lowStock = await alertService.getLowStockAlerts();
      setLowStockProducts(lowStock.products || []);

      // Obtener lotes próximos a vencer
      const nearExpiry = await alertService.getExpiringAlerts(30);
      setNearExpiryBatches(nearExpiry.batches || []);

    } catch (error) {
      console.error('Error fetching warehouse data:', error);
      toast.error('Error al cargar datos de bodega');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Panel de Bodega
          </h1>
          <p className="text-neutral-600 mt-1">
            Control de inventario, productos y lotes
          </p>
        </div>
        <button 
          onClick={() => navigate('/dashboard/entradas')}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Nueva Entrada</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Productos"
          value={stats?.total || 0}
          icon={FiBox}
          color="primary"
          description="En inventario"
        />
        <StatCard
          title="Stock Bajo"
          value={stats?.lowStock || 0}
          icon={FiAlertCircle}
          color="warning"
          description="Requieren reabastecimiento"
        />
        <StatCard
          title="Próximos a Vencer"
          value={nearExpiryBatches.length}
          icon={FiCalendar}
          color="warning"
          description="En 30 días"
        />
        <StatCard
          title="Agotados"
          value={stats?.outOfStock || 0}
          icon={FiTrendingDown}
          color="danger"
          description="Sin stock"
        />
      </div>

      {/* ✅ ACCESOS RÁPIDOS MEJORADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          onClick={() => navigate('/dashboard/productos')}
          className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
            <FiPackage className="text-2xl text-primary-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Gestionar Productos</h3>
          <p className="text-sm text-neutral-600">Crear y editar productos</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/lotes')}
          className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-success-200 transition-colors">
            <FiGrid className="text-2xl text-success-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Gestionar Lotes</h3>
          <p className="text-sm text-neutral-600">Crear y administrar lotes</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/inventario')}
          className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-warning-200 transition-colors">
            <FiBox className="text-2xl text-warning-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Inventario Completo</h3>
          <p className="text-sm text-neutral-600">Ver todo el inventario</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/proveedores')}
          className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
            <FiLayers className="text-2xl text-purple-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Proveedores</h3>
          <p className="text-sm text-neutral-600">Gestionar proveedores</p>
        </button>
      </div>

      {/* Alerts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="p-6 border-b bg-warning-50">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <FiAlertCircle className="text-warning-600" />
              <span>Productos con Stock Bajo</span>
            </h3>
          </div>
          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product) => (
                <div key={product.id} className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{product.name}</p>
                      <p className="text-sm text-neutral-500">SKU: {product.sku}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <span className="text-danger-600 font-medium">
                          Stock: {product.stock}
                        </span>
                        <span className="text-neutral-500">
                          Mínimo: {product.minStock}
                        </span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/dashboard/productos`)}
                      className="text-sm font-medium text-warning-600 hover:text-warning-700 whitespace-nowrap"
                    >
                      Reabastecer
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-neutral-500 py-8">
                No hay productos con stock bajo
              </p>
            )}
          </div>
        </div>

        {/* Near Expiry Alert */}
        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="p-6 border-b bg-danger-50">
            <h3 className="text-lg font-semibold flex items-center space-x-2">
              <FiCalendar className="text-danger-600" />
              <span>Lotes Próximos a Vencer</span>
            </h3>
          </div>
          <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
            {nearExpiryBatches.length > 0 ? (
              nearExpiryBatches.map((batch) => {
                const daysLeft = daysUntilExpiration(batch.expirationDate);
                return (
                  <div key={batch.id} className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-neutral-900">{batch.product?.name}</p>
                        <p className="text-sm text-neutral-500">Lote: {batch.batchNumber}</p>
                        <div className="mt-2 flex items-center space-x-4 text-sm">
                          <span className="text-danger-600 font-medium">
                            Vence en {daysLeft} días
                          </span>
                          <span className="text-neutral-500">
                            Cantidad: {batch.currentQuantity}
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/dashboard/lotes`)}
                        className="text-sm font-medium text-danger-600 hover:text-danger-700 whitespace-nowrap"
                      >
                        Ver detalle
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-neutral-500 py-8">
                No hay lotes próximos a vencer
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodegaDashboard;