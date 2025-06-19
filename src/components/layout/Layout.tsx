// Layout component for the redesigned application
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { cn } from '../../utils/cn';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSettingsStore } from '../../stores/settingsStore';
import { PerformanceMonitor } from '../common/PerformanceMonitor';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useSettingsStore();

  // Mémoriser les classes CSS pour éviter les recalculs
  const layoutClasses = useMemo(() => cn(
    "min-h-screen",
    darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
  ), [darkMode]);

  const sidebarClasses = useMemo(() => cn(
    'fixed inset-y-0 left-0 z-50 w-72 transform shadow-xl transition-transform duration-300 ease-in-out lg:hidden',
    darkMode ? 'bg-gray-800' : 'bg-white',
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  ), [darkMode, sidebarOpen]);

  // Optimiser les callbacks pour éviter les re-renders
  const handleMenuClick = useCallback(() => setSidebarOpen(true), []);
  const handleSidebarClose = useCallback(() => setSidebarOpen(false), []);

  // Appliquer le thème sombre au niveau du document - optimisé
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={layoutClasses}>
      {/* Sidebar pour desktop - mémorisé */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <Sidebar />
      </div>

      {/* Overlay pour mobile - conditionnel */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={handleSidebarClose}
        />
      )}

      {/* Sidebar mobile - mémorisé */}
      <div className={sidebarClasses}>
        <Sidebar onClose={handleSidebarClose} />
      </div>

      {/* Contenu principal */}
      <div className="lg:pl-72">
        <Header onMenuClick={handleMenuClick} />
        
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Performance Monitor - seulement en mode développement ou si activé */}
      <PerformanceMonitor showDetails={process.env.NODE_ENV === 'development'} />
    </div>
  );
};

export default Layout; 