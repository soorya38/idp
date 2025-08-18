import React, { useEffect, useState, useCallback } from 'react';
import { RefreshCcw } from 'lucide-react';

interface JiraProject {
  id: string;
  key: string;
  name: string;
  projectUrl?: string;
  boardUrl?: string;
}

interface JiraIssue {
  id: string;
  key: string;
  fields?: {
    summary?: string;
    status?: { name?: string };
    issuetype?: { name?: string };
    updated?: string;
  };
  webUrl?: string;
}

export const Jira: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<JiraProject[]>([]);
  const [selectedProjectKey, setSelectedProjectKey] = useState<string>('');
  const [issues, setIssues] = useState<JiraIssue[]>([]);
  const [grouped, setGrouped] = useState<Record<string, JiraIssue[]>>({});

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jira/projects');
      const data = await res.json();
      setProjects(Array.isArray(data.values) ? data.values : []);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyIssues = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedProjectKey
        ? `/api/jira/projects/${encodeURIComponent(selectedProjectKey)}/issues/grouped?maxResults=50&fields=summary,status,issuetype,updated`
        : '/api/jira/issues/mine/grouped?maxResults=50&fields=summary,status,issuetype,updated';
      const res = await fetch(url);
      const data = await res.json();
      setGrouped(data.groups || {});
      const flat = Object.values(data.groups || {}).flat();
      setIssues(Array.isArray(flat) ? flat as JiraIssue[] : []);
    } finally {
      setLoading(false);
    }
  }, [selectedProjectKey]);

  useEffect(() => {
    fetchProjects();
    fetchMyIssues();
  }, []);

  useEffect(() => {
    // Auto-refresh tickets when the selected project changes
    fetchMyIssues();
  }, [fetchMyIssues]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Jira</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Browse projects and your assigned issues</p>
        </div>
        <button onClick={() => { fetchProjects(); fetchMyIssues(); }} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
          <RefreshCcw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      

      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Projects</h2>
          <div className="text-xs text-gray-500 dark:text-gray-400">{projects.length} found</div>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedProjectKey}
            onChange={(e) => setSelectedProjectKey(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.key}>{p.key} — {p.name}</option>
            ))}
          </select>
          <button onClick={fetchProjects} className="px-3 py-2 text-xs bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600">Reload Projects</button>
        </div>
        {selectedProjectKey && (
          <div className="mt-3 flex items-center space-x-3 text-xs">
            {projects.find(pp => pp.key === selectedProjectKey)?.projectUrl && (
              <a
                href={projects.find(pp => pp.key === selectedProjectKey)!.projectUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open Project
              </a>
            )}
            {projects.find(pp => pp.key === selectedProjectKey)?.boardUrl && (
              <a
                href={projects.find(pp => pp.key === selectedProjectKey)!.boardUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                Open Board
              </a>
            )}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Tickets by Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {['open','inprogress','blocked','completed','closed'].map((groupKey) => (
              <div key={groupKey}>
                <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 capitalize">{groupKey}</div>
                <div className="space-y-3">
                  {(grouped[groupKey] || []).map((i) => (
                    <div key={i.id} className="border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{i.key}</div>
                      <div className="text-gray-900 dark:text-white font-medium">{i.fields?.summary ?? 'Untitled'}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{i.fields?.issuetype?.name} • {i.fields?.status?.name}</div>
                      {i.webUrl && (
                        <div className="mt-2">
                          <a href={i.webUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">Open in Jira</a>
                        </div>
                      )}
                    </div>
                  ))}
                  {!loading && (!grouped[groupKey] || grouped[groupKey].length === 0) && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">No tickets</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}
