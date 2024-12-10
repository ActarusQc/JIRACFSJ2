import React, { useState } from 'react';
import { KanbanBoard } from './components/KanbanBoard';
import { Plus, LayoutGrid, Calendar, LayoutDashboard, Settings as SettingsIcon } from 'lucide-react';
import { NotificationToast } from './components/NotificationToast';
import { SearchBar } from './components/SearchBar';
import { Settings } from './components/Settings';
import { ProjectForm } from './components/ProjectForm';
import { ProjectList } from './components/ProjectList';
import { Dashboard } from './components/dashboard/Dashboard';

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [viewMode, setViewMode] = useState<'timeline' | 'board'>('timeline');

  const handleViewChange = (view: 'dashboard' | 'calendar' | 'board' | 'projects') => {
    setShowDashboard(view === 'dashboard');
    setShowProjects(view === 'projects');
    setShowSettings(false);
    if (view === 'calendar' || view === 'board') {
      setViewMode(view === 'calendar' ? 'timeline' : 'board');
      setShowDashboard(false);
      setShowProjects(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center">
                <img 
                  src="https://www.cfsj.qc.ca/wp-content/themes/reactif_s/assets/images/logo-couleur.webp"
                  alt="Logo"
                  className="h-8 w-auto"
                />
                <span className="ml-2 text-xl font-semibold text-gray-900">
                  Gestionnaire de Projets
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewChange('dashboard')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                    showDashboard
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Tableau de bord
                </button>

                <button
                  onClick={() => handleViewChange('calendar')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                    !showDashboard && !showProjects && viewMode === 'timeline'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Voir calendrier
                </button>

                <button
                  onClick={() => handleViewChange('board')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                    !showDashboard && !showProjects && viewMode === 'board'
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Voir le tableau
                </button>

                <button
                  onClick={() => handleViewChange('projects')}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm ${
                    showProjects
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Voir les projets
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <SearchBar />
              <button
                onClick={() => setShowProjectForm(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                Nouveau projet
              </button>
              <button
                onClick={() => {
                  setShowSettings(!showSettings);
                  setShowProjects(false);
                  setShowDashboard(false);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                title="Paramètres"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-8">
          {showSettings ? (
            <Settings />
          ) : showProjects ? (
            <ProjectList />
          ) : showDashboard ? (
            <Dashboard />
          ) : (
            <KanbanBoard viewMode={viewMode} />
          )}
        </div>
      </main>
      {showProjectForm && <ProjectForm onClose={() => setShowProjectForm(false)} />}
      <NotificationToast />
    </div>
  );
}

export default App;