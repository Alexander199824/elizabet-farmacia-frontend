/**
 * @author Alexander Echeverria
 * @file AlertsTab.jsx
 * @description Tab de alertas de inventario (stock bajo, vencidos, etc.)
 * @location /src/components/inventory/AlertsTab.jsx
 */

import { useState, useEffect } from 'react';
import { FiAlertCircle, FiPackage, FiClock, FiXCircle, FiLock } from 'react-icons/fi';
import productService from '../../services/productService';
import batchService from '../../services/batchService';
import { formatCurrency, formatDate, daysUntilExpiration } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AlertsTab = ({ onRefresh }) => {
  const [alerts, setAlerts] = useState({
    lowStock: [],
    nearExpiry: [],
    expired: [],
    blocked: []
  });
  const [loading, setLoading] = useState(true);
  const [activeAlertType, setActiveAlertType] = useState('all'); // 'all', 'lowStock', 'nearExpiry', 'expired', 'blocked'

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      // Obtener productos con stock bajo
      const lowStockResponse = await productService.getLowStockProducts().catch(() => ({ products: [] }));

      // Obtener lotes próximos a vencer (próximos 30 días)
      const batchesResponse = await batchService.getAllBatches({ limit: 1000 }).catch(() => ({ batches: [] }));
      const batches = batchesResponse.batches || [];

      const nearExpiry = batches.filter(batch => {
        const days = daysUntilExpiration(batch.expirationDate);
        return days > 0 && days <= 30;
      });

      const expired = batches.filter(batch => {
        const days = daysUntilExpiration(batch.expirationDate);
        return days <= 0;
      });

      const blocked = batches.filter(batch => batch.blocked);

      setAlerts({
        lowStock: lowStockResponse.products || [],
        nearExpiry,
        expired,
        blocked
      });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      toast.error('Error al cargar alertas');
    } finally {
      setLoading(false);
    }
  };

  const getTotalAlerts = () => {
    return alerts.lowStock.length + alerts.nearExpiry.length + alerts.expired.length + alerts.blocked.length;
  };

  const getFilteredData = () => {
    switch (activeAlertType) {
      case 'lowStock':
        return { type: 'lowStock', data: alerts.lowStock };
      case 'nearExpiry':
        return { type: 'nearExpiry', data: alerts.nearExpiry };
      case 'expired':
        return { type: 'expired', data: alerts.expired };
      case 'blocked':
        return { type: 'blocked', data: alerts.blocked };
      default:
        return {
          type: 'all',
          data: [
            ...alerts.lowStock.map(item => ({ ...item, alertType: 'lowStock' })),
            ...alerts.nearExpiry.map(item => ({ ...item, alertType: 'nearExpiry' })),
            ...alerts.expired.map(item => ({ ...item, alertType: 'expired' })),
            ...alerts.blocked.map(item => ({ ...item, alertType: 'blocked' }))
          ]
        };
    }
  };

  const renderAlertCard = (item, type) => {
    // Determinar el tipo de alerta
    const alertType = type || item.alertType;

    // Para productos con stock bajo
    if (alertType === 'lowStock') {
      return (
        <div key={`lowStock-${item.id}`} className="bg-white rounded-lg shadow-card p-4 border-l-4 border-warning-500">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-warning-100 p-2 rounded">
                <FiPackage className="text-warning-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900">{item.name}</h4>
                <p className="text-sm text-neutral-600">SKU: {item.sku}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Stock:</span>{' '}
                    <span className="text-warning-600 font-bold">{item.stock}</span>
                  </span>
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Mínimo:</span>{' '}
                    <span className="text-neutral-600">{item.minStock}</span>
                  </span>
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Precio:</span>{' '}
                    <span className="text-neutral-600">{formatCurrency(item.price)}</span>
                  </span>
                </div>
              </div>
            </div>
            <span className="badge-warning">Stock Bajo</span>
          </div>
        </div>
      );
    }

    // Para lotes próximos a vencer
    if (alertType === 'nearExpiry') {
      const days = daysUntilExpiration(item.expirationDate);
      return (
        <div key={`nearExpiry-${item.id}`} className="bg-white rounded-lg shadow-card p-4 border-l-4 border-warning-500">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-warning-100 p-2 rounded">
                <FiClock className="text-warning-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900">
                  Lote: {item.batchNumber}
                </h4>
                <p className="text-sm text-neutral-600">
                  Producto: {item.product?.name || 'N/A'}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Vence:</span>{' '}
                    <span className="text-warning-600 font-bold">{formatDate(item.expirationDate)}</span>
                  </span>
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Quedan:</span>{' '}
                    <span className="text-warning-600 font-bold">{days} días</span>
                  </span>
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Cantidad:</span>{' '}
                    <span className="text-neutral-600">{item.currentQuantity}</span>
                  </span>
                </div>
              </div>
            </div>
            <span className="badge-warning">Por Vencer</span>
          </div>
        </div>
      );
    }

    // Para lotes vencidos
    if (alertType === 'expired') {
      const days = Math.abs(daysUntilExpiration(item.expirationDate));
      return (
        <div key={`expired-${item.id}`} className="bg-white rounded-lg shadow-card p-4 border-l-4 border-danger-500">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-danger-100 p-2 rounded">
                <FiXCircle className="text-danger-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900">
                  Lote: {item.batchNumber}
                </h4>
                <p className="text-sm text-neutral-600">
                  Producto: {item.product?.name || 'N/A'}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Venció:</span>{' '}
                    <span className="text-danger-600 font-bold">{formatDate(item.expirationDate)}</span>
                  </span>
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Hace:</span>{' '}
                    <span className="text-danger-600 font-bold">{days} días</span>
                  </span>
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Cantidad:</span>{' '}
                    <span className="text-neutral-600">{item.currentQuantity}</span>
                  </span>
                </div>
              </div>
            </div>
            <span className="badge-danger">Vencido</span>
          </div>
        </div>
      );
    }

    // Para lotes bloqueados
    if (alertType === 'blocked') {
      return (
        <div key={`blocked-${item.id}`} className="bg-white rounded-lg shadow-card p-4 border-l-4 border-neutral-500">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="bg-neutral-100 p-2 rounded">
                <FiLock className="text-neutral-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-neutral-900">
                  Lote: {item.batchNumber}
                </h4>
                <p className="text-sm text-neutral-600">
                  Producto: {item.product?.name || 'N/A'}
                </p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Vence:</span>{' '}
                    <span className="text-neutral-600">{formatDate(item.expirationDate)}</span>
                  </span>
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Cantidad:</span>{' '}
                    <span className="text-neutral-600">{item.currentQuantity}</span>
                  </span>
                  <span className="text-sm">
                    <span className="font-medium text-neutral-700">Ubicación:</span>{' '}
                    <span className="text-neutral-600">{item.location || 'N/A'}</span>
                  </span>
                </div>
              </div>
            </div>
            <span className="badge-danger">Bloqueado</span>
          </div>
        </div>
      );
    }

    return null;
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Alertas de Inventario
          </h2>
          <p className="text-sm text-neutral-600 mt-1">
            Productos con stock bajo y lotes por vencer o vencidos
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          className="btn-secondary flex items-center space-x-2"
        >
          <FiAlertCircle />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Alert Type Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <button
          onClick={() => setActiveAlertType('all')}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            activeAlertType === 'all'
              ? 'border-primary-500 bg-primary-50'
              : 'border-neutral-200 bg-white hover:border-primary-300'
          }`}
        >
          <p className="text-sm text-neutral-600">Total Alertas</p>
          <p className="text-2xl font-bold text-neutral-900">{getTotalAlerts()}</p>
        </button>

        <button
          onClick={() => setActiveAlertType('lowStock')}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            activeAlertType === 'lowStock'
              ? 'border-warning-500 bg-warning-50'
              : 'border-neutral-200 bg-white hover:border-warning-300'
          }`}
        >
          <p className="text-sm text-neutral-600">Stock Bajo</p>
          <p className="text-2xl font-bold text-warning-600">{alerts.lowStock.length}</p>
        </button>

        <button
          onClick={() => setActiveAlertType('nearExpiry')}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            activeAlertType === 'nearExpiry'
              ? 'border-warning-500 bg-warning-50'
              : 'border-neutral-200 bg-white hover:border-warning-300'
          }`}
        >
          <p className="text-sm text-neutral-600">Por Vencer</p>
          <p className="text-2xl font-bold text-warning-600">{alerts.nearExpiry.length}</p>
        </button>

        <button
          onClick={() => setActiveAlertType('expired')}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            activeAlertType === 'expired'
              ? 'border-danger-500 bg-danger-50'
              : 'border-neutral-200 bg-white hover:border-danger-300'
          }`}
        >
          <p className="text-sm text-neutral-600">Vencidos</p>
          <p className="text-2xl font-bold text-danger-600">{alerts.expired.length}</p>
        </button>

        <button
          onClick={() => setActiveAlertType('blocked')}
          className={`p-4 rounded-lg border-2 text-left transition-all ${
            activeAlertType === 'blocked'
              ? 'border-neutral-500 bg-neutral-50'
              : 'border-neutral-200 bg-white hover:border-neutral-300'
          }`}
        >
          <p className="text-sm text-neutral-600">Bloqueados</p>
          <p className="text-2xl font-bold text-neutral-600">{alerts.blocked.length}</p>
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
          </div>
        ) : filteredData.data.length > 0 ? (
          filteredData.data.map(item => renderAlertCard(item, filteredData.type === 'all' ? null : filteredData.type))
        ) : (
          <div className="bg-white rounded-lg shadow-card p-12 text-center">
            <FiAlertCircle className="mx-auto text-neutral-300" size={48} />
            <h3 className="text-lg font-semibold text-neutral-700 mt-4">
              No hay alertas
            </h3>
            <p className="text-neutral-500 mt-2">
              {activeAlertType === 'all'
                ? 'Todo está en orden. No hay alertas activas.'
                : `No hay alertas de tipo "${activeAlertType}".`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsTab;
