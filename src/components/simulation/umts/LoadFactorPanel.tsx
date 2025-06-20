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
    if (loadFactor < 0.3) return 'text-lime-400';
    if (loadFactor < 0.6) return 'text-yellow-300';
    if (loadFactor < 0.8) return 'text-orange-400';
    return 'text-red-500';
  };

  const getQoSColor = (qos: string) => {
    switch (qos) {
      case 'excellent': return 'text-lime-400';
      case 'good': return 'text-yellow-300';
      case 'fair': return 'text-orange-400';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-400';
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

  const getLoadFactorStatus = (loadFactor: number) => {
    if (loadFactor < 0.3) return { status: 'Excellent', color: 'text-lime-400', icon: '🟢' };
    if (loadFactor < 0.6) return { status: 'Bon', color: 'text-yellow-300', icon: '🟡' };
    if (loadFactor < 0.8) return { status: 'Moyen', color: 'text-orange-400', icon: '🟠' };
    return { status: 'Critique', color: 'text-red-500', icon: '🔴' };
  };

  const loadFactorStatus = getLoadFactorStatus(loadFactor);

  return (
    <div className="w-80 bg-slate-900 shadow-lg p-6 overflow-y-auto max-h-screen">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">📡 Simulation UMTS</h2>
        <p className="text-slate-300 text-sm mb-3">
          Étudiez l'impact des paramètres sur le facteur de charge et la qualité de service UMTS.
        </p>
        
        {/* Info pédagogique rapide */}
        <div className="p-3 bg-slate-800 rounded-lg mb-4 border border-slate-700">
          <p className="text-xs text-slate-300">
            <strong>💡 TP Objectif :</strong> Comprendre comment le nombre d'utilisateurs, 
            le débit et l'activité affectent la capacité d'un réseau UMTS.
          </p>
        </div>
      </div>

      {/* Scénarios prédéfinis */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">🎯 Scénarios prédéfinis</h3>
        <ScenarioDropdown />
      </div>

      {/* Résultats en temps réel avec explications */}
      <div className="mb-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-3">📊 Résultats en temps réel</h3>
        
        <div className="space-y-4">
          <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-200 font-medium">Facteur de charge:</span>
              <span className={`font-bold text-lg ${getLoadFactorColor(loadFactor)}`}>
                {(loadFactor * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center text-sm">
              <span className="mr-2">{loadFactorStatus.icon}</span>
              <span className={loadFactorStatus.color}>{loadFactorStatus.status}</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Mesure l'utilisation de la capacité du réseau WCDMA
            </p>
          </div>
          
          <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-green-500">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-200 font-medium">Qualité de service:</span>
              <span className={`font-bold ${getQoSColor(qosLevel)}`}>
                {getQoSIcon(qosLevel)} {qosLevel.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Qualité perçue par l'utilisateur final
            </p>
          </div>
          
          <div className="bg-slate-700 p-3 rounded-lg border-l-4 border-purple-500">
            <div className="flex justify-between items-center mb-1">
              <span className="text-slate-200 font-medium">Node Bs requis:</span>
              <span className="font-bold text-blue-400">
                {numberOfNodeBsRequired}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Nombre de stations de base nécessaires
            </p>
          </div>
        </div>
      </div>

      {/* Contrôles des paramètres avec explications */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-white mb-4">⚙️ Paramètres de simulation</h3>
        
        {/* Nombre d'utilisateurs */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            👥 Nombre d'utilisateurs: <span className="text-blue-400 font-bold">{numberOfUsers}</span>
          </label>
          <input
            type="range"
            min="1"
            max="200"
            value={numberOfUsers}
            onChange={(e) => setNumberOfUsers(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1</span>
            <span>100</span>
            <span>200</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            <strong>Impact :</strong> Plus d'utilisateurs = facteur de charge plus élevé
          </p>
        </div>

        {/* Débit par utilisateur */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            📶 Débit par utilisateur: <span className="text-blue-400 font-bold">{dataRatePerUser} kbps</span>
          </label>
          <input
            type="range"
            min="64"
            max="1024"
            step="64"
            value={dataRatePerUser}
            onChange={(e) => setDataRatePerUser(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>64 kbps</span>
            <span>512 kbps</span>
            <span>1024 kbps</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            <strong>Impact :</strong> Débit plus élevé = charge réseau plus importante
          </p>
        </div>

        {/* Facteur d'activité */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            ⚡ Facteur d'activité: <span className="text-blue-400 font-bold">{(activityFactor * 100).toFixed(0)}%</span>
          </label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={activityFactor}
            onChange={(e) => setActivityFactor(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>10%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            <strong>Impact :</strong> Pourcentage de temps où l'utilisateur transmet des données
          </p>
        </div>

        {/* Type de service */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            🎯 Type de service
          </label>
          <select
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value as 'voice' | 'data' | 'video')}
            className="w-full p-2 border border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-slate-700 text-white"
          >
            <option value="voice">📞 Voix (12.2 kbps)</option>
            <option value="data">📱 Données (64-384 kbps)</option>
            <option value="video">🎥 Vidéo (128-512 kbps)</option>
          </select>
          <p className="text-xs text-slate-400 mt-2">
            <strong>Impact :</strong> Détermine le débit requis par utilisateur
          </p>
        </div>

        {/* Puissance d'émission Node B */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <label className="block text-sm font-medium text-slate-200 mb-2">
            📡 Puissance Node B: <span className="text-blue-400 font-bold">{nodeBTransmitPower} dBm</span>
          </label>
          <input
            type="range"
            min="30"
            max="50"
            step="1"
            value={nodeBTransmitPower}
            onChange={(e) => setNodeBTransmitPower(Number(e.target.value))}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>30 dBm</span>
            <span>40 dBm</span>
            <span>50 dBm</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            <strong>Impact :</strong> Puissance d'émission de la station de base
          </p>
        </div>

        {/* Options d'affichage */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
          <h4 className="text-sm font-medium text-slate-200 mb-3">🔧 Options d'affichage</h4>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="interference"
                checked={showInterference}
                onChange={(e) => setShowInterference(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
              />
              <label htmlFor="interference" className="ml-2 text-sm text-slate-200">
                Afficher les zones d'interférence
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="handovers"
                checked={showHandovers}
                onChange={(e) => setShowHandovers(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-600 rounded bg-slate-700"
              />
              <label htmlFor="handovers" className="ml-2 text-sm text-slate-200">
                Afficher les handovers
              </label>
            </div>
          </div>
        </div>

        {/* Bouton de réinitialisation */}
        <button
          onClick={resetToDefaults}
          className="w-full bg-slate-600 hover:bg-slate-500 text-white font-medium py-3 px-4 rounded-md transition duration-200"
        >
          🔄 Réinitialiser aux valeurs par défaut
        </button>
      </div>

      {/* Informations pédagogiques étendues */}
      <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
        <h4 className="text-sm font-medium text-slate-200 mb-3">📚 Concepts clés UMTS</h4>
        <div className="text-xs text-slate-300 space-y-2">
          <p><strong>🔗 WCDMA :</strong> Technique d'accès multiple qui permet à plusieurs utilisateurs de partager la même bande de fréquence simultanément.</p>
          <p><strong>📊 Facteur de charge :</strong> Mesure l'utilisation de la capacité du réseau. Un facteur élevé indique une congestion potentielle.</p>
          <p><strong>📱 Node B :</strong> Station de base UMTS qui gère les communications avec les terminaux mobiles.</p>
          <p><strong>🎯 QoS :</strong> Qualité de Service qui détermine l'expérience utilisateur (débit, latence, etc.).</p>
        </div>
      </div>

      {/* Conseils pour le TP */}
      <div className="mt-4 p-4 bg-yellow-900 bg-opacity-30 rounded-lg border border-yellow-700">
        <h4 className="text-sm font-medium text-yellow-200 mb-2">💡 Conseils pour le TP</h4>
        <div className="text-xs text-yellow-100 space-y-1">
          <p>• Commencez avec peu d'utilisateurs et augmentez progressivement</p>
          <p>• Observez quand le facteur de charge devient critique (&gt;80%)</p>
          <p>• Testez différents types de services pour voir leur impact</p>
          <p>• Notez le nombre de Node Bs requis pour maintenir la QoS</p>
        </div>
      </div>
    </div>
  );
}; 