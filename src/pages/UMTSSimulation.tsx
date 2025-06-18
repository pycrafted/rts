import React from 'react';
import { SimulationUMTS } from '../components/simulation/umts/SimulationUMTS';
import { Header } from '../components/common/Header';

export const UMTSSimulation: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <SimulationUMTS />
    </div>
  );
}; 