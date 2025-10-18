/**
 * @author Alexander Echeverria
 * @file BodegaDashboard.jsx
 * @description Dashboard del encargado de bodega
 * @location /src/pages/bodega/BodegaDashboard.jsx
 */

import { useState, useEffect } from 'react';
import { FiBox, FiAlertCircle, FiPackage, FiTrendingDown, FiCalendar, FiPlus } from 'react-icons/fi';
import StatCard from '../../components/dashboard/StatCard';
import { formatDate, daysUntilExpiration } from '../../utils/helpers';
import toast from 'react-hot-toast';

const BodegaDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    nearExpiry: 0,
    expired: 0,
  });

  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [nearExpiryBatches, setNearExpiryBatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchLowStockProducts();
    fetchNearExpiryBatches();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // TODO: Llamar a la API de estadísticas de inventario
      setTimeout(() => {
        setStats({
          totalProducts: 456,
          lowStock: 23,
          nearExpiry: 12,
          expired: 3,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error al cargar estadísticas');
      setLoading(false);
    }
  };

  const fetchLowStockProducts = async () => {
    try {
      // TODO: Llamar a la API de productos con stock bajo
      setTimeout(() => {
        setLowStockProducts([
          { id: 1, name: 'Paracetamol 500mg', currentStock: 5, minStock: 20, sku: 'MED-001' },
          { id: 2, name: 'Ibuprofeno 400mg', currentStock: 8, minStock: 25, sku: 'MED-002' },
          { id: 3, name: 'Amoxicilina 500mg', currentStock: 12, minStock: 30, sku: 'MED-003' },
          { id: 4, name: 'Loratadina 10mg', currentStock: 3, minStock: 15, sku: 'MED-004' },
          { id: 5, name: 'Omeprazol 20mg', currentStock: 6, minStock: 20, sku: 'MED-005' },
        ]);
      }, 1000);
    } catch (error) {
      console.error('Error fetching low stock:', error);
      toast.error('Error al cargar productos con stock bajo');
    }
  };

  const fetchNearExpiryBatches = async () => {
    try {
      // TODO: Llamar a la API de lotes próximos a vencer
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 15);
      
      setTimeout(() => {
        setNearExpiryBatches([
          { id: 1, product: 'Aspirina 100mg', batchNumber: 'L-2024-001', expiryDate: futureDate, quantity: 50 },
          { id: 2, product: 'Vitamina C 1000mg', batchNumber: 'L-2024-002', expiryDate: futureDate, quantity: 30 },
          { id: 3, product: 'Complejo B', batchNumber: 'L-2024-003', expiryDate: futureDate, quantity: 25 },
        ]);
      }, 1000);
    } catch (error) {
      console.error('Error fetching near expiry:', error);
      toast.error('Error al cargar lotes próximos a vencer');
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
            Control de inventario y stock
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <FiPlus />
          <span>Nueva Entrada</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Productos"
          value={stats.totalProducts}
          icon={FiBox}
          color="primary"
          description="En inventario"
        />
        <StatCard
          title="Stock Bajo"
          value={stats.lowStock}
          icon={FiAlertCircle}
          color="warning"
          description="Requieren reabastecimiento"
        />
        <StatCard
          title="Próximos a Vencer"
          value={stats.nearExpiry}
          icon={FiCalendar}
          color="warning"
          description="En 30 días"
        />
        <StatCard
          title="Vencidos"
          value={stats.expired}
          icon={FiTrendingDown}
          color="danger"
          description="Requieren atención"
        />
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
          <div className="p-6 space-y-3">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-neutral-900">{product.name}</p>
                    <p className="text-sm text-neutral-500">SKU: {product.sku}</p>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="text-danger-600 font-medium">
                        Stock: {product.currentStock}
                      </span>
                      <span className="text-neutral-500">
                        Mínimo: {product.minStock}
                      </span>
                    </div>
                  </div>
                  <button className="text-sm font-medium text-warning-600 hover:text-warning-700 whitespace-nowrap">
                    Reabastecer
                  </button>
                </div>
              </div>
            ))}
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
          <div className="p-6 space-y-3">
            {nearExpiryBatches.map((batch) => {
              const daysLeft = daysUntilExpiration(batch.expiryDate);
              return (
                <div key={batch.id} className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-900">{batch.product}</p>
                      <p className="text-sm text-neutral-500">Lote: {batch.batchNumber}</p>
                      <div className="mt-2 flex items-center space-x-4 text-sm">
                        <span className="text-danger-600 font-medium">
                          Vence en {daysLeft} días
                        </span>
                        <span className="text-neutral-500">
                          Cantidad: {batch.quantity}
                        </span>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-danger-600 hover:text-danger-700 whitespace-nowrap">
                      Ver detalle
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
            <FiPlus className="text-2xl text-primary-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Registrar Entrada</h3>
          <p className="text-sm text-neutral-600">Nueva entrada de productos</p>
        </button>

        <button className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group">
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-success-200 transition-colors">
            <FiPackage className="text-2xl text-success-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Ver Lotes</h3>
          <p className="text-sm text-neutral-600">Gestionar lotes de productos</p>
        </button>

        <button className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group">
          <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-warning-200 transition-colors">
            <FiBox className="text-2xl text-warning-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Inventario Completo</h3>
          <p className="text-sm text-neutral-600">Ver todo el inventario</p>
        </button>
      </div>
    </div>
  );
};

export default BodegaDashboard;