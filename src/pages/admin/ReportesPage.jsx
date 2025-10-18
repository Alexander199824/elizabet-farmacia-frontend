/**
 * @author Alexander Echeverria
 * @file ReportesPage.jsx
 * @description Página completa de reportes con gráficas y analíticas
 * @location /src/pages/admin/ReportesPage.jsx
 */

import { useState, useEffect } from 'react';
import { 
  FiDownload, FiCalendar, FiTrendingUp, FiDollarSign, 
  FiPackage, FiUsers, FiBarChart2, FiPieChart 
} from 'react-icons/fi';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import reportService from '../../services/reportService';
import statisticsService from '../../services/statisticsService';
import { formatCurrency, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const ReportesPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ventas'); // ventas, inventario, financiero, clientes
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Estados para diferentes reportes
  const [salesReport, setSalesReport] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [topClients, setTopClients] = useState([]);
  const [inventoryReport, setInventoryReport] = useState(null);
  const [profitability, setProfitability] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchReports();
  }, [dateRange]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      // Cargar todos los reportes en paralelo
      const [
        salesData,
        topProductsData,
        topClientsData,
        inventoryData,
        profitabilityData,
        dashboardData
      ] = await Promise.all([
        reportService.getSalesReport({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          groupBy: 'day'
        }),
        reportService.getTopProducts({ limit: 10 }),
        reportService.getTopClients({ limit: 10 }),
        reportService.getInventoryReport(),
        reportService.getProfitabilityReport({
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
        statisticsService.getDashboard()
      ]);

      setSalesReport(salesData);
      setTopProducts(topProductsData.products || []);
      setTopClients(topClientsData.clients || []);
      setInventoryReport(inventoryData);
      setProfitability(profitabilityData);
      setDashboard(dashboardData);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const blob = await reportService.exportToPDF(activeTab, dateRange);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${activeTab}-${dateRange.startDate}.pdf`;
      a.click();
      toast.success('Reporte exportado a PDF');
    } catch (error) {
      toast.error('Error al exportar PDF');
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await reportService.exportToExcel(activeTab, dateRange);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte-${activeTab}-${dateRange.startDate}.xlsx`;
      a.click();
      toast.success('Reporte exportado a Excel');
    } catch (error) {
      toast.error('Error al exportar Excel');
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Reportes y Analíticas
          </h1>
          <p className="text-neutral-600 mt-1">
            Análisis detallado del negocio
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={handleExportPDF} className="btn-outline flex items-center space-x-2">
            <FiDownload />
            <span>PDF</span>
          </button>
          <button onClick={handleExportExcel} className="btn-primary flex items-center space-x-2">
            <FiDownload />
            <span>Excel</span>
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="flex items-center space-x-4">
          <FiCalendar className="text-primary-500 text-xl" />
          <div className="flex items-center space-x-4 flex-1">
            <div>
              <label className="text-sm text-neutral-600 block mb-1">Fecha Inicio</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-sm text-neutral-600 block mb-1">Fecha Fin</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={fetchReports}
              className="btn-primary mt-6"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiDollarSign className="text-3xl opacity-80" />
              <span className="text-xs opacity-80">Total</span>
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(dashboard.sales?.total || 0)}
            </p>
            <p className="text-sm opacity-80 mt-1">Ventas Totales</p>
          </div>

          <div className="bg-gradient-to-br from-success-500 to-success-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiTrendingUp className="text-3xl opacity-80" />
              <span className="text-xs opacity-80">Conteo</span>
            </div>
            <p className="text-3xl font-bold">
              {dashboard.sales?.count || 0}
            </p>
            <p className="text-sm opacity-80 mt-1">Transacciones</p>
          </div>

          <div className="bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiPackage className="text-3xl opacity-80" />
              <span className="text-xs opacity-80">Productos</span>
            </div>
            <p className="text-3xl font-bold">
              {dashboard.inventory?.totalProducts || 0}
            </p>
            <p className="text-sm opacity-80 mt-1">En Inventario</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiUsers className="text-3xl opacity-80" />
              <span className="text-xs opacity-80">Clientes</span>
            </div>
            <p className="text-3xl font-bold">
              {dashboard.clients?.unique || 0}
            </p>
            <p className="text-sm opacity-80 mt-1">Únicos</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-card">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {[
              { id: 'ventas', label: 'Ventas', icon: FiTrendingUp },
              { id: 'inventario', label: 'Inventario', icon: FiPackage },
              { id: 'financiero', label: 'Financiero', icon: FiDollarSign },
              { id: 'clientes', label: 'Clientes', icon: FiUsers }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <tab.icon className="inline mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* VENTAS TAB */}
          {activeTab === 'ventas' && (
            <div className="space-y-6">
              {/* Gráfica de Ventas por Día */}
              {salesReport && salesReport.daily && (
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Tendencia de Ventas Diarias
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={salesReport.daily}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Ventas"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Top 10 Productos */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Top 10 Productos Más Vendidos
                  </h3>
                  {topProducts.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={topProducts} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Bar dataKey="quantitySold" fill="#10b981" name="Vendidos" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-neutral-500 text-center py-8">
                      No hay datos disponibles
                    </p>
                  )}
                </div>

                {/* Ventas por Categoría */}
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Ventas por Categoría
                  </h3>
                  {salesReport?.byCategory && salesReport.byCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={salesReport.byCategory}
                          dataKey="total"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => entry.category}
                        >
                          {salesReport.byCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-neutral-500 text-center py-8">
                      No hay datos disponibles
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* INVENTARIO TAB */}
          {activeTab === 'inventario' && inventoryReport && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">Valor Total</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(inventoryReport.totalValue || 0)}
                  </p>
                </div>
                <div className="bg-warning-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">Stock Bajo</p>
                  <p className="text-2xl font-bold text-warning-600">
                    {inventoryReport.lowStock || 0}
                  </p>
                </div>
                <div className="bg-danger-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">Agotados</p>
                  <p className="text-2xl font-bold text-danger-600">
                    {inventoryReport.outOfStock || 0}
                  </p>
                </div>
              </div>

              {inventoryReport.byCategory && (
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Inventario por Categoría
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={inventoryReport.byCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantity" fill="#3b82f6" name="Cantidad" />
                      <Bar dataKey="value" fill="#10b981" name="Valor" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* FINANCIERO TAB */}
          {activeTab === 'financiero' && profitability && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-success-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">Ingresos</p>
                  <p className="text-2xl font-bold text-success-600">
                    {formatCurrency(profitability.revenue || 0)}
                  </p>
                </div>
                <div className="bg-warning-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">Costos</p>
                  <p className="text-2xl font-bold text-warning-600">
                    {formatCurrency(profitability.costs || 0)}
                  </p>
                </div>
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">Ganancia</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(profitability.profit || 0)}
                  </p>
                </div>
              </div>

              {profitability.margin && (
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Margen de Ganancia
                  </h3>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-6xl font-bold text-primary-600">
                        {profitability.margin}%
                      </p>
                      <p className="text-neutral-600 mt-2">Margen Promedio</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CLIENTES TAB */}
          {activeTab === 'clientes' && (
            <div className="space-y-6">
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Top 10 Mejores Clientes
                </h3>
                {topClients.length > 0 ? (
                  <div className="space-y-3">
                    {topClients.map((client, index) => (
                      <div key={client.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">
                              {client.firstName} {client.lastName}
                            </p>
                            <p className="text-sm text-neutral-500">
                              {client.totalPurchases} compras
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-bold text-success-600">
                          {formatCurrency(client.totalSpent)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-neutral-500 text-center py-8">
                    No hay datos disponibles
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;