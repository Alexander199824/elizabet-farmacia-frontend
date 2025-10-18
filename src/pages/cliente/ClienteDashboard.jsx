/**
 * @author Alexander Echeverria
 * @file ClienteDashboard.jsx
 * @description Dashboard del cliente
 * @location /src/pages/cliente/ClienteDashboard.jsx
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiPackage, FiClock, FiCheckCircle, FiFileText } from 'react-icons/fi';
import StatCard from '../../components/dashboard/StatCard';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ClienteDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalSpent: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentOrders();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // TODO: Llamar a la API de estadísticas del cliente
      setTimeout(() => {
        setStats({
          totalOrders: 15,
          pendingOrders: 2,
          completedOrders: 13,
          totalSpent: 8450.75,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error al cargar estadísticas');
      setLoading(false);
    }
  };

  const fetchRecentOrders = async () => {
    try {
      // TODO: Llamar a la API de pedidos del cliente
      setTimeout(() => {
        setRecentOrders([
          { 
            id: 1, 
            orderNumber: 'PED-001234', 
            date: new Date(), 
            total: 450.00, 
            status: 'completada',
            items: 5
          },
          { 
            id: 2, 
            orderNumber: 'PED-001235', 
            date: new Date(), 
            total: 320.50, 
            status: 'en_proceso',
            items: 3
          },
          { 
            id: 3, 
            orderNumber: 'PED-001236', 
            date: new Date(), 
            total: 890.25, 
            status: 'pendiente',
            items: 7
          },
          { 
            id: 4, 
            orderNumber: 'PED-001237', 
            date: new Date(), 
            total: 1250.00, 
            status: 'completada',
            items: 10
          },
        ]);
      }, 1000);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      pendiente: { label: 'Pendiente', color: 'warning', icon: FiClock },
      en_proceso: { label: 'En Proceso', color: 'primary', icon: FiPackage },
      completada: { label: 'Completada', color: 'success', icon: FiCheckCircle },
      cancelada: { label: 'Cancelada', color: 'danger', icon: FiFileText },
    };
    return statusConfig[status] || statusConfig.pendiente;
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
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-success-600 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-display font-bold mb-2">
          Bienvenido, {user?.firstName}!
        </h1>
        <p className="text-lg opacity-90">
          Gestiona tus pedidos y consulta tu historial de compras
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Pedidos"
          value={stats.totalOrders}
          icon={FiShoppingBag}
          color="primary"
          description="Historial completo"
        />
        <StatCard
          title="Pendientes"
          value={stats.pendingOrders}
          icon={FiClock}
          color="warning"
          description="En proceso"
        />
        <StatCard
          title="Completados"
          value={stats.completedOrders}
          icon={FiCheckCircle}
          color="success"
          description="Entregados"
        />
        <StatCard
          title="Total Gastado"
          value={formatCurrency(stats.totalSpent)}
          icon={FiFileText}
          color="primary"
          description="Histórico"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">Pedidos Recientes</h3>
          <button
            onClick={() => navigate('/dashboard/pedidos')}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Ver todos
          </button>
        </div>
        <div className="divide-y">
          {recentOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={order.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-lg text-neutral-900">
                        {order.orderNumber}
                      </span>
                      <span className={`badge badge-${statusInfo.color} flex items-center space-x-1`}>
                        <StatusIcon className="text-sm" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-neutral-600">
                      <span>{formatDate(order.date)}</span>
                      <span>•</span>
                      <span>{order.items} productos</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-success-600">
                        {formatCurrency(order.total)}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate(`/dashboard/pedidos/${order.id}`)}
                      className="btn-outline text-sm"
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => navigate('/')}
          className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
            <FiShoppingBag className="text-2xl text-primary-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Nueva Compra</h3>
          <p className="text-sm text-neutral-600">Explorar productos disponibles</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/pedidos')}
          className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-success-200 transition-colors">
            <FiPackage className="text-2xl text-success-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Mis Pedidos</h3>
          <p className="text-sm text-neutral-600">Ver historial completo</p>
        </button>

        <button
          onClick={() => navigate('/dashboard/perfil')}
          className="p-6 bg-white rounded-xl shadow-card hover:shadow-lg transition-shadow text-left group"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
            <FiFileText className="text-2xl text-primary-600" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Mi Perfil</h3>
          <p className="text-sm text-neutral-600">Actualizar información personal</p>
        </button>
      </div>
    </div>
  );
};

export default ClienteDashboard;