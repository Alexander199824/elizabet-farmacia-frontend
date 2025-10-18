/**
 * @author Alexander Echeverria
 * @file RepartidorDashboard.jsx
 * @description Dashboard del repartidor
 * @location /src/pages/repartidor/RepartidorDashboard.jsx
 */

import { useState, useEffect } from 'react';
import { FiTruck, FiPackage, FiCheckCircle, FiClock, FiMapPin } from 'react-icons/fi';
import StatCard from '../../components/dashboard/StatCard';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const RepartidorDashboard = () => {
  const [stats, setStats] = useState({
    deliveriesToday: 0,
    completedToday: 0,
    pendingToday: 0,
    deliveriesMonth: 0,
  });

  const [todayDeliveries, setTodayDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchTodayDeliveries();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // TODO: Llamar a la API de estadísticas de entregas
      setTimeout(() => {
        setStats({
          deliveriesToday: 12,
          completedToday: 7,
          pendingToday: 5,
          deliveriesMonth: 145,
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error al cargar estadísticas');
      setLoading(false);
    }
  };

  const fetchTodayDeliveries = async () => {
    try {
      // TODO: Llamar a la API de entregas del día
      setTimeout(() => {
        setTodayDeliveries([
          { 
            id: 1, 
            orderNumber: 'PED-001234', 
            customer: 'Juan Pérez', 
            address: 'Zona 10, Ciudad de Guatemala',
            phone: '+502 1234-5678',
            status: 'pendiente',
            time: '09:00 AM'
          },
          { 
            id: 2, 
            orderNumber: 'PED-001235', 
            customer: 'María García', 
            address: 'Zona 14, Guatemala',
            phone: '+502 8765-4321',
            status: 'en_ruta',
            time: '10:30 AM'
          },
          { 
            id: 3, 
            orderNumber: 'PED-001236', 
            customer: 'Carlos López', 
            address: 'Zona 1, Centro Histórico',
            phone: '+502 5555-1234',
            status: 'completada',
            time: '08:00 AM'
          },
          { 
            id: 4, 
            orderNumber: 'PED-001237', 
            customer: 'Ana Martínez', 
            address: 'Zona 15, Vista Hermosa',
            phone: '+502 9999-8888',
            status: 'pendiente',
            time: '11:00 AM'
          },
          { 
            id: 5, 
            orderNumber: 'PED-001238', 
            customer: 'Pedro Ramírez', 
            address: 'Zona 7, Tikal Futura',
            phone: '+502 7777-6666',
            status: 'completada',
            time: '07:30 AM'
          },
        ]);
      }, 1000);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      toast.error('Error al cargar entregas');
    }
  };

  const getStatusInfo = (status) => {
    const statusConfig = {
      pendiente: { label: 'Pendiente', color: 'warning', icon: FiClock },
      en_ruta: { label: 'En Ruta', color: 'primary', icon: FiTruck },
      completada: { label: 'Completada', color: 'success', icon: FiCheckCircle },
    };
    return statusConfig[status] || statusConfig.pendiente;
  };

  const handleMarkAsDelivered = (deliveryId) => {
    toast.success('Entrega marcada como completada');
    // TODO: Llamar a la API para actualizar el estado
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
          value={stats.deliveriesToday}
          icon={FiPackage}
          color="primary"
          description="Asignadas"
        />
        <StatCard
          title="Completadas"
          value={stats.completedToday}
          icon={FiCheckCircle}
          color="success"
          description="Hoy"
        />
        <StatCard
          title="Pendientes"
          value={stats.pendingToday}
          icon={FiClock}
          color="warning"
          description="Por entregar"
        />
        <StatCard
          title="Este Mes"
          value={stats.deliveriesMonth}
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
          {todayDeliveries.map((delivery) => {
            const statusInfo = getStatusInfo(delivery.status);
            const StatusIcon = statusInfo.icon;
            
            return (
              <div key={delivery.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="font-semibold text-lg text-neutral-900">
                        {delivery.orderNumber}
                      </span>
                      <span className={`badge badge-${statusInfo.color} flex items-center space-x-1`}>
                        <StatusIcon className="text-sm" />
                        <span>{statusInfo.label}</span>
                      </span>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2 text-neutral-700">
                        <FiPackage className="text-neutral-400" />
                        <span className="font-medium">{delivery.customer}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-neutral-600">
                        <FiMapPin className="text-neutral-400" />
                        <span>{delivery.address}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-neutral-600">
                        <FiClock className="text-neutral-400" />
                        <span>Horario: {delivery.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    {delivery.status === 'pendiente' && (
                      <button
                        onClick={() => handleMarkAsDelivered(delivery.id)}
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
                    <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                      Ver en Mapa
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-lg font-semibold mb-4">Ruta del Día</h3>
        <div className="bg-neutral-100 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <FiMapPin className="text-6xl text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-600">Mapa de ruta próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepartidorDashboard;