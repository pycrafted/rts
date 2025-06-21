/**
 * Page principale de simulation optique
 * 
 * Cette page sert de conteneur pour la simulation optique et inclut :
 * - Un en-tête avec le titre
 * - La vue principale de simulation (OptiqueSimulationView)
 * 
 * @component
 */
import React from 'react';
import OptiqueSimulationView from '@/components/optique/simulation/OptiqueSimulationView';

const OptiqueSimulation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-2 sm:p-4 lg:p-6">
      {/* Header responsive */}
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
          🌐 Simulation Optique
        </h1>
        <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-4xl">
          Visualisez et analysez les performances de votre réseau fibre optique en temps réel. 
          Simulez différents scénarios de déploiement et identifiez les points d'amélioration.
        </p>
      </div>

      {/* Conteneur principal responsive */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        {/* Barre d'outils responsive */}
        <div className="bg-slate-800/80 border-b border-slate-700 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm sm:text-base text-green-400 font-medium">Simulation Active</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-slate-600"></div>
              <div className="text-xs sm:text-sm text-slate-400">
                Mode: <span className="text-cyan-400 font-medium">Temps Réel</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm rounded-lg transition-colors touch-manipulation">
                🔄 Actualiser
              </button>
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm rounded-lg transition-colors touch-manipulation">
                📊 Exporter
              </button>
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs sm:text-sm rounded-lg transition-colors touch-manipulation">
                ⚙️ Paramètres
              </button>
            </div>
          </div>
        </div>

        {/* Zone de simulation */}
        <div className="h-[calc(100vh-200px)] sm:h-[calc(100vh-250px)] lg:h-[calc(100vh-300px)]">
          <OptiqueSimulationView />
        </div>
      </div>

      {/* Footer informatif */}
      <div className="mt-4 sm:mt-6 text-center">
        <p className="text-xs sm:text-sm text-slate-500">
          💡 <span className="text-cyan-400">Astuce:</span> Utilisez les contrôles flottants sur mobile pour accéder aux paramètres
        </p>
      </div>
    </div>
  );
};

export default OptiqueSimulation; 