import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatusCardProps {
  title: string;
  status: 'healthy' | 'warning' | 'error' | 'good' | 'busy';
  description: string;
  icon: LucideIcon;
}

const statusConfig = {
  healthy: {
    bgColor: 'bg-green-50 dark:bg-green-900/10',
    iconColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  good: {
    bgColor: 'bg-green-50 dark:bg-green-900/10',
    iconColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800',
  },
  warning: {
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/10',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800',
  },
  busy: {
    bgColor: 'bg-blue-50 dark:bg-blue-900/10',
    iconColor: 'text-blue-600 dark:text-blue-400',
    borderColor: 'border-blue-200 dark:border-blue-800',
  },
  error: {
    bgColor: 'bg-red-50 dark:bg-red-900/10',
    iconColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800',
  },
};

export const StatusCard: React.FC<StatusCardProps> = ({
  title,
  status,
  description,
  icon: Icon,
}) => {
  const config = statusConfig[status];

  return (
    <div className={`${config.bgColor} ${config.borderColor} border p-6`}>
      <div className="flex items-center space-x-3">
        <div className={`w-10 h-10 ${config.bgColor} flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${config.iconColor}`} />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};