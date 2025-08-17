import React from 'react';
import {
  Activity,
  Users,
  Server,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Settings,
  Bell,
  X,
} from 'lucide-react';
import { MetricCard } from './ui/MetricCard';
import { StatusCard } from './ui/StatusCard';
import { Chart } from './ui/Chart';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            System Alerts
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/10">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-300">
                  All systems operational
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  No active alerts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const metrics = [
  {
    title: 'Active Services',
    value: '42',
    change: '+3',
    trend: 'up' as const,
    icon: Activity,
  },
  {
    title: 'Team Members',
    value: '156',
    change: '+12',
    trend: 'up' as const,
    icon: Users,
  },
  {
    title: 'Infrastructure',
    value: '28',
    change: '-1',
    trend: 'down' as const,
    icon: Server,
  },
  {
    title: 'Deployments',
    value: '234',
    change: '+45',
    trend: 'up' as const,
    icon: GitBranch,
  },
];

const recentActivity = [
  {
    id: 1,
    type: 'deployment',
    message: 'user-service deployed to production',
    user: 'Sarah Chen',
    timestamp: '2 minutes ago',
    status: 'success' as const,
  },
  {
    id: 2,
    type: 'alert',
    message: 'High CPU usage detected on web-server-3',
    user: 'System',
    timestamp: '5 minutes ago',
    status: 'warning' as const,
  },
  {
    id: 3,
    type: 'deployment',
    message: 'api-gateway rolled back from v2.1.0',
    user: 'Mike Johnson',
    timestamp: '12 minutes ago',
    status: 'error' as const,
  },
  {
    id: 4,
    type: 'infrastructure',
    message: 'New database instance provisioned',
    user: 'DevOps Team',
    timestamp: '1 hour ago',
    status: 'success' as const,
  },
];

const chartData = [
  { name: 'Mon', deployments: 12, incidents: 2 },
  { name: 'Tue', deployments: 19, incidents: 1 },
  { name: 'Wed', deployments: 15, incidents: 3 },
  { name: 'Thu', deployments: 22, incidents: 1 },
  { name: 'Fri', deployments: 18, incidents: 0 },
  { name: 'Sat', deployments: 8, incidents: 1 },
  { name: 'Sun', deployments: 5, incidents: 0 },
];

export const Dashboard: React.FC = () => {
  const [showAlerts, setShowAlerts] = React.useState(false);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
          <button
            onClick={() => setShowAlerts(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="View Alerts"
          >
            <Bell className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Weekly Activity
              </h2>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Deployments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500"></div>
                  <span className="text-gray-600 dark:text-gray-400">Incidents</span>
                </div>
              </div>
            </div>
            <Chart data={chartData} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-white font-medium">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    by {activity.user} • {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="System Health"
          status="healthy"
          description="All services running normally"
          icon={CheckCircle}
        />
        <StatusCard
          title="Deployment Queue"
          status="busy"
          description="3 deployments in progress"
          icon={Clock}
        />
        <StatusCard
          title="Performance"
          status="good"
          description="Average response time: 142ms"
          icon={TrendingUp}
        />
      </div>

      <AlertModal isOpen={showAlerts} onClose={() => setShowAlerts(false)} />
    </div>
  );
};