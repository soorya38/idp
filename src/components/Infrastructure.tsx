import React from 'react';
import {
  Server,
  Database,
  Cloud,
  Activity,
  AlertTriangle,
  TrendingUp,
  Cpu,
  HardDrive,
  Zap,
  FileText,
  Eye,
  X,
  Download,
  RefreshCw,
} from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  type: 'server' | 'database' | 'storage' | 'network';
  status: 'healthy' | 'warning' | 'critical' | 'offline';
  provider: string;
  region: string;
  specs: string;
  uptime: string;
  metrics: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
  cost: number;
  pods?: Pod[];
}

interface Pod {
  id: string;
  name: string;
  status: 'running' | 'pending' | 'failed' | 'succeeded';
  restarts: number;
  age: string;
  node: string;
}

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  pod: string;
}

const resources: Resource[] = [
  {
    id: '1',
    name: 'web-server-01',
    type: 'server',
    status: 'healthy',
    provider: 'AWS EC2',
    region: 'us-east-1',
    specs: 't3.large (2 vCPU, 8GB RAM)',
    uptime: '99.98%',
    metrics: { cpu: 45, memory: 62, storage: 35, network: 28 },
    cost: 89.50,
    pods: [
      { id: '1', name: 'web-server-01-pod-1', status: 'running', restarts: 0, age: '2d', node: 'node-1' },
      { id: '2', name: 'web-server-01-pod-2', status: 'running', restarts: 1, age: '1d', node: 'node-2' },
      { id: '3', name: 'web-server-01-pod-3', status: 'running', restarts: 0, age: '6h', node: 'node-1' },
    ],
  },
  {
    id: '2',
    name: 'postgres-primary',
    type: 'database',
    status: 'healthy',
    provider: 'AWS RDS',
    region: 'us-east-1',
    specs: 'db.r5.xlarge (4 vCPU, 32GB RAM)',
    uptime: '99.99%',
    metrics: { cpu: 25, memory: 48, storage: 67, network: 15 },
    cost: 245.00,
    pods: [
      { id: '4', name: 'postgres-primary-pod-1', status: 'running', restarts: 0, age: '7d', node: 'node-3' },
    ],
  },
  {
    id: '3',
    name: 'redis-cache',
    type: 'database',
    status: 'warning',
    provider: 'AWS ElastiCache',
    region: 'us-east-1',
    specs: 'cache.r6g.large (2 vCPU, 12.93GB RAM)',
    uptime: '99.95%',
    metrics: { cpu: 78, memory: 85, storage: 45, network: 42 },
    cost: 156.80,
    pods: [
      { id: '5', name: 'redis-cache-pod-1', status: 'running', restarts: 3, age: '3d', node: 'node-2' },
      { id: '6', name: 'redis-cache-pod-2', status: 'failed', restarts: 5, age: '1h', node: 'node-3' },
    ],
  },
  {
    id: '4',
    name: 'app-storage',
    type: 'storage',
    status: 'healthy',
    provider: 'AWS S3',
    region: 'us-east-1',
    specs: '2.5TB Standard Storage',
    uptime: '100%',
    metrics: { cpu: 0, memory: 0, storage: 72, network: 35 },
    cost: 67.20,
  },
  {
    id: '5',
    name: 'load-balancer',
    type: 'network',
    status: 'healthy',
    provider: 'AWS ALB',
    region: 'us-east-1',
    specs: 'Application Load Balancer',
    uptime: '99.99%',
    metrics: { cpu: 12, memory: 0, storage: 0, network: 65 },
    cost: 32.40,
  },
  {
    id: '6',
    name: 'worker-node-02',
    type: 'server',
    status: 'critical',
    provider: 'AWS EC2',
    region: 'us-west-2',
    specs: 'c5.2xlarge (8 vCPU, 16GB RAM)',
    uptime: '97.2%',
    metrics: { cpu: 95, memory: 92, storage: 88, network: 78 },
    cost: 198.40,
    pods: [
      { id: '7', name: 'worker-node-02-pod-1', status: 'failed', restarts: 10, age: '30m', node: 'node-4' },
      { id: '8', name: 'worker-node-02-pod-2', status: 'pending', restarts: 0, age: '5m', node: 'node-4' },
    ],
  },
];

const mockLogs: LogEntry[] = [
  { timestamp: '2024-01-15 14:45:23', level: 'INFO', message: 'Application started successfully on port 8080', pod: 'web-server-01-pod-1' },
  { timestamp: '2024-01-15 14:45:24', level: 'INFO', message: 'Database connection pool initialized', pod: 'web-server-01-pod-1' },
  { timestamp: '2024-01-15 14:46:15', level: 'INFO', message: 'Health check endpoint responding', pod: 'web-server-01-pod-1' },
  { timestamp: '2024-01-15 14:47:32', level: 'WARN', message: 'High memory usage detected: 85%', pod: 'web-server-01-pod-1' },
  { timestamp: '2024-01-15 14:48:45', level: 'ERROR', message: 'Failed to connect to external service: connection timeout', pod: 'web-server-01-pod-1' },
  { timestamp: '2024-01-15 14:48:46', level: 'INFO', message: 'Retrying connection to external service...', pod: 'web-server-01-pod-1' },
  { timestamp: '2024-01-15 14:48:49', level: 'INFO', message: 'Connection restored successfully', pod: 'web-server-01-pod-1' },
  { timestamp: '2024-01-15 14:50:12', level: 'DEBUG', message: 'Processing request: GET /api/users', pod: 'web-server-01-pod-1' },
  { timestamp: '2024-01-15 14:50:13', level: 'DEBUG', message: 'Query executed in 45ms', pod: 'web-server-01-pod-1' },
  { timestamp: '2024-01-15 14:51:28', level: 'INFO', message: 'Graceful shutdown initiated', pod: 'web-server-01-pod-1' },
];

const getStatusColor = (status: Resource['status']) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'warning':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'critical':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'offline':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  }
};

const getPodStatusColor = (status: Pod['status']) => {
  switch (status) {
    case 'running':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'succeeded':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
  }
};

const getTypeIcon = (type: Resource['type']) => {
  switch (type) {
    case 'server':
      return Server;
    case 'database':
      return Database;
    case 'storage':
      return HardDrive;
    case 'network':
      return Zap;
  }
};

const getMetricColor = (value: number) => {
  if (value > 85) return 'text-red-600 dark:text-red-400';
  if (value > 70) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-green-600 dark:text-green-400';
};

const getLogLevelColor = (level: string) => {
  switch (level) {
    case 'ERROR':
      return 'text-red-400';
    case 'WARN':
      return 'text-yellow-400';
    case 'INFO':
      return 'text-blue-400';
    case 'DEBUG':
      return 'text-gray-400';
    default:
      return 'text-gray-300';
  }
};

export const Infrastructure: React.FC = () => {
  const [selectedResource, setSelectedResource] = React.useState<Resource | null>(null);
  const [selectedPod, setSelectedPod] = React.useState<Pod | null>(null);
  const [showPods, setShowPods] = React.useState(false);
  const [showLogs, setShowLogs] = React.useState(false);
  const [logLevel, setLogLevel] = React.useState('all');
  const [timeRange, setTimeRange] = React.useState('1h');
  const [showProvisionModal, setShowProvisionModal] = React.useState(false);

  const totalCost = resources.reduce((sum, resource) => sum + resource.cost, 0);
  const healthyResources = resources.filter(r => r.status === 'healthy').length;
  const warningResources = resources.filter(r => r.status === 'warning').length;
  const criticalResources = resources.filter(r => r.status === 'critical').length;

  const handleViewPods = (resource: Resource) => {
    setSelectedResource(resource);
    setShowPods(true);
  };

  const handleViewPodLogs = (pod: Pod) => {
    setSelectedPod(pod);
    setShowLogs(true);
  };

  const filteredLogs = mockLogs.filter(log => {
    if (selectedPod && log.pod !== selectedPod.name) return false;
    if (logLevel !== 'all' && log.level !== logLevel) return false;
    return true;
  });

  const handleProvisionResource = () => {
    setShowProvisionModal(true);
  };

  const handleResourceAction = (resource: Resource, action: string) => {
    switch (action) {
      case 'restart':
        if (window.confirm(`Are you sure you want to restart ${resource.name}?`)) {
          alert(`Restarting resource: ${resource.name}`);
        }
        break;
      case 'scale':
        alert(`Opening scaling options for: ${resource.name}`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${resource.name}? This action cannot be undone.`)) {
          alert(`Deleting resource: ${resource.name}`);
        }
        break;
    }
  };

  return (
    <div className="p-6 space-y-6 relative">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Infrastructure
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage your infrastructure resources
          </p>
        </div>
        <button 
          onClick={handleProvisionResource}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Cloud className="w-4 h-4" />
          <span>Provision Resource</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Resources</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {resources.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Server className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Healthy</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                {healthyResources}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Warnings</p>
              <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mt-1">
                {warningResources}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Cost</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                ${totalCost.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Resources Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Resource Overview
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Metrics
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Uptime
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {resources.map((resource) => {
                const Icon = getTypeIcon(resource.type);
                return (
                  <tr key={resource.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {resource.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {resource.specs}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getStatusColor(resource.status)}`}>
                        {resource.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {resource.provider}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {resource.region}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {resource.type !== 'storage' && resource.type !== 'network' && (
                          <div className="flex items-center space-x-2 text-xs">
                            <Cpu className="w-3 h-3" />
                            <span className={getMetricColor(resource.metrics.cpu)}>
                              CPU: {resource.metrics.cpu}%
                            </span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 text-xs">
                          <HardDrive className="w-3 h-3" />
                          <span className={getMetricColor(resource.metrics.storage)}>
                            Storage: {resource.metrics.storage}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {resource.uptime}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        ${resource.cost}/mo
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {resource.pods && resource.pods.length > 0 && (
                          <button
                            onClick={() => handleViewPods(resource)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="View Pods"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
                          </button>
                        )}
                        <button
                          onClick={() => handleResourceAction(resource, 'restart')}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Restart"
                        >
                          <RefreshCw className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Resource Modal */}
      {showProvisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Provision New Resource
              </h2>
              <button
                onClick={() => setShowProvisionModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resource Type
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="server">Server</option>
                  <option value="database">Database</option>
                  <option value="storage">Storage</option>
                  <option value="network">Network</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Provider
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="aws">AWS</option>
                  <option value="gcp">Google Cloud</option>
                  <option value="azure">Azure</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Resource Name
                </label>
                <input
                  type="text"
                  placeholder="my-new-resource"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowProvisionModal(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Resource provisioning started!');
                  setShowProvisionModal(false);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Provision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pods Modal */}
      {showPods && selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-6xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Pods - {selectedResource.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedResource.provider} • {selectedResource.region}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPods(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Pods Table */}
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Pod Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Restarts
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Node
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedResource.pods?.map((pod) => (
                    <tr key={pod.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                            <Server className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {pod.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getPodStatusColor(pod.status)}`}>
                          {pod.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-medium ${pod.restarts > 3 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                          {pod.restarts}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {pod.age}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {pod.node}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewPodLogs(pod)}
                          className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View Logs</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Pod Logs Modal */}
      {showLogs && selectedPod && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-6xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Pod Logs
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedPod.name} • {selectedPod.status}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLogs(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Log Controls */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <select
                  value={logLevel}
                  onChange={(e) => setLogLevel(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="ERROR">ERROR</option>
                  <option value="WARN">WARN</option>
                  <option value="INFO">INFO</option>
                  <option value="DEBUG">DEBUG</option>
                </select>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="1h">Last 1 hour</option>
                  <option value="6h">Last 6 hours</option>
                  <option value="24h">Last 24 hours</option>
                  <option value="7d">Last 7 days</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
                <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Logs Content */}
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-gray-900 dark:bg-gray-950 p-4 font-mono text-sm">
                {filteredLogs.map((log, index) => (
                  <div key={index} className="flex items-start space-x-3 py-1 hover:bg-gray-800 dark:hover:bg-gray-900 px-2 -mx-2">
                    <span className="text-gray-400 whitespace-nowrap text-xs">
                      {log.timestamp}
                    </span>
                    <span className={`font-medium whitespace-nowrap text-xs ${getLogLevelColor(log.level)}`}>
                      [{log.level}]
                    </span>
                    <span className="text-gray-300 dark:text-gray-400 flex-1 text-xs">
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredLogs.length} log entries for {selectedPod.name}
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};