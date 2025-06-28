import React, { useState, useEffect, useCallback } from 'react';
import { useElectron } from '../../services/electronService';

interface ElectronStatusProps {
  className?: string;
}

export const ElectronStatus: React.FC<ElectronStatusProps> = ({ className = '' }) => {
  const { isElectron, service, isAvailable } = useElectron();
  const [memoryUsage, setMemoryUsage] = useState<number | null>(null);
  const [appVersion, setAppVersion] = useState<string>('1.0.0');

  // Optimisation : Mise à jour moins fréquente de l'utilisation mémoire
  const updateMemoryUsage = useCallback(() => {
    if (window.electronPerformance?.getMemoryUsage) {
      const memory = window.electronPerformance.getMemoryUsage();
      if (memory) {
        setMemoryUsage(Math.round(memory.usedJSHeapSize / 1024 / 1024));
      }
    }
  }, []);

  useEffect(() => {
    const loadAppVersion = async () => {
      if (isAvailable && service) {
        try {
          const version = await service.getAppVersion();
          setAppVersion(version);
        } catch (error) {
          console.error('Erreur chargement version:', error);
          setAppVersion('1.0.0');
        }
      }
    };

    loadAppVersion();
  }, [isAvailable, service]);

  useEffect(() => {
    // Mise à jour initiale de la mémoire
    updateMemoryUsage();

    // Mise à jour moins fréquente (toutes les 10 secondes au lieu de 5)
    const interval = setInterval(updateMemoryUsage, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [updateMemoryUsage]);

  // Ne pas afficher si pas en mode Electron
  if (!isElectron) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 text-xs text-gray-600 ${className}`}>
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>Electron</span>
      </div>
      
      {appVersion && (
        <span className="text-gray-500">v{appVersion}</span>
      )}
      
      {memoryUsage !== null && (
        <span className="text-gray-500">
          {memoryUsage} MB
        </span>
      )}
    </div>
  );
};

export default ElectronStatus; 