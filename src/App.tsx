import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import Sidebar from './components/Sidebar';
import HomePage from './components/pages/HomePage';
import EvolutionPage from './components/pages/EvolutionPage';
import LeadsPage from './components/pages/LeadsPage';
import DashboardPage from './components/pages/DashboardPage';
import CommercialDashboard from './components/pages/CommercialDashboard';

import MigrationRunner from './components/MigrationRunner';
import { LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, signOut } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'evolution':
        return <EvolutionPage />;
      case 'leads':
        return <LeadsPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'commercial':
        return <CommercialDashboard />;

      case 'migration':
        return <MigrationRunner />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Bem-vindo, {user?.email}</p>
          </div>
          <button
            onClick={signOut}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </button>
        </div>
        {renderContent()}
      </main>
    </div>
  );
};

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthPage />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
