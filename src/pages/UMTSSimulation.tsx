import React from 'react';
import { SimulationUMTS } from '../components/simulation/umts/SimulationUMTS';

export const UMTSSimulation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <SimulationUMTS />
    </div>
  );
}; 