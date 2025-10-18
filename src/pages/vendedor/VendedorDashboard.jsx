/**
 * @author Alexander Echeverria
 * @file VendedorDashboard.jsx
 * @description Dashboard del vendedor
 * @location /src/pages/vendedor/VendedorDashboard.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiDollarSign, FiShoppingCart, FiTrendingUp, FiPackage, FiPlus } from 'react-icons/fi';
import StatCard from '../../components/dashboard/StatCard';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const VendedorDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    salesToday: 0,
    ordersToday: 0,
    salesMonth: 0,
    ordersMonth: 0,
  });

  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentSales();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // TODO: Llamar a la API de estadísticas del vendedor
      setTimeout(() => {
        setStats({
          salesToday: 12450.75,
          ordersToday: 8,
          salesMonth: 156780.50,
          ordersMonth: 98,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error al cargar estadísticas');
      setLoading(false);
    }
  };

  const fetchRecentSales = async () => {
    try {
      // TODO: Llamar a la API de ventas recientes
      setTimeout(() => {
        setRecentSales([
          { id: 1, invoiceNumber: 'F-001234', customer: 'Juan Pérez', total: 450.00, date: new Date(), status: 'completada' },
          { id: 2, invoiceNumber: 'F-001235', customer: 'María García', total: 320.50, date: new Date(), status: 'completada' },
          { id: 3, invoiceNumber: 'F-001236', customer: 'Carlos López', total: 890.25, date: new Date(), status: 'pendiente' },
          { id: 4, invoiceNumber: 'F-001237', customer: 'Ana Martínez', total: 1250.00, date: new Date(), status: 'completada' },
          { id: 5, invoiceNumber: 'F-001238', customer: 'Pedro Ramírez', total: 675.80, date: new Date(), status: 'completada' },
        ]);
      }, 1000);
    } catch (error) {
      console.error('Error fetching recent sales:', error);
      toast.error('Error al cargar ventas recientes');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      completada: 'badge-success',
      pendiente: 'badge-warning',
      cancelada: 'badge-danger',
    };
    return badges[status] || 'badge';
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
            Panel de Ventas
          </h1>
          <p className="text-neutral-600 mt-1">
            Gestiona tus ventas y clientes
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/nueva-venta')}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Nueva Venta</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas Hoy"
          value={formatCurrency(stats.salesToday)}
          icon={FiDollarSign}
          color="success"
          description={`${stats.ordersToday} pedidos`}
        />
        <StatCard
          title="Pedidos Hoy"
          value={stats.ordersToday}
          icon={FiShoppingCart}
          color="primary"
          description="En el día"
        />
        <StatCard
          title="Ventas del Mes"
          value={formatCurrency(stats.salesMonth)}
          icon={FiTrendingUp}
          color="success"
          trend={{ value: '+15.3%', isPositive: true }}
          description="vs. mes anterior"
        />
        <StatCard
          title="Pedidos del Mes"
          value={stats.ordersMonth}
          icon={FiPackage}
          color="primary"
          description="Total del mes"
        />
      </div>

      {/* Recent Sales Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Ventas Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Factura
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-medium text-primary-600">{sale.invoiceNumber}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-neutral-900">{sale.customer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-success-600">{formatCurrency(sale.total)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                    {formatDate(sale.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={getStatusBadge(sale.status)}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-primary-600 hover:text-primary-700 font-medium">
                      Ver detalle
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/dashboard/nueva-venta')}
          className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
            <FiPlus className="text-2xl text-primary-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Nueva Venta</h3>
          <p className="text-sm text-neutral-600">Registrar una nueva venta</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/productos')}
          className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-success-200 transition-colors">
            <FiPackage className="text-2xl text-success-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Ver Productos</h3>
          <p className="text-sm text-neutral-600">Consultar inventario disponible</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/clientes')}
          className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
            <FiDollarSign className="text-2xl text-primary-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Clientes</h3>
          <p className="text-sm text-neutral-600">Gestionar clientes</p>
        </button>
      </div>
    </div>
  );
};

export default VendedorDashboard;