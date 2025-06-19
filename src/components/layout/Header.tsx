import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import Button from '../ui/Button';
import SettingsModal from '../common/SettingsModal';
import { useSettingsStore } from '../../stores/settingsStore';

interface HeaderProps {
  onMenuClick: () => void;
}

const getPageTitle = (pathname: string) => {
  const pathMap: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/gsm': 'Dimensionnement GSM',
    '/umts': 'Dimensionnement UMTS',
    '/hertzien': 'Liaisons Hertziennes',
    '/optique': 'Liaisons Optiques',
    '/simulation': 'Simulations',
    '/simulation/optique': 'Simulation Optique',
    '/simulation/hertzien': 'Simulation Hertzien',
    '/simulation/gsm': 'Simulation GSM',
    '/simulation/umts': 'Simulation UMTS',
  };
  
  return pathMap[pathname] || 'Page';
};

const getBreadcrumbs = (pathname: string) => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Accueil', href: '/dashboard' }];
  
  let currentPath = '';
  segments.forEach((segment, _index) => {
    currentPath += `/${segment}`;
    const name = getPageTitle(currentPath);
    if (name !== 'Page') {
      breadcrumbs.push({ name, href: currentPath });
    }
  });
  
  return breadcrumbs;
};

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const breadcrumbs = getBreadcrumbs(location.pathname);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { darkMode } = useSettingsStore();

  return (
    <>
      <header className={cn(
        "shadow-sm border-b",
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      )}>
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Section gauche - Menu et titre */}
            <div className="flex items-center space-x-4">
              {/* Bouton menu mobile */}
              <button
                type="button"
                className={cn(
                  "rounded-md p-2 hover:bg-opacity-10 lg:hidden",
                  darkMode ? "text-gray-400 hover:text-gray-300 hover:bg-white" : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                )}
                onClick={onMenuClick}
              >
                <span className="sr-only">Ouvrir la navigation</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Titre de la page */}
              <div className="hidden sm:block">
                <h1 className={cn(
                  "text-xl font-semibold",
                  darkMode ? "text-white" : "text-gray-900"
                )}>
                  {pageTitle}
                </h1>
              </div>
            </div>

            {/* Section droite - Actions */}
            <div className="flex items-center space-x-4">
              {/* Breadcrumbs pour desktop */}
              <nav className="hidden md:flex items-center space-x-2 text-sm">
                {breadcrumbs.map((breadcrumb, breadcrumbIndex) => (
                  <React.Fragment key={breadcrumb.href}>
                    {breadcrumbIndex > 0 && (
                      <svg className={cn(
                        "h-4 w-4",
                        darkMode ? "text-gray-600" : "text-gray-300"
                      )} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={cn(
                      'transition-colors duration-fast',
                      breadcrumbIndex === breadcrumbs.length - 1 
                        ? darkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'
                        : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                    )}>
                      {breadcrumb.name}
                    </span>
                  </React.Fragment>
                ))}
              </nav>

              {/* Actions rapides */}
              <div className="flex items-center space-x-2">
                <Button
                  variant={darkMode ? "ghost" : "outline"}
                  size="sm"
                  icon="📊"
                  className="hidden sm:inline-flex"
                >
                  Export
                </Button>
                
                <Button
                  variant={darkMode ? "ghost" : "outline"}
                  size="sm"
                  icon="⚙️"
                  className="hidden sm:inline-flex"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  Paramètres
                </Button>

                {/* Notifications */}
                <button
                  type="button"
                  className={cn(
                    "relative rounded-full p-2",
                    darkMode 
                      ? "text-gray-400 hover:text-gray-300 hover:bg-white hover:bg-opacity-10"
                      : "text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                  )}
                >
                  <span className="sr-only">Voir les notifications</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75a6 6 0 01-6 6h12a6 6 0 01-6-6V9.75a6 6 0 00-6-6z" />
                  </svg>
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-error-500"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Modal des paramètres */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />
    </>
  );
};

export default Header; 