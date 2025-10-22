/**
 * @author Alexander Echeverria
 * @file AdminDashboard.jsx
 * @description Dashboard del administrador con datos reales del backend
 * @location /src/pages/admin/AdminDashboard.jsx
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiPackage, FiTrendingUp } from 'react-icons/fi';
import StatCard from '../../components/dashboard/StatCard';
import statisticsService from '../../services/statisticsService';
import invoiceService from '../../services/invoiceService';
import alertService from '../../services/alertService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [recentSales, setRecentSales] = useState([]);
  const [alerts, setAlerts] = useState({
    lowStock: [],
    nearExpiry: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [refreshKey]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Obtener datos del dashboard principal
      const dashboardData = await statisticsService.getDashboard();
      setDashboard(dashboardData);

      // 2. Obtener ventas recientes
      const salesData = await invoiceService.getAllInvoices({ 
        page: 1, 
        limit: 5,
        sortBy: 'invoiceDate',
        sortOrder: 'desc'
      });
      setRecentSales(salesData.invoices || []);

      // 3. Obtener alertas de stock bajo
      const lowStockAlerts = await alertService.getLowStockAlerts();
      
      // 4. Obtener alertas de productos próximos a vencer
      const nearExpiryAlerts = await alertService.getExpiringAlerts(30);
      
      setAlerts({
        lowStock: lowStockAlerts.products || [],
        nearExpiry: nearExpiryAlerts.batches || []
      });

    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.success('Actualizando datos...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-20">
        <p className="text-neutral-600">No hay datos disponibles</p>
        <button onClick={handleRefresh} className="btn-primary mt-4">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">
              Bienvenido a tu espacio 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Donde podrás gestionar la farmacia de manera eficiente
            </p>
          </div>
          <button onClick={handleRefresh} className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
            🔄 Actualizar
          </button>
        </div>
      </div>

      {/* Stats Grid - Tarjetas Clickeables */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/dashboard/ventas" className="transform transition-all hover:scale-105">
          <StatCard
            title="Total de Ventas"
            value={dashboard.sales?.count || 0}
            icon={FiTrendingUp}
            color="success"
            description="Ventas realizadas"
          />
        </Link>
        
        <Link to="/dashboard/ventas" className="transform transition-all hover:scale-105">
          <StatCard
            title="Pedidos"
            value={dashboard.sales?.count || 0}
            icon={FiShoppingCart}
            color="primary"
            description="Total del período"
          />
        </Link>
        
        <Link to="/dashboard/inventario" className="transform transition-all hover:scale-105">
          <StatCard
            title="Productos"
            value={dashboard.inventory?.totalProducts || 0}
            icon={FiPackage}
            color="primary"
            description="En catálogo"
          />
        </Link>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Ventas Recientes</h3>
            <Link to="/dashboard/ventas" className="text-sm text-primary-600 hover:text-primary-700">
              Ver todas →
            </Link>
          </div>
          <div className="space-y-3">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                  <div>
                    <p className="font-medium">Recibo: {sale.invoiceNumber}</p>
                    <p className="text-sm text-neutral-500">
                      {sale.client ? `${sale.client.firstName} ${sale.client.lastName}` : sale.clientName || 'Consumidor Final'}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {formatDate(sale.invoiceDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-success-600">
                      {formatCurrency(sale.total)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      sale.status === 'completada' ? 'bg-success-100 text-success-700' : 
                      sale.status === 'pendiente' ? 'bg-warning-100 text-warning-700' : 
                      'bg-neutral-100 text-neutral-700'
                    }`}>
                      {sale.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-neutral-500 py-8">No hay ventas recientes</p>
            )}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Alertas de Stock</h3>
            <Link to="/dashboard/inventario" className="text-sm text-warning-600 hover:text-warning-700">
              Ver todo →
            </Link>
          </div>
          <div className="space-y-3">
            {alerts.lowStock.length > 0 ? (
              alerts.lowStock.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-neutral-500">
                      Stock: <span className="font-semibold text-danger-600">{product.stock}</span> / Min: {product.minStock}
                    </p>
                  </div>
                  <button className="text-sm font-medium text-warning-600 hover:text-warning-700">
                    Reabastecer
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-neutral-500 py-8">No hay alertas de stock</p>
            )}
          </div>
        </div>
      </div>

      {/* Métodos de Pago */}
      {dashboard.paymentMethods && dashboard.paymentMethods.length > 0 && (
        <div className="bg-white rounded-xl shadow-card p-6">
          <h3 className="text-lg font-semibold mb-4">Métodos de Pago</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {dashboard.paymentMethods.map((method) => (
              <div key={method.paymentMethod} className="p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm text-neutral-600 capitalize">{method.paymentMethod}</p>
                <p className="text-2xl font-bold text-primary-600 mt-1">
                  {formatCurrency(method.total)}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {method.count} transacciones
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;