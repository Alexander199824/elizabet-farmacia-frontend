/**
 * @author Alexander Echeverria
 * @file StatCard.jsx
 * @description Tarjeta de estadística
 * @location /src/components/dashboard/StatCard.jsx
 */

const StatCard = ({ title, value, icon: Icon, color = 'primary', trend, description }) => {
  const colorClasses = {
    primary: 'bg-primary-100 text-primary-600',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    danger: 'bg-danger-100 text-danger-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-neutral-900 mb-2">{value}</p>
          {description && (
            <p className="text-sm text-neutral-500">{description}</p>
          )}
          {trend && (
            <div className={`inline-flex items-center text-sm mt-2 ${
              trend.isPositive ? 'text-success-600' : 'text-danger-600'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="text-2xl" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;