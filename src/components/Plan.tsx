import React from 'react';
import { List, User, Tag, Calendar, Flag } from 'lucide-react';

type JiraStatus = 'Backlog' | 'To Do' | 'In Progress' | 'In Review' | 'Done' | 'Blocked';

interface JiraTask {
  key: string;
  summary: string;
  status: JiraStatus;
  assignee: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate?: string;
  labels: string[];
}

const tasks: JiraTask[] = [
  {
    key: 'PLAN-101',
    summary: 'Create onboarding flow for new services',
    status: 'In Progress',
    assignee: 'soorya',
    priority: 'High',
    dueDate: '2025-08-25',
    labels: ['services', 'onboarding'],
  },
  {
    key: 'PLAN-102',
    summary: 'Add health checks to API Gateway routes',
    status: 'To Do',
    assignee: 'akilesh',
    priority: 'Medium',
    dueDate: '2025-08-28',
    labels: ['api', 'gateway'],
  },
  {
    key: 'PLAN-103',
    summary: 'Implement blue/green deploy strategy for payments',
    status: 'In Review',
    assignee: 'devopsteam',
    priority: 'High',
    dueDate: '2025-08-30',
    labels: ['deploy', 'strategy'],
  },
  {
    key: 'PLAN-104',
    summary: 'Mobile app log forwarding to central store',
    status: 'Backlog',
    assignee: 'mobile',
    priority: 'Low',
    labels: ['mobile', 'logging'],
  },
  {
    key: 'PLAN-105',
    summary: 'Add SLO dashboards for staging',
    status: 'Blocked',
    assignee: 'test',
    priority: 'Critical',
    labels: ['observability', 'slo'],
  },
  {
    key: 'PLAN-106',
    summary: 'Migrate DB migrations to timestamped files',
    status: 'Done',
    assignee: 'devopsteam',
    priority: 'Medium',
    labels: ['database', 'migrations'],
  },
];

const statusBadgeClass = (status: JiraStatus) => {
  const base = 'text-xs px-2 py-1 border font-medium';
  switch (status) {
    case 'Done':
      return `${base} text-green-700 border-green-300 dark:text-green-400 dark:border-green-700`;
    case 'In Progress':
      return `${base} text-blue-700 border-blue-300 dark:text-blue-400 dark:border-blue-700`;
    case 'In Review':
      return `${base} text-indigo-700 border-indigo-300 dark:text-indigo-400 dark:border-indigo-700`;
    case 'Blocked':
      return `${base} text-red-700 border-red-300 dark:text-red-400 dark:border-red-700`;
    case 'To Do':
      return `${base} text-yellow-700 border-yellow-300 dark:text-yellow-400 dark:border-yellow-700`;
    case 'Backlog':
    default:
      return `${base} text-gray-700 border-gray-300 dark:text-gray-300 dark:border-gray-700`;
  }
};

export function Plan() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <List className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Plan</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.key}
            className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-mono text-gray-500 dark:text-gray-400">{task.key}</span>
              <span className={statusBadgeClass(task.status)}>{task.status}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{task.summary}</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{task.assignee}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flag className="w-4 h-4" />
                <span>{task.priority}</span>
              </div>
              {task.dueDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Due {task.dueDate}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{task.labels.length ? task.labels.join(', ') : 'No labels'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


