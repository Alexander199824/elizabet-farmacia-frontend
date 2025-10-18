/**
 * @author Alexander Echeverria
 * @file helpers.js
 * @description Funciones auxiliares
 * @location /src/utils/helpers.js
 */

// ========== FUNCIONES ORIGINALES ==========

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

// ========== FUNCIONES ADICIONALES NECESARIAS ==========

/**
 * Validar teléfono guatemalteco
 */
export const isValidPhone = (phone) => {
  // Formato: 1234-5678 o 12345678
  const regex = /^[0-9]{4}-?[0-9]{4}$/;
  return regex.test(phone);
};

/**
 * Capitalizar primera letra
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Obtener iniciales de nombre completo (firstName + lastName)
 */
export const getInitialsFromFullName = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return `${first}${last}`;
};

/**
 * Calcular descuento
 */
export const calculateDiscount = (price, discountPercent) => {
  return price - (price * discountPercent / 100);
};

/**
 * Calcular IVA (12%)
 */
export const calculateTax = (subtotal, taxPercent = 12) => {
  return subtotal * (taxPercent / 100);
};

/**
 * Formatear número con separadores de miles
 */
export const formatNumber = (num) => {
  return new Intl.NumberFormat('es-GT').format(num || 0);
};

/**
 * Calcular porcentaje
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(2);
};

/**
 * Obtener mes en español
 */
export const getMonthName = (monthNumber) => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return months[monthNumber] || '';
};

/**
 * Formatear tiempo relativo (hace X minutos)
 */
export const timeAgo = (date) => {
  if (!date) return '';
  
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  
  const intervals = {
    año: 31536000,
    mes: 2592000,
    semana: 604800,
    día: 86400,
    hora: 3600,
    minuto: 60
  };
  
  for (const [name, value] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / value);
    if (interval >= 1) {
      return `Hace ${interval} ${name}${interval !== 1 ? 's' : ''}`;
    }
  }
  
  return 'Hace un momento';
};

/**
 * Validar rango de fechas
 */
export const isValidDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return false;
  return new Date(startDate) <= new Date(endDate);
};

/**
 * Obtener primer día del mes
 */
export const getFirstDayOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Obtener último día del mes
 */
export const getLastDayOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Descargar archivo blob
 */
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Validar stock disponible
 */
export const isStockAvailable = (product, quantity) => {
  return product.stock >= quantity;
};

/**
 * Calcular margen de ganancia
 */
export const calculateProfit = (salePrice, costPrice) => {
  return salePrice - costPrice;
};

/**
 * Calcular margen de ganancia porcentual
 */
export const calculateProfitMargin = (salePrice, costPrice) => {
  if (costPrice === 0) return 0;
  return ((salePrice - costPrice) / costPrice * 100).toFixed(2);
};

/**
 * Generar color aleatorio de una paleta
 */
export const getRandomColor = () => {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Parsear query string
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};