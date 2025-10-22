/**
 * @author Alexander Echeverria
 * @file ProductosPage.jsx
 * @description Página completa de gestión de productos con CRUD
 * @location /src/pages/admin/ProductosPage.jsx
 */

import { useState, useEffect } from 'react';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiEye, FiFilter, FiDownload } from 'react-icons/fi';
import productService from '../../services/productService';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ProductosPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    isActive: '',
    lowStock: false
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    presentation: '',
    price: '',
    costPrice: '',
    stock: '',
    minStock: '',
    description: '',
    imageUrl: '',
    isActive: true
  });

  useEffect(() => {
    fetchProducts();
  }, [pagination.page, filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        ...filters
      };

      const response = await productService.getAllProducts(params);
      
      setProducts(response.products || []);
      setPagination(prev => ({
        ...prev,
        total: response.total || 0,
        totalPages: response.totalPages || 0
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchProducts();
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      await productService.deleteProduct(productId);
      toast.success('Producto eliminado exitosamente');
      fetchProducts();
    } catch (error) {
      toast.error('Error al eliminar producto');
    }
  };

  const handleOpenCreateModal = () => {
    setEditMode(false);
    setFormData({
      name: '',
      sku: '',
      category: '',
      presentation: '',
      price: '',
      costPrice: '',
      stock: '',
      minStock: '',
      description: '',
      imageUrl: '',
      isActive: true
    });
    setShowFormModal(true);
  };

  const handleOpenEditModal = (product) => {
    setEditMode(true);
    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || '',
      presentation: product.presentation || '',
      price: product.price || '',
      costPrice: product.costPrice || '',
      stock: product.stock || '',
      minStock: product.minStock || '',
      description: product.description || '',
      imageUrl: product.imageUrl || '',
      isActive: product.isActive !== undefined ? product.isActive : true
    });
    setSelectedProduct(product);
    setShowFormModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validar campos requeridos
      if (!formData.name || !formData.sku || !formData.category || !formData.price) {
        toast.error('Por favor completa todos los campos requeridos');
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.costPrice) || 0,
        stock: parseInt(formData.stock) || 0,
        minStock: parseInt(formData.minStock) || 0
      };

      if (editMode) {
        await productService.updateProduct(selectedProduct.id, productData);
        toast.success('Producto actualizado exitosamente');
      } else {
        await productService.createProduct(productData);
        toast.success('Producto creado exitosamente');
      }

      setShowFormModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error.message || 'Error al guardar el producto');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const getStockBadge = (product) => {
    if (product.stock <= 0) {
      return <span className="badge-danger">Agotado</span>;
    }
    if (product.stock <= product.minStock) {
      return <span className="badge-warning">Stock Bajo</span>;
    }
    return <span className="badge-success">Disponible</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Gestión de Productos
          </h1>
          <p className="text-neutral-600 mt-1">
            Administra el catálogo de productos
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="btn-primary flex items-center space-x-2"
        >
          <FiPlus />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nombre, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            </div>
          </form>

          {/* Category Filter */}
          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todas las categorías</option>
            <option value="medicamento">Medicamentos</option>
            <option value="vitamina">Vitaminas</option>
            <option value="suplemento">Suplementos</option>
            <option value="cuidado_personal">Cuidado Personal</option>
            <option value="otro">Otros</option>
          </select>

          {/* Active Filter */}
          <select
            value={filters.isActive}
            onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="">Todos los estados</option>
            <option value="true">Activos</option>
            <option value="false">Inactivos</option>
          </select>
        </div>

        <div className="flex items-center space-x-4 mt-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.lowStock}
              onChange={(e) => setFilters({ ...filters, lowStock: e.target.checked })}
              className="rounded text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-neutral-700">Solo stock bajo</span>
          </label>

          <button
            onClick={() => {
              setFilters({ category: '', isActive: '', lowStock: false });
              setSearchTerm('');
            }}
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-neutral-600">Total Productos</p>
          <p className="text-2xl font-bold text-primary-600">{pagination.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-neutral-600">En Stock</p>
          <p className="text-2xl font-bold text-success-600">
            {products.filter(p => p.stock > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-neutral-600">Stock Bajo</p>
          <p className="text-2xl font-bold text-warning-600">
            {products.filter(p => p.stock <= p.minStock && p.stock > 0).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-neutral-600">Agotados</p>
          <p className="text-2xl font-bold text-danger-600">
            {products.filter(p => p.stock <= 0).length}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  SKU
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase">
                  Stock
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
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
                    </div>
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-neutral-900">{product.name}</p>
                          <p className="text-sm text-neutral-500">{product.presentation}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm capitalize">{product.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-primary-600">
                        {formatCurrency(product.price)}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Costo: {formatCurrency(product.costPrice)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold">{product.stock}</p>
                        <p className="text-xs text-neutral-500">Min: {product.minStock}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStockBadge(product)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowModal(true);
                          }}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                          title="Ver detalles"
                        >
                          <FiEye />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-2 text-success-600 hover:bg-success-50 rounded"
                          title="Editar"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-danger-600 hover:bg-danger-50 rounded"
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-neutral-500">
                    No se encontraron productos
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
              Mostrando {products.length} de {pagination.total} productos
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    pagination.page === i + 1
                      ? 'bg-primary-500 text-white'
                      : 'hover:bg-neutral-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border rounded hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Detalles */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-semibold">Detalles del Producto</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {selectedProduct.imageUrl && (
                <img
                  src={selectedProduct.imageUrl}
                  alt={selectedProduct.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-neutral-600">Nombre</p>
                  <p className="font-semibold">{selectedProduct.name}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">SKU</p>
                  <p className="font-semibold">{selectedProduct.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Categoría</p>
                  <p className="font-semibold capitalize">{selectedProduct.category}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Presentación</p>
                  <p className="font-semibold">{selectedProduct.presentation}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Precio</p>
                  <p className="font-semibold text-primary-600">
                    {formatCurrency(selectedProduct.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Costo</p>
                  <p className="font-semibold">{formatCurrency(selectedProduct.costPrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Stock Actual</p>
                  <p className="font-semibold">{selectedProduct.stock}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-600">Stock Mínimo</p>
                  <p className="font-semibold">{selectedProduct.minStock}</p>
                </div>
              </div>
              {selectedProduct.description && (
                <div>
                  <p className="text-sm text-neutral-600">Descripción</p>
                  <p className="text-neutral-900">{selectedProduct.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formulario Crear/Editar */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold">
                {editMode ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button
                onClick={() => setShowFormModal(false)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Nombre del Producto <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Paracetamol 500mg"
                  />
                </div>

                {/* SKU */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    SKU <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: MED-001"
                  />
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Categoría <span className="text-danger-500">*</span>
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar categoría</option>
                    <option value="medicamento">Medicamento</option>
                    <option value="vitamina">Vitamina</option>
                    <option value="suplemento">Suplemento</option>
                    <option value="cuidado_personal">Cuidado Personal</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                {/* Presentación */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Presentación
                  </label>
                  <input
                    type="text"
                    name="presentation"
                    value={formData.presentation}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ej: Caja x 20 tabletas"
                  />
                </div>

                {/* Precio de Venta */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Precio de Venta <span className="text-danger-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleFormChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                {/* Precio de Costo */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Precio de Costo
                  </label>
                  <input
                    type="number"
                    name="costPrice"
                    value={formData.costPrice}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                {/* Stock Actual */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Stock Actual
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleFormChange}
                    min="0"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {/* Stock Mínimo */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Stock Mínimo
                  </label>
                  <input
                    type="number"
                    name="minStock"
                    value={formData.minStock}
                    onChange={handleFormChange}
                    min="0"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                {/* URL de Imagen */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    URL de Imagen
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                {/* Descripción */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Descripción del producto..."
                  />
                </div>

                {/* Estado Activo */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleFormChange}
                      className="rounded text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-neutral-700">
                      Producto Activo
                    </span>
                  </label>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary px-6 py-2"
                >
                  {editMode ? 'Actualizar' : 'Crear'} Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductosPage;