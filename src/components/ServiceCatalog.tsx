import React, { useState } from 'react';
import {
  Package,
  Search,
  Filter,
  Grid,
  List,
  Plus,
  Play,
  Pause,
  Settings,
  Eye,
  Activity,
  Database,
  Globe,
  Zap,
  Shield,
  Bell,
  Users,
  FileText,
  GitBranch,
  Server,
  Cloud,
  Lock,
  Mail,
  BarChart3,
  MessageSquare,
  Calendar,
  Cpu,
  HardDrive,
  Network,
  Code,
  Webhook,
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  version: string;
  description: string;
  status: 'running' | 'stopped' | 'error' | 'deploying';
  health: 'healthy' | 'warning' | 'critical';
  instances: number;
  cpu: number;
  memory: number;
  requests: number;
  uptime: string;
  lastDeployed: string;
  repository: string;
  owner: string;
  category: string;
  icon: React.ComponentType<any>;
  endpoints: string[];
  dependencies: string[];
}

const services: Service[] = [
  {
    id: '1',
    name: 'User Service',
    version: 'v2.4.1',
    description: 'Handles user authentication, profiles, and account management',
    status: 'running',
    health: 'healthy',
    instances: 5,
    cpu: 45,
    memory: 62,
    requests: 15420,
    uptime: '99.98%',
    lastDeployed: '2 hours ago',
    repository: 'github.com/company/user-service',
    owner: 'Backend Team',
    category: 'Core Services',
    icon: Users,
    endpoints: ['/api/v1/users', '/api/v1/auth', '/api/v1/profiles'],
    dependencies: ['postgres-db', 'redis-cache'],
  },
  {
    id: '2',
    name: 'Payment Processor',
    version: 'v1.8.3',
    description: 'Secure payment processing and transaction management',
    status: 'running',
    health: 'healthy',
    instances: 3,
    cpu: 32,
    memory: 48,
    requests: 8934,
    uptime: '99.95%',
    lastDeployed: '1 day ago',
    repository: 'github.com/company/payment-processor',
    owner: 'Finance Team',
    category: 'Business Logic',
    icon: Zap,
    endpoints: ['/api/v1/payments', '/api/v1/transactions', '/api/v1/refunds'],
    dependencies: ['user-service', 'notification-service'],
  },
  {
    id: '3',
    name: 'Notification Service',
    version: 'v1.2.7',
    description: 'Multi-channel notification delivery (email, SMS, push)',
    status: 'running',
    health: 'warning',
    instances: 2,
    cpu: 78,
    memory: 85,
    requests: 12678,
    uptime: '99.92%',
    lastDeployed: '3 hours ago',
    repository: 'github.com/company/notification-service',
    owner: 'Platform Team',
    category: 'Communication',
    icon: Bell,
    endpoints: ['/api/v1/notifications', '/api/v1/templates'],
    dependencies: ['user-service', 'email-provider'],
  },
  {
    id: '4',
    name: 'Analytics Engine',
    version: 'v3.1.2',
    description: 'Real-time data processing and business intelligence',
    status: 'running',
    health: 'healthy',
    instances: 8,
    cpu: 67,
    memory: 73,
    requests: 25340,
    uptime: '99.99%',
    lastDeployed: '5 hours ago',
    repository: 'github.com/company/analytics-engine',
    owner: 'Data Team',
    category: 'Analytics',
    icon: BarChart3,
    endpoints: ['/api/v1/analytics', '/api/v1/metrics', '/api/v1/reports'],
    dependencies: ['clickhouse-db', 'kafka-stream'],
  },
  {
    id: '5',
    name: 'API Gateway',
    version: 'v2.0.5',
    description: 'Request routing, rate limiting, and API management',
    status: 'running',
    health: 'healthy',
    instances: 4,
    cpu: 23,
    memory: 34,
    requests: 89234,
    uptime: '99.97%',
    lastDeployed: '6 hours ago',
    repository: 'github.com/company/api-gateway',
    owner: 'Platform Team',
    category: 'Infrastructure',
    icon: Globe,
    endpoints: ['/health', '/metrics', '/admin'],
    dependencies: ['all-services'],
  },
  {
    id: '6',
    name: 'File Storage Service',
    version: 'v1.5.9',
    description: 'Secure file upload, storage, and content delivery',
    status: 'running',
    health: 'healthy',
    instances: 3,
    cpu: 18,
    memory: 29,
    requests: 5678,
    uptime: '99.94%',
    lastDeployed: '1 day ago',
    repository: 'github.com/company/file-storage',
    owner: 'Platform Team',
    category: 'Storage',
    icon: HardDrive,
    endpoints: ['/api/v1/files', '/api/v1/upload', '/api/v1/download'],
    dependencies: ['s3-bucket', 'cdn'],
  },
  {
    id: '7',
    name: 'Search Service',
    version: 'v2.3.1',
    description: 'Full-text search and indexing across all content',
    status: 'running',
    health: 'healthy',
    instances: 6,
    cpu: 56,
    memory: 68,
    requests: 18945,
    uptime: '99.91%',
    lastDeployed: '8 hours ago',
    repository: 'github.com/company/search-service',
    owner: 'Backend Team',
    category: 'Search',
    icon: Search,
    endpoints: ['/api/v1/search', '/api/v1/index', '/api/v1/suggest'],
    dependencies: ['elasticsearch', 'user-service'],
  },
  {
    id: '8',
    name: 'Audit Service',
    version: 'v1.1.4',
    description: 'Security auditing and compliance logging',
    status: 'running',
    health: 'healthy',
    instances: 2,
    cpu: 12,
    memory: 25,
    requests: 3456,
    uptime: '99.98%',
    lastDeployed: '2 days ago',
    repository: 'github.com/company/audit-service',
    owner: 'Security Team',
    category: 'Security',
    icon: Shield,
    endpoints: ['/api/v1/audit', '/api/v1/logs'],
    dependencies: ['postgres-db'],
  },
  {
    id: '9',
    name: 'Recommendation Engine',
    version: 'v1.7.2',
    description: 'ML-powered personalized recommendations',
    status: 'deploying',
    health: 'healthy',
    instances: 4,
    cpu: 89,
    memory: 92,
    requests: 7823,
    uptime: '99.85%',
    lastDeployed: '30 minutes ago',
    repository: 'github.com/company/recommendation-engine',
    owner: 'ML Team',
    category: 'Machine Learning',
    icon: Cpu,
    endpoints: ['/api/v1/recommendations', '/api/v1/models'],
    dependencies: ['user-service', 'analytics-engine'],
  },
  {
    id: '10',
    name: 'Chat Service',
    version: 'v1.4.6',
    description: 'Real-time messaging and chat functionality',
    status: 'running',
    health: 'healthy',
    instances: 5,
    cpu: 41,
    memory: 55,
    requests: 12456,
    uptime: '99.93%',
    lastDeployed: '4 hours ago',
    repository: 'github.com/company/chat-service',
    owner: 'Frontend Team',
    category: 'Communication',
    icon: MessageSquare,
    endpoints: ['/api/v1/chat', '/api/v1/rooms', '/ws/chat'],
    dependencies: ['user-service', 'redis-cache'],
  },
  {
    id: '11',
    name: 'Scheduler Service',
    version: 'v2.1.8',
    description: 'Job scheduling and background task management',
    status: 'running',
    health: 'warning',
    instances: 3,
    cpu: 34,
    memory: 47,
    requests: 2134,
    uptime: '99.89%',
    lastDeployed: '12 hours ago',
    repository: 'github.com/company/scheduler-service',
    owner: 'Platform Team',
    category: 'Infrastructure',
    icon: Calendar,
    endpoints: ['/api/v1/jobs', '/api/v1/schedule'],
    dependencies: ['redis-queue'],
  },
  {
    id: '12',
    name: 'Webhook Service',
    version: 'v1.3.5',
    description: 'Webhook delivery and event streaming',
    status: 'error',
    health: 'critical',
    instances: 0,
    cpu: 0,
    memory: 0,
    requests: 0,
    uptime: '97.2%',
    lastDeployed: '2 days ago',
    repository: 'github.com/company/webhook-service',
    owner: 'Integration Team',
    category: 'Integration',
    icon: Webhook,
    endpoints: ['/api/v1/webhooks', '/api/v1/events'],
    dependencies: ['kafka-stream'],
  },
];

const getStatusColor = (status: Service['status']) => {
  switch (status) {
    case 'running':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'stopped':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'deploying':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
  }
};

const getHealthColor = (health: Service['health']) => {
  switch (health) {
    case 'healthy':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'critical':
      return 'bg-red-500';
  }
};

export function ServiceCatalog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [...new Set(services.map(service => service.category))];

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || service.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || service.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleServiceAction = (service: Service, action: string) => {
    switch (action) {
      case 'start':
        alert(`Starting service: ${service.name}`);
        break;
      case 'stop':
        alert(`Stopping service: ${service.name}`);
        break;
      case 'restart':
        alert(`Restarting service: ${service.name}`);
        break;
      case 'deploy':
        alert(`Deploying service: ${service.name}`);
        break;
      case 'view':
        alert(`Viewing details for: ${service.name}`);
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Service Catalog
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor all your microservices
          </p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Deploy Service</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Services</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {services.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Running</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                {services.filter(s => s.status === 'running').length}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Healthy</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                {services.filter(s => s.health === 'healthy').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {services.reduce((sum, s) => sum + s.requests, 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
            <option value="error">Error</option>
            <option value="deploying">Deploying</option>
          </select>
        </div>
        <div className="flex border border-gray-300 dark:border-gray-600">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} border-r border-gray-300 dark:border-gray-600`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Services Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                {/* Service Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {service.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {service.version}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 ${getHealthColor(service.health)}`}></div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {service.description}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">CPU</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.cpu}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Memory</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.memory}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Instances</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.instances}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Uptime</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {service.uptime}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    {service.status === 'running' ? (
                      <button
                        onClick={() => handleServiceAction(service, 'stop')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Pause className="w-4 h-4 text-red-500" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleServiceAction(service, 'start')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Play className="w-4 h-4 text-green-500" />
                      </button>
                    )}
                    <button
                      onClick={() => handleServiceAction(service, 'view')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleServiceAction(service, 'deploy')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {service.lastDeployed}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Health
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Instances
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    CPU/Memory
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Requests
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredServices.map((service) => {
                  const Icon = service.icon;
                  return (
                    <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                            <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {service.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {service.version} • {service.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getStatusColor(service.status)}`}>
                          {service.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 ${getHealthColor(service.health)}`}></div>
                          <span className="text-sm text-gray-900 dark:text-white capitalize">
                            {service.health}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {service.instances}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {service.cpu}% / {service.memory}%
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {service.requests.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {service.status === 'running' ? (
                            <button
                              onClick={() => handleServiceAction(service, 'stop')}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Pause className="w-4 h-4 text-red-500" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleServiceAction(service, 'start')}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                              <Play className="w-4 h-4 text-green-500" />
                            </button>
                          )}
                          <button
                            onClick={() => handleServiceAction(service, 'view')}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-500" />
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
      )}
    </div>
  );
}