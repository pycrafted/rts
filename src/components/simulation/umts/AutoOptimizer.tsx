import React, { useState, useEffect } from 'react';
import { useUMTSSimulationStore } from './useUMTSSimulationStore';

interface AutoOptimizerProps {
  currentFps: number;
  targetFps?: number;
}

export const AutoOptimizer: React.FC<AutoOptimizerProps> = ({ 
  currentFps, 
  targetFps = 30 
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationLevel, setOptimizationLevel] = useState<'low' | 'medium' | 'high'>('low');
  
  const {
    numberOfUsers,
    setNumberOfUsers,
    setShowInterference,
    setShowHandovers
  } = useUMTSSimulationStore();

  // Optimisation automatique basée sur les FPS
  useEffect(() => {
    if (currentFps < targetFps && !isOptimizing) {
      setIsOptimizing(true);
      
      // Appliquer des optimisations progressives
      if (currentFps < 20) {
        // Optimisations agressives
        setOptimizationLevel('high');
        setShowInterference(false);
        setShowHandovers(false);
        if (numberOfUsers > 20) {
          setNumberOfUsers(20);
        }
      } else if (currentFps < 25) {
        // Optimisations modérées
        setOptimizationLevel('medium');
        setShowInterference(false);
        if (numberOfUsers > 30) {
          setNumberOfUsers(30);
        }
      } else {
        // Optimisations légères
        setOptimizationLevel('low');
        if (numberOfUsers > 40) {
          setNumberOfUsers(40);
        }
      }
      
      // Réactiver l'optimisation après un délai
      setTimeout(() => setIsOptimizing(false), 2000);
    }
  }, [currentFps, targetFps, isOptimizing, numberOfUsers, setNumberOfUsers, setShowInterference, setShowHandovers]);

  const getOptimizationStatus = () => {
    if (currentFps >= targetFps) return { color: 'text-green-600', status: 'Optimal' };
    if (optimizationLevel === 'high') return { color: 'text-red-600', status: 'Optimisation maximale' };
    if (optimizationLevel === 'medium') return { color: 'text-yellow-600', status: 'Optimisation modérée' };
    return { color: 'text-blue-600', status: 'Optimisation légère' };
  };

  const optimizationStatus = getOptimizationStatus();

  return (
    <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg min-w-[280px]">
      <h4 className="text-sm font-semibold text-gray-800 mb-3">⚡ Auto-Optimizer</h4>
      
      <div className="space-y-2 text-xs">
        {/* Status d'optimisation */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className={`font-semibold ${optimizationStatus.color}`}>
            {optimizationStatus.status}
          </span>
        </div>
        
        {/* FPS actuels */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">FPS actuels:</span>
          <span className={`font-mono font-bold ${
            currentFps >= targetFps ? 'text-green-600' : 'text-red-600'
          }`}>
            {currentFps}
          </span>
        </div>
        
        {/* FPS cible */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">FPS cible:</span>
          <span className="font-mono">{targetFps}</span>
        </div>
        
        {/* Niveau d'optimisation */}
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Niveau:</span>
          <span className="font-semibold capitalize">{optimizationLevel}</span>
        </div>
      </div>
      
      {/* Barre de performance */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Performance</span>
          <span>{currentFps}/{targetFps} FPS</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              currentFps >= targetFps ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((currentFps / targetFps) * 100, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Optimisations appliquées */}
      {currentFps < targetFps && (
        <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
          <p className="text-blue-800 font-semibold mb-1">🔧 Optimisations appliquées:</p>
          <ul className="text-blue-700 space-y-1">
            {optimizationLevel === 'high' && (
              <>
                <li>• Interférences désactivées</li>
                <li>• Handovers désactivés</li>
                <li>• Utilisateurs limités à 20</li>
              </>
            )}
            {optimizationLevel === 'medium' && (
              <>
                <li>• Interférences désactivées</li>
                <li>• Utilisateurs limités à 30</li>
              </>
            )}
            {optimizationLevel === 'low' && (
              <li>• Utilisateurs limités à 40</li>
            )}
          </ul>
        </div>
      )}
      
      {/* Indicateur d'optimisation en cours */}
      {isOptimizing && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
          <div className="flex items-center text-yellow-800">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-600 mr-2"></div>
            <span>Optimisation en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
}; 