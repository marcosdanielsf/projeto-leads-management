import React from 'react';
import { Home, TrendingUp, Users, BarChart3, Settings, Database, LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Executivo', icon: BarChart3 },
    { id: 'commercial', label: 'Dashboard Comercial', icon: TrendingUp },
    { id: 'home', label: 'Visão Geral', icon: Home },
    { id: 'evolution', label: 'Evolução', icon: TrendingUp },
    { id: 'leads', label: 'Gerenciar Leads', icon: Users },
    { id: 'migration', label: 'Migração DB', icon: Database },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-elevated h-screen flex flex-col">
      <div className="p-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-icon-md h-icon-md text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-neutral-900">Sales Dashboard</h1>
            <p className="text-sm text-neutral-500">Lead Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 font-medium ${
                    activeTab === item.id
                      ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-700'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <Icon className="w-icon-sm h-icon-sm" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-neutral-200">
        <div className="flex items-center gap-3 text-neutral-500">
          <div className="w-8 h-8 bg-neutral-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-semibold">MD</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-700">Marcos Daniels</p>
            <p className="text-xs text-neutral-500">Admin</p>
          </div>
          <LogOut className="w-icon-xs h-icon-xs cursor-pointer hover:text-neutral-700 transition-colors duration-200" />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;