/**
 * @author Alexander Echeverria
 * @file Footer.jsx
 * @description Footer de la aplicación
 * @location /src/components/common/Footer.jsx
 */

import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import { FARMACIA_INFO } from '../../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-display font-bold mb-4 text-gradient">
              {FARMACIA_INFO.name}
            </h3>
            <p className="text-neutral-400 mb-4">
              Tu farmacia de confianza. Calidad, servicio y cuidado para tu salud y bienestar.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="p-2 bg-neutral-800 hover:bg-primary-500 rounded-lg transition-colors">
                <FiFacebook />
              </a>
              <a href="#" className="p-2 bg-neutral-800 hover:bg-primary-500 rounded-lg transition-colors">
                <FiInstagram />
              </a>
              <a href="#" className="p-2 bg-neutral-800 hover:bg-primary-500 rounded-lg transition-colors">
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h4 className="font-display font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Inicio</Link></li>
              <li><Link to="/productos" className="hover:text-primary-400 transition-colors">Productos</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">Nosotros</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="font-display font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2 text-neutral-400">
              <li><Link to="/categoria/medicamentos" className="hover:text-primary-400 transition-colors">Medicamentos</Link></li>
              <li><Link to="/categoria/vitaminas" className="hover:text-primary-400 transition-colors">Vitaminas</Link></li>
              <li><Link to="/categoria/suplementos" className="hover:text-primary-400 transition-colors">Suplementos</Link></li>
              <li><Link to="/categoria/cuidado-personal" className="hover:text-primary-400 transition-colors">Cuidado Personal</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3 text-neutral-400">
              <li className="flex items-start space-x-3">
                <FiMapPin className="mt-1 flex-shrink-0 text-primary-400" />
                <span>{FARMACIA_INFO.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiPhone className="flex-shrink-0 text-primary-400" />
                <span>{FARMACIA_INFO.phone}</span>
              </li>
              <li className="flex items-center space-x-3">
                <FiMail className="flex-shrink-0 text-primary-400" />
                <span>{FARMACIA_INFO.email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-500">
          <p>
            &copy; {new Date().getFullYear()} {FARMACIA_INFO.name}. Todos los derechos reservados.
          </p>
          <p className="mt-2 text-sm">
            Desarrollado por <span className="text-primary-400 font-semibold">Alexander Echeverria</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;