import React from 'react';
import { cn } from '../../utils/cn';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  variant = 'default',
  size = 'md',
  className,
}) => {
  const variants = {
    default: 'bg-white border-gray-200',
    success: 'bg-success-50 border-success-200',
    warning: 'bg-warning-50 border-warning-200',
    error: 'bg-error-50 border-error-200',
  };

  const iconColors = {
    default: 'text-gray-600',
    success: 'text-success-600',
    warning: 'text-warning-600',
    error: 'text-error-600',
  };

  const valueColors = {
    default: 'text-gray-900',
    success: 'text-success-700',
    warning: 'text-warning-700',
    error: 'text-error-700',
  };

  const sizes = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={cn(
        'rounded-xl border transition-all duration-normal hover:shadow-md',
        variants[variant],
        sizes[size],
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            {icon && (
              <div className={cn(
                'flex items-center justify-center rounded-lg bg-gray-100 p-2',
                iconColors[variant],
                iconSizes[size]
              )}>
                {icon}
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 truncate">
                {title}
              </p>
              
              <div className="flex items-baseline space-x-2">
                <p className={cn(
                  'font-bold tracking-tight',
                  valueColors[variant],
                  size === 'sm' ? 'text-lg' : size === 'md' ? 'text-2xl' : 'text-3xl'
                )}>
                  {value}
                </p>
                
                {trend && (
                  <div className={cn(
                    'flex items-center text-xs font-medium',
                    trend.isPositive ? 'text-success-600' : 'text-error-600'
                  )}>
                    <svg
                      className={cn(
                        'w-3 h-3 mr-1',
                        trend.isPositive ? 'rotate-0' : 'rotate-180'
                      )}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {Math.abs(trend.value)}%
                  </div>
                )}
              </div>
              
              {description && (
                <p className="text-xs text-gray-500 mt-1">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCard; 