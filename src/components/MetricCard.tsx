import React from 'react';
import { LucideIcon } from 'lucide-react';

type ColorType = 'primary' | 'secondary' | 'success' | 'warning' | 'error';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: ColorType;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  color = 'primary' as ColorType,
}) => {
  const colorClasses: Record<ColorType, string> = {
    primary: 'from-primary-500 to-primary-600',
    secondary: 'from-secondary-500 to-secondary-600',
    success: 'from-semantic-success-500 to-semantic-success-700',
    warning: 'from-semantic-warning-500 to-semantic-warning-700',
    error: 'from-semantic-error-500 to-semantic-error-700',
  };

  const changeColors = {
    positive: 'text-semantic-success-700 bg-semantic-success-50',
    negative: 'text-semantic-error-700 bg-semantic-error-50',
    neutral: 'text-neutral-600 bg-neutral-100',
  };

  return (
    <div className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-neutral-600 mb-2">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 mb-3">{value}</p>
          {change && (
            <span className={`inline-flex items-center px-3 py-1 rounded-sm text-xs font-semibold ${changeColors[changeType]}`}>
              {change}
            </span>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-r ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-icon-md h-icon-md text-white" />
        </div>
      </div>
    </div>
  );
};

export default MetricCard;