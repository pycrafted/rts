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
    if (currentFps >= targetFps) return { color: 'text-lime-400', status: 'Optimal' };
    if (optimizationLevel === 'high') return { color: 'text-red-500', status: 'Optimisation maximale' };
    if (optimizationLevel === 'medium') return { color: 'text-yellow-300', status: 'Optimisation modérée' };
    return { color: 'text-blue-400', status: 'Optimisation légère' };
  };

  const optimizationStatus = getOptimizationStatus();

  return (
    <div className="absolute bottom-4 right-4 bg-slate-800 bg-opacity-90 rounded-lg p-4 shadow-lg min-w-[280px] border border-slate-700 opacity-20 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
      <h4 className="text-sm font-semibold text-white mb-3">⚡ Auto-Optimizer</h4>
      
      <div className="space-y-2 text-xs">
        {/* Status d'optimisation */}
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Status:</span>
          <span className={`font-semibold ${optimizationStatus.color}`}>
            {optimizationStatus.status}
          </span>
        </div>
        
        {/* FPS actuels */}
        <div className="flex justify-between items-center">
          <span className="text-slate-300">FPS actuels:</span>
          <span className={`font-mono font-bold ${
            currentFps >= targetFps ? 'text-lime-400' : 'text-red-500'
          }`}>
            {currentFps}
          </span>
        </div>
        
        {/* FPS cible */}
        <div className="flex justify-between items-center">
          <span className="text-slate-300">FPS cible:</span>
          <span className="font-mono text-slate-300">{targetFps}</span>
        </div>
        
        {/* Niveau d'optimisation */}
        <div className="flex justify-between items-center">
          <span className="text-slate-300">Niveau:</span>
          <span className="font-semibold capitalize text-slate-300">{optimizationLevel}</span>
        </div>
      </div>
      
      {/* Barre de performance */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-slate-300 mb-1">
          <span>Performance</span>
          <span>{currentFps}/{targetFps} FPS</span>
        </div>
        <div className="w-full bg-slate-600 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              currentFps >= targetFps ? 'bg-lime-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min((currentFps / targetFps) * 100, 100)}%` }}
          />
        </div>
      </div>
      
      {/* Optimisations appliquées */}
      {currentFps < targetFps && (
        <div className="mt-3 p-2 bg-blue-900 bg-opacity-30 border border-blue-700 rounded text-xs">
          <p className="text-blue-200 font-semibold mb-1">🔧 Optimisations appliquées:</p>
          <ul className="text-blue-100 space-y-1">
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
        <div className="mt-3 p-2 bg-yellow-900 bg-opacity-30 border border-yellow-700 rounded text-xs">
          <div className="flex items-center text-yellow-200">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-yellow-400 mr-2"></div>
            <span>Optimisation en cours...</span>
          </div>
        </div>
      )}
    </div>
  );
}; 