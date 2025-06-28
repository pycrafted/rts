import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stats } from '@react-three/drei';
import { NodeB3D } from './NodeB3D';
import { MobileUser3D } from './MobileUser3D';
import { LoadFactorPanel } from './LoadFactorPanel';
import { PerformanceMonitor } from './PerformanceMonitor';
import { AutoOptimizer } from './AutoOptimizer';
import { useUMTSSimulationStore } from './useUMTSSimulationStore';
import { usePDFExport } from '@/services/pdfExportService';

export const SimulationUMTS: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentFps, setCurrentFps] = useState(60);
  const [showHelp, setShowHelp] = useState(false);
  
  const {
    loadFactor,
    userPositions,
    showInterference,
    showHandovers,
    updateResults
  } = useUMTSSimulationStore();

  const { exportDashboardReport } = usePDFExport();

  // Initialiser les résultats au montage - optimisé avec useCallback
  const initializeSimulation = useCallback(async () => {
    try {
      // Réduire le temps de chargement
      await new Promise(resolve => setTimeout(resolve, 800));
      updateResults();
      setIsLoading(false);
    } catch (error) {
      // Gestion silencieuse de l'erreur pour la production
      setIsLoading(false);
    }
  }, [updateResults]);

  useEffect(() => {
    initializeSimulation();
  }, [initializeSimulation]);

  // Optimisation : Mémoriser les composants d'interférence
  const interferenceElements = useMemo(() => {
    if (!showInterference) return null;
    
    return (
      <group>
        {/* Zone d'interférence autour du Node B - géométrie simplifiée */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1800, 20, 20]} />
          <meshStandardMaterial 
            color="#ef4444" 
            transparent 
            opacity={0.08}
            wireframe
          />
        </mesh>
        
        {/* Indicateurs d'interférence - limités aux 8 premiers utilisateurs */}
        {userPositions.slice(0, 8).map((user, index) => (
          <mesh key={`interference-${index}`} position={[user.x, user.y, user.z]}>
            <sphereGeometry args={[40, 10, 10]} />
            <meshStandardMaterial 
              color="#ef4444" 
              transparent 
              opacity={0.3}
            />
          </mesh>
        ))}
      </group>
    );
  }, [showInterference, userPositions]);

  // Optimisation : Mémoriser les éléments de handover
  const handoverElements = useMemo(() => {
    if (!showHandovers) return null;
    
    const handovers = [];
    // Limiter les calculs de handover aux 12 premiers utilisateurs
    const limitedUsers = userPositions.slice(0, 12);
    
    for (let i = 0; i < limitedUsers.length; i++) {
      for (let j = i + 1; j < Math.min(i + 4, limitedUsers.length); j++) {
        const user1 = limitedUsers[i];
        const user2 = limitedUsers[j];
        
        const distance = Math.sqrt(
          Math.pow(user1.x - user2.x, 2) + 
          Math.pow(user1.z - user2.z, 2)
        );
        
        if (distance < 500) {
          handovers.push(
            <mesh key={`handover-${i}-${j}`}>
              <cylinderGeometry args={[1.5, 1.5, distance, 8]} />
              <meshStandardMaterial 
                color="#3b82f6" 
                transparent 
                opacity={0.5}
              />
            </mesh>
          );
        }
      }
    }
    
    return <group>{handovers}</group>;
  }, [showHandovers, userPositions]);

  // Optimisation : Mémoriser les utilisateurs mobiles
  const mobileUsers = useMemo(() => {
    // Limiter le nombre d'utilisateurs affichés pour les performances
    const maxDisplayedUsers = Math.min(userPositions.length, 50);
    
    return userPositions.slice(0, maxDisplayedUsers).map((user, index) => (
      <MobileUser3D
        key={`user-${index}`}
        position={[user.x, user.y, user.z]}
        qos={user.qos}
        index={index}
      />
    ));
  }, [userPositions]);

  // Composant de loader optimisé avec explications pédagogiques
  const LoadingScreen = () => (
    <div className="flex h-screen bg-gradient-to-b from-blue-50 to-indigo-100 items-center justify-center">
      <div className="text-center max-w-md">
        {/* Spinner animé */}
        <div className="mb-6">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
        
        {/* Titre */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📶 Simulation UMTS - WCDMA
        </h2>
        
        {/* Description pédagogique */}
        <p className="text-gray-600 mb-6">
          Initialisation de la simulation UMTS (Universal Mobile Telecommunications System) 
          utilisant la technologie WCDMA (Wideband Code Division Multiple Access).
        </p>
        
        {/* Barre de progression */}
        <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto mb-4">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
        
        {/* Étapes de chargement avec explications */}
        <div className="text-sm text-gray-500 space-y-2">
          <div className="flex items-center justify-center">
            <span className="mr-2">✅</span>
            <span>Initialisation du store Zustand</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="mr-2">⏳</span>
            <span>Chargement des composants 3D</span>
          </div>
          <div className="flex items-center justify-center">
            <span className="mr-2">⏳</span>
            <span>Calcul des paramètres initiaux</span>
          </div>
        </div>
        
        {/* Info pédagogique */}
        <div className="mt-6 p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700">
            <strong>💡 UMTS :</strong> Système de téléphonie mobile 3G qui utilise WCDMA 
            pour permettre plusieurs utilisateurs de partager la même bande de fréquence.
          </p>
        </div>
      </div>
    </div>
  );

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

  // Afficher le loader pendant le chargement
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Scène 3D */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [0, 50, 200], fov: 50 }}
          shadows
          className="bg-slate-900"
          // Optimisations de performance
          gl={{ 
            antialias: false, // Désactiver l'antialiasing pour les performances
            powerPreference: "high-performance"
          }}
          dpr={[1, 2]} // Limiter la densité de pixels
        >
          {/* Éclairage optimisé */}
          <ambientLight intensity={0.7} />
          <directionalLight
            position={[40, 40, 20]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={1024} // Réduire la résolution des ombres
            shadow-mapSize-height={1024}
          />
          
          {/* Environnement */}
          <Environment preset="city" />
          
          {/* Sol de référence - géométrie élargie */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
            <planeGeometry args={[8000, 8000]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          
          {/* Grille de référence - plus de divisions pour la carte élargie */}
          <gridHelper args={[8000, 100, '#475569', '#334155']} />
          
          {/* Marqueurs de distance pour la carte élargie */}
          <group>
            {/* Cercle de 500m */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -49, 0]}>
              <ringGeometry args={[500, 501, 64]} />
              <meshStandardMaterial color="#00ffff" transparent opacity={0.4} />
            </mesh>
            
            {/* Cercle de 1000m */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -49, 0]}>
              <ringGeometry args={[1000, 1001, 64]} />
              <meshStandardMaterial color="#ff00ff" transparent opacity={0.4} />
            </mesh>
            
            {/* Cercle de 1500m */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -49, 0]}>
              <ringGeometry args={[1500, 1501, 64]} />
              <meshStandardMaterial color="#ffff00" transparent opacity={0.4} />
            </mesh>
            
            {/* Cercle de 2000m */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -49, 0]}>
              <ringGeometry args={[2000, 2001, 64]} />
              <meshStandardMaterial color="#00ff00" transparent opacity={0.4} />
            </mesh>
            
            {/* Cercle de 3000m */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -49, 0]}>
              <ringGeometry args={[3000, 3001, 64]} />
              <meshStandardMaterial color="#ff8800" transparent opacity={0.4} />
            </mesh>
            
            {/* Cercle de 4000m */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -49, 0]}>
              <ringGeometry args={[4000, 4001, 64]} />
              <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
            </mesh>
          </group>
          
          {/* Node B principal */}
          <NodeB3D 
            position={[0, 0, 0]} 
            loadFactor={loadFactor} 
          />
          
          {/* Utilisateurs mobiles optimisés */}
          {mobileUsers}
          
          {/* Zones d'interférence optimisées */}
          {interferenceElements}
          
          {/* Handovers optimisés */}
          {handoverElements}
          
          {/* Contrôles de caméra */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={12000}
            minDistance={150}
            // Optimisations des contrôles
            enableDamping={false} // Désactiver le damping pour les performances
          />
          
          {/* Statistiques de performance */}
          <Stats />
        </Canvas>
        
        {/* Overlay d'informations pédagogiques */}
        <div className="absolute top-4 left-4 bg-slate-800 bg-opacity-90 rounded-lg p-4 shadow-lg max-w-sm border border-slate-700 opacity-20 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-white">📡 Simulation UMTS</h3>
            <div className="flex gap-2">
              <button
                onClick={handleExportPDF}
                className="text-blue-400 hover:text-blue-300 text-sm px-2 py-1 bg-blue-900 bg-opacity-50 rounded"
                title="Exporter le rapport PDF"
              >
                📊 Export
              </button>
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {showHelp ? 'Masquer' : 'Aide'}
              </button>
            </div>
          </div>
          
          {showHelp ? (
            <div className="text-sm text-gray-300 space-y-2">
              <p><strong className="text-white">🎯 Objectif :</strong> Comprendre le facteur de charge UMTS</p>
              <p><strong className="text-white">📊 Facteur de charge :</strong> Mesure l'utilisation de la capacité</p>
              <p><strong className="text-white">🔗 WCDMA :</strong> Partage de bande de fréquence entre utilisateurs</p>
              <p><strong className="text-white">📱 Node B :</strong> Station de base UMTS (équivalent BTS GSM)</p>
              <p><strong className="text-white">🎮 Contrôles :</strong> Souris pour naviguer, panneau pour ajuster</p>
            </div>
          ) : (
            <div className="text-sm text-gray-300 space-y-1">
              <p>• Utilisez la souris pour naviguer dans la scène 3D</p>
              <p>• Ajustez les paramètres dans le panneau de droite</p>
              <p>• Observez l'impact sur le facteur de charge</p>
              <p>• {userPositions.length} utilisateurs actifs</p>
            </div>
          )}
          
          {/* Légende des marqueurs de distance */}
          <div className="mt-3 pt-3 border-t border-gray-600">
            <h4 className="text-sm font-semibold text-white mb-2">Marqueurs de distance :</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00ffff' }}></div>
                <span className="text-gray-300 ml-2">500m</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff00ff' }}></div>
                <span className="text-gray-300 ml-2">1000m</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffff00' }}></div>
                <span className="text-gray-300 ml-2">1500m</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#00ff00' }}></div>
                <span className="text-gray-300 ml-2">2000m</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ff8800' }}></div>
                <span className="text-gray-300 ml-2">3000m</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffffff' }}></div>
                <span className="text-gray-300 ml-2">4000m</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Indicateur de performance avec explication */}
        <div className="absolute top-4 right-4 bg-slate-800 bg-opacity-90 rounded-lg p-4 shadow-lg border border-slate-700 opacity-20 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {(loadFactor * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400 mb-2">Facteur de charge</div>
            <div className="text-xs text-blue-400">
              {loadFactor < 0.3 ? '🟢 Excellent' : 
               loadFactor < 0.6 ? '🟡 Bon' : 
               loadFactor < 0.8 ? '🟠 Moyen' : '🔴 Critique'}
            </div>
          </div>
        </div>
        
        {/* Moniteur de performance */}
        <PerformanceMonitor 
          userCount={userPositions.length}
          loadFactor={loadFactor}
          onFpsChange={setCurrentFps}
        />
        
        {/* Auto-optimiseur */}
        <AutoOptimizer 
          currentFps={currentFps}
          targetFps={30}
        />
      </div>
      
      {/* Panneau de contrôle */}
      <div className="w-80 bg-slate-900 shadow-lg border-l border-slate-700">
        <LoadFactorPanel />
      </div>
    </div>
  );
}; 