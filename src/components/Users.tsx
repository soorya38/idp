import React, { useState } from 'react';
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Filter,
  MoreHorizontal,
  Shield,
  Mail,
  Calendar,
} from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer' | 'manager';
  team: string;
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  joinDate: string;
  avatar?: string;
}

const users: User[] = [
  {
    id: '1',
    name: 'soorya',
    email: 'soorya@company.com',
    role: 'admin',
    team: 'Platform Team',
    status: 'active',
    lastActive: 'just now',
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'akilesh',
    email: 'akilesh@company.com',
    role: 'developer',
    team: 'Backend Team',
    status: 'active',
    lastActive: '1 hour ago',
    joinDate: '2023-02-20',
  },
  {
    id: '3',
    name: 'test',
    email: 'test@company.com',
    role: 'viewer',
    team: 'QA Team',
    status: 'pending',
    lastActive: 'Never',
    joinDate: '2024-01-08',
  },
  {
    id: '4',
    name: 'devopsteam',
    email: 'devops@company.com',
    role: 'manager',
    team: 'DevOps Team',
    status: 'active',
    lastActive: '30 minutes ago',
    joinDate: '2022-11-10',
  },
  {
    id: '5',
    name: 'mobile',
    email: 'mobile@company.com',
    role: 'developer',
    team: 'Mobile Team',
    status: 'inactive',
    lastActive: '2 days ago',
    joinDate: '2023-03-05',
  },
];

const getRoleColor = (role: User['role']) => {
  switch (role) {
    case 'admin':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
    case 'manager':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'developer':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'viewer':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
  }
};

const getStatusColor = (status: User['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'inactive':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
  }
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase();
};

export const Users: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserActions, setShowUserActions] = useState<string | null>(null);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.team.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleInviteUser = () => {
    setShowInviteModal(true);
  };

  const handleUserAction = (user: User, action: string) => {
    switch (action) {
      case 'edit':
        alert(`Editing user: ${user.name}`);
        break;
      case 'deactivate':
        if (window.confirm(`Are you sure you want to deactivate ${user.name}?`)) {
          alert(`Deactivating user: ${user.name}`);
        }
        break;
      case 'delete':
        if (window.confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) {
          alert(`Deleting user: ${user.name}`);
        }
        break;
      case 'reset-password':
        if (window.confirm(`Send password reset email to ${user.email}?`)) {
          alert(`Password reset email sent to ${user.email}`);
        }
        break;
    }
    setShowUserActions(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Users & Teams
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage user access and team permissions
          </p>
        </div>
        <button 
          onClick={handleInviteUser}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite User</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
                {users.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
              <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mt-1">
                {users.filter(u => u.status === 'active').length}
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
              <p className="text-sm text-gray-500 dark:text-gray-400">Admins</p>
              <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mt-1">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400 mt-1">
                {users.filter(u => u.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
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
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="developer">Developer</option>
            <option value="viewer">Viewer</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <Mail className="w-3 h-3" />
                          <span>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {user.team}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {user.lastActive}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button 
                        onClick={() => setShowUserActions(showUserActions === user.id ? null : user.id)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                      <MoreHorizontal className="w-4 h-4 text-gray-500" />
                      </button>
                      {showUserActions === user.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => handleUserAction(user, 'edit')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Edit User
                            </button>
                            <button
                              onClick={() => handleUserAction(user, 'reset-password')}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Reset Password
                            </button>
                            <button
                              onClick={() => handleUserAction(user, 'deactivate')}
                              className="w-full text-left px-4 py-2 text-sm text-yellow-600 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Deactivate
                            </button>
                            <button
                              onClick={() => handleUserAction(user, 'delete')}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                              Delete User
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite User Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Invite User
              </h2>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="user@company.com"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="viewer">Viewer</option>
                  <option value="developer">Developer</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Team
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="platform">Platform Team</option>
                  <option value="backend">Backend Team</option>
                  <option value="frontend">Frontend Team</option>
                  <option value="data">Data Team</option>
                  <option value="qa">QA Team</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Invitation sent successfully!');
                  setShowInviteModal(false);
                }}
                className="px-4 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};