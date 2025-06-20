import React from 'react';
import { useUMTSSimulationStore } from './useUMTSSimulationStore';

interface Scenario {
  id: string;
  name: string;
  description: string;
  numberOfUsers: number;
  dataRatePerUser: number;
  activityFactor: number;
  serviceType: 'voice' | 'data' | 'video';
  nodeBTransmitPower: number;
}

const scenarios: Scenario[] = [
  {
    id: 'voice-basic',
    name: '📞 Voix - Configuration de base',
    description: 'Scénario typique pour la téléphonie vocale avec charge modérée',
    numberOfUsers: 30,
    dataRatePerUser: 64,
    activityFactor: 0.4,
    serviceType: 'voice',
    nodeBTransmitPower: 43
  },
  {
    id: 'voice-congested',
    name: '📞 Voix - Réseau saturé',
    description: 'Simulation d\'un réseau vocal très chargé (heures de pointe)',
    numberOfUsers: 150,
    dataRatePerUser: 64,
    activityFactor: 0.8,
    serviceType: 'voice',
    nodeBTransmitPower: 45
  },
  {
    id: 'data-moderate',
    name: '📱 Données - Charge modérée',
    description: 'Utilisation typique pour la navigation web et emails',
    numberOfUsers: 50,
    dataRatePerUser: 128,
    activityFactor: 0.3,
    serviceType: 'data',
    nodeBTransmitPower: 43
  },
  {
    id: 'data-heavy',
    name: '📱 Données - Charge élevée',
    description: 'Utilisation intensive (streaming, téléchargements)',
    numberOfUsers: 80,
    dataRatePerUser: 384,
    activityFactor: 0.6,
    serviceType: 'data',
    nodeBTransmitPower: 47
  },
  {
    id: 'video-streaming',
    name: '🎥 Vidéo - Streaming',
    description: 'Scénario pour le streaming vidéo en qualité standard',
    numberOfUsers: 40,
    dataRatePerUser: 256,
    activityFactor: 0.7,
    serviceType: 'video',
    nodeBTransmitPower: 45
  },
  {
    id: 'video-hd',
    name: '🎥 Vidéo - HD/4K',
    description: 'Streaming vidéo haute définition (très gourmand)',
    numberOfUsers: 25,
    dataRatePerUser: 512,
    activityFactor: 0.9,
    serviceType: 'video',
    nodeBTransmitPower: 50
  },
  {
    id: 'mixed-services',
    name: '🔄 Services mixtes',
    description: 'Mélange de voix, données et vidéo (réaliste)',
    numberOfUsers: 60,
    dataRatePerUser: 192,
    activityFactor: 0.5,
    serviceType: 'data',
    nodeBTransmitPower: 44
  },
  {
    id: 'campus-university',
    name: '🎓 Campus universitaire',
    description: 'Environnement universitaire avec forte densité d\'utilisateurs',
    numberOfUsers: 120,
    dataRatePerUser: 256,
    activityFactor: 0.4,
    serviceType: 'data',
    nodeBTransmitPower: 46
  },
  {
    id: 'business-district',
    name: '🏢 Quartier d\'affaires',
    description: 'Zone commerciale avec trafic professionnel intense',
    numberOfUsers: 90,
    dataRatePerUser: 320,
    activityFactor: 0.6,
    serviceType: 'data',
    nodeBTransmitPower: 48
  },
  {
    id: 'rural-area',
    name: '🌾 Zone rurale',
    description: 'Zone rurale avec faible densité mais couverture étendue',
    numberOfUsers: 20,
    dataRatePerUser: 128,
    activityFactor: 0.3,
    serviceType: 'voice',
    nodeBTransmitPower: 50
  }
];

export const ScenarioDropdown: React.FC = () => {
  const {
    setNumberOfUsers,
    setDataRatePerUser,
    setActivityFactor,
    setServiceType,
    setNodeBTransmitPower
  } = useUMTSSimulationStore();

  const loadScenario = (scenario: Scenario) => {
    setNumberOfUsers(scenario.numberOfUsers);
    setDataRatePerUser(scenario.dataRatePerUser);
    setActivityFactor(scenario.activityFactor);
    setServiceType(scenario.serviceType);
    setNodeBTransmitPower(scenario.nodeBTransmitPower);
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-200 mb-2">
        🎯 Scénarios prédéfinis
      </label>
      <select
        onChange={(e) => {
          const scenario = scenarios.find(s => s.id === e.target.value);
          if (scenario) {
            loadScenario(scenario);
          }
        }}
        className="w-full p-2 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
        defaultValue=""
      >
        <option value="" disabled>
          Choisissez un scénario...
        </option>
        {scenarios.map((scenario) => (
          <option key={scenario.id} value={scenario.id}>
            {scenario.name}
          </option>
        ))}
      </select>
      
      {/* Description du scénario sélectionné */}
      <div className="mt-2 p-3 bg-slate-800 rounded-md border border-slate-700">
        <p className="text-xs text-slate-300">
          <strong>💡 Conseil pédagogique:</strong> Commencez par un scénario simple 
          puis explorez des configurations plus complexes pour comprendre l'impact 
          des différents paramètres sur le facteur de charge.
        </p>
      </div>
    </div>
  );
}; 