/**
 * @author Alexander Echeverria
 * @file App.jsx
 * @description Componente principal con rutas protegidas por rol
 * @location /src/App.jsx
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { USER_ROLES } from './utils/constants';

// Layouts
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import CartDrawer from './components/cart/CartDrawer';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import VendedorDashboard from './pages/vendedor/VendedorDashboard';
import BodegaDashboard from './pages/bodega/BodegaDashboard';
import RepartidorDashboard from './pages/repartidor/RepartidorDashboard';
import ClienteDashboard from './pages/cliente/ClienteDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Public Layout
const PublicLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

// Dashboard Router - Redirige según el rol
const DashboardRouter = () => {
  const { user } = useAuth();

  const dashboardByRole = {
    [USER_ROLES.ADMIN]: <AdminDashboard />,
    [USER_ROLES.VENDEDOR]: <VendedorDashboard />,
    [USER_ROLES.BODEGA]: <BodegaDashboard />,
    [USER_ROLES.REPARTIDOR]: <RepartidorDashboard />,
    [USER_ROLES.CLIENTE]: <ClienteDashboard />,
  };

  return dashboardByRole[user?.role] || <Navigate to="/" replace />;
};

// Main App Component
function AppContent() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home />
            </PublicLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardRouter />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/dashboard/productos"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.VENDEDOR]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Gestión de Productos</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/ventas"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.VENDEDOR]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Gestión de Ventas</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/usuarios"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/inventario"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.BODEGA]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/reportes"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Reportes</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Vendedor Routes */}
        <Route
          path="/dashboard/nueva-venta"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.VENDEDOR]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Nueva Venta</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/mis-ventas"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.VENDEDOR]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Mis Ventas</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/clientes"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.VENDEDOR]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Clientes</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Bodega Routes */}
        <Route
          path="/dashboard/lotes"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.BODEGA]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Gestión de Lotes</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/entradas"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.BODEGA]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Entradas de Inventario</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/alertas"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.BODEGA]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Alertas de Stock</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Repartidor Routes */}
        <Route
          path="/dashboard/entregas"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.REPARTIDOR]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Mis Entregas</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/ruta"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.REPARTIDOR]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Ruta del Día</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/historial"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.REPARTIDOR]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Historial de Entregas</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* Cliente Routes */}
        <Route
          path="/dashboard/pedidos"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Mis Pedidos</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/perfil"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Mi Perfil</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/facturas"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.CLIENTE]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Mis Facturas</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/configuracion"
          element={
            <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-2xl font-bold">Configuración</h1>
                  <p className="text-neutral-600 mt-2">Próximamente...</p>
                </div>
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <PublicLayout>
              <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-6xl font-bold text-neutral-300 mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
                <p className="text-neutral-600 mb-8">
                  La página que buscas no existe.
                </p>
                <a href="/" className="btn-primary">
                  Volver al inicio
                </a>
              </div>
            </PublicLayout>
          }
        />
      </Routes>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1f2937',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            borderRadius: '0.5rem',
            padding: '1rem',
          },
          success: {
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;