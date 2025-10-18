/**
 * @author Alexander Echeverria
 * @file VentasPage.jsx
 * @description Página completa de gestión de ventas con CRUD
 * @location /src/pages/admin/VentasPage.jsx
 */

import { useState, useEffect } from 'react';
import { FiSearch, FiEye, FiDownload, FiFilter, FiX } from 'react-icons/fi';
import invoiceService from '../../services/invoiceService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { PAYMENT_METHODS } from '../../utils/constants';
import toast from 'react-hot-toast';

const VentasPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    paymentMethod: '',
    startDate: '',
    endDate: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [selectedSale, setSelectedSale] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchSales();
    fetchStats();
  }, [pagination.page, filters]);

  const fetchSales = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      };

      const response = await invoiceService.getAllInvoices(params);
      
      setSales(response.invoices || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Error al cargar ventas');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const statsData = await invoiceService.getInvoiceStats(filters);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchSales();
  };

  const handleViewSale = async (saleId) => {
    try {
      const response = await invoiceService.getInvoiceById(saleId);
      setSelectedSale(response);
      setShowModal(true);
    } catch (error) {
      toast.error('Error al cargar detalles');
    }
  };

  const handleCancelSale = async (saleId) => {
    if (!window.confirm('¿Estás seguro de anular esta venta?')) return;

    const reason = prompt('Motivo de anulación:');
    if (!reason) return;

    try {
      await invoiceService.cancelInvoice(saleId, reason);
      toast.success('Venta anulada exitosamente');
      fetchSales();
      fetchStats();
    } catch (error) {
      toast.error('Error al anular venta');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getStatusBadge = (status) => {
    const badges = {
      completada: 'badge-success',
      pendiente: 'badge-warning',
      cancelada: 'badge-danger',
      anulada: 'badge-danger',
    };
    return badges[status] || 'badge';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Gestión de Ventas
          </h1>
          <p className="text-neutral-600 mt-1">
            Administra todas las ventas del sistema
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <FiDownload />
          <span>Exportar</span>
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-neutral-600">Total Ventas</p>
            <p className="text-2xl font-bold text-primary-600">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-neutral-600">Ingresos Totales</p>
            <p className="text-2xl font-bold text-success-600">
              {formatCurrency(stats.totalRevenue || 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-neutral-600">Ticket Promedio</p>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(stats.averageTicket?.average || 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-neutral-600">Completadas</p>
            <p className="text-2xl font-bold text-success-600">
              {stats.byStatus?.find(s => s.status === 'completada')?.count || 0}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por número, cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            </div>
          </form>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todos los estados</option>
            <option value="completada">Completada</option>
            <option value="pendiente">Pendiente</option>
            <option value="cancelada">Cancelada</option>
            <option value="anulada">Anulada</option>
          </select>

          {/* Payment Method Filter */}
          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todos los métodos</option>
            {PAYMENT_METHODS.map(method => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Clear Filters */}
        {Object.values(filters).some(v => v) && (
          <button
            onClick={() => setFilters({ status: '', paymentMethod: '', startDate: '', endDate: '' })}
            className="mt-4 text-sm text-danger-500 hover:text-danger-600 flex items-center space-x-1"
          >
            <FiX />
            <span>Limpiar filtros</span>
          </button>
        )}
      </div>

      {/* Sales Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Recibo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Vendedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Pago
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                    </div>
                  </td>
                </tr>
              ) : sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-primary-600">
                        {sale.invoiceNumber}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {formatDate(sale.invoiceDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-neutral-900">
                        {sale.client ? 
                          `${sale.client.firstName} ${sale.client.lastName}` : 
                          sale.clientName || 'CF'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                      {sale.seller ? 
                        `${sale.seller.firstName} ${sale.seller.lastName}` : 
                        'N/A'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-success-600">
                        {formatCurrency(sale.total)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {sale.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(sale.status)}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewSale(sale.id)}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          <FiEye />
                        </button>
                        {sale.status === 'completada' && (
                          <button
                            onClick={() => handleCancelSale(sale.id)}
                            className="text-danger-600 hover:text-danger-700 font-medium"
                          >
                            Anular
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-8 text-center text-neutral-500">
                    No se encontraron ventas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              Mostrando {sales.length} de {pagination.total} ventas
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

      {/* Modal de Detalles */}
      {showModal && selectedSale && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Detalles de Venta - {selectedSale.invoiceNumber}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Info de la venta */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600">Fecha</p>
                  <p className="font-semibold">
                    {formatDate(selectedSale.invoiceDate)} {selectedSale.invoiceTime}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Estado</p>
                  <span className={getStatusBadge(selectedSale.status)}>
                    {selectedSale.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Cliente</p>
                  <p className="font-semibold">
                    {selectedSale.client ? 
                      `${selectedSale.client.firstName} ${selectedSale.client.lastName}` : 
                      selectedSale.clientName
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Vendedor</p>
                  <p className="font-semibold">
                    {selectedSale.seller ? 
                      `${selectedSale.seller.firstName} ${selectedSale.seller.lastName}` : 
                      'N/A'
                    }
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold mb-2">Productos</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs">Producto</th>
                        <th className="px-4 py-2 text-left text-xs">Cantidad</th>
                        <th className="px-4 py-2 text-left text-xs">Precio</th>
                        <th className="px-4 py-2 text-left text-xs">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedSale.items?.map((item, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 text-sm">
                            {item.product?.name || 'N/A'}
                          </td>
                          <td className="px-4 py-2 text-sm">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-4 py-2 text-sm font-semibold">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {formatCurrency(selectedSale.subtotal)}
                  </span>
                </div>
                {selectedSale.discount > 0 && (
                  <div className="flex justify-between text-danger-600">
                    <span>Descuento:</span>
                    <span className="font-semibold">
                      -{formatCurrency(selectedSale.discount)}
                    </span>
                  </div>
                )}
                {selectedSale.tax > 0 && (
                  <div className="flex justify-between">
                    <span>IVA:</span>
                    <span className="font-semibold">
                      {formatCurrency(selectedSale.tax)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-success-600 border-t pt-2">
                  <span>TOTAL:</span>
                  <span>{formatCurrency(selectedSale.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VentasPage;