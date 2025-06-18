import React, { useState } from 'react';

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
  onDefectAdd: (defect: { type: 'bend' | 'break' | 'dirty' | 'wet'; position: number; severity: number }) => void;
}

const OptiqueMaintenance: React.FC<OptiqueMaintenanceProps> = ({
  onScenarioSelect,
  onDefectAdd
}) => {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleScenarioSelect = (scenarioId: string) => {
    setSelectedScenario(scenarioId);
    const scenario = maintenanceScenarios.find(s => s.id === scenarioId);
    if (scenario) {
      onScenarioSelect(scenario);
      // Ajouter les défauts du scénario
      scenario.defects.forEach(defect => onDefectAdd(defect));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Scénarios de Maintenance</h3>
        <button
          onClick={() => setShowTutorial(!showTutorial)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showTutorial ? 'Masquer Tutoriel' : 'Afficher Tutoriel'}
        </button>
      </div>

      {showTutorial && (
        <div className="p-4 bg-blue-50 rounded-lg mb-4">
          <h4 className="font-medium text-blue-800 mb-2">Comment utiliser les scénarios</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
            <li>Sélectionnez un scénario dans la liste</li>
            <li>Suivez les étapes dans l'ordre indiqué</li>
            <li>Utilisez les outils de mesure pour diagnostiquer</li>
            <li>Appliquez les corrections nécessaires</li>
            <li>Vérifiez les résultats dans le bilan de liaison</li>
          </ol>
        </div>
      )}

      <div className="space-y-4">
        {maintenanceScenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              selectedScenario === scenario.id
                ? 'bg-blue-50 border-blue-500'
                : 'bg-white border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => handleScenarioSelect(scenario.id)}
          >
            <h4 className="font-medium text-gray-900">{scenario.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
            
            {selectedScenario === scenario.id && (
              <div className="mt-3">
                <h5 className="text-sm font-medium text-gray-700 mb-2">Étapes :</h5>
                <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                  {scenario.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <h4 className="font-medium text-green-800 mb-2">Conseils de Maintenance</h4>
        <ul className="list-disc list-inside space-y-2 text-sm text-green-700">
          <li>Toujours nettoyer les connecteurs avant les mesures</li>
          <li>Vérifier les courbures de la fibre (rayon minimum)</li>
          <li>Documenter toutes les interventions</li>
          <li>Utiliser des outils de mesure calibrés</li>
          <li>Respecter les procédures de sécurité</li>
        </ul>
      </div>
    </div>
  );
};

export default OptiqueMaintenance; 