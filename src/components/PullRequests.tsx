import React, { useState } from 'react';
import {
  GitPullRequest,
  Search,
  Filter,
  GitBranch,
  User,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  GitCommit,
} from 'lucide-react';

interface PullRequest {
  id: string;
  number: number;
  title: string;
  description: string;
  author: string;
  repository: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'merged' | 'closed' | 'draft';
  createdAt: string;
  updatedAt: string;
  comments: number;
  commits: number;
  additions: number;
  deletions: number;
  reviewers: string[];
  labels: string[];
  checks: {
    name: string;
    status: 'pending' | 'success' | 'failure' | 'cancelled';
  }[];
}

const pullRequests: PullRequest[] = [
  {
    id: '1',
    number: 247,
    title: 'Add user authentication middleware',
    description: 'Implements JWT-based authentication middleware for API routes with proper error handling and token validation.',
    author: 'Sarah Chen',
    repository: 'user-service',
    sourceBranch: 'feature/auth-middleware',
    targetBranch: 'main',
    status: 'open',
    createdAt: '2 hours ago',
    updatedAt: '30 minutes ago',
    comments: 5,
    commits: 8,
    additions: 156,
    deletions: 23,
    reviewers: ['Mike Johnson', 'Emily Rodriguez'],
    labels: ['enhancement', 'security'],
    checks: [
      { name: 'CI/CD Pipeline', status: 'success' },
      { name: 'Security Scan', status: 'success' },
      { name: 'Code Quality', status: 'pending' },
    ],
  },
  {
    id: '2',
    number: 246,
    title: 'Fix memory leak in data processing',
    description: 'Resolves memory leak issue in the data processing pipeline that was causing OOM errors in production.',
    author: 'Mike Johnson',
    repository: 'analytics-engine',
    sourceBranch: 'bugfix/memory-leak',
    targetBranch: 'main',
    status: 'open',
    createdAt: '4 hours ago',
    updatedAt: '1 hour ago',
    comments: 12,
    commits: 3,
    additions: 45,
    deletions: 67,
    reviewers: ['David Brown', 'Lisa Wang'],
    labels: ['bug', 'critical', 'performance'],
    checks: [
      { name: 'CI/CD Pipeline', status: 'success' },
      { name: 'Performance Tests', status: 'success' },
      { name: 'Memory Tests', status: 'success' },
    ],
  },
  {
    id: '3',
    number: 245,
    title: 'Update API documentation',
    description: 'Updates OpenAPI specifications and adds examples for new endpoints introduced in v2.4.0.',
    author: 'Emily Rodriguez',
    repository: 'api-gateway',
    sourceBranch: 'docs/api-v2.4',
    targetBranch: 'main',
    status: 'merged',
    createdAt: '1 day ago',
    updatedAt: '6 hours ago',
    comments: 3,
    commits: 5,
    additions: 234,
    deletions: 12,
    reviewers: ['Sarah Chen'],
    labels: ['documentation'],
    checks: [
      { name: 'Documentation Build', status: 'success' },
      { name: 'Link Checker', status: 'success' },
    ],
  },
  {
    id: '4',
    number: 244,
    title: 'Implement rate limiting',
    description: 'Adds configurable rate limiting to prevent API abuse and improve system stability.',
    author: 'Alex Thompson',
    repository: 'api-gateway',
    sourceBranch: 'feature/rate-limiting',
    targetBranch: 'develop',
    status: 'draft',
    createdAt: '2 days ago',
    updatedAt: '1 day ago',
    comments: 8,
    commits: 12,
    additions: 289,
    deletions: 45,
    reviewers: ['Platform Team'],
    labels: ['enhancement', 'performance', 'wip'],
    checks: [
      { name: 'CI/CD Pipeline', status: 'pending' },
      { name: 'Load Tests', status: 'pending' },
    ],
  },
  {
    id: '5',
    number: 243,
    title: 'Database migration for user preferences',
    description: 'Adds new tables and columns to support user preference settings and notification configurations.',
    author: 'Lisa Wang',
    repository: 'user-service',
    sourceBranch: 'migration/user-preferences',
    targetBranch: 'main',
    status: 'closed',
    createdAt: '3 days ago',
    updatedAt: '2 days ago',
    comments: 15,
    commits: 6,
    additions: 123,
    deletions: 8,
    reviewers: ['Data Team', 'Sarah Chen'],
    labels: ['database', 'migration'],
    checks: [
      { name: 'Migration Tests', status: 'failure' },
      { name: 'Schema Validation', status: 'failure' },
    ],
  },
];

const getStatusColor = (status: PullRequest['status']) => {
  switch (status) {
    case 'open':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'merged':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    case 'closed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'draft':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  }
};

const getStatusIcon = (status: PullRequest['status']) => {
  switch (status) {
    case 'open':
      return <GitPullRequest className="w-4 h-4" />;
    case 'merged':
      return <CheckCircle className="w-4 h-4" />;
    case 'closed':
      return <XCircle className="w-4 h-4" />;
    case 'draft':
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getCheckStatusColor = (status: PullRequest['checks'][0]['status']) => {
  switch (status) {
    case 'success':
      return 'text-green-600 dark:text-green-400';
    case 'failure':
      return 'text-red-600 dark:text-red-400';
    case 'pending':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'cancelled':
      return 'text-gray-600 dark:text-gray-400';
  }
};

export const PullRequests: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRepository, setFilterRepository] = useState<string>('all');
  const [selectedPR, setSelectedPR] = useState<PullRequest | null>(null);
  const [showPRDetails, setShowPRDetails] = useState(false);

  const filteredPRs = pullRequests.filter((pr) => {
    const matchesSearch = pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pr.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pr.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || pr.status === filterStatus;
    const matchesRepo = filterRepository === 'all' || pr.repository === filterRepository;
    return matchesSearch && matchesStatus && matchesRepo;
  });

  const repositories = [...new Set(pullRequests.map(pr => pr.repository))];

  const handleViewPR = (pr: PullRequest) => {
    setSelectedPR(pr);
    setShowPRDetails(true);
  };

  const handlePRAction = (pr: PullRequest, action: string) => {
    switch (action) {
      case 'merge':
        if (window.confirm(`Are you sure you want to merge PR #${pr.number}?`)) {
          alert(`Merging PR #${pr.number}: ${pr.title}`);
        }
        break;
      case 'close':
        if (window.confirm(`Are you sure you want to close PR #${pr.number}?`)) {
          alert(`Closing PR #${pr.number}: ${pr.title}`);
        }
        break;
      case 'approve':
        alert(`Approving PR #${pr.number}: ${pr.title}`);
        break;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Pull Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and manage code changes across all repositories
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Open PRs</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                {pullRequests.filter(pr => pr.status === 'open').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <GitPullRequest className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Merged</p>
              <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mt-1">
                {pullRequests.filter(pr => pr.status === 'merged').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Drafts</p>
              <p className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mt-1">
                {pullRequests.filter(pr => pr.status === 'draft').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Closed</p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
                {pullRequests.filter(pr => pr.status === 'closed').length}
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
            placeholder="Search pull requests..."
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
            <option value="open">Open</option>
            <option value="merged">Merged</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
          <select
            value={filterRepository}
            onChange={(e) => setFilterRepository(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Repositories</option>
            {repositories.map(repo => (
              <option key={repo} value={repo}>{repo}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Pull Requests List */}
      <div className="space-y-4">
        {filteredPRs.map((pr) => (
          <div
            key={pr.id}
            className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getStatusColor(pr.status)}`}>
                  {getStatusIcon(pr.status)}
                  <span className="text-sm font-medium capitalize">{pr.status}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pr.title}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      #{pr.number}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {pr.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{pr.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitBranch className="w-4 h-4" />
                      <span>{pr.repository}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>Created {pr.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => handleViewPR(pr)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Eye className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Branch Info */}
            <div className="flex items-center space-x-2 mb-4 text-sm">
              <span className="text-gray-500 dark:text-gray-400">Merge</span>
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 font-mono">
                {pr.sourceBranch}
              </span>
              <span className="text-gray-500 dark:text-gray-400">into</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 font-mono">
                {pr.targetBranch}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 mb-4 text-sm">
              <div className="flex items-center space-x-1">
                <GitCommit className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white font-medium">{pr.commits}</span>
                <span className="text-gray-500 dark:text-gray-400">commits</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-gray-900 dark:text-white font-medium">{pr.comments}</span>
                <span className="text-gray-500 dark:text-gray-400">comments</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-green-600 dark:text-green-400 font-medium">+{pr.additions}</span>
                <span className="text-red-600 dark:text-red-400 font-medium">-{pr.deletions}</span>
              </div>
            </div>

            {/* Labels */}
            {pr.labels.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {pr.labels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {label}
                  </span>
                ))}
              </div>
            )}

            {/* Checks */}
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">Checks:</span>
              {pr.checks.map((check) => (
                <div key={check.name} className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    check.status === 'success' ? 'bg-green-500' :
                    check.status === 'failure' ? 'bg-red-500' :
                    check.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <span className={`text-sm ${getCheckStatusColor(check.status)}`}>
                    {check.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Reviewers */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Reviewers:</span>
                <div className="flex items-center space-x-2">
                  {pr.reviewers.map((reviewer) => (
                    <div
                      key={reviewer}
                      className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium"
                    >
                      {reviewer.split(' ').map(n => n[0]).join('')}
                    </div>
                  ))}
                </div>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Updated {pr.updatedAt}
              </span>
              <div className="flex items-center space-x-2">
                {pr.status === 'open' && (
                  <>
                    <button
                      onClick={() => handlePRAction(pr, 'approve')}
                      className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/40 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handlePRAction(pr, 'merge')}
                      className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      Merge
                    </button>
                    <button
                      onClick={() => handlePRAction(pr, 'close')}
                      className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                    >
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PR Details Modal */}
      {showPRDetails && selectedPR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {selectedPR.title} #{selectedPR.number}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedPR.repository} • {selectedPR.author}
                </p>
              </div>
              <button
                onClick={() => setShowPRDetails(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Description
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedPR.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Changes
                  </h3>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-green-600 dark:text-green-400">+{selectedPR.additions} additions</span>
                    <span className="text-red-600 dark:text-red-400">-{selectedPR.deletions} deletions</span>
                    <span className="text-gray-600 dark:text-gray-400">{selectedPR.commits} commits</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Checks
                  </h3>
                  <div className="space-y-2">
                    {selectedPR.checks.map((check, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className={`w-3 h-3 ${
                          check.status === 'success' ? 'bg-green-500' :
                          check.status === 'failure' ? 'bg-red-500' :
                          check.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}></div>
                        <span className="text-sm text-gray-900 dark:text-white">{check.name}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          check.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          check.status === 'failure' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          check.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                        }`}>
                          {check.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              {selectedPR.status === 'open' && (
                <>
                  <button
                    onClick={() => handlePRAction(selectedPR, 'close')}
                    className="px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    Close PR
                  </button>
                  <button
                    onClick={() => handlePRAction(selectedPR, 'merge')}
                    className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Merge PR
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};