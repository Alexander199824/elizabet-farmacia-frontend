/**
 * @author Alexander Echeverria
 * @file ProductGrid.jsx
 * @description Grid de productos
 * @location /src/components/products/ProductGrid.jsx
 */

import ProductCard from './ProductCard';
import Loader from '../common/Loader';

const ProductGrid = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="py-20">
        <Loader size="large" />
        <p className="text-center mt-4 text-neutral-600">Cargando productos...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-xl font-semibold text-neutral-700 mb-2">
          No se encontraron productos
        </h3>
        <p className="text-neutral-500">
          Intenta con otros filtros o términos de búsqueda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;