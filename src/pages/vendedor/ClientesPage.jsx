/**
 * @author Alexander Echeverria
 * @file ClientesPage.jsx
 * @description Gestión completa de clientes para vendedores
 * @location /src/pages/vendedor/ClientesPage.jsx
 */

import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiEye, FiPhone, FiMail } from 'react-icons/fi';
import clientService from '../../services/clientService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ClientesPage = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    fetchClients();
  }, [pagination.page]);

  // Debounce para búsqueda en tiempo real
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (searchTerm !== undefined) {
        setPagination(prev => ({ ...prev, page: 1 }));
        fetchClients();
      }
    }, 500);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Solo agregar parámetros si tienen valor
      if (searchTerm) params.search = searchTerm;

      const response = await clientService.getAllClients(params);
      
      setClients(response.users || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchClients();
  };

  const handleViewClient = async (clientId) => {
    try {
      const clientData = await clientService.getClientById(clientId);
      setSelectedClient(clientData);
      
      // Obtener historial de compras
      const history = await clientService.getClientPurchaseHistory(clientId, {
        limit: 10
      });
      setPurchaseHistory(history.invoices || []);
      
      setShowModal(true);
    } catch (error) {
      toast.error('Error al cargar detalles');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Gestión de Clientes
          </h1>
          <p className="text-neutral-600 mt-1">
            Administra tu cartera de clientes
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <FiPlus />
          <span>Nuevo Cliente</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-neutral-600">Total Clientes</p>
          <p className="text-2xl font-bold text-primary-600">{pagination.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-neutral-600">Activos</p>
          <p className="text-2xl font-bold text-success-600">
            {clients.filter(c => c.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-neutral-600">Con Email Verificado</p>
          <p className="text-2xl font-bold text-primary-600">
            {clients.filter(c => c.emailVerified).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-neutral-600">Nuevos Este Mes</p>
          <p className="text-2xl font-bold text-success-600">
            {clients.filter(c => {
              const created = new Date(c.createdAt);
              const now = new Date();
              return created.getMonth() === now.getMonth() && 
                     created.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, email, DPI, NIT..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          </div>
          <button type="submit" className="btn-primary">
            Buscar
          </button>
        </form>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto" />
          </div>
        ) : clients.length > 0 ? (
          clients.map((client) => (
            <div key={client.id} className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                    {client.firstName?.[0]}{client.lastName?.[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900">
                      {client.firstName} {client.lastName}
                    </h3>
                    <p className="text-sm text-neutral-500">ID: {client.id}</p>
                  </div>
                </div>
                {client.isActive ? (
                  <span className="badge-success">Activo</span>
                ) : (
                  <span className="badge-danger">Inactivo</span>
                )}
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-neutral-600">
                  <FiMail className="text-neutral-400" />
                  <span className="truncate">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center space-x-2 text-sm text-neutral-600">
                    <FiPhone className="text-neutral-400" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.nit && (
                  <div className="text-sm text-neutral-600">
                    <span className="font-medium">NIT:</span> {client.nit}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t flex items-center justify-between">
                <div className="text-xs text-neutral-500">
                  Miembro desde {formatDate(client.createdAt)}
                </div>
                <button
                  onClick={() => handleViewClient(client.id)}
                  className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center space-x-1"
                >
                  <FiEye />
                  <span>Ver más</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-neutral-500">
            No se encontraron clientes
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded-lg hover:bg-neutral-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-sm text-neutral-600">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="px-4 py-2 border rounded-lg hover:bg-neutral-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}

      {/* Modal de Detalles */}
      {showModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                Detalles del Cliente
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Info Personal */}
              <div>
                <h4 className="font-semibold mb-3">Información Personal</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600">Nombre Completo</p>
                    <p className="font-semibold">
                      {selectedClient.firstName} {selectedClient.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Email</p>
                    <p className="font-semibold">{selectedClient.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Teléfono</p>
                    <p className="font-semibold">{selectedClient.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">DPI</p>
                    <p className="font-semibold">{selectedClient.dpi || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">NIT</p>
                    <p className="font-semibold">{selectedClient.nit || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Estado</p>
                    <span className={selectedClient.isActive ? 'badge-success' : 'badge-danger'}>
                      {selectedClient.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dirección */}
              {selectedClient.address && (
                <div>
                  <h4 className="font-semibold mb-2">Dirección</h4>
                  <p className="text-neutral-700">{selectedClient.address}</p>
                </div>
              )}

              {/* Historial de Compras */}
              <div>
                <h4 className="font-semibold mb-3">Historial de Compras</h4>
                {purchaseHistory.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs">Recibo</th>
                          <th className="px-4 py-2 text-left text-xs">Fecha</th>
                          <th className="px-4 py-2 text-left text-xs">Total</th>
                          <th className="px-4 py-2 text-left text-xs">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {purchaseHistory.map((purchase) => (
                          <tr key={purchase.id}>
                            <td className="px-4 py-2 text-sm">
                              {purchase.invoiceNumber}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              {formatDate(purchase.invoiceDate)}
                            </td>
                            <td className="px-4 py-2 text-sm font-semibold text-success-600">
                              {formatCurrency(purchase.total)}
                            </td>
                            <td className="px-4 py-2 text-sm">
                              <span className={`badge badge-${purchase.status === 'completada' ? 'success' : 'warning'}`}>
                                {purchase.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-neutral-500 text-sm">
                    No hay compras registradas
                  </p>
                )}
              </div>

              {/* Acciones */}
              <div className="pt-4 border-t flex items-center space-x-3">
                <button className="btn-primary">
                  <FiEdit2 className="mr-2" />
                  Editar Cliente
                </button>
                <a href={`tel:${selectedClient.phone}`} className="btn-outline">
                  <FiPhone className="mr-2" />
                  Llamar
                </a>
                <a href={`mailto:${selectedClient.email}`} className="btn-outline">
                  <FiMail className="mr-2" />
                  Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientesPage;