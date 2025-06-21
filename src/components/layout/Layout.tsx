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
  const [isMobile, setIsMobile] = useState(false);
  const { darkMode } = useSettingsStore();

  // Détection mobile optimisée
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mémoriser les classes CSS pour éviter les recalculs
  const layoutClasses = useMemo(() => cn(
    "min-h-screen",
    "pt-safe-top pb-safe-bottom", // Support des safe areas iOS
    darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
  ), [darkMode]);

  const sidebarClasses = useMemo(() => cn(
    'fixed inset-y-0 left-0 z-50 w-72 transform shadow-xl transition-transform duration-300 ease-in-out',
    'lg:hidden', // Caché sur desktop
    darkMode ? 'bg-gray-800' : 'bg-white',
    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
  ), [darkMode, sidebarOpen]);

  const mainContentClasses = useMemo(() => cn(
    'transition-all duration-300 ease-in-out',
    'lg:pl-72', // Padding pour sidebar desktop
    isMobile ? 'pl-0' : 'lg:pl-72'
  ), [isMobile]);

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
      <div className={mainContentClasses}>
        <Header onMenuClick={handleMenuClick} />
        
        <main className="py-4 sm:py-6">
          <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
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