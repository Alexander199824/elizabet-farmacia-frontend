/**
 * @author Alexander Echeverria
 * @file ReportesPage.jsx
 * @description Dashboard completo de reportes con análisis avanzado
 * @location /src/pages/admin/ReportesPage.jsx
 */

import { useState, useEffect } from 'react';
import { 
  FiDownload, FiCalendar, FiTrendingUp, FiDollarSign, 
  FiPackage, FiUsers, FiBarChart2, FiClock, FiAlertCircle,
  FiShoppingCart, FiBox, FiLayers, FiActivity
} from 'react-icons/fi';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import reportService from '../../services/reportService';
import statisticsService from '../../services/statisticsService';
import productService from '../../services/productService';
import batchService from '../../services/batchService';
import { formatCurrency, formatDate, daysUntilExpiration } from '../../utils/helpers';
import toast from 'react-hot-toast';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const ReportesPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview'); // overview, ventas, inventario, movimientos
  const [activeSubTab, setActiveSubTab] = useState('diario'); // Para sub-tabs de ventas
  
  // Filtros de fecha
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // Estados para diferentes datos
  const [dashboardData, setDashboardData] = useState(null);
  const [salesData, setSalesData] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);
  const [movementsData, setMovementsData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [expiringProducts, setExpiringProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    fetchAllReports();
  }, [dateRange]);

  const fetchAllReports = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchDashboardData(),
        fetchSalesReports(),
        fetchInventoryReports(),
        fetchMovementsReports()
      ]);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const data = await statisticsService.getDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    }
  };

  const fetchSalesReports = async () => {
    try {
      // Ventas por día
      const dailySales = await reportService.getSalesReport({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        groupBy: 'day'
      });

      // Ventas por hora
      const hourlySales = await reportService.getSalesReport({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        groupBy: 'hour'
      });

      // Top productos
      const topProds = await reportService.getTopProducts({ limit: 10 });

      // Ventas por categoría
      const catSales = await reportService.getSalesByCategory(
        dateRange.startDate,
        dateRange.endDate
      );

      setSalesData(dailySales);
      setHourlyData(hourlySales.hourly || []);
      setTopProducts(topProds.products || []);
      setCategoryData(catSales.categories || []);
    } catch (error) {
      console.error('Error fetching sales reports:', error);
    }
  };

  const fetchInventoryReports = async () => {
    try {
      // Reporte de inventario general
      const invReport = await reportService.getInventoryReport();

      // Productos con stock bajo
      const lowStock = await reportService.getLowStockReport();

      // Productos próximos a vencer
      const expiring = await reportService.getExpirationReport(30);

      setInventoryData(invReport);
      setLowStockProducts(lowStock.products || []);
      setExpiringProducts(expiring.batches || []);
    } catch (error) {
      console.error('Error fetching inventory reports:', error);
    }
  };

  const fetchMovementsReports = async () => {
    try {
      const movements = await reportService.getInventoryMovements(
        dateRange.startDate,
        dateRange.endDate
      );
      setMovementsData(movements);
    } catch (error) {
      console.error('Error fetching movements:', error);
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

  const getPeriodPreset = (period) => {
    const end = new Date();
    const start = new Date();
    
    switch(period) {
      case 'hoy':
        start.setHours(0, 0, 0, 0);
        break;
      case 'semana':
        start.setDate(end.getDate() - 7);
        break;
      case 'mes':
        start.setMonth(end.getMonth() - 1);
        break;
      case 'trimestre':
        start.setMonth(end.getMonth() - 3);
        break;
      case 'semestre':
        start.setMonth(end.getMonth() - 6);
        break;
      case 'año':
        start.setFullYear(end.getFullYear() - 1);
        break;
      default:
        return;
    }

    setDateRange({
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    });
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
            Centro de Reportes y Análisis
          </h1>
          <p className="text-neutral-600 mt-1">
            Análisis completo del negocio con métricas avanzadas
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
        <div className="flex flex-wrap items-center gap-4">
          <FiCalendar className="text-primary-500 text-xl" />
          
          {/* Quick presets */}
          <div className="flex flex-wrap gap-2">
            {['hoy', 'semana', 'mes', 'trimestre', 'semestre', 'año'].map((period) => (
              <button
                key={period}
                onClick={() => getPeriodPreset(period)}
                className="px-3 py-1 text-sm border border-neutral-300 rounded-lg hover:bg-primary-50 hover:border-primary-500 transition-colors capitalize"
              >
                {period}
              </button>
            ))}
          </div>

          {/* Custom date range */}
          <div className="flex items-center space-x-3 ml-auto">
            <div>
              <label className="text-xs text-neutral-600 block mb-1">Desde</label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-600 block mb-1">Hasta</label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={fetchAllReports}
              className="btn-primary mt-5"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      {dashboardData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiDollarSign className="text-3xl opacity-80" />
              <FiTrendingUp className="text-2xl" />
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(dashboardData.sales?.total || 0)}
            </p>
            <p className="text-sm opacity-80 mt-1">Ventas Totales</p>
            <p className="text-xs opacity-70 mt-2">
              {dashboardData.sales?.count || 0} transacciones
            </p>
          </div>

          <div className="bg-gradient-to-br from-success-500 to-success-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiShoppingCart className="text-3xl opacity-80" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded">Promedio</span>
            </div>
            <p className="text-3xl font-bold">
              {formatCurrency(dashboardData.sales?.average || 0)}
            </p>
            <p className="text-sm opacity-80 mt-1">Ticket Promedio</p>
          </div>

          <div className="bg-gradient-to-br from-warning-500 to-warning-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiPackage className="text-3xl opacity-80" />
              <FiAlertCircle className="text-2xl" />
            </div>
            <p className="text-3xl font-bold">
              {dashboardData.inventory?.lowStock || 0}
            </p>
            <p className="text-sm opacity-80 mt-1">Stock Bajo</p>
            <p className="text-xs opacity-70 mt-2">
              {dashboardData.inventory?.totalProducts || 0} productos totales
            </p>
          </div>

          <div className="bg-gradient-to-br from-danger-500 to-danger-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <FiCalendar className="text-3xl opacity-80" />
              <span className="text-sm bg-white/20 px-2 py-1 rounded">30 días</span>
            </div>
            <p className="text-3xl font-bold">
              {dashboardData.inventory?.expiring || 0}
            </p>
            <p className="text-sm opacity-80 mt-1">Por Vencer</p>
          </div>
        </div>
      )}

      {/* Main Tabs */}
      <div className="bg-white rounded-xl shadow-card">
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {[
              { id: 'overview', label: 'Resumen General', icon: FiBarChart2 },
              { id: 'ventas', label: 'Análisis de Ventas', icon: FiShoppingCart },
              { id: 'inventario', label: 'Inventario', icon: FiBox },
              { id: 'movimientos', label: 'Movimientos', icon: FiActivity }
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
          {/* RESUMEN GENERAL TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Resumen Ejecutivo</h2>
              
              {/* Gráfica de Ventas Diarias */}
              {salesData && salesData.daily && (
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Tendencia de Ventas (Últimos 30 días)
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData.daily}>
                      <defs>
                        <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#3b82f6" 
                        fillOpacity={1} 
                        fill="url(#colorVentas)"
                        name="Ventas"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Grid de 2 columnas */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top 5 Productos */}
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Top 5 Productos Más Vendidos
                  </h3>
                  {topProducts.length > 0 ? (
                    <div className="space-y-3">
                      {topProducts.slice(0, 5).map((product, index) => (
                        <div key={product.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{product.name}</p>
                              <p className="text-xs text-neutral-500">
                                {product.quantitySold} unidades vendidas
                              </p>
                            </div>
                          </div>
                          <p className="font-bold text-success-600">
                            {formatCurrency(product.totalRevenue || 0)}
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

                {/* Ventas por Categoría */}
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Distribución por Categoría
                  </h3>
                  {categoryData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="total"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={(entry) => entry.category}
                        >
                          {categoryData.map((entry, index) => (
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

              {/* Alertas Importantes */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Stock Bajo */}
                <div className="bg-warning-50 border border-warning-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-warning-800 mb-4 flex items-center">
                    <FiAlertCircle className="mr-2" />
                    Productos con Stock Bajo ({lowStockProducts.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {lowStockProducts.slice(0, 5).map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-2 bg-white rounded">
                        <span className="text-sm font-medium">{product.name}</span>
                        <span className="text-sm text-danger-600 font-bold">
                          Stock: {product.stock}/{product.minStock}
                        </span>
                      </div>
                    ))}
                    {lowStockProducts.length === 0 && (
                      <p className="text-center text-neutral-500 py-4">
                        ✅ Todo el stock está en niveles óptimos
                      </p>
                    )}
                  </div>
                </div>

                {/* Próximos a Vencer */}
                <div className="bg-danger-50 border border-danger-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-danger-800 mb-4 flex items-center">
                    <FiCalendar className="mr-2" />
                    Próximos a Vencer ({expiringProducts.length})
                  </h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {expiringProducts.slice(0, 5).map((batch) => {
                      const days = daysUntilExpiration(batch.expirationDate);
                      return (
                        <div key={batch.id} className="flex items-center justify-between p-2 bg-white rounded">
                          <div>
                            <span className="text-sm font-medium">{batch.product?.name}</span>
                            <p className="text-xs text-neutral-500">Lote: {batch.batchNumber}</p>
                          </div>
                          <span className="text-sm text-danger-600 font-bold">
                            {days} días
                          </span>
                        </div>
                      );
                    })}
                    {expiringProducts.length === 0 && (
                      <p className="text-center text-neutral-500 py-4">
                        ✅ No hay productos próximos a vencer
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VENTAS TAB */}
          {activeTab === 'ventas' && (
            <div className="space-y-6">
              {/* Sub-tabs para ventas */}
              <div className="flex space-x-2 border-b pb-2">
                {['diario', 'hora', 'categoria', 'productos'].map((subTab) => (
                  <button
                    key={subTab}
                    onClick={() => setActiveSubTab(subTab)}
                    className={`px-4 py-2 rounded-t-lg transition-colors capitalize ${
                      activeSubTab === subTab
                        ? 'bg-primary-100 text-primary-700 font-semibold'
                        : 'text-neutral-600 hover:bg-neutral-100'
                    }`}
                  >
                    {subTab}
                  </button>
                ))}
              </div>

              {/* Ventas Diarias */}
              {activeSubTab === 'diario' && salesData && (
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Ventas Diarias</h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={salesData.daily}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Bar dataKey="total" fill="#3b82f6" name="Ventas" />
                      <Bar dataKey="count" fill="#10b981" name="# Transacciones" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Ventas por Hora */}
              {activeSubTab === 'hora' && hourlyData.length > 0 && (
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Análisis de Ventas por Hora del Día
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" label={{ value: 'Hora', position: 'insideBottom', offset: -5 }} />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        name="Ventas"
                        dot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                    <p className="text-sm text-primary-900">
                      <strong>💡 Insight:</strong> Las horas pico de ventas te ayudan a planificar mejor el personal y el inventario.
                    </p>
                  </div>
                </div>
              )}

              {/* Ventas por Categoría */}
              {activeSubTab === 'categoria' && categoryData.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Gráfico de Categorías</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="total"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="bg-neutral-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Detalle por Categoría</h3>
                    <div className="space-y-3">
                      {categoryData.map((cat, index) => (
                        <div key={cat.category} className="p-3 bg-white rounded-lg flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="font-medium capitalize">{cat.category}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-success-600">
                              {formatCurrency(cat.total)}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {cat.count} ventas
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Top Productos */}
              {activeSubTab === 'productos' && topProducts.length > 0 && (
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Top 10 Productos Más Vendidos
                  </h3>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={topProducts} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={200} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="quantitySold" fill="#10b981" name="Unidades Vendidas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* INVENTARIO TAB */}
          {activeTab === 'inventario' && inventoryData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Análisis de Inventario</h2>

              {/* Stats de Inventario */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-primary-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">Valor Total</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(inventoryData.totalValue || 0)}
                  </p>
                </div>
                <div className="bg-warning-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">Stock Bajo</p>
                  <p className="text-2xl font-bold text-warning-600">
                    {inventoryData.lowStock || 0}
                  </p>
                </div>
                <div className="bg-danger-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">Agotados</p>
                  <p className="text-2xl font-bold text-danger-600">
                    {inventoryData.outOfStock || 0}
                  </p>
                </div>
                <div className="bg-success-50 rounded-lg p-4">
                  <p className="text-sm text-neutral-600">Stock OK</p>
                  <p className="text-2xl font-bold text-success-600">
                    {inventoryData.okStock || 0}
                  </p>
                </div>
              </div>

              {/* Inventario por Categoría */}
              {inventoryData.byCategory && (
                <div className="bg-neutral-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Inventario por Categoría
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={inventoryData.byCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="quantity" fill="#3b82f6" name="Cantidad" />
                      <Bar yAxisId="right" dataKey="value" fill="#10b981" name="Valor (Q)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Tabla de Stock Bajo */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4 text-warning-700">
                  ⚠️ Productos que Requieren Reabastecimiento
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm">Producto</th>
                        <th className="px-4 py-2 text-left text-sm">Stock Actual</th>
                        <th className="px-4 py-2 text-left text-sm">Stock Mínimo</th>
                        <th className="px-4 py-2 text-left text-sm">Stock Máximo</th>
                        <th className="px-4 py-2 text-left text-sm">Requerido</th>
                        <th className="px-4 py-2 text-left text-sm">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {lowStockProducts.map((product) => {
                        const required = Math.max(0, (product.maxStock || product.minStock * 2) - product.stock);
                        return (
                          <tr key={product.id} className="hover:bg-neutral-50">
                            <td className="px-4 py-3 text-sm font-medium">{product.name}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="font-bold text-danger-600">{product.stock}</span>
                            </td>
                            <td className="px-4 py-3 text-sm">{product.minStock}</td>
                            <td className="px-4 py-3 text-sm">{product.maxStock || product.minStock * 2}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className="font-bold text-primary-600">{required}</span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {product.stock === 0 ? (
                                <span className="badge-danger">Agotado</span>
                              ) : (
                                <span className="badge-warning">Bajo</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Productos por Vencer */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4 text-danger-700">
                  📅 Productos Próximos a Vencer (30 días)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-neutral-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm">Producto</th>
                        <th className="px-4 py-2 text-left text-sm">Lote</th>
                        <th className="px-4 py-2 text-left text-sm">Cantidad</th>
                        <th className="px-4 py-2 text-left text-sm">Fecha Vencimiento</th>
                        <th className="px-4 py-2 text-left text-sm">Días Restantes</th>
                        <th className="px-4 py-2 text-left text-sm">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {expiringProducts.map((batch) => {
                        const days = daysUntilExpiration(batch.expirationDate);
                        return (
                          <tr key={batch.id} className="hover:bg-neutral-50">
                            <td className="px-4 py-3 text-sm font-medium">{batch.product?.name}</td>
                            <td className="px-4 py-3 text-sm">{batch.batchNumber}</td>
                            <td className="px-4 py-3 text-sm font-bold">{batch.currentQuantity}</td>
                            <td className="px-4 py-3 text-sm">{formatDate(batch.expirationDate)}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={days < 7 ? 'text-danger-600 font-bold' : 'text-warning-600'}>
                                {days} días
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {days < 0 ? (
                                <span className="badge-danger">Vencido</span>
                              ) : days < 7 ? (
                                <span className="badge-danger">Urgente</span>
                              ) : (
                                <span className="badge-warning">Por Vencer</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* MOVIMIENTOS TAB */}
          {activeTab === 'movimientos' && movementsData && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Movimientos de Inventario</h2>
              
              <div className="bg-neutral-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Historial de Movimientos
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={movementsData.daily || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="entries" 
                      stackId="1"
                      stroke="#10b981" 
                      fill="#10b981"
                      name="Entradas"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="exits" 
                      stackId="2"
                      stroke="#ef4444" 
                      fill="#ef4444"
                      name="Salidas"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-success-50 rounded-lg p-6">
                  <h4 className="font-semibold text-success-800 mb-3">
                    📥 Entradas Totales
                  </h4>
                  <p className="text-3xl font-bold text-success-600">
                    {movementsData.totalEntries || 0}
                  </p>
                  <p className="text-sm text-neutral-600 mt-2">
                    Unidades ingresadas al inventario
                  </p>
                </div>

                <div className="bg-danger-50 rounded-lg p-6">
                  <h4 className="font-semibold text-danger-800 mb-3">
                    📤 Salidas Totales
                  </h4>
                  <p className="text-3xl font-bold text-danger-600">
                    {movementsData.totalExits || 0}
                  </p>
                  <p className="text-sm text-neutral-600 mt-2">
                    Unidades vendidas del inventario
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;