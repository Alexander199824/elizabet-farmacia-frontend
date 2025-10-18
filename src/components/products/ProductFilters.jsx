/**
 * @author Alexander Echeverria
 * @file ProductFilters.jsx
 * @description Filtros de productos
 * @location /src/components/products/ProductFilters.jsx
 */

import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const ProductFilters = ({ onFilterChange, activeFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryChange = (category) => {
    onFilterChange({ category });
  };

  const handleStockChange = (stockStatus) => {
    onFilterChange({ stockStatus });
  };

  const handlePriceChange = (priceRange) => {
    onFilterChange({ priceRange });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  return (
    <div className="mb-6">
      {/* Mobile filter button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full btn-outline flex items-center justify-center space-x-2 mb-4"
      >
        <FiFilter />
        <span>Filtros</span>
        {hasActiveFilters && (
          <span className="badge-primary ml-2">{Object.keys(activeFilters).length}</span>
        )}
      </button>

      {/* Filters panel */}
      <div
        className={`
        bg-white rounded-xl shadow-card p-6
        ${isOpen ? 'block' : 'hidden lg:block'}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center space-x-2">
            <FiFilter className="text-primary-500" />
            <span>Filtros</span>
          </h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-sm text-danger-500 hover:text-danger-600 flex items-center space-x-1"
            >
              <FiX />
              <span>Limpiar</span>
            </button>
          )}
        </div>

        {/* Categorías */}
        <div className="mb-6">
          <h4 className="font-semibold text-neutral-700 mb-3">Categoría</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="category"
                checked={!activeFilters.category}
                onChange={() => handleCategoryChange('')}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Todas las categorías</span>
            </label>
            {PRODUCT_CATEGORIES.map((cat) => (
              <label
                key={cat.value}
                className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors"
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.value}
                  checked={activeFilters.category === cat.value}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm">{cat.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Disponibilidad */}
        <div className="mb-6">
          <h4 className="font-semibold text-neutral-700 mb-3">Disponibilidad</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="stock"
                checked={!activeFilters.stockStatus}
                onChange={() => handleStockChange('')}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Todos</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="stock"
                value="ok"
                checked={activeFilters.stockStatus === 'ok'}
                onChange={(e) => handleStockChange(e.target.value)}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">En stock</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="stock"
                value="low"
                checked={activeFilters.stockStatus === 'low'}
                onChange={(e) => handleStockChange(e.target.value)}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Stock bajo</span>
            </label>
          </div>
        </div>

        {/* Rango de precio */}
        <div className="mb-6">
          <h4 className="font-semibold text-neutral-700 mb-3">Precio</h4>
          <div className="space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="price"
                checked={!activeFilters.priceRange}
                onChange={() => handlePriceChange('')}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Todos los precios</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="price"
                value="0-50"
                checked={activeFilters.priceRange === '0-50'}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Menos de Q50</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="price"
                value="50-100"
                checked={activeFilters.priceRange === '50-100'}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Q50 - Q100</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="price"
                value="100-200"
                checked={activeFilters.priceRange === '100-200'}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Q100 - Q200</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
              <input
                type="radio"
                name="price"
                value="200-999999"
                checked={activeFilters.priceRange === '200-999999'}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm">Más de Q200</span>
            </label>
          </div>
        </div>

        {/* Receta médica */}
        <div>
          <h4 className="font-semibold text-neutral-700 mb-3">Otros</h4>
          <label className="flex items-center space-x-2 cursor-pointer hover:bg-neutral-50 p-2 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={activeFilters.requiresPrescription || false}
              onChange={(e) => onFilterChange({ requiresPrescription: e.target.checked || undefined })}
              className="text-primary-500 focus:ring-primary-500"
            />
            <span className="text-sm">Solo productos con receta</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;