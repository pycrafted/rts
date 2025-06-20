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
    <div className="p-4 sm:p-6 bg-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-cyan-300">Laboratoire de Fibre Optique</h1>
        <p className="text-slate-400 mb-6">
          Une simulation interactive pour visualiser l'impact des paramètres physiques sur un bilan de liaison optique.
        </p>
        <OptiqueSimulationView />
      </div>
    </div>
  );
};

export default OptiqueSimulation; 