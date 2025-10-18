/**
 * @author Alexander Echeverria
 * @file ProductCard.jsx
 * @description Tarjeta de producto individual
 * @location /src/components/products/ProductCard.jsx
 */

import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      toast.error('Producto agotado');
      return;
    }
    addToCart(product);
  };

  const getStockBadge = () => {
    if (product.stock <= 0) {
      return <span className="badge-danger">Agotado</span>;
    }
    if (product.stock <= product.minStock) {
      return <span className="badge badge-warning">Pocas unidades</span>;
    }
    return <span className="badge-success">Disponible</span>;
  };

  return (
    <div className="card-hover group">
      {/* Imagen */}
      <div className="relative overflow-hidden rounded-lg mb-4 bg-neutral-100">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Sin+Imagen'}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badge de stock */}
        <div className="absolute top-3 right-3">
          {getStockBadge()}
        </div>

        {/* Wishlist button */}
        <button className="absolute top-3 left-3 p-2 bg-white rounded-full shadow-md hover:bg-danger-50 hover:text-danger-500 transition-colors opacity-0 group-hover:opacity-100">
          <FiHeart />
        </button>

        {/* Overlay con info adicional */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <p className="text-sm">SKU: {product.sku}</p>
            {product.laboratory && (
              <p className="text-xs opacity-90">Lab: {product.laboratory}</p>
            )}
          </div>
        </div>
      </div>

      {/* Información del producto */}
      <div className="space-y-2">
        {/* Categoría */}
        {product.category && (
          <span className="text-xs text-primary-600 font-medium uppercase">
            {product.category}
          </span>
        )}

        {/* Nombre */}
        <h3 className="font-semibold text-neutral-900 line-clamp-2 min-h-[3rem]">
          {product.name}
        </h3>

        {/* Presentación */}
        {product.presentation && (
          <p className="text-sm text-neutral-500">{product.presentation}</p>
        )}

        {/* Descripción corta */}
        {product.description && (
          <p className="text-sm text-neutral-600 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Precio y acciones */}
        <div className="flex items-center justify-between pt-3 border-t">
          <div>
            <p className="text-2xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </p>
            {product.costPrice && (
              <p className="text-xs text-neutral-400 line-through">
                {formatCurrency(product.costPrice)}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`
              p-3 rounded-lg transition-all duration-200 flex items-center space-x-2
              ${product.stock > 0
                ? 'bg-success-500 text-white hover:bg-success-600 hover:shadow-lg'
                : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              }
            `}
          >
            <FiShoppingCart className="text-lg" />
            <span className="hidden sm:inline font-medium">Agregar</span>
          </button>
        </div>

        {/* Receta médica requerida */}
        {product.requiresPrescription && (
          <div className="mt-2 p-2 bg-danger-50 border border-danger-200 rounded-lg">
            <p className="text-xs text-danger-600 font-medium text-center">
              ⚕️ Requiere receta médica
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;