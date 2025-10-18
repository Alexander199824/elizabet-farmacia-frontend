/**
 * @author Alexander Echeverria
 * @file AdminDashboard.jsx
 * @description Dashboard del administrador
 * @location /src/pages/admin/AdminDashboard.jsx
 */

import { useState, useEffect } from 'react';
import { FiDollarSign, FiShoppingCart, FiPackage, FiUsers, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import StatCard from '../../components/dashboard/StatCard';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    lowStock: 0,
    nearExpiry: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // TODO: Llamar a las APIs correspondientes
      // Simulación temporal
      setTimeout(() => {
        setStats({
          totalSales: 125340.50,
          totalOrders: 234,
          totalProducts: 456,
          totalUsers: 89,
          lowStock: 12,
          nearExpiry: 8,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error al cargar estadísticas');
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
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-900">
          Dashboard Administrativo
        </h1>
        <p className="text-neutral-600 mt-1">
          Resumen general del sistema
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Ventas Totales"
          value={formatCurrency(stats.totalSales)}
          icon={FiDollarSign}
          color="success"
          trend={{ value: '+12.5%', isPositive: true }}
          description="vs. mes anterior"
        />
        <StatCard
          title="Pedidos"
          value={stats.totalOrders}
          icon={FiShoppingCart}
          color="primary"
          description="Este mes"
        />
        <StatCard
          title="Productos"
          value={stats.totalProducts}
          icon={FiPackage}
          color="primary"
          description="En catálogo"
        />
        <StatCard
          title="Usuarios"
          value={stats.totalUsers}
          icon={FiUsers}
          color="success"
          description="Registrados"
        />
        <StatCard
          title="Stock Bajo"
          value={stats.lowStock}
          icon={FiAlertCircle}
          color="warning"
          description="Productos"
        />
        <StatCard
          title="Próximos a Vencer"
          value={stats.nearExpiry}
          icon={FiTrendingUp}
          color="danger"
          description="Lotes"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h3 className="text-lg font-semibold mb-4">Ventas Recientes</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                <div>
                  <p className="font-medium">Venta #{1000 + i}</p>
                  <p className="text-sm text-neutral-500">Hace {i} horas</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-success-600">
                    {formatCurrency(Math.random() * 1000 + 100)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white rounded-xl shadow-card p-6">
          <h3 className="text-lg font-semibold mb-4">Alertas de Stock</h3>
          <div className="space-y-3">
            {['Paracetamol 500mg', 'Ibuprofeno 400mg', 'Amoxicilina 500mg'].map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <div>
                  <p className="font-medium">{product}</p>
                  <p className="text-sm text-neutral-500">Stock: {5 - i} unidades</p>
                </div>
                <button className="text-sm font-medium text-warning-600 hover:text-warning-700">
                  Reabastecer
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;