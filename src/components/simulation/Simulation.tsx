import React from 'react';
import SimulationView from './SimulationView';

const Simulation: React.FC = () => {
  return (
    <div className="h-screen">
      <SimulationView isActive={false} />
    </div>
  );
};

export default Simulation;