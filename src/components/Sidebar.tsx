import React from 'react';
import {
  Home,
  Package,
  Bug,
  Globe,
  Server,
  GitBranch,
  BookOpen,
  GitPullRequest,
  Database,
  Zap,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  List,
} from 'lucide-react';
import { NavigationItem } from '../App';

interface SidebarProps {
  activeView: NavigationItem;
  onNavigate: (view: NavigationItem) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'services', label: 'Service Catalog', icon: Package },
  // { id: 'jira', label: 'Jira', icon: Bug },
  { id: 'environments', label: 'Environments', icon: Globe },
  { id: 'plan', label: 'Plan', icon: List },
  { id: 'infrastructure', label: 'Infrastructure', icon: Server },
  { id: 'pipelines', label: 'CI/CD Pipelines', icon: GitBranch },
  { id: 'documentation', label: 'Documentation', icon: BookOpen },
  { id: 'pull-requests', label: 'Pull Requests', icon: GitPullRequest },
  { id: 'database-migrations', label: 'DB Migrations', icon: Database },
  { id: 'api-gateway', label: 'API Gateway', icon: Zap },
  { id: 'users', label: 'Users & Teams', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const;

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onNavigate,
  collapsed,
  onToggleCollapse,
}) => {
  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 flex items-center justify-center">
              <Server className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              DevPlatform
            </h1>
          </div>
        )}
        
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {navigationItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id as NavigationItem)}
            className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left transition-all duration-200 ${
              activeView === id
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={collapsed ? label : undefined}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">{label}</span>}
          </button>
        ))}
      </nav>

    </div>
  );
};