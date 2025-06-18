import React from 'react';
import OptiqueSimulationView from '../components/optique/simulation/OptiqueSimulationView';

const OptiqueSimulation: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Simulation Optique</h1>
      <OptiqueSimulationView />
    </div>
  );
};

export default OptiqueSimulation; 