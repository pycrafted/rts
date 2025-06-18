/**
 * Page principale de simulation hertzienne
 * 
 * Cette page gère la simulation des liaisons hertziennes avec :
 * - Un en-tête avec le titre
 * - Des boutons pour basculer entre le bilan de liaison et l'analyse des obstacles
 * - La vue principale de simulation (SimulationView)
 * 
 * @component
 */
import React, { useState } from 'react';
import SimulationView from '@/components/simulation/SimulationView';

const HertzienSimulation: React.FC = () => {
  // État pour suivre le mode actif (bilan de liaison ou obstacles)
  const [isActive, setIsActive] = useState<boolean>(false);

  return (
    <div className="p-6 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold mb-6 text-blue-800">Simulation Hertzien</h2>
        
        {/* Contrôles de navigation */}
        <div className="mb-6">
          <div className="flex space-x-4 mb-4">
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
              onClick={() => setIsActive(false)}
            >
              Bilan de Liaison
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" 
              onClick={() => setIsActive(true)}
            >
              Obstacles
            </button>
          </div>
        </div>

        {/* Vue de simulation */}
        <SimulationView isActive={isActive} />
      </div>
    </div>
  );
};

export default HertzienSimulation; 