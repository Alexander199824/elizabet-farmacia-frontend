/**
 * @author Alexander Echeverria
 * @file OrderConfirmation.jsx
 * @description Página de confirmación de pedido
 * @location /src/pages/public/OrderConfirmation.jsx
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { FiCheckCircle, FiPhone, FiMail, FiMapPin, FiHome } from 'react-icons/fi';
import { formatCurrency } from '../../utils/helpers';
import { FARMACIA_INFO } from '../../utils/constants';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  if (!orderData) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-success-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="text-5xl text-success-600" />
            </div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              ¡Pedido Recibido!
            </h1>
            <p className="text-lg text-neutral-600 mb-3">
              Gracias por tu compra, {orderData.customerInfo.fullName}
            </p>
            <div className="inline-block bg-primary-100 px-6 py-3 rounded-lg">
              <p className="text-sm text-neutral-600 mb-1">Número de Orden</p>
              <p className="text-2xl font-bold text-primary-600">{orderData.orderNumber}</p>
            </div>
            <p className="text-sm text-neutral-500 mt-2">{orderData.orderDate}</p>
          </div>

          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
            <h2 className="text-xl font-bold mb-6">Detalles del Pedido</h2>

            {/* Customer Info */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FiPhone className="text-primary-600" />
                Información de Contacto
              </h3>
              <div className="space-y-2 text-sm text-neutral-600">
                <p><span className="font-medium">Teléfono:</span> {orderData.customerInfo.phone}</p>
                {orderData.customerInfo.email && (
                  <p><span className="font-medium">Email:</span> {orderData.customerInfo.email}</p>
                )}
              </div>
              <div className="mt-4 p-3 bg-warning-50 border border-warning-200 rounded-lg">
                <p className="text-sm text-warning-900">
                  <strong>📱 Importante:</strong> Te contactaremos a este número para confirmar tu pedido y coordinar la entrega.
                </p>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <FiMapPin className="text-success-600" />
                Información de Entrega
              </h3>
              <div className="space-y-2 text-sm text-neutral-600">
                <p><span className="font-medium">Zona:</span> {orderData.deliveryInfo.zoneName}</p>
                {orderData.deliveryInfo.address && (
                  <>
                    <p><span className="font-medium">Dirección:</span> {orderData.deliveryInfo.address}</p>
                    {orderData.deliveryInfo.reference && (
                      <p><span className="font-medium">Referencias:</span> {orderData.deliveryInfo.reference}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Products */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold mb-3">Productos</h3>
              <div className="space-y-3">
                {orderData.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-neutral-600">Cantidad: {item.quantity}</p>
                    </div>
                    <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-medium">{formatCurrency(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Costo de envío:</span>
                <span className="font-medium">
                  {orderData.deliveryCost === 0 ? 'Gratis' : formatCurrency(orderData.deliveryCost)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t">
                <span>Total:</span>
                <span className="text-primary-600">{formatCurrency(orderData.total)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mt-6 p-4 bg-success-50 border border-success-200 rounded-lg">
              <p className="text-sm font-medium text-success-900 mb-2">
                💵 Método de pago: Efectivo (Contra entrega)
              </p>
              <p className="text-xs text-success-700">
                Se te entregará un recibo impreso al momento de la entrega.
              </p>
            </div>

            {/* Notes */}
            {orderData.notes && (
              <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
                <p className="text-sm font-medium mb-1">Notas:</p>
                <p className="text-sm text-neutral-600">{orderData.notes}</p>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-primary-900 mb-4">¿Qué sigue ahora?</h3>
            <ol className="space-y-3 text-sm text-primary-800">
              <li className="flex gap-3">
                <span className="font-bold">1.</span>
                <span>Guarda tu <strong>número de orden: {orderData.orderNumber}</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">2.</span>
                <span>Nuestro equipo revisará tu pedido y verificará la disponibilidad</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">3.</span>
                <span>Te <strong>contactaremos al {orderData.customerInfo.phone}</strong> para confirmar tu pedido</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">4.</span>
                <span>
                  {orderData.deliveryInfo.zone === 'pickup'
                    ? 'Te avisaremos cuando tu pedido esté listo para recoger en tienda'
                    : 'Entregaremos tu pedido en la dirección indicada (tiempo estimado: 1-3 horas)'
                  }
                </span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold">5.</span>
                <span>Pagarás en efectivo y recibirás tu <strong>recibo impreso</strong> al momento de la entrega</span>
              </li>
            </ol>
          </div>

          {/* Important Notice */}
          <div className="bg-warning-50 border-2 border-warning-300 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-warning-900 mb-3 flex items-center gap-2">
              <span className="text-2xl">⏰</span>
              ¡Mantén tu teléfono cerca!
            </h3>
            <p className="text-sm text-warning-800">
              Es muy importante que estés disponible en el número <strong>{orderData.customerInfo.phone}</strong> para
              que podamos confirmar tu pedido y coordinar la entrega. Te llamaremos pronto.
            </p>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="font-bold mb-4">¿Necesitas ayuda?</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <FiPhone className="text-primary-600" />
                <span>{FARMACIA_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="text-primary-600" />
                <span>{FARMACIA_INFO.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <FiMapPin className="text-primary-600" />
                <span>{FARMACIA_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <FiHome />
              Volver a la tienda
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
