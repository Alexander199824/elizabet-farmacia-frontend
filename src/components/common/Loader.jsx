/**
 * @author Alexander Echeverria
 * @file Loader.jsx
 * @description Componente de carga
 * @location /src/components/common/Loader.jsx
 */

const Loader = ({ size = 'medium', fullScreen = false }) => {
  const sizes = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  const loader = (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin`}
      />
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="text-center">
          {loader}
          <p className="mt-4 text-neutral-600 font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return loader;
};

export default Loader;