import React, { useState } from 'react';
import {
  Database,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  FileText,
  GitCommit,
  ArrowRight,
  Eye,
  Download,
  RefreshCw,
  Plus,
  X,
} from 'lucide-react';

interface Migration {
  id: string;
  name: string;
  version: string;
  service: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back';
  createdAt: string;
  executedAt?: string;
  duration?: string;
  author: string;
  checksum: string;
  rollbackAvailable: boolean;
  sql: string;
  environment: string;
}

const migrations: Migration[] = [
  {
    id: '1',
    name: '001_create_users_table',
    version: '1.0.0',
    service: 'user-service',
    description: 'Create users table with authentication fields',
    status: 'completed',
    createdAt: '2024-01-10 09:00:00',
    executedAt: '2024-01-10 09:05:23',
    duration: '2.3s',
    author: 'Sarah Chen',
    checksum: 'a1b2c3d4e5f6',
    rollbackAvailable: true,
    environment: 'production',
    sql: `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);`,
  },
  {
    id: '2',
    name: '002_add_user_profiles',
    version: '1.1.0',
    service: 'user-service',
    description: 'Add user profile fields and preferences',
    status: 'completed',
    createdAt: '2024-01-12 14:30:00',
    executedAt: '2024-01-12 14:32:15',
    duration: '1.8s',
    author: 'Mike Johnson',
    checksum: 'b2c3d4e5f6g7',
    rollbackAvailable: true,
    environment: 'production',
    sql: `ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN avatar_url TEXT;
ALTER TABLE users ADD COLUMN preferences JSONB DEFAULT '{}';

CREATE INDEX idx_users_name ON users(first_name, last_name);`,
  },
  {
    id: '3',
    name: '003_create_orders_table',
    version: '2.0.0',
    service: 'payment-processor',
    description: 'Create orders table for payment processing',
    status: 'running',
    createdAt: '2024-01-15 10:15:00',
    author: 'Emily Rodriguez',
    checksum: 'c3d4e5f6g7h8',
    rollbackAvailable: false,
    environment: 'staging',
    sql: `CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);`,
  },
  {
    id: '4',
    name: '004_add_payment_methods',
    version: '2.1.0',
    service: 'payment-processor',
    description: 'Add payment methods table',
    status: 'pending',
    createdAt: '2024-01-15 11:00:00',
    author: 'David Brown',
    checksum: 'd4e5f6g7h8i9',
    rollbackAvailable: false,
    environment: 'staging',
    sql: `CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(20) NOT NULL,
  provider VARCHAR(50) NOT NULL,
  token VARCHAR(255) NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);`,
  },
  {
    id: '5',
    name: '005_update_user_indexes',
    version: '1.2.0',
    service: 'user-service',
    description: 'Optimize user table indexes for better performance',
    status: 'failed',
    createdAt: '2024-01-14 16:20:00',
    executedAt: '2024-01-14 16:22:45',
    duration: '45.2s',
    author: 'Lisa Wang',
    checksum: 'e5f6g7h8i9j0',
    rollbackAvailable: true,
    environment: 'production',
    sql: `DROP INDEX IF EXISTS idx_users_name;
CREATE INDEX CONCURRENTLY idx_users_full_name ON users(LOWER(first_name || ' ' || last_name));
CREATE INDEX CONCURRENTLY idx_users_created_at ON users(created_at DESC);`,
  },
];

const getStatusColor = (status: Migration['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'running':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'rolled_back':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
  }
};

const getStatusIcon = (status: Migration['status']) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'running':
      return <Clock className="w-4 h-4 animate-spin" />;
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'failed':
      return <XCircle className="w-4 h-4" />;
    case 'rolled_back':
      return <ArrowRight className="w-4 h-4 rotate-180" />;
  }
};

export const DatabaseMigrations: React.FC = () => {
  const [selectedMigration, setSelectedMigration] = useState<Migration | null>(null);
  const [showSql, setShowSql] = useState(false);
  const [filterService, setFilterService] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterEnvironment, setFilterEnvironment] = useState<string>('all');
  const [showNewMigration, setShowNewMigration] = useState(false);

  const services = [...new Set(migrations.map(m => m.service))];
  const environments = [...new Set(migrations.map(m => m.environment))];

  const filteredMigrations = migrations.filter((migration) => {
    const matchesService = filterService === 'all' || migration.service === filterService;
    const matchesStatus = filterStatus === 'all' || migration.status === filterStatus;
    const matchesEnvironment = filterEnvironment === 'all' || migration.environment === filterEnvironment;
    return matchesService && matchesStatus && matchesEnvironment;
  });

  const handleViewSql = (migration: Migration) => {
    setSelectedMigration(migration);
    setShowSql(true);
  };

  const handleRunMigration = (migration: Migration) => {
    if (window.confirm(`Are you sure you want to run migration: ${migration.name}?`)) {
      alert(`Running migration: ${migration.name}`);
    }
  };

  const handleCancelMigration = (migration: Migration) => {
    if (window.confirm(`Are you sure you want to cancel migration: ${migration.name}?`)) {
      alert(`Cancelling migration: ${migration.name}`);
    }
  };

  const handleRollbackMigration = (migration: Migration) => {
    if (window.confirm(`Are you sure you want to rollback migration: ${migration.name}?`)) {
      alert(`Rolling back migration: ${migration.name}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Database Migrations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage database schema changes across all services
          </p>
        </div>
        <button 
          onClick={() => setShowNewMigration(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Migration</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Migrations</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {migrations.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                {migrations.filter(m => m.status === 'completed').length}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mt-1">
                {migrations.filter(m => m.status === 'pending').length}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400 mt-1">
                {migrations.filter(m => m.status === 'failed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <select
          value={filterService}
          onChange={(e) => setFilterService(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Services</option>
          {services.map(service => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="running">Running</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="rolled_back">Rolled Back</option>
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

      {/* Migrations Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Migration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Environment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Executed
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
              {filteredMigrations.map((migration) => (
                <tr key={migration.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                        <GitCommit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {migration.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          v{migration.version} • {migration.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {migration.service}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className={`flex items-center space-x-2 px-3 py-1 ${getStatusColor(migration.status)} w-fit`}>
                      {getStatusIcon(migration.status)}
                      <span className="text-sm font-medium capitalize">{migration.status.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white capitalize">
                      {migration.environment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {migration.executedAt || 'Not executed'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {migration.duration || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewSql(migration)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        title="View SQL"
                      >
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      {migration.status === 'pending' && (
                        <button
                          onClick={() => handleRunMigration(migration)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Run Migration"
                        >
                          <Play className="w-4 h-4 text-green-500" />
                        </button>
                      )}
                      {migration.status === 'running' && (
                        <button
                          onClick={() => handleCancelMigration(migration)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Cancel Migration"
                        >
                          <Pause className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                      {migration.rollbackAvailable && migration.status === 'completed' && (
                        <button
                          onClick={() => handleRollbackMigration(migration)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Rollback"
                        >
                          <ArrowRight className="w-4 h-4 text-yellow-500 rotate-180" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Migration Modal */}
      {showNewMigration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-2xl w-full max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Create New Migration
              </h2>
              <button
                onClick={() => setShowNewMigration(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Migration Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., add_user_preferences"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Service
                  </label>
                  <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    {services.map(service => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the migration"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  SQL Content
                </label>
                <textarea
                  rows={10}
                  placeholder="-- Enter your SQL migration here"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowNewMigration(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Migration created successfully!');
                  setShowNewMigration(false);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Create Migration
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SQL Modal */}
      {showSql && selectedMigration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Migration SQL
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedMigration.name} • {selectedMigration.service}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSql(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* SQL Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-gray-900 dark:bg-gray-950 p-4 font-mono text-sm">
                <pre className="text-gray-300 dark:text-gray-400 whitespace-pre-wrap">
                  {selectedMigration.sql}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Checksum: {selectedMigration.checksum} • Author: {selectedMigration.author}
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};