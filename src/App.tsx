import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ServiceCatalog } from './components/ServiceCatalog';
import { Environments } from './components/Environments';
import { Infrastructure } from './components/Infrastructure';
import { Pipelines } from './components/Pipelines';
import { Users } from './components/Users';
import { Settings } from './components/Settings';
import { Documentation } from './components/Documentation';
import { PullRequests } from './components/PullRequests';
import { DatabaseMigrations } from './components/DatabaseMigrations';
import { ApiGateway } from './components/ApiGateway';
import { Plan } from './components/Plan';

export type NavigationItem = 
  | 'dashboard' 
  | 'services' 
  | 'environments' 
  | 'plan'
  | 'infrastructure' 
  | 'pipelines' 
  | 'documentation'
  | 'pull-requests'
  | 'database-migrations'
  | 'api-gateway'
  | 'users' 
  | 'settings';

function App() {
  const [activeView, setActiveView] = useState<NavigationItem>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <ServiceCatalog />;
      case 'environments':
        return <Environments />;
      case 'plan':
        return <Plan />;
      case 'infrastructure':
        return <Infrastructure />;
      case 'pipelines':
        return <Pipelines />;
      case 'documentation':
        return <Documentation />;
      case 'pull-requests':
        return <PullRequests />;
      case 'database-migrations':
        return <DatabaseMigrations />;
      case 'api-gateway':
        return <ApiGateway />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <main className={`flex-1 overflow-auto transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        <div className="min-h-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

export default App;