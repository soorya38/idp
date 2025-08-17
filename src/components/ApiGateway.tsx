import React, { useState } from 'react';
import {
  Globe,
  Shield,
  Zap,
  Activity,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  BarChart3,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
} from 'lucide-react';

interface Route {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  service: string;
  upstream: string;
  status: 'active' | 'inactive' | 'error';
  rateLimit: number;
  timeout: number;
  retries: number;
  authentication: boolean;
  caching: boolean;
  lastModified: string;
  requestCount: number;
  avgResponseTime: number;
  errorRate: number;
}

interface RateLimitRule {
  id: string;
  name: string;
  path: string;
  limit: number;
  window: string;
  status: 'active' | 'inactive';
  createdAt: string;
  hitCount: number;
}

interface SecurityPolicy {
  id: string;
  name: string;
  type: 'cors' | 'jwt' | 'api_key' | 'oauth' | 'ip_whitelist';
  status: 'active' | 'inactive';
  config: Record<string, any>;
  appliedRoutes: number;
  createdAt: string;
}

interface Documentation {
  id: string;
  title: string;
  type: 'markdown' | 'mermaid' | 'swagger';
  content: string;
  service: string;
  lastUpdated: string;
}

const routes: Route[] = [
  {
    id: '1',
    path: '/api/v1/users',
    method: 'GET',
    service: 'user-service',
    upstream: 'http://user-service:3000',
    status: 'active',
    rateLimit: 1000,
    timeout: 30,
    retries: 3,
    authentication: true,
    caching: true,
    lastModified: '2 hours ago',
    requestCount: 15420,
    avgResponseTime: 145,
    errorRate: 0.2,
  },
  {
    id: '2',
    path: '/api/v1/auth/login',
    method: 'POST',
    service: 'auth-service',
    upstream: 'http://auth-service:3001',
    status: 'active',
    rateLimit: 100,
    timeout: 10,
    retries: 1,
    authentication: false,
    caching: false,
    lastModified: '1 day ago',
    requestCount: 8934,
    avgResponseTime: 89,
    errorRate: 1.2,
  },
  {
    id: '3',
    path: '/api/v1/payments',
    method: 'POST',
    service: 'payment-processor',
    upstream: 'http://payment-service:3002',
    status: 'active',
    rateLimit: 500,
    timeout: 60,
    retries: 2,
    authentication: true,
    caching: false,
    lastModified: '3 hours ago',
    requestCount: 3245,
    avgResponseTime: 234,
    errorRate: 0.8,
  },
  {
    id: '4',
    path: '/api/v1/analytics',
    method: 'GET',
    service: 'analytics-engine',
    upstream: 'http://analytics-service:3003',
    status: 'error',
    rateLimit: 2000,
    timeout: 45,
    retries: 3,
    authentication: true,
    caching: true,
    lastModified: '5 hours ago',
    requestCount: 12678,
    avgResponseTime: 567,
    errorRate: 5.4,
  },
  {
    id: '5',
    path: '/api/v1/notifications',
    method: 'POST',
    service: 'notification-service',
    upstream: 'http://notification-service:3004',
    status: 'inactive',
    rateLimit: 200,
    timeout: 15,
    retries: 2,
    authentication: true,
    caching: false,
    lastModified: '1 week ago',
    requestCount: 0,
    avgResponseTime: 0,
    errorRate: 0,
  },
  {
    id: '6',
    path: '/api/v1/users/{id}',
    method: 'PUT',
    service: 'user-service',
    upstream: 'http://user-service:3000',
    status: 'active',
    rateLimit: 500,
    timeout: 30,
    retries: 3,
    authentication: true,
    caching: false,
    lastModified: '1 hour ago',
    requestCount: 2340,
    avgResponseTime: 178,
    errorRate: 0.5,
  },
  {
    id: '7',
    path: '/api/v1/payments/{id}/status',
    method: 'GET',
    service: 'payment-processor',
    upstream: 'http://payment-service:3002',
    status: 'active',
    rateLimit: 1000,
    timeout: 20,
    retries: 2,
    authentication: true,
    caching: true,
    lastModified: '4 hours ago',
    requestCount: 5678,
    avgResponseTime: 123,
    errorRate: 0.3,
  },
];

const rateLimitRules: RateLimitRule[] = [
  {
    id: '1',
    name: 'Auth Rate Limit',
    path: '/api/v1/auth/*',
    limit: 100,
    window: '1h',
    status: 'active',
    createdAt: '2024-01-10',
    hitCount: 8934,
  },
  {
    id: '2',
    name: 'API General Limit',
    path: '/api/v1/*',
    limit: 1000,
    window: '1h',
    status: 'active',
    createdAt: '2024-01-08',
    hitCount: 45230,
  },
  {
    id: '3',
    name: 'Payment Strict Limit',
    path: '/api/v1/payments/*',
    limit: 50,
    window: '10m',
    status: 'active',
    createdAt: '2024-01-12',
    hitCount: 3245,
  },
];

const securityPolicies: SecurityPolicy[] = [
  {
    id: '1',
    name: 'CORS Policy',
    type: 'cors',
    status: 'active',
    config: {
      allowedOrigins: ['https://app.company.com', 'https://admin.company.com'],
      allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    },
    appliedRoutes: 12,
    createdAt: '2024-01-05',
  },
  {
    id: '2',
    name: 'JWT Authentication',
    type: 'jwt',
    status: 'active',
    config: {
      secret: '***hidden***',
      algorithm: 'HS256',
      expiresIn: '24h',
    },
    appliedRoutes: 8,
    createdAt: '2024-01-06',
  },
  {
    id: '3',
    name: 'API Key Validation',
    type: 'api_key',
    status: 'active',
    config: {
      headerName: 'X-API-Key',
      required: true,
    },
    appliedRoutes: 5,
    createdAt: '2024-01-07',
  },
];

const documentation: Documentation[] = [
  {
    id: '1',
    title: 'User Service API',
    type: 'swagger',
    service: 'user-service',
    lastUpdated: '2024-01-15',
    content: `{
  "openapi": "3.0.0",
  "info": {
    "title": "User Service API",
    "version": "2.4.1",
    "description": "API for user management and authentication"
  },
  "paths": {
    "/api/v1/users": {
      "get": {
        "summary": "Get all users",
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "schema": { "type": "integer", "default": 1 }
          },
          {
            "name": "limit",
            "in": "query",
            "schema": { "type": "integer", "default": 10 }
          }
        ],
        "responses": {
          "200": {
            "description": "List of users",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "users": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/User" }
                    },
                    "total": { "type": "integer" },
                    "page": { "type": "integer" },
                    "limit": { "type": "integer" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/api/v1/users/{id}": {
      "put": {
        "summary": "Update user",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string", "format": "uuid" }
          }
        ],
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/UserUpdate" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Updated user",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/User" }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id": { "type": "string", "format": "uuid" },
          "email": { "type": "string", "format": "email" },
          "firstName": { "type": "string" },
          "lastName": { "type": "string" },
          "createdAt": { "type": "string", "format": "date-time" }
        }
      },
      "UserUpdate": {
        "type": "object",
        "properties": {
          "firstName": { "type": "string" },
          "lastName": { "type": "string" }
        }
      }
    }
  }
}`,
  },
  {
    id: '2',
    title: 'Payment Flow Architecture',
    type: 'mermaid',
    service: 'payment-processor',
    lastUpdated: '2024-01-14',
    content: `graph TD
    A[Client Request] --> B[API Gateway]
    B --> C[Authentication Service]
    C --> D[Payment Processor]
    D --> E[Payment Provider]
    E --> F[Bank/Card Network]
    
    D --> G[Database]
    D --> H[Notification Service]
    H --> I[Email/SMS]
    
    J[Webhook] --> D
    D --> K[Analytics Engine]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style D fill:#e8f5e8
    style E fill:#fff3e0
    style F fill:#ffebee`,
  },
  {
    id: '3',
    title: 'Analytics Service Overview',
    type: 'markdown',
    service: 'analytics-engine',
    lastUpdated: '2024-01-13',
    content: `# Analytics Engine Service

## Overview
The Analytics Engine processes real-time data streams and provides insights for business intelligence.

## Features
- **Real-time Processing**: Stream processing with Apache Kafka
- **Data Aggregation**: Time-series data aggregation and rollups
- **Custom Metrics**: User-defined metrics and KPIs
- **Alerting**: Threshold-based alerting system

## Architecture
The service is built using:
- **Apache Kafka** for stream processing
- **ClickHouse** for time-series data storage
- **Redis** for caching frequently accessed data
- **Grafana** for visualization

## API Endpoints

### GET /api/v1/analytics/metrics
Returns aggregated metrics for a given time range.

**Parameters:**
- \`start\`: Start timestamp (ISO 8601)
- \`end\`: End timestamp (ISO 8601)
- \`granularity\`: Data granularity (hour, day, week)

**Response:**
\`\`\`json
{
  "metrics": [
    {
      "timestamp": "2024-01-15T10:00:00Z",
      "value": 1234,
      "metric": "page_views"
    }
  ]
}
\`\`\`

## Configuration
Environment variables:
- \`KAFKA_BROKERS\`: Kafka broker endpoints
- \`CLICKHOUSE_URL\`: ClickHouse database URL
- \`REDIS_URL\`: Redis cache URL

## Monitoring
The service exposes Prometheus metrics at \`/metrics\` endpoint.`,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'inactive':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    case 'error':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  }
};

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'POST':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'PUT':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'DELETE':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'PATCH':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  }
};

const getSecurityTypeIcon = (type: SecurityPolicy['type']) => {
  switch (type) {
    case 'cors':
      return Globe;
    case 'jwt':
    case 'oauth':
      return Shield;
    case 'api_key':
      return Eye;
    case 'ip_whitelist':
      return Filter;
    default:
      return Shield;
  }
};

export const ApiGateway: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'routes' | 'rate-limits' | 'security' | 'documentation'>('routes');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [collapsedServices, setCollapsedServices] = useState<Set<string>>(new Set());
  const [selectedDoc, setSelectedDoc] = useState<Documentation | null>(null);
  const [showAddRoute, setShowAddRoute] = useState(false);
  const [showAddRateLimit, setShowAddRateLimit] = useState(false);
  const [showAddSecurity, setShowAddSecurity] = useState(false);
  const [showAddDoc, setShowAddDoc] = useState(false);

  const filteredRoutes = routes.filter((route) => {
    const matchesSearch = route.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         route.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || route.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Group routes by service
  const routesByService = filteredRoutes.reduce((acc, route) => {
    if (!acc[route.service]) {
      acc[route.service] = [];
    }
    acc[route.service].push(route);
    return acc;
  }, {} as Record<string, Route[]>);

  const totalRequests = routes.reduce((sum, route) => sum + route.requestCount, 0);
  const avgResponseTime = routes.reduce((sum, route) => sum + route.avgResponseTime, 0) / routes.length;
  const avgErrorRate = routes.reduce((sum, route) => sum + route.errorRate, 0) / routes.length;

  const toggleServiceCollapse = (service: string) => {
    const newCollapsed = new Set(collapsedServices);
    if (newCollapsed.has(service)) {
      newCollapsed.delete(service);
    } else {
      newCollapsed.add(service);
    }
    setCollapsedServices(newCollapsed);
  };

  const handleAddRoute = () => {
    setShowAddRoute(true);
  };

  const handleAddRateLimit = () => {
    setShowAddRateLimit(true);
  };

  const handleAddSecurity = () => {
    setShowAddSecurity(true);
  };

  const handleAddDocumentation = () => {
    setShowAddDoc(true);
  };

  const handleRouteAction = (route: Route, action: string) => {
    switch (action) {
      case 'edit':
        alert(`Editing route: ${route.path}`);
        break;
      case 'view':
        alert(`Viewing details for: ${route.path}`);
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete route ${route.path}?`)) {
          alert(`Deleting route: ${route.path}`);
        }
        break;
    }
  };

  const renderDocumentation = (doc: Documentation) => {
    if (doc.type === 'swagger') {
      try {
        const spec = JSON.parse(doc.content);
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                {spec.info.title} v{spec.info.version}
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                {spec.info.description}
              </p>
            </div>
            <div className="space-y-4">
              {Object.entries(spec.paths).map(([path, methods]: [string, any]) => (
                <div key={path} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <h4 className="font-mono text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    {path}
                  </h4>
                  {Object.entries(methods).map(([method, details]: [string, any]) => (
                    <div key={method} className="mb-4 last:mb-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getMethodColor(method.toUpperCase())}`}>
                          {method.toUpperCase()}
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {details.summary}
                        </span>
                      </div>
                      {details.parameters && (
                        <div className="ml-4 text-sm text-gray-600 dark:text-gray-400">
                          <strong>Parameters:</strong>
                          <ul className="list-disc list-inside ml-2">
                            {details.parameters.map((param: any, idx: number) => (
                              <li key={idx}>
                                <code>{param.name}</code> ({param.in}) - {param.schema?.type}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      } catch (e) {
        return <div className="text-red-500">Invalid Swagger specification</div>;
      }
    } else if (doc.type === 'mermaid') {
      return (
        <div className="space-y-4">
          <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
              {doc.title}
            </h3>
            <p className="text-purple-700 dark:text-purple-300 mt-1">
              Architecture diagram for {doc.service}
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {doc.content}
            </pre>
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                💡 This Mermaid diagram would be rendered as an interactive flowchart in a full implementation.
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      // Markdown
      return (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
              {doc.title}
            </h3>
            <p className="text-green-700 dark:text-green-300 mt-1">
              Documentation for {doc.service}
            </p>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {doc.content}
            </pre>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            API Gateway
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage API routes, rate limiting, and security policies
          </p>
        </div>
        <button 
          onClick={handleAddRoute}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Route</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Routes</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {routes.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Requests</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {totalRequests.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {Math.round(avgResponseTime)}ms
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Error Rate</p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
                {avgErrorRate.toFixed(1)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'routes', label: 'Routes', icon: Globe },
            { id: 'rate-limits', label: 'Rate Limits', icon: Zap },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'documentation', label: 'Documentation', icon: FileText },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Routes Tab */}
      {activeTab === 'routes' && (
        <div className="space-y-6">
          {/* Search and Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="error">Error</option>
            </select>
          </div>

          {/* Routes Grouped by Service */}
          <div className="space-y-4">
            {Object.entries(routesByService).map(([service, serviceRoutes]) => (
              <div key={service} className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                {/* Service Header */}
                <div 
                  className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/30"
                  onClick={() => toggleServiceCollapse(service)}
                >
                  <div className="flex items-center space-x-3">
                    {collapsedServices.has(service) ? (
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {service}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {serviceRoutes.length} routes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {serviceRoutes.reduce((sum, route) => sum + route.requestCount, 0).toLocaleString()} requests
                    </div>
                    <div className="flex items-center space-x-1">
                      {serviceRoutes.filter(r => r.status === 'active').length > 0 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                      {serviceRoutes.filter(r => r.status === 'error').length > 0 && (
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      )}
                      {serviceRoutes.filter(r => r.status === 'inactive').length > 0 && (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Service Routes */}
                {!collapsedServices.has(service) && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Route
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Requests
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Response Time
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Error Rate
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {serviceRoutes.map((route) => (
                          <tr key={route.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMethodColor(route.method)}`}>
                                  {route.method}
                                </span>
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                                    {route.path}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {route.upstream}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(route.status)}`}>
                                {route.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-900 dark:text-white">
                                {route.requestCount.toLocaleString()}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm text-gray-900 dark:text-white">
                                {route.avgResponseTime}ms
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`text-sm font-medium ${
                                route.errorRate > 2 ? 'text-red-600 dark:text-red-400' :
                                route.errorRate > 1 ? 'text-yellow-600 dark:text-yellow-400' :
                                'text-green-600 dark:text-green-400'
                              }`}>
                                {route.errorRate}%
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button 
                                  onClick={() => handleRouteAction(route, 'edit')}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <Edit className="w-4 h-4 text-gray-500" />
                                </button>
                                <button 
                                  onClick={() => handleRouteAction(route, 'view')}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <Eye className="w-4 h-4 text-gray-500" />
                                </button>
                                <button 
                                  onClick={() => handleRouteAction(route, 'delete')}
                                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rate Limits Tab */}
      {activeTab === 'rate-limits' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Rate Limit Rules
            </h2>
            <button 
              onClick={handleAddRateLimit}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Rule</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {rateLimitRules.map((rule) => (
              <div
                key={rule.id}
                className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {rule.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}>
                        {rule.status}
                      </span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Settings className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Path Pattern
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {rule.path}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Limit
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {rule.limit} requests
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Window
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {rule.window}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Current Usage
                    </p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2"
                          style={{ width: `${Math.min((rule.hitCount / rule.limit) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {rule.hitCount}/{rule.limit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Security Policies
            </h2>
            <button 
              onClick={handleAddSecurity}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Policy</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {securityPolicies.map((policy) => {
              const Icon = getSecurityTypeIcon(policy.type);
              return (
                <div
                  key={policy.id}
                  className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {policy.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {policy.type.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                        {policy.status}
                      </span>
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <Settings className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Applied Routes
                      </p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {policy.appliedRoutes} routes
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Configuration
                      </p>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 mt-1">
                        <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                          {JSON.stringify(policy.config, null, 2)}
                        </pre>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Created: {policy.createdAt}</span>
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                          Edit
                        </button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300">
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === 'documentation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              API Documentation
            </h2>
            <button 
              onClick={handleAddDocumentation}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Documentation</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Documentation List */}
            <div className="space-y-4">
              {documentation.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 border cursor-pointer transition-colors ${
                    selectedDoc?.id === doc.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      doc.type === 'swagger' ? 'bg-green-100 dark:bg-green-900/20' :
                      doc.type === 'mermaid' ? 'bg-purple-100 dark:bg-purple-900/20' :
                      'bg-blue-100 dark:bg-blue-900/20'
                    }`}>
                      <FileText className={`w-4 h-4 ${
                        doc.type === 'swagger' ? 'text-green-600 dark:text-green-400' :
                        doc.type === 'mermaid' ? 'text-purple-600 dark:text-purple-400' :
                        'text-blue-600 dark:text-blue-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {doc.service}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs ${
                      doc.type === 'swagger' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      doc.type === 'mermaid' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                    }`}>
                      {doc.type}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {doc.lastUpdated}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Documentation Content */}
            <div className="lg:col-span-2">
              {selectedDoc ? (
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  {renderDocumentation(selectedDoc)}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Select Documentation
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Choose a documentation item from the list to view its content
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {showAddRoute && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Add New Route
              </h2>
              <button
                onClick={() => setShowAddRoute(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Path
                </label>
                <input
                  type="text"
                  placeholder="/api/v1/example"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Method
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upstream URL
                </label>
                <input
                  type="text"
                  placeholder="http://service:3000"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowAddRoute(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Route added successfully!');
                  setShowAddRoute(false);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Add Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};