import React, { useState, useMemo } from 'react';
import GsmCoverageScene from './GsmCoverageScene';

interface CoverageSettings {
  coverageRadius: number;
  obstaclePosition: [number, number, number];
  obstacleSize: [number, number, number];
  antennaHeight: number;
}

interface SimulationResults {
  coverageArea: number;
  coverageVolume: number;
  obstacleImpact: number;
  signalStrength: number;
  attenuationBehindObstacle: number;
  effectiveCoverageRadius: number;
}

const GSMCoverageDemo: React.FC = () => {
  const [settings, setSettings] = useState<CoverageSettings>({
    coverageRadius: 5,
    obstaclePosition: [2, 0, 3],
    obstacleSize: [1, 2, 1],
    antennaHeight: 3
  });

  const [showInfo, setShowInfo] = useState(false);

  // Calcul des résultats de simulation
  const simulationResults = useMemo((): SimulationResults => {
    const { coverageRadius, obstaclePosition, obstacleSize, antennaHeight } = settings;
    
    // Calcul de la zone de couverture (surface)
    const coverageArea = Math.PI * coverageRadius * coverageRadius;
    
    // Calcul du volume de couverture
    const coverageVolume = (4/3) * Math.PI * coverageRadius * coverageRadius * coverageRadius;
    
    // Calcul de l'impact de l'obstacle
    const distanceToObstacle = Math.sqrt(
      Math.pow(obstaclePosition[0], 2) + 
      Math.pow(obstaclePosition[1], 2) + 
      Math.pow(obstaclePosition[2], 2)
    );
    
    // Atténuation derrière l'obstacle (simulation simplifiée)
    const obstacleVolume = obstacleSize[0] * obstacleSize[1] * obstacleSize[2];
    const obstacleImpact = Math.min(100, (obstacleVolume / coverageVolume) * 100);
    
    // Force du signal (basée sur la hauteur d'antenne et la distance)
    const signalStrength = Math.max(0, 100 - (distanceToObstacle * 10) + (antennaHeight * 5));
    
    // Atténuation derrière l'obstacle
    const attenuationBehindObstacle = Math.min(90, obstacleImpact * 2);
    
    // Rayon de couverture effectif (considérant l'obstacle)
    const effectiveCoverageRadius = coverageRadius * (1 - obstacleImpact / 200);
    
    return {
      coverageArea,
      coverageVolume,
      obstacleImpact,
      signalStrength,
      attenuationBehindObstacle,
      effectiveCoverageRadius
    };
  }, [settings]);

  const handleRadiusChange = (radius: number) => {
    setSettings(prev => ({ ...prev, coverageRadius: radius }));
  };

  const handleObstaclePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setSettings(prev => ({
      ...prev,
      obstaclePosition: [
        axis === 'x' ? value : prev.obstaclePosition[0],
        axis === 'y' ? value : prev.obstaclePosition[1],
        axis === 'z' ? value : prev.obstaclePosition[2]
      ]
    }));
  };

  const handleObstacleSizeChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setSettings(prev => ({
      ...prev,
      obstacleSize: [
        axis === 'x' ? value : prev.obstacleSize[0],
        axis === 'y' ? value : prev.obstacleSize[1],
        axis === 'z' ? value : prev.obstacleSize[2]
      ]
    }));
  };

  const handleAntennaHeightChange = (height: number) => {
    setSettings(prev => ({ ...prev, antennaHeight: height }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Simulation de Couverture GSM 3D</h1>
              <p className="text-gray-600 mt-1">Visualisez la couverture d'une antenne GSM et l'impact des obstacles</p>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showInfo ? 'Masquer' : 'Afficher'} les informations
            </button>
          </div>
        </div>
      </div>

      {/* Information Panel */}
      {showInfo && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">🎯 Antenne GSM</h3>
                <p className="text-sm text-blue-800">
                  L'antenne est représentée par un cylindre métallique avec un panneau d'émission. 
                  Sa hauteur influence la portée du signal.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">📡 Zone de Couverture</h3>
                <p className="text-sm text-blue-800">
                  La sphère bleue transparente représente la zone de couverture. 
                  L'atténuation derrière les obstacles est simulée visuellement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">🏢 Obstacles</h3>
                <p className="text-sm text-blue-800">
                  Les obstacles rouges simulent des bâtiments ou reliefs qui atténuent le signal. 
                  La couverture est réduite derrière ces obstacles.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contrôles</h2>
              
              {/* Coverage Radius */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rayon de couverture: {settings.coverageRadius}m
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={settings.coverageRadius}
                  onChange={(e) => handleRadiusChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Plus le rayon est grand, plus la zone couverte est étendue
                </div>
              </div>

              {/* Antenna Height */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hauteur de l'antenne: {settings.antennaHeight}m
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  step="0.5"
                  value={settings.antennaHeight}
                  onChange={(e) => handleAntennaHeightChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-1">
                  Une antenne plus haute améliore la portée du signal
                </div>
              </div>

              {/* Obstacle Position */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Position de l'obstacle</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600">X: {settings.obstaclePosition[0]}m</label>
                    <input
                      type="range"
                      min="-5"
                      max="5"
                      step="0.5"
                      value={settings.obstaclePosition[0]}
                      onChange={(e) => handleObstaclePositionChange('x', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Y: {settings.obstaclePosition[1]}m</label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.5"
                      value={settings.obstaclePosition[1]}
                      onChange={(e) => handleObstaclePositionChange('y', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Z: {settings.obstaclePosition[2]}m</label>
                    <input
                      type="range"
                      min="1"
                      max="8"
                      step="0.5"
                      value={settings.obstaclePosition[2]}
                      onChange={(e) => handleObstaclePositionChange('z', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Obstacle Size */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Taille de l'obstacle</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600">Largeur: {settings.obstacleSize[0]}m</label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={settings.obstacleSize[0]}
                      onChange={(e) => handleObstacleSizeChange('x', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Hauteur: {settings.obstacleSize[1]}m</label>
                    <input
                      type="range"
                      min="0.5"
                      max="4"
                      step="0.1"
                      value={settings.obstacleSize[1]}
                      onChange={(e) => handleObstacleSizeChange('y', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Profondeur: {settings.obstacleSize[2]}m</label>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={settings.obstacleSize[2]}
                      onChange={(e) => handleObstacleSizeChange('z', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Instructions de navigation</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Clic gauche + glisser : Rotation de la caméra</li>
                  <li>• Molette : Zoom avant/arrière</li>
                  <li>• Clic droit + glisser : Déplacement de la caméra</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3D Scene and Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* 3D Scene */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="h-[400px] w-full">
                <GsmCoverageScene
                  coverageRadius={settings.coverageRadius}
                  obstaclePosition={settings.obstaclePosition}
                  obstacleSize={settings.obstacleSize}
                  antennaHeight={settings.antennaHeight}
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Résultats de Simulation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Coverage Metrics */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">📊 Métriques de Couverture</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zone de couverture:</span>
                      <span className="font-medium">{simulationResults.coverageArea.toFixed(1)} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Volume de couverture:</span>
                      <span className="font-medium">{simulationResults.coverageVolume.toFixed(1)} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rayon effectif:</span>
                      <span className="font-medium">{simulationResults.effectiveCoverageRadius.toFixed(1)} m</span>
                    </div>
                  </div>
                </div>

                {/* Signal Quality */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">📶 Qualité du Signal</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Force du signal:</span>
                      <span className="font-medium">{simulationResults.signalStrength.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.max(0, Math.min(100, simulationResults.signalStrength))}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {simulationResults.signalStrength > 80 ? 'Excellent' : 
                       simulationResults.signalStrength > 60 ? 'Bon' : 
                       simulationResults.signalStrength > 40 ? 'Moyen' : 'Faible'}
                    </div>
                  </div>
                </div>

                {/* Obstacle Impact */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium text-red-900 mb-2">🏢 Impact de l'Obstacle</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impact sur couverture:</span>
                      <span className="font-medium">{simulationResults.obstacleImpact.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Atténuation derrière:</span>
                      <span className="font-medium">{simulationResults.attenuationBehindObstacle.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, simulationResults.obstacleImpact)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">📋 Analyse Détaillée</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Configuration Actuelle</h4>
                    <ul className="space-y-1 text-gray-600">
                      <li>• Rayon de couverture: {settings.coverageRadius}m</li>
                      <li>• Hauteur d'antenne: {settings.antennaHeight}m</li>
                      <li>• Distance à l'obstacle: {Math.sqrt(
                        Math.pow(settings.obstaclePosition[0], 2) + 
                        Math.pow(settings.obstaclePosition[1], 2) + 
                        Math.pow(settings.obstaclePosition[2], 2)
                      ).toFixed(1)}m</li>
                      <li>• Volume de l'obstacle: {(settings.obstacleSize[0] * settings.obstacleSize[1] * settings.obstacleSize[2]).toFixed(1)}m³</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Recommandations</h4>
                    <ul className="space-y-1 text-gray-600">
                      {simulationResults.signalStrength < 50 && (
                        <li>• ⚠️ Augmenter la hauteur d'antenne pour améliorer la couverture</li>
                      )}
                      {simulationResults.obstacleImpact > 30 && (
                        <li>• ⚠️ L'obstacle impacte significativement la couverture</li>
                      )}
                      {simulationResults.effectiveCoverageRadius < settings.coverageRadius * 0.8 && (
                        <li>• 💡 Considérer repositionner l'antenne pour éviter l'obstacle</li>
                      )}
                      <li>• ✅ Configuration actuelle: {simulationResults.signalStrength > 60 ? 'Optimale' : 'À améliorer'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Information */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations Techniques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Simulation de Couverture</h3>
              <p className="text-sm text-gray-600 mb-3">
                Cette simulation 3D montre comment une antenne GSM émet un signal dans toutes les directions.
                La zone de couverture est représentée par une sphère transparente.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Rayon de couverture :</strong> Distance maximale du signal</li>
                <li>• <strong>Atténuation :</strong> Réduction du signal derrière les obstacles</li>
                <li>• <strong>Hauteur d'antenne :</strong> Influence la portée et la qualité du signal</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Impact des Obstacles</h3>
              <p className="text-sm text-gray-600 mb-3">
                Les obstacles (bâtiments, reliefs) peuvent bloquer ou atténuer le signal radio.
                Cette simulation montre visuellement l'effet d'ombre radio.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Ombre radio :</strong> Zone où le signal est affaibli</li>
                <li>• <strong>Diffraction :</strong> Le signal contourne partiellement l'obstacle</li>
                <li>• <strong>Réflexion :</strong> Le signal peut rebondir sur les surfaces</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSMCoverageDemo; 