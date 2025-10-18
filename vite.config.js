/**
 * @author Alexander Echeverria
 * @file vite.config.js
 * @description Configuración de Vite
 * @location /vite.config.js
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});