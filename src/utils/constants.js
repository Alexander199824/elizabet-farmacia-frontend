/**
 * @author Alexander Echeverria
 * @file constants.js
 * @description Constantes de la aplicación
 * @location /src/utils/constants.js
 */

export const FARMACIA_INFO = {
  name: import.meta.env.VITE_FARMACIA_NAME || 'Farmacia Elizabeth',
  phone: import.meta.env.VITE_FARMACIA_PHONE || '+502 1234-5678',
  email: import.meta.env.VITE_FARMACIA_EMAIL || 'info@farmaciaelizabeth.com',
  address: import.meta.env.VITE_FARMACIA_ADDRESS || 'Guatemala City, Guatemala',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  VENDEDOR: 'vendedor',
  BODEGA: 'bodega',
  REPARTIDOR: 'repartidor',
  CLIENTE: 'cliente',
};

export const PRODUCT_CATEGORIES = [
  { value: 'medicamento', label: 'Medicamentos' },
  { value: 'vitamina', label: 'Vitaminas' },
  { value: 'suplemento', label: 'Suplementos' },
  { value: 'cuidado_personal', label: 'Cuidado Personal' },
  { value: 'higiene', label: 'Higiene' },
  { value: 'equipamiento', label: 'Equipamiento Médico' },
  { value: 'otro', label: 'Otros' },
];

export const PAYMENT_METHODS = [
  { value: 'efectivo', label: 'Efectivo' },
  { value: 'tarjeta', label: 'Tarjeta' },
  { value: 'transferencia', label: 'Transferencia' },
  { value: 'credito', label: 'Crédito' },
];

export const INVOICE_STATUS = {
  COMPLETADA: 'completada',
  PENDIENTE: 'pendiente',
  CANCELADA: 'cancelada',
  ANULADA: 'anulada',
};

export const BATCH_STATUS = {
  ACTIVE: 'active',
  NEAR_EXPIRY: 'near_expiry',
  EXPIRED: 'expired',
  DEPLETED: 'depleted',
  BLOCKED: 'blocked',
};