import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

interface SidebarProps {
  onClose?: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: '📊',
    description: 'Vue d\'ensemble'
  },
  {
    name: 'Assistant IA',
    href: '/assistant-ia',
    icon: '🤖',
    description: 'Expert télécoms'
  },
  {
    name: 'GSM',
    href: '/gsm',
    icon: '📱',
    description: 'Dimensionnement GSM'
  },
  {
    name: 'UMTS',
    href: '/umts',
    icon: '📡',
    description: 'Dimensionnement UMTS'
  },
  {
    name: 'Hertzien',
    href: '/hertzien',
    icon: '🔌',
    description: 'Liaisons hertziennes'
  },
  {
    name: 'Optique',
    href: '/optique',
    icon: '💡',
    description: 'Liaisons optiques'
  },
  {
    name: 'Simulation',
    href: '/simulation',
    icon: '🖥️',
    description: 'Simulations 3D'
  },
];

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col bg-white shadow-xl">
      {/* Header de la sidebar */}
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Télécoms</h1>
            <p className="text-xs text-gray-500">Dimensionnement</p>
          </div>
        </div>
        
        {/* Bouton fermer pour mobile */}
        {onClose && (
          <button
            type="button"
            className="ml-auto rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden"
            onClick={onClose}
          >
            <span className="sr-only">Fermer la navigation</span>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href || 
                          (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
          
          return (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-fast',
                'hover:bg-gray-50 hover:text-gray-900',
                isActive
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                  : 'text-gray-600'
              )}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              <div className="flex flex-col">
                <span className="font-medium">{item.name}</span>
                <span className={cn(
                  'text-xs transition-colors duration-fast',
                  isActive ? 'text-primary-600' : 'text-gray-400'
                )}>
                  {item.description}
                </span>
              </div>
              
              {/* Indicateur d'état actif */}
              {isActive && (
                <div className="ml-auto h-2 w-2 rounded-full bg-primary-600" />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer de la sidebar */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-600">👤</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Utilisateur</p>
            <p className="text-xs text-gray-500 truncate">Ingénieur Télécoms</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 