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
    <div className="h-screen bg-gray-100">
      <div className="h-full flex flex-col">
        {/* En-tête */}
        <div className="bg-white shadow-sm p-4">
          <h2 className="text-xl font-bold text-blue-800">Simulation Hertzien</h2>
          
          {/* Contrôles de navigation */}
          <div className="mt-4">
            <div className="flex space-x-4">
              <button 
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  !isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setIsActive(false)}
              >
                📊 Bilan de Liaison
              </button>
              <button 
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => setIsActive(true)}
              >
                🏔️ Obstacles & Diffraction
              </button>
            </div>
          </div>
        </div>

        {/* Vue de simulation - utilise tout l'espace restant */}
        <div className="flex-1 overflow-hidden">
          <SimulationView isActive={isActive} />
        </div>
      </div>
    </div>
  );
};

export default HertzienSimulation; 