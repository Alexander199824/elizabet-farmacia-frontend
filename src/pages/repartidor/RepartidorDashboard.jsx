/**
 * @author Alexander Echeverria
 * @file RepartidorDashboard.jsx
 * @description Dashboard del repartidor con datos reales
 * @location /src/pages/repartidor/RepartidorDashboard.jsx
 */

import { useState, useEffect } from 'react';
import { FiTruck, FiPackage, FiCheckCircle, FiClock, FiMapPin, FiPhone } from 'react-icons/fi';
import StatCard from '../../components/dashboard/StatCard';
import deliveryService from '../../services/deliveryService';
import invoiceService from '../../services/invoiceService';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const RepartidorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDeliveryData();
    }
  }, [user]);

  const fetchDeliveryData = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

      // Obtener estadísticas de entregas
      const deliveryStats = await deliveryService.getDeliveryStats({
        driverId: user.id,
        startDate: startOfMonth.toISOString().split('T')[0]
      });

      setStats(deliveryStats);

      // Obtener entregas del día
      const todayData = await deliveryService.getTodayDeliveries();
      
      // Filtrar solo las entregas asignadas a este repartidor
      const myDeliveries = todayData.deliveries?.filter(
        d => d.driverId === user.id
      ) || [];

      setTodayDeliveries(myDeliveries);

    } catch (error) {
      console.error('Error fetching delivery data:', error);
      toast.error('Error al cargar datos de entregas');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      pendiente: { label: 'Pendiente', color: 'warning', icon: FiClock },
      en_ruta: { label: 'En Ruta', color: 'primary', icon: FiTruck },
      entregada: { label: 'Entregada', color: 'success', icon: FiCheckCircle },
      cancelada: { label: 'Cancelada', color: 'danger', icon: FiClock },
    };
    return statusConfig[status] || statusConfig.pendiente;
  };

  const handleStartDelivery = async (deliveryId) => {
    try {
      await deliveryService.startDelivery(deliveryId);
      toast.success('Entrega iniciada');
      fetchDeliveryData();
    } catch (error) {
      toast.error('Error al iniciar entrega');
    }
  };

  const handleMarkAsDelivered = async (deliveryId) => {
    try {
      await deliveryService.markAsDelivered(deliveryId, {
        deliveredAt: new Date().toISOString(),
        notes: 'Entrega completada exitosamente'
      });
      toast.success('Entrega marcada como completada');
      fetchDeliveryData();
    } catch (error) {
      toast.error('Error al marcar entrega');
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
          Panel de Entregas
        </h1>
        <p className="text-neutral-600 mt-1">
          Gestiona tus entregas del día
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Entregas Hoy"
          value={todayDeliveries.length}
          icon={FiPackage}
          color="primary"
          description="Asignadas"
        />
        <StatCard
          title="Completadas"
          value={todayDeliveries.filter(d => d.status === 'entregada').length}
          icon={FiCheckCircle}
          color="success"
          description="Hoy"
        />
        <StatCard
          title="Pendientes"
          value={todayDeliveries.filter(d => d.status === 'pendiente').length}
          icon={FiClock}
          color="warning"
          description="Por entregar"
        />
        <StatCard
          title="Este Mes"
          value={stats?.total || 0}
          icon={FiTruck}
          color="primary"
          description="Total entregas"
        />
      </div>

      {/* Today's Deliveries */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Entregas de Hoy</h3>
        </div>
        <div className="divide-y">
          {todayDeliveries.length > 0 ? (
            todayDeliveries.map((delivery) => {
              const statusInfo = getStatusInfo(delivery.status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={delivery.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="font-semibold text-lg text-neutral-900">
                          Pedido #{delivery.orderId || delivery.id}
                        </span>
                        <span className={`badge badge-${statusInfo.color} flex items-center space-x-1`}>
                          <StatusIcon className="text-sm" />
                          <span>{statusInfo.label}</span>
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2 text-neutral-700">
                          <FiPackage className="text-neutral-400" />
                          <span className="font-medium">{delivery.customerName}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-neutral-600">
                          <FiMapPin className="text-neutral-400" />
                          <span>{delivery.address}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-neutral-600">
                          <FiPhone className="text-neutral-400" />
                          <span>{delivery.phone}</span>
                        </div>
                        {delivery.scheduledTime && (
                          <div className="flex items-center space-x-2 text-neutral-600">
                            <FiClock className="text-neutral-400" />
                            <span>Horario: {delivery.scheduledTime}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      {delivery.status === 'pendiente' && (
                        <button
                          onClick={() => handleStartDelivery(delivery.id)}
                          className="btn-primary text-sm"
                        >
                          Iniciar Ruta
                        </button>
                      )}
                      {delivery.status === 'en_ruta' && (
                        <button
                          onClick={() => handleMarkAsDelivered(delivery.id)}
                          className="btn-success text-sm"
                        >
                          Marcar Entregado
                        </button>
                      )}
                      <a 
                        href={`tel:${delivery.phone}`}
                        className="btn-outline text-sm text-center"
                      >
                        Llamar
                      </a>
                      {delivery.latitude && delivery.longitude && (
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${delivery.latitude},${delivery.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium text-center"
                        >
                          Ver en Mapa
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-neutral-500">
              No tienes entregas asignadas para hoy
            </div>
          )}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold mb-4">Ruta del Día</h3>
        <div className="bg-neutral-100 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <FiMapPin className="text-6xl text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">Mapa de ruta próximamente</p>
            <p className="text-sm text-neutral-500 mt-2">
              Aquí podrás ver la ruta optimizada de tus entregas
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepartidorDashboard;