/**
 * @author Alexander Echeverria
 * @file AuditPage.jsx
 * @description Página completa de auditoría y logs del sistema
 * @location /src/pages/admin/AuditPage.jsx
 */

import { useState, useEffect } from 'react';
import { 
  FiSearch, FiFilter, FiDownload, FiEye, FiAlertCircle, 
  FiActivity, FiUsers, FiDatabase, FiClock, FiCalendar
} from 'react-icons/fi';
import auditService from '../../services/auditService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const AuditPage = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('logs'); // logs, stats, recent
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    action: '',
    entity: '',
    startDate: '',
    endDate: '',
    userId: ''
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Opciones de filtros
  const actionTypes = [
    { value: '', label: 'Todas las acciones' },
    { value: 'CREATE', label: 'Crear' },
    { value: 'UPDATE', label: 'Actualizar' },
    { value: 'DELETE', label: 'Eliminar' },
    { value: 'LOGIN', label: 'Login' },
    { value: 'LOGOUT', label: 'Logout' },
    { value: 'CANCEL', label: 'Cancelar' },
    { value: 'RESTORE', label: 'Restaurar' }
  ];

  const entityTypes = [
    { value: '', label: 'Todas las entidades' },
    { value: 'User', label: 'Usuarios' },
    { value: 'Product', label: 'Productos' },
    { value: 'Invoice', label: 'Ventas' },
    { value: 'Batch', label: 'Lotes' },
    { value: 'Supplier', label: 'Proveedores' },
    { value: 'Client', label: 'Clientes' }
  ];

  useEffect(() => {
    if (activeTab === 'logs') {
      fetchLogs();
    } else if (activeTab === 'stats') {
      fetchStats();
    } else if (activeTab === 'recent') {
      fetchRecentActivity();
    }
  }, [activeTab, pagination.page, filters]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      };

      const response = await auditService.getAllLogs(params);
      
      setLogs(response.logs || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Error al cargar logs de auditoría');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate && filters.endDate) {
        params.startDate = filters.startDate;
        params.endDate = filters.endDate;
      }

      const response = await auditService.getAuditStats(params);
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Error al cargar estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentActivity = async () => {
    setLoading(true);
    try {
      const response = await auditService.getRecentActivity({
        hours: 24,
        limit: 50
      });
      setRecentActivity(response.logs || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
      toast.error('Error al cargar actividad reciente');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchLogs();
  };

  const handleViewLog = async (logId) => {
    try {
      const response = await auditService.getLogById(logId);
      setSelectedLog(response);
      setShowModal(true);
    } catch (error) {
      toast.error('Error al cargar detalles del log');
    }
  };

  const handleExportCSV = async () => {
    try {
      const blob = await auditService.exportToCSV(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      toast.success('Logs exportados a CSV');
    } catch (error) {
      toast.error('Error al exportar');
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await auditService.exportToExcel(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.xlsx`;
      a.click();
      toast.success('Logs exportados a Excel');
    } catch (error) {
      toast.error('Error al exportar');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getActionBadge = (action) => {
    const badges = {
      CREATE: 'badge-success',
      UPDATE: 'badge-primary',
      DELETE: 'badge-danger',
      LOGIN: 'badge-primary',
      LOGOUT: 'badge',
      CANCEL: 'badge-warning',
      RESTORE: 'badge-success'
    };
    return badges[action] || 'badge';
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return `Hace ${seconds} segundo${seconds !== 1 ? 's' : ''}`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} minuto${minutes !== 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} hora${hours !== 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    return `Hace ${days} día${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Auditoría del Sistema
          </h1>
          <p className="text-neutral-600 mt-1">
            Registro completo de actividades y cambios
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handleExportCSV} className="btn-outline flex items-center space-x-2">
            <FiDownload />
            <span>CSV</span>
          </button>
          <button onClick={handleExportExcel} className="btn-primary flex items-center space-x-2">
            <FiDownload />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiActivity className="text-3xl opacity-80" />
            </div>
            <p className="text-3xl font-bold">{stats.totalLogs || 0}</p>
            <p className="text-sm opacity-80 mt-1">Total de Logs</p>
          </div>

          <div className="bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiAlertCircle className="text-3xl opacity-80" />
            </div>
            <p className="text-3xl font-bold">{stats.criticalEvents || 0}</p>
            <p className="text-sm opacity-80 mt-1">Eventos Críticos</p>
          </div>

          <div className="bg-gradient-to-br from-danger-500 to-danger-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiDatabase className="text-3xl opacity-80" />
            </div>
            <p className="text-3xl font-bold">{stats.failedActions || 0}</p>
            <p className="text-sm opacity-80 mt-1">Acciones Fallidas</p>
          </div>

          <div className="bg-gradient-to-br from-success-500 to-success-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiUsers className="text-3xl opacity-80" />
            </div>
            <p className="text-3xl font-bold">{stats.topUsers?.length || 0}</p>
            <p className="text-sm opacity-80 mt-1">Usuarios Activos</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-card">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'logs'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <FiDatabase className="inline mr-2" />
              Logs de Auditoría
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'stats'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <FiActivity className="inline mr-2" />
              Estadísticas
            </button>
            <button
              onClick={() => setActiveTab('recent')}
              className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                activeTab === 'recent'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <FiClock className="inline mr-2" />
              Actividad Reciente
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* LOGS TAB */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <form onSubmit={handleSearch} className="md:col-span-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar en logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                  </div>
                </form>

                <select
                  value={filters.action}
                  onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {actionTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                <select
                  value={filters.entity}
                  onChange={(e) => setFilters({ ...filters, entity: e.target.value })}
                  className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {entityTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setFilters({
                      action: '',
                      entity: '',
                      startDate: '',
                      endDate: '',
                      userId: ''
                    });
                    setSearchTerm('');
                  }}
                  className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <FiFilter className="inline mr-2" />
                  Limpiar
                </button>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Logs Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        Fecha/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        Acción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        Entidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        IP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {loading ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                          </div>
                        </td>
                      </tr>
                    ) : logs.length > 0 ? (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={getActionBadge(log.action)}>
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {log.entity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {log.user?.username || 'Sistema'}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            <div className="max-w-xs truncate">
                              {log.description}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                            {log.ipAddress || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewLog(log.id)}
                              className="text-primary-600 hover:text-primary-700 font-medium"
                            >
                              <FiEye className="inline mr-1" />
                              Ver
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-neutral-500">
                          No se encontraron logs
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-neutral-600">
                    Mostrando {logs.length} de {pagination.total} logs
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1 border rounded hover:bg-neutral-50 disabled:opacity-50"
                    >
                      Anterior
                    </button>
                    <span className="text-sm text-neutral-600">
                      Página {pagination.page} de {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1 border rounded hover:bg-neutral-50 disabled:opacity-50"
                    >
                      Siguiente
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              {/* Date Range Filter */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchStats}
                    className="btn-primary w-full"
                  >
                    Actualizar
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* By Action */}
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Acciones
                  </h3>
                  <div className="space-y-3">
                    {stats.byAction?.map((action) => (
                      <div key={action.action} className="flex items-center justify-between">
                        <span className={`${getActionBadge(action.action)} w-20`}>
                          {action.action}
                        </span>
                        <span className="font-bold text-neutral-900">
                          {action.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Users */}
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Usuarios Más Activos
                  </h3>
                  <div className="space-y-3">
                    {stats.topUsers?.slice(0, 5).map((user, index) => (
                      <div key={user.userId} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="text-neutral-900">
                            {user.user?.username || 'N/A'}
                          </span>
                        </div>
                        <span className="font-bold text-primary-600">
                          {user.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RECENT TAB */}
          {activeTab === 'recent' && (
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                </div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((log) => (
                  <div key={log.id} className="p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className={getActionBadge(log.action)}>
                            {log.action}
                          </span>
                          <span className="font-medium text-neutral-900">
                            {log.entity}
                          </span>
                          <span className="text-sm text-neutral-500">
                            {getTimeAgo(log.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-neutral-700">{log.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-neutral-500">
                          <span>Usuario: {log.user?.username || 'Sistema'}</span>
                          <span>IP: {log.ipAddress || 'N/A'}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleViewLog(log.id)}
                        className="text-primary-600 hover:text-primary-700"
                      >
                        <FiEye className="text-xl" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-neutral-500">
                  No hay actividad reciente
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Detalles del Log
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600">ID</p>
                  <p className="font-semibold">{selectedLog.id}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Acción</p>
                  <span className={getActionBadge(selectedLog.action)}>
                    {selectedLog.action}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Entidad</p>
                  <p className="font-semibold">{selectedLog.entity}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">ID Entidad</p>
                  <p className="font-semibold">{selectedLog.entityId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Usuario</p>
                  <p className="font-semibold">{selectedLog.user?.username || 'Sistema'}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Fecha</p>
                  <p className="font-semibold">{formatDate(selectedLog.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">IP</p>
                  <p className="font-semibold">{selectedLog.ipAddress || 'N/A'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-neutral-600 mb-2">Descripción</p>
                <p className="text-neutral-900">{selectedLog.description}</p>
              </div>

              {selectedLog.userAgent && (
                <div>
                  <p className="text-sm text-neutral-600 mb-2">User Agent</p>
                  <p className="text-xs text-neutral-700 bg-neutral-50 p-2 rounded">
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}

              {selectedLog.previousValue && (
                <div>
                  <p className="text-sm text-neutral-600 mb-2">Valor Anterior</p>
                  <pre className="text-xs bg-neutral-50 p-4 rounded overflow-x-auto">
                    {JSON.stringify(selectedLog.previousValue, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.newValue && (
                <div>
                  <p className="text-sm text-neutral-600 mb-2">Valor Nuevo</p>
                  <pre className="text-xs bg-neutral-50 p-4 rounded overflow-x-auto">
                    {JSON.stringify(selectedLog.newValue, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditPage;