/**
 * @author Alexander Echeverria
 * @file CartDrawer.jsx
 * @description Drawer del carrito de compras
 * @location /src/components/cart/CartDrawer.jsx
 */

import { useEffect } from 'react';
import { FiX, FiShoppingBag, FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/helpers';

const CartDrawer = () => {
  const { cart, isOpen, toggleCart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const navigate = useNavigate();

  // Bloquear scroll cuando el drawer está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCheckout = () => {
    toggleCart();
    navigate('/checkout');
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity"
          onClick={toggleCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-display font-bold flex items-center space-x-2">
            <FiShoppingBag className="text-primary-500" />
            <span>Mi Carrito</span>
            {cart.length > 0 && (
              <span className="badge-primary">{cart.length}</span>
            )}
          </h2>
          <button
            onClick={toggleCart}
            className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            <FiX className="text-2xl" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-6 max-h-[calc(100vh-200px)]">
          {cart.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-4 bg-neutral-100 rounded-full flex items-center justify-center">
                <FiShoppingBag className="text-4xl text-neutral-400" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-700 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-neutral-500 mb-6">
                Agrega productos para comenzar tu compra
              </p>
              <button onClick={toggleCart} className="btn-primary">
                Explorar Productos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  {/* Imagen */}
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/80'}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h3>
                    <p className="text-primary-600 font-bold text-lg">
                      {formatCurrency(item.price)}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-200 rounded transition-colors"
                      >
                        <FiMinus className="text-sm" />
                      </button>
                      <span className="w-10 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1 hover:bg-neutral-200 rounded transition-colors disabled:opacity-50"
                      >
                        <FiPlus className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="self-start p-2 hover:bg-danger-50 hover:text-danger-500 rounded-lg transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer con total y checkout */}
        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-lg">
              <span className="font-semibold">Subtotal:</span>
              <span className="text-2xl font-bold text-primary-600">
                {formatCurrency(getCartTotal())}
              </span>
            </div>

            {/* Botones */}
            <div className="space-y-2">
              <button onClick={handleCheckout} className="w-full btn-primary">
                Proceder al Pago
              </button>
              <button onClick={toggleCart} className="w-full btn-outline">
                Seguir Comprando
              </button>
            </div>

            <p className="text-xs text-center text-neutral-500">
              Los precios incluyen impuestos
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;