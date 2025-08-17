import React, { useState } from 'react';
import {
  GitBranch,
  Play,
  Pause,
  Square,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Settings,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Download,
  FileText,
  GitCommit,
  User,
  Calendar,
  Timer,
  X,
  Edit,
  Trash2,
  Copy,
} from 'lucide-react';

interface Pipeline {
  id: string;
  name: string;
  description: string;
  repository: string;
  branch: string;
  status: 'idle' | 'running' | 'success' | 'failed' | 'cancelled';
  lastRun: string;
  duration: string;
  author: string;
  trigger: 'manual' | 'push' | 'schedule' | 'webhook';
  environment: string;
  stages: PipelineStage[];
  runs: PipelineRun[];
}

interface PipelineStage {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped';
  duration?: string;
  order: number;
}

interface PipelineRun {
  id: string;
  number: number;
  status: 'running' | 'success' | 'failed' | 'cancelled';
  startedAt: string;
  duration: string;
  commit: string;
  author: string;
  message: string;
}

const pipelines: Pipeline[] = [
  {
    id: '1',
    name: 'user-service-ci',
    description: 'CI/CD pipeline for user service',
    repository: 'github.com/company/user-service',
    branch: 'main',
    status: 'success',
    lastRun: '2 hours ago',
    duration: '4m 32s',
    author: 'Sarah Chen',
    trigger: 'push',
    environment: 'production',
    stages: [
      { id: '1', name: 'Build', status: 'success', duration: '1m 23s', order: 1 },
      { id: '2', name: 'Test', status: 'success', duration: '2m 15s', order: 2 },
      { id: '3', name: 'Security Scan', status: 'success', duration: '45s', order: 3 },
      { id: '4', name: 'Deploy', status: 'success', duration: '1m 9s', order: 4 },
    ],
    runs: [
      { id: '1', number: 247, status: 'success', startedAt: '2 hours ago', duration: '4m 32s', commit: 'a1b2c3d', author: 'Sarah Chen', message: 'Add user authentication middleware' },
      { id: '2', number: 246, status: 'success', startedAt: '1 day ago', duration: '4m 18s', commit: 'b2c3d4e', author: 'Mike Johnson', message: 'Fix memory leak in data processing' },
      { id: '3', number: 245, status: 'failed', startedAt: '2 days ago', duration: '2m 45s', commit: 'c3d4e5f', author: 'Emily Rodriguez', message: 'Update API documentation' },
    ],
  },
  {
    id: '2',
    name: 'api-gateway-deploy',
    description: 'Deployment pipeline for API gateway',
    repository: 'github.com/company/api-gateway',
    branch: 'develop',
    status: 'running',
    lastRun: '5 minutes ago',
    duration: '2m 15s',
    author: 'Platform Team',
    trigger: 'manual',
    environment: 'staging',
    stages: [
      { id: '1', name: 'Build', status: 'success', duration: '1m 5s', order: 1 },
      { id: '2', name: 'Test', status: 'running', order: 2 },
      { id: '3', name: 'Deploy', status: 'pending', order: 3 },
    ],
    runs: [
      { id: '1', number: 89, status: 'running', startedAt: '5 minutes ago', duration: '2m 15s', commit: 'd4e5f6g', author: 'Platform Team', message: 'Implement rate limiting' },
      { id: '2', number: 88, status: 'success', startedAt: '6 hours ago', duration: '3m 42s', commit: 'e5f6g7h', author: 'Alex Thompson', message: 'Update routing configuration' },
    ],
  },
  {
    id: '3',
    name: 'payment-processor-test',
    description: 'Testing pipeline for payment processor',
    repository: 'github.com/company/payment-processor',
    branch: 'feature/stripe-integration',
    status: 'failed',
    lastRun: '1 hour ago',
    duration: '6m 23s',
    author: 'Finance Team',
    trigger: 'push',
    environment: 'development',
    stages: [
      { id: '1', name: 'Build', status: 'success', duration: '1m 45s', order: 1 },
      { id: '2', name: 'Unit Tests', status: 'success', duration: '2m 30s', order: 2 },
      { id: '3', name: 'Integration Tests', status: 'failed', duration: '2m 8s', order: 3 },
      { id: '4', name: 'Deploy', status: 'skipped', order: 4 },
    ],
    runs: [
      { id: '1', number: 156, status: 'failed', startedAt: '1 hour ago', duration: '6m 23s', commit: 'f6g7h8i', author: 'Finance Team', message: 'Add Stripe payment integration' },
      { id: '2', number: 155, status: 'success', startedAt: '1 day ago', duration: '5m 12s', commit: 'g7h8i9j', author: 'David Brown', message: 'Update payment validation logic' },
    ],
  },
  {
    id: '4',
    name: 'analytics-engine-build',
    description: 'Build and test pipeline for analytics engine',
    repository: 'github.com/company/analytics-engine',
    branch: 'main',
    status: 'idle',
    lastRun: '3 days ago',
    duration: '8m 45s',
    author: 'Data Team',
    trigger: 'schedule',
    environment: 'production',
    stages: [
      { id: '1', name: 'Build', status: 'success', duration: '2m 15s', order: 1 },
      { id: '2', name: 'Test', status: 'success', duration: '3m 30s', order: 2 },
      { id: '3', name: 'Performance Tests', status: 'success', duration: '2m 45s', order: 3 },
      { id: '4', name: 'Deploy', status: 'success', duration: '15s', order: 4 },
    ],
    runs: [
      { id: '1', number: 342, status: 'success', startedAt: '3 days ago', duration: '8m 45s', commit: 'h8i9j0k', author: 'Data Team', message: 'Optimize query performance' },
    ],
  },
  {
    id: '5',
    name: 'notification-service-ci',
    description: 'CI pipeline for notification service',
    repository: 'github.com/company/notification-service',
    branch: 'hotfix/email-templates',
    status: 'cancelled',
    lastRun: '30 minutes ago',
    duration: '1m 23s',
    author: 'Backend Team',
    trigger: 'push',
    environment: 'staging',
    stages: [
      { id: '1', name: 'Build', status: 'success', duration: '45s', order: 1 },
      { id: '2', name: 'Test', status: 'cancelled', duration: '38s', order: 2 },
      { id: '3', name: 'Deploy', status: 'skipped', order: 3 },
    ],
    runs: [
      { id: '1', number: 78, status: 'cancelled', startedAt: '30 minutes ago', duration: '1m 23s', commit: 'i9j0k1l', author: 'Backend Team', message: 'Fix email template rendering' },
      { id: '2', number: 77, status: 'success', startedAt: '2 hours ago', duration: '3m 15s', commit: 'j0k1l2m', author: 'Lisa Wang', message: 'Add SMS notification support' },
    ],
  },
];

const getStatusColor = (status: Pipeline['status'] | PipelineStage['status'] | PipelineRun['status']) => {
  switch (status) {
    case 'success':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'running':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    case 'idle':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'skipped':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  }
};

const getStatusIcon = (status: Pipeline['status'] | PipelineStage['status'] | PipelineRun['status']) => {
  switch (status) {
    case 'success':
      return <CheckCircle className="w-4 h-4" />;
    case 'running':
      return <Clock className="w-4 h-4 animate-spin" />;
    case 'failed':
      return <XCircle className="w-4 h-4" />;
    case 'cancelled':
      return <Square className="w-4 h-4" />;
    case 'idle':
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'skipped':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getTriggerIcon = (trigger: Pipeline['trigger']) => {
  switch (trigger) {
    case 'push':
      return <GitCommit className="w-4 h-4" />;
    case 'manual':
      return <User className="w-4 h-4" />;
    case 'schedule':
      return <Calendar className="w-4 h-4" />;
    case 'webhook':
      return <GitBranch className="w-4 h-4" />;
  }
};

export const Pipelines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterEnvironment, setFilterEnvironment] = useState<string>('all');
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [showPipelineDetails, setShowPipelineDetails] = useState(false);
  const [showRunHistory, setShowRunHistory] = useState(false);
  const [showNewPipeline, setShowNewPipeline] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [selectedRun, setSelectedRun] = useState<PipelineRun | null>(null);

  const filteredPipelines = pipelines.filter((pipeline) => {
    const matchesSearch = pipeline.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pipeline.repository.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pipeline.status === filterStatus;
    const matchesEnvironment = filterEnvironment === 'all' || pipeline.environment === filterEnvironment;
    return matchesSearch && matchesStatus && matchesEnvironment;
  });

  const environments = [...new Set(pipelines.map(p => p.environment))];

  const handleRunPipeline = (pipeline: Pipeline) => {
    if (window.confirm(`Are you sure you want to run pipeline: ${pipeline.name}?`)) {
      alert(`Running pipeline: ${pipeline.name}`);
    }
  };

  const handleStopPipeline = (pipeline: Pipeline) => {
    if (window.confirm(`Are you sure you want to stop pipeline: ${pipeline.name}?`)) {
      alert(`Stopping pipeline: ${pipeline.name}`);
    }
  };

  const handleViewDetails = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setShowPipelineDetails(true);
  };

  const handleViewHistory = (pipeline: Pipeline) => {
    setSelectedPipeline(pipeline);
    setShowRunHistory(true);
  };

  const handleViewLogs = (run: PipelineRun) => {
    setSelectedRun(run);
    setShowLogs(true);
  };

  const handleDeletePipeline = (pipeline: Pipeline) => {
    if (window.confirm(`Are you sure you want to delete pipeline: ${pipeline.name}?`)) {
      alert(`Deleting pipeline: ${pipeline.name}`);
    }
  };

  const mockLogs = [
    { timestamp: '2024-01-15 14:32:15', level: 'INFO', message: 'Pipeline started' },
    { timestamp: '2024-01-15 14:32:16', level: 'INFO', message: 'Checking out code from repository' },
    { timestamp: '2024-01-15 14:32:18', level: 'INFO', message: 'Installing dependencies...' },
    { timestamp: '2024-01-15 14:33:45', level: 'INFO', message: 'Dependencies installed successfully' },
    { timestamp: '2024-01-15 14:33:46', level: 'INFO', message: 'Starting build process' },
    { timestamp: '2024-01-15 14:34:12', level: 'INFO', message: 'Build completed successfully' },
    { timestamp: '2024-01-15 14:34:13', level: 'INFO', message: 'Running tests...' },
    { timestamp: '2024-01-15 14:35:28', level: 'INFO', message: 'All tests passed' },
    { timestamp: '2024-01-15 14:35:29', level: 'INFO', message: 'Starting deployment' },
    { timestamp: '2024-01-15 14:36:47', level: 'INFO', message: 'Deployment completed successfully' },
  ];

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            CI/CD Pipelines
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor your continuous integration and deployment pipelines
          </p>
        </div>
        <button 
          onClick={() => setShowNewPipeline(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Pipeline</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Pipelines</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {pipelines.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <GitBranch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Running</p>
              <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400 mt-1">
                {pipelines.filter(p => p.status === 'running').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Play className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Success Rate</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                {Math.round((pipelines.filter(p => p.status === 'success').length / pipelines.length) * 100)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
                {pipelines.filter(p => p.status === 'failed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search pipelines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="idle">Idle</option>
            <option value="running">Running</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={filterEnvironment}
            onChange={(e) => setFilterEnvironment(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Environments</option>
            {environments.map(env => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pipelines List */}
      <div className="space-y-4">
        {filteredPipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            {/* Pipeline Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <GitBranch className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {pipeline.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {pipeline.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-2 px-3 py-1 ${getStatusColor(pipeline.status)}`}>
                  {getStatusIcon(pipeline.status)}
                  <span className="text-sm font-medium capitalize">{pipeline.status}</span>
                </div>
              </div>
            </div>

            {/* Pipeline Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Repository</p>
                <p className="text-sm text-gray-900 dark:text-white font-medium">{pipeline.repository}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Branch</p>
                <p className="text-sm text-gray-900 dark:text-white font-medium">{pipeline.branch}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Environment</p>
                <p className="text-sm text-gray-900 dark:text-white font-medium capitalize">{pipeline.environment}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Trigger</p>
                <div className="flex items-center space-x-1">
                  {getTriggerIcon(pipeline.trigger)}
                  <span className="text-sm text-gray-900 dark:text-white font-medium capitalize">{pipeline.trigger}</span>
                </div>
              </div>
            </div>

            {/* Pipeline Stages */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Stages</p>
              <div className="flex items-center space-x-2">
                {pipeline.stages.map((stage, index) => (
                  <React.Fragment key={stage.id}>
                    <div className={`flex items-center space-x-2 px-3 py-1 ${getStatusColor(stage.status)}`}>
                      {getStatusIcon(stage.status)}
                      <span className="text-xs font-medium">{stage.name}</span>
                      {stage.duration && (
                        <span className="text-xs opacity-75">({stage.duration})</span>
                      )}
                    </div>
                    {index < pipeline.stages.length - 1 && (
                      <div className="w-4 h-px bg-gray-300 dark:bg-gray-600"></div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Pipeline Stats */}
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{pipeline.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>Last run: {pipeline.lastRun}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Timer className="w-4 h-4" />
                  <span>Duration: {pipeline.duration}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                {pipeline.status === 'running' ? (
                  <button
                    onClick={() => handleStopPipeline(pipeline)}
                    className="flex items-center space-x-1 px-3 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Square className="w-3 h-3" />
                    <span>Stop</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleRunPipeline(pipeline)}
                    className="flex items-center space-x-1 px-3 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                  >
                    <Play className="w-3 h-3" />
                    <span>Run</span>
                  </button>
                )}
                <button
                  onClick={() => handleViewHistory(pipeline)}
                  className="flex items-center space-x-1 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                >
                  <FileText className="w-3 h-3" />
                  <span>History</span>
                </button>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleViewDetails(pipeline)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="View Details"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Settings"
                >
                  <Settings className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDeletePipeline(pipeline)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Delete Pipeline"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Pipeline Modal */}
      {showNewPipeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Pipeline
              </h2>
              <button
                onClick={() => setShowNewPipeline(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Pipeline Name
                  </label>
                  <input
                    type="text"
                    placeholder="my-service-ci"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Repository
                  </label>
                  <input
                    type="text"
                    placeholder="github.com/company/my-service"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    placeholder="main"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Environment
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Pipeline description..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Trigger
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="push">On Push</option>
                  <option value="manual">Manual</option>
                  <option value="schedule">Scheduled</option>
                  <option value="webhook">Webhook</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowNewPipeline(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Pipeline created successfully!');
                  setShowNewPipeline(false);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Create Pipeline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pipeline Details Modal */}
      {showPipelineDetails && selectedPipeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <GitBranch className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedPipeline.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pipeline Details
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPipelineDetails(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Configuration</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Repository</label>
                      <p className="text-gray-900 dark:text-white">{selectedPipeline.repository}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Branch</label>
                      <p className="text-gray-900 dark:text-white">{selectedPipeline.branch}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Environment</label>
                      <p className="text-gray-900 dark:text-white capitalize">{selectedPipeline.environment}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Trigger</label>
                      <p className="text-gray-900 dark:text-white capitalize">{selectedPipeline.trigger}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Status</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Status</label>
                      <div className={`flex items-center space-x-2 px-3 py-1 ${getStatusColor(selectedPipeline.status)} w-fit mt-1`}>
                        {getStatusIcon(selectedPipeline.status)}
                        <span className="text-sm font-medium capitalize">{selectedPipeline.status}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Run</label>
                      <p className="text-gray-900 dark:text-white">{selectedPipeline.lastRun}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</label>
                      <p className="text-gray-900 dark:text-white">{selectedPipeline.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Stages</h3>
                <div className="space-y-3">
                  {selectedPipeline.stages.map((stage) => (
                    <div key={stage.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-2 px-3 py-1 ${getStatusColor(stage.status)}`}>
                          {getStatusIcon(stage.status)}
                          <span className="text-sm font-medium">{stage.name}</span>
                        </div>
                      </div>
                      {stage.duration && (
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {stage.duration}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Run History Modal */}
      {showRunHistory && selectedPipeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-6xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Run History
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedPipeline.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRunHistory(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Run
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Commit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Started
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedPipeline.runs.map((run) => (
                    <tr key={run.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            #{run.number}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {run.message}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center space-x-2 px-3 py-1 ${getStatusColor(run.status)} w-fit`}>
                          {getStatusIcon(run.status)}
                          <span className="text-sm font-medium capitalize">{run.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-mono text-gray-900 dark:text-white">
                            {run.commit}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {run.author}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {run.startedAt}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">
                          {run.duration}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewLogs(run)}
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

      {/* Logs Modal */}
      {showLogs && selectedRun && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-6xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Pipeline Logs
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Run #{selectedRun.number} • {selectedRun.status}
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
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>All Stages</option>
                  <option>Build</option>
                  <option>Test</option>
                  <option>Deploy</option>
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
            <div className="flex-1 overflow-auto p-4">
              <div className="bg-gray-900 dark:bg-gray-950 p-4 font-mono text-sm">
                {mockLogs.map((log, index) => (
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
          </div>
        </div>
      )}
    </div>
  );
};