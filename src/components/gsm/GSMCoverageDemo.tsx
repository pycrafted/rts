import React, { useState, useEffect, useMemo } from 'react';
import GsmCoverageScene from './GsmCoverageScene';
import { useGSMSimulationStore } from './useGSMSimulationStore';
import { usePDFExport } from '@/services/pdfExportService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

const GSMCoverageDemo: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);
  
  const {
    settings,
    results,
    setCoverageRadius,
    setObstaclePosition,
    setObstacleSize,
    setAntennaHeight,
    setPhonePosition
  } = useGSMSimulationStore();

  const { exportDashboardReport } = usePDFExport();

  const handleRadiusChange = (radius: number) => {
    setCoverageRadius(radius);
  };

  const handleObstaclePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setObstaclePosition(axis, value);
  };

  const handleObstacleSizeChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setObstacleSize(axis, value);
  };

  const handleAntennaHeightChange = (height: number) => {
    setAntennaHeight(height);
  };

  const handlePhonePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    setPhonePosition(axis, value);
  };

  const getSignalQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-orange-600 bg-orange-100';
      case 'poor': return 'text-red-600 bg-red-100';
      case 'none': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSignalQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent': return '📶';
      case 'good': return '📶';
      case 'poor': return '📶';
      case 'none': return '📴';
      default: return '📴';
    }
  };

  // Fonction d'export PDF
  const handleExportPDF = async () => {
    try {
      console.log('📊 Export PDF complet en cours...');
      
      // Récupérer toutes les données du dashboard
      const gsmHistory = JSON.parse(localStorage.getItem('gsm_history') || '[]');
      const umtsHistory = JSON.parse(localStorage.getItem('umts_history') || '[]');
      const hertzienHistory = JSON.parse(localStorage.getItem('hertzien_history') || '[]');
      const optiqueHistory = JSON.parse(localStorage.getItem('optique_history') || '[]');

      // Calculer les métriques globales
      const totalGsmCalculs = gsmHistory.length;
      const totalUmtsCalculs = umtsHistory.length;
      const totalHertzienCalculs = hertzienHistory.length;
      const totalOptiqueCalculs = optiqueHistory.length;

      const totalGsmDistance = gsmHistory.reduce((sum: number, item: any) => sum + (item.area || 0), 0);
      const totalUmtsDistance = umtsHistory.reduce((sum: number, item: any) => sum + (item.area || 0), 0);
      const totalHertzienDistance = hertzienHistory.reduce((sum: number, item: any) => sum + (item.distance || 0), 0);
      const totalOptiqueDistance = optiqueHistory.reduce((sum: number, item: any) => sum + (item.params?.length || 0), 0);

      const totalGsmMarge = gsmHistory.reduce((sum: number, item: any) => sum + (item.gos || 0), 0);
      const totalUmtsMarge = umtsHistory.reduce((sum: number, item: any) => sum + (item.gos || 0), 0);
      const totalHertzienMarge = hertzienHistory.reduce((sum: number, item: any) => sum + (item.marge || 0), 0);
      const totalOptiqueMarge = optiqueHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);

      const totalGsmBilan = gsmHistory.reduce((sum: number, item: any) => sum + (item.nbSites || 0), 0);
      const totalUmtsBilan = umtsHistory.reduce((sum: number, item: any) => sum + (item.nbNodeB || 0), 0);
      const totalHertzienBilan = hertzienHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);
      const totalOptiqueBilan = optiqueHistory.reduce((sum: number, item: any) => sum + (item.bilan || 0), 0);

      const allData = {
        gsm: {
          history: gsmHistory,
          metrics: {
            totalCalculs: totalGsmCalculs,
            totalDistance: totalGsmDistance,
            totalMarge: totalGsmMarge,
            totalBilan: totalGsmBilan,
            moyenneDistance: totalGsmCalculs > 0 ? totalGsmDistance / totalGsmCalculs : 0,
            moyenneMarge: totalGsmCalculs > 0 ? totalGsmMarge / totalGsmCalculs : 0,
            moyenneBilan: totalGsmCalculs > 0 ? totalGsmBilan / totalGsmCalculs : 0
          }
        },
        umts: {
          history: umtsHistory,
          metrics: {
            totalCalculs: totalUmtsCalculs,
            totalDistance: totalUmtsDistance,
            totalMarge: totalUmtsMarge,
            totalBilan: totalUmtsBilan,
            moyenneDistance: totalUmtsCalculs > 0 ? totalUmtsDistance / totalUmtsCalculs : 0,
            moyenneMarge: totalUmtsCalculs > 0 ? totalUmtsMarge / totalUmtsCalculs : 0,
            moyenneBilan: totalUmtsCalculs > 0 ? totalUmtsBilan / totalUmtsCalculs : 0
          }
        },
        hertzien: {
          history: hertzienHistory,
          metrics: {
            totalCalculs: totalHertzienCalculs,
            totalDistance: totalHertzienDistance,
            totalMarge: totalHertzienMarge,
            totalBilan: totalHertzienBilan,
            moyenneDistance: totalHertzienCalculs > 0 ? totalHertzienDistance / totalHertzienCalculs : 0,
            moyenneMarge: totalHertzienCalculs > 0 ? totalHertzienMarge / totalHertzienCalculs : 0,
            moyenneBilan: totalHertzienCalculs > 0 ? totalHertzienBilan / totalHertzienCalculs : 0
          }
        },
        optique: {
          history: optiqueHistory,
          metrics: {
            totalCalculs: totalOptiqueCalculs,
            totalDistance: totalOptiqueDistance,
            totalMarge: totalOptiqueMarge,
            totalBilan: totalOptiqueBilan,
            moyenneDistance: totalOptiqueCalculs > 0 ? totalOptiqueDistance / totalOptiqueCalculs : 0,
            moyenneMarge: totalOptiqueCalculs > 0 ? totalOptiqueMarge / totalOptiqueCalculs : 0,
            moyenneBilan: totalOptiqueCalculs > 0 ? totalOptiqueBilan / totalOptiqueCalculs : 0
          }
        },
        global: {
          totalCalculs: totalGsmCalculs + totalUmtsCalculs + totalHertzienCalculs + totalOptiqueCalculs,
          totalDistance: totalGsmDistance + totalUmtsDistance + totalHertzienDistance + totalOptiqueDistance,
          totalMarge: totalGsmMarge + totalUmtsMarge + totalHertzienMarge + totalOptiqueMarge,
          totalBilan: totalGsmBilan + totalUmtsBilan + totalHertzienBilan + totalOptiqueBilan
        }
      };

      const result = await exportDashboardReport(allData);
      
      if (result.success) {
        console.log('✅ Export PDF réussi:', result.filePath);
        alert(`PDF exporté avec succès !\nFichier: ${result.filePath}`);
      } else {
        console.error('❌ Échec de l\'export PDF:', result.error);
        alert(`Erreur lors de l'export PDF: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Erreur lors de l\'export PDF:', error);
      alert('Erreur lors de l\'export PDF. Vérifiez la console pour plus de détails.');
    }
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
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                title="Exporter le rapport PDF"
              >
                📊 Export PDF
              </button>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showInfo ? 'Masquer' : 'Afficher'} les informations
              </button>
            </div>
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
                <h3 className="font-semibold text-blue-900 mb-2">📱 Téléphone Mobile</h3>
                <p className="text-sm text-blue-800">
                  Le téléphone change de couleur selon la qualité du signal reçu :
                  Vert (excellent), Orange (bon), Rouge (faible), Gris (aucun signal).
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

              {/* Phone Position */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Position du téléphone</h3>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600">X: {settings.phonePosition[0]}m</label>
                    <input
                      type="range"
                      min="-8"
                      max="8"
                      step="0.5"
                      value={settings.phonePosition[0]}
                      onChange={(e) => handlePhonePositionChange('x', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Y: {settings.phonePosition[1]}m</label>
                    <input
                      type="range"
                      min="-2"
                      max="2"
                      step="0.5"
                      value={settings.phonePosition[1]}
                      onChange={(e) => handlePhonePositionChange('y', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600">Z: {settings.phonePosition[2]}m</label>
                    <input
                      type="range"
                      min="-5"
                      max="8"
                      step="0.5"
                      value={settings.phonePosition[2]}
                      onChange={(e) => handlePhonePositionChange('z', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Déplacez le téléphone pour tester la qualité du signal
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
                  phonePosition={settings.phonePosition}
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Résultats de Simulation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Phone Signal Quality */}
                <div className={`p-4 rounded-lg ${getSignalQualityColor(results.phoneSignalQuality)}`}>
                  <h3 className="font-medium mb-2 flex items-center gap-2">
                    {getSignalQualityIcon(results.phoneSignalQuality)} Signal Téléphone
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Qualité:</span>
                      <span className="font-medium capitalize">{results.phoneSignalQuality}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance antenne:</span>
                      <span className="font-medium">{results.phoneDistanceToAntenna.toFixed(1)}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distance obstacle:</span>
                      <span className="font-medium">{results.phoneDistanceToObstacle.toFixed(1)}m</span>
                    </div>
                  </div>
                </div>

                {/* Coverage Metrics */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">📊 Métriques de Couverture</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Zone de couverture:</span>
                      <span className="font-medium">{results.coverageArea.toFixed(1)} m²</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Volume de couverture:</span>
                      <span className="font-medium">{results.coverageVolume.toFixed(1)} m³</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rayon effectif:</span>
                      <span className="font-medium">{results.effectiveCoverageRadius.toFixed(1)} m</span>
                    </div>
                  </div>
                </div>

                {/* Signal Quality */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">📶 Qualité du Signal</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Force du signal:</span>
                      <span className="font-medium">{results.signalStrength.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${Math.max(0, Math.min(100, results.signalStrength))}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {results.signalStrength > 80 ? 'Excellent' : 
                       results.signalStrength > 60 ? 'Bon' : 
                       results.signalStrength > 40 ? 'Moyen' : 'Faible'}
                    </div>
                  </div>
                </div>

                {/* Obstacle Impact */}
                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-medium text-red-900 mb-2">🏢 Impact de l'Obstacle</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Impact sur couverture:</span>
                      <span className="font-medium">{results.obstacleImpact.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Atténuation derrière:</span>
                      <span className="font-medium">{results.attenuationBehindObstacle.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, results.obstacleImpact)}%` }}
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
                      <li>• Position téléphone: [{settings.phonePosition[0]}, {settings.phonePosition[1]}, {settings.phonePosition[2]}]</li>
                      <li>• Distance à l'obstacle: {Math.sqrt(
                        Math.pow(settings.obstaclePosition[0], 2) + 
                        Math.pow(settings.obstaclePosition[1], 2) + 
                        Math.pow(settings.obstaclePosition[2], 2)
                      ).toFixed(1)}m</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-2">Recommandations</h4>
                    <ul className="space-y-1 text-gray-600">
                      {results.phoneSignalQuality === 'none' && (
                        <li>• ⚠️ Déplacer le téléphone dans la zone de couverture</li>
                      )}
                      {results.phoneSignalQuality === 'poor' && (
                        <li>• ⚠️ Le téléphone reçoit un signal faible</li>
                      )}
                      {results.phoneDistanceToAntenna > settings.coverageRadius * 0.8 && (
                        <li>• 💡 Rapprocher le téléphone de l'antenne</li>
                      )}
                      <li>• ✅ Qualité signal téléphone: {results.phoneSignalQuality}</li>
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
              <h3 className="font-medium text-gray-900 mb-2">Téléphone Mobile</h3>
              <p className="text-sm text-gray-600 mb-3">
                Le téléphone mobile change de couleur selon la qualité du signal reçu :
                Vert (excellent), Orange (bon), Rouge (faible), Gris (aucun signal).
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Signal excellent :</strong> Téléphone vert, pulsation rapide</li>
                <li>• <strong>Signal bon :</strong> Téléphone orange, pulsation modérée</li>
                <li>• <strong>Signal faible :</strong> Téléphone rouge, pulsation lente</li>
                <li>• <strong>Aucun signal :</strong> Téléphone gris, pas de pulsation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GSMCoverageDemo; 