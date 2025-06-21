import React, { useState } from 'react';
import InfoBulle from '@/components/common/InfoBulle';

interface MaintenanceScenario {
  id: string;
  title: string;
  description: string;
  steps: string[];
  defects: Array<{
    type: 'bend' | 'break' | 'dirty' | 'wet';
    position: number;
    severity: number;
  }>;
}

const maintenanceScenarios: MaintenanceScenario[] = [
  {
    id: 'scenario1',
    title: 'Dépannage de base',
    description: 'Apprenez à identifier et réparer les problèmes courants de fibre optique.',
    steps: [
      'Vérifier la continuité de la fibre',
      'Identifier les points de perte',
      'Nettoyer les connecteurs',
      'Vérifier les épissures',
      'Mesurer l\'atténuation'
    ],
    defects: [
      { type: 'dirty', position: 30, severity: 0.7 },
      { type: 'bend', position: 60, severity: 0.5 }
    ]
  },
  {
    id: 'scenario2',
    title: 'Maintenance préventive',
    description: 'Scénario de maintenance préventive pour éviter les pannes.',
    steps: [
      'Inspection visuelle de la fibre',
      'Mesure de l\'atténuation',
      'Vérification des connecteurs',
      'Nettoyage des épissures',
      'Documentation des mesures'
    ],
    defects: [
      { type: 'wet', position: 40, severity: 0.3 },
      { type: 'dirty', position: 70, severity: 0.4 }
    ]
  },
  {
    id: 'scenario3',
    title: 'Urgence - Fibre cassée',
    description: 'Gestion d\'une situation d\'urgence avec une fibre cassée.',
    steps: [
      'Localiser le point de rupture',
      'Préparer le matériel de réparation',
      'Réaliser une épissure de secours',
      'Vérifier la continuité',
      'Planifier la réparation définitive'
    ],
    defects: [
      { type: 'break', position: 50, severity: 0.9 }
    ]
  }
];

interface OptiqueMaintenanceProps {
  onScenarioSelect: (scenario: MaintenanceScenario) => void;
}

const OptiqueMaintenance: React.FC<OptiqueMaintenanceProps> = ({ onScenarioSelect }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null);

  const handleScenarioSelect = (scenario: MaintenanceScenario) => {
    setSelectedScenarioId(scenario.id);
    onScenarioSelect(scenario);
  };

  const selectedScenario = maintenanceScenarios.find(s => s.id === selectedScenarioId);

  return (
    <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
      <div>
        <label className="flex items-center font-medium text-slate-300 mb-2">
          Scénarios Pédagogiques
          <InfoBulle content="Simulez des pannes communes pour apprendre à les diagnostiquer." />
        </label>
        <div className="flex flex-col sm:flex-wrap sm:flex-row gap-2">
          {maintenanceScenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleScenarioSelect(scenario)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors touch-manipulation min-h-[32px] flex items-center justify-center ${
                selectedScenarioId === scenario.id
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
              }`}
            >
              {scenario.title}
            </button>
          ))}
        </div>
      </div>

      {selectedScenario && (
        <div className="p-2 sm:p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          <p className="text-slate-300 text-xs italic mb-2">{selectedScenario.description}</p>
          <h5 className="text-xs sm:text-sm font-semibold text-cyan-400 mb-2">Étapes à suivre :</h5>
          <ol className="list-decimal list-inside space-y-1 text-slate-300 text-xs">
            {selectedScenario.steps.map((step, index) => (
              <li key={index} className="leading-relaxed">{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default OptiqueMaintenance; 