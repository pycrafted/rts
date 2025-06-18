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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-blue-800">Simulation Optique</h1>
      <OptiqueSimulationView />
    </div>
  );
};

export default OptiqueSimulation; 