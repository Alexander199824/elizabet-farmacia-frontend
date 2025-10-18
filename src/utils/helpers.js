/**
 * @author Alexander Echeverria
 * @file helpers.js
 * @description Funciones auxiliares
 * @location /src/utils/helpers.js
 */

// Formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-GT', {
    style: 'currency',
    currency: 'GTQ',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Formatear fecha
export const formatDate = (date) => {
  return new Intl.DateTimeFormat('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Formatear fecha corta
export const formatDateShort = (date) => {
  return new Intl.DateTimeFormat('es-GT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(date));
};

// Formatear fecha y hora
export const formatDateTime = (date) => {
  return new Intl.DateTimeFormat('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Validar email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Validar DPI (Guatemala)
export const isValidDPI = (dpi) => {
  return /^\d{13}$/.test(dpi);
};

// Validar NIT (Guatemala)
export const isValidNIT = (nit) => {
  return /^\d{1,8}$/.test(nit) || nit === 'CF';
};

// Truncar texto
export const truncateText = (text, maxLength) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Calcular días hasta vencimiento
export const daysUntilExpiration = (expirationDate) => {
  const today = new Date();
  const expiry = new Date(expirationDate);
  const diffTime = expiry - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Obtener estado de vencimiento
export const getExpirationStatus = (expirationDate) => {
  const days = daysUntilExpiration(expirationDate);
  
  if (days < 0) return { status: 'expired', color: 'danger', text: 'Vencido' };
  if (days <= 30) return { status: 'near_expiry', color: 'warning', text: 'Próximo a vencer' };
  return { status: 'active', color: 'success', text: 'Vigente' };
};

// Generar iniciales de nombre
export const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Debounce
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};