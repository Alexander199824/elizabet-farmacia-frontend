/**
 * @author Alexander Echeverria
 * @file Login.jsx
 * @description Página de inicio de sesión
 * @location /src/pages/public/Login.jsx
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import { FARMACIA_INFO } from '../../utils/constants';
import Loader from '../../components/common/Loader';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        submit: error.message || 'Credenciales incorrectas. Por favor, verifica tus datos.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      setErrors({ 
        submit: 'Error al iniciar sesión con Google. Intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setErrors({ 
      submit: 'Error al conectar con Google. Intenta nuevamente.' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-success-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              FE
            </div>
          </Link>
          <h2 className="text-3xl font-display font-bold text-neutral-900">
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-neutral-600">
            Bienvenido a {FARMACIA_INFO.name}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error general */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-start space-x-3">
              <FiAlertCircle className="text-danger-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-danger-700">{errors.submit}</p>
            </div>
          )}

          {/* Google Login */}
          <div className="mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap
              theme="outline"
              size="large"
              text="signin_with"
              width="100%"
            />
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-neutral-500">O continúa con email</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-3 py-3 border rounded-lg
                    focus:outline-none focus:ring-2 transition-colors
                    ${errors.email 
                      ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' 
                      : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
                    }
                  `}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-danger-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`
                    block w-full pl-10 pr-10 py-3 border rounded-lg
                    focus:outline-none focus:ring-2 transition-colors
                    ${errors.password 
                      ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500' 
                      : 'border-neutral-300 focus:ring-primary-500 focus:border-primary-500'
                    }
                  `}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-danger-600">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-neutral-700">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader size="small" />
                  <span>Iniciando sesión...</span>
                </>
              ) : (
                <span>Iniciar Sesión</span>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-neutral-600">
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center">
          <Link to="/" className="text-sm text-neutral-600 hover:text-neutral-900">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;