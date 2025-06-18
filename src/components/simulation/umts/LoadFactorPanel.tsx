import React from 'react';
import { useUMTSSimulationStore } from './useUMTSSimulationStore';
import { ScenarioDropdown } from './ScenarioDropdown';

export const LoadFactorPanel: React.FC = () => {
  const {
    numberOfUsers,
    dataRatePerUser,
    activityFactor,
    serviceType,
    nodeBTransmitPower,
    showInterference,
    showHandovers,
    loadFactor,
    qosLevel,
    numberOfNodeBsRequired,
    setNumberOfUsers,
    setDataRatePerUser,
    setActivityFactor,
    setServiceType,
    setNodeBTransmitPower,
    setShowInterference,
    setShowHandovers,
    resetToDefaults
  } = useUMTSSimulationStore();

  const getLoadFactorColor = (loadFactor: number) => {
    if (loadFactor < 0.3) return 'text-green-600';
    if (loadFactor < 0.6) return 'text-yellow-600';
    if (loadFactor < 0.8) return 'text-orange-600';
    return 'text-red-600';
  };

  const getQoSColor = (qos: string) => {
    switch (qos) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-yellow-600';
      case 'fair': return 'text-orange-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getQoSIcon = (qos: string) => {
    switch (qos) {
      case 'excellent': return '🟢';
      case 'good': return '🟡';
      case 'fair': return '🟠';
      case 'poor': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="w-80 bg-white shadow-lg rounded-lg p-6 overflow-y-auto max-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Simulation UMTS</h2>
        <p className="text-gray-600 text-sm">
          Ajustez les paramètres pour voir l'impact sur le facteur de charge et la qualité de service.
        </p>
      </div>

      {/* Scénarios prédéfinis */}
      <ScenarioDropdown />

      {/* Résultats en temps réel */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">📊 Résultats en temps réel</h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Facteur de charge:</span>
            <span className={`font-bold ${getLoadFactorColor(loadFactor)}`}>
              {(loadFactor * 100).toFixed(1)}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Qualité de service:</span>
            <span className={`font-bold ${getQoSColor(qosLevel)}`}>
              {getQoSIcon(qosLevel)} {qosLevel.toUpperCase()}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Node Bs requis:</span>
            <span className="font-bold text-blue-600">
              {numberOfNodeBsRequired}
            </span>
          </div>
        </div>
      </div>

      {/* Contrôles des paramètres */}
      <div className="space-y-6">
        {/* Nombre d'utilisateurs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            👥 Nombre d'utilisateurs: {numberOfUsers}
          </label>
          <input
            type="range"
            min="1"
            max="200"
            value={numberOfUsers}
            onChange={(e) => setNumberOfUsers(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>100</span>
            <span>200</span>
          </div>
        </div>

        {/* Débit par utilisateur */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📶 Débit par utilisateur: {dataRatePerUser} kbps
          </label>
          <input
            type="range"
            min="64"
            max="1024"
            step="64"
            value={dataRatePerUser}
            onChange={(e) => setDataRatePerUser(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>64 kbps</span>
            <span>512 kbps</span>
            <span>1024 kbps</span>
          </div>
        </div>

        {/* Facteur d'activité */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⚡ Facteur d'activité: {(activityFactor * 100).toFixed(0)}%
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={activityFactor}
            onChange={(e) => setActivityFactor(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Type de service */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎯 Type de service
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as 'voice' | 'data' | 'video')}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="voice">📞 Voix (12.2 kbps)</option>
            <option value="data">📱 Données (64-384 kbps)</option>
            <option value="video">🎥 Vidéo (128-512 kbps)</option>
          </select>
        </div>

        {/* Puissance d'émission Node B */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📡 Puissance Node B: {nodeBTransmitPower} dBm
          </label>
          <input
            type="range"
            min="30"
            max="50"
            step="1"
            value={nodeBTransmitPower}
            onChange={(e) => setNodeBTransmitPower(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>30 dBm</span>
            <span>40 dBm</span>
            <span>50 dBm</span>
          </div>
        </div>

        {/* Options d'affichage */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">🔧 Options d'affichage</h4>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="interference"
              checked={showInterference}
              onChange={(e) => setShowInterference(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="interference" className="ml-2 text-sm text-gray-700">
              Afficher les zones d'interférence
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="handovers"
              checked={showHandovers}
              onChange={(e) => setShowHandovers(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="handovers" className="ml-2 text-sm text-gray-700">
              Afficher les handovers
            </label>
          </div>
        </div>

        {/* Bouton de réinitialisation */}
        <button
          onClick={resetToDefaults}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          🔄 Réinitialiser aux valeurs par défaut
        </button>
      </div>

      {/* Informations pédagogiques */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">📚 Informations pédagogiques</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p>• <strong>Facteur de charge:</strong> Mesure l'utilisation de la capacité du réseau</p>
          <p>• <strong>QoS:</strong> Qualité de Service perçue par l'utilisateur</p>
          <p>• <strong>Node B:</strong> Station de base UMTS (équivalent BTS en GSM)</p>
          <p>• <strong>WCDMA:</strong> Technique d'accès multiple utilisée en UMTS</p>
        </div>
      </div>
    </div>
  );
}; 