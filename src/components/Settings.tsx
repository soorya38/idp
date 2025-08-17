import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Database,
  Webhook,
  Key,
  Mail,
  Globe,
  Users,
  Zap,
  Save,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'team', label: 'Team Settings', icon: Users },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Configure your platform preferences and integrations
          </p>
        </div>
      </div>

      <div className="flex space-x-6">
        {/* Settings Navigation */}
        <div className="w-64 space-y-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 text-left transition-colors ${
                activeTab === id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 p-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    General Settings
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      defaultValue="DevPlatform"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Environment
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Production</option>
                      <option>Staging</option>
                      <option>Development</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Platform URL
                  </label>
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <input
                      type="url"
                      defaultValue="https://platform.company.com"
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    defaultValue="Internal developer platform for managing applications, infrastructure, and deployments."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Notification Settings
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <Bell className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Email Notifications
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Receive email alerts for deployments and incidents
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center space-x-3">
                      <Webhook className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          Slack Integration
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Send notifications to Slack channels
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Security Settings
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-300">
                          Two-Factor Authentication
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          Enable 2FA for enhanced security
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        defaultValue="30"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Password Policy
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>Strong</option>
                        <option>Medium</option>
                        <option>Basic</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'integrations' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    External Integrations
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                          <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">GitHub</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Source control</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 text-sm">
                        Connected
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                          <Webhook className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Docker Hub</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Container registry</p>
                        </div>
                      </div>
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors">
                        Connect
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    API Keys
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Production API Key
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        pk_live_••••••••••••••••••••••••4242
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors">
                        Regenerate
                      </button>
                      <button className="px-3 py-2 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors">
                        Revoke
                      </button>
                    </div>
                  </div>

                  <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    <Key className="w-4 h-4" />
                    <span>Generate New API Key</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Team Settings
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Role for New Users
                    </label>
                    <select className="w-full max-w-md px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option>Viewer</option>
                      <option>Developer</option>
                      <option>Manager</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Allow Self-Registration
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Let users sign up without invitation
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
              <button className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};