/**
 * @author Alexander Echeverria
 * @file InventarioPage.jsx
 * @description Página principal de gestión de inventario - UNIFICADA
 * @location /src/pages/admin/InventarioPage.jsx
 */

import { useState, useEffect } from 'react';
import { FiPackage, FiBox, FiAlertCircle, FiDownload } from 'react-icons/fi';
import productService from '../../services/productService';
import batchService from '../../services/batchService';
import { formatCurrency } from '../../utils/helpers';

// Componentes de tabs
import ProductsTab from '../../components/inventory/ProductsTab';
import BatchesTab from '../../components/inventory/BatchesTab';
import AlertsTab from '../../components/inventory/AlertsTab';

const InventarioPage = () => {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'batches', 'alerts'
  const [stats, setStats] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchStats();
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const [productStats, batchStats] = await Promise.all([
        productService.getProductStats().catch(() => null),
        batchService.getBatchStats().catch(() => null)
      ]);

      setStats({
        products: productStats || { total: 0, lowStock: 0, outOfStock: 0 },
        batches: batchStats || { total: 0, nearExpiry: 0, expired: 0, totalValue: 0 }
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
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
            Control completo de productos, lotes y alertas
          </p>
        </div>
        <button
          onClick={() => {/* TODO: Implementar exportación */}}
          className="btn-secondary flex items-center space-x-2"
        >
          <FiDownload />
          <span>Exportar</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-primary-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Total Productos</p>
              <p className="text-2xl font-bold text-neutral-900">
                {stats?.products?.total || 0}
              </p>
            </div>
            <FiPackage className="text-3xl text-primary-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-warning-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Stock Bajo</p>
              <p className="text-2xl font-bold text-warning-600">
                {stats?.products?.lowStock || 0}
              </p>
            </div>
            <FiAlertCircle className="text-3xl text-warning-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-danger-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Por Vencer</p>
              <p className="text-2xl font-bold text-danger-600">
                {stats?.batches?.nearExpiry || 0}
              </p>
            </div>
            <FiBox className="text-3xl text-danger-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-card p-4 border-l-4 border-success-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600">Valor Total</p>
              <p className="text-2xl font-bold text-success-600">
                {formatCurrency(stats?.batches?.totalValue || 0)}
              </p>
            </div>
            <div className="text-3xl text-success-500">Q</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 px-6 py-4 font-medium transition-colors border-b-2 flex items-center justify-center space-x-2 ${
                activeTab === 'products'
                  ? 'border-primary-500 text-primary-600 bg-primary-50'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <FiPackage size={20} />
              <span>Productos</span>
            </button>

            <button
              onClick={() => setActiveTab('batches')}
              className={`flex-1 px-6 py-4 font-medium transition-colors border-b-2 flex items-center justify-center space-x-2 ${
                activeTab === 'batches'
                  ? 'border-primary-500 text-primary-600 bg-primary-50'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <FiBox size={20} />
              <span>Lotes</span>
            </button>

            <button
              onClick={() => setActiveTab('alerts')}
              className={`flex-1 px-6 py-4 font-medium transition-colors border-b-2 flex items-center justify-center space-x-2 ${
                activeTab === 'alerts'
                  ? 'border-primary-500 text-primary-600 bg-primary-50'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'
              }`}
            >
              <FiAlertCircle size={20} />
              <span>Alertas</span>
              {((stats?.products?.lowStock || 0) + (stats?.batches?.nearExpiry || 0)) > 0 && (
                <span className="bg-danger-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {(stats?.products?.lowStock || 0) + (stats?.batches?.nearExpiry || 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'products' && (
            <ProductsTab onRefresh={handleRefresh} />
          )}

          {activeTab === 'batches' && (
            <BatchesTab onRefresh={handleRefresh} />
          )}

          {activeTab === 'alerts' && (
            <AlertsTab onRefresh={handleRefresh} />
          )}
        </div>
      </div>
    </div>
  );
};

export default InventarioPage;
