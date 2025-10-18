/**
 * @author Alexander Echeverria
 * @file main.jsx
 * @description Punto de entrada de la aplicación
 * @location /src/main.jsx
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);