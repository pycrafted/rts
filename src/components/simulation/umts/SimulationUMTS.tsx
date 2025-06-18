import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Stats } from '@react-three/drei';
import { NodeB3D } from './NodeB3D';
import { MobileUser3D } from './MobileUser3D';
import { LoadFactorPanel } from './LoadFactorPanel';
import { useUMTSSimulationStore } from './useUMTSSimulationStore';

export const SimulationUMTS: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const {
    loadFactor,
    userPositions,
    showInterference,
    showHandovers,
    updateResults
  } = useUMTSSimulationStore();

  // Initialiser les résultats au montage
  useEffect(() => {
    const initializeSimulation = async () => {
      try {
        // Simuler un temps de chargement pour les ressources 3D
        await new Promise(resolve => setTimeout(resolve, 1500));
        updateResults();
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement de la simulation:', error);
        setIsLoading(false);
      }
    };

    initializeSimulation();
  }, [updateResults]);

  // Composant de loader
  const LoadingScreen = () => (
    <div className="flex h-screen bg-gradient-to-b from-blue-50 to-indigo-100 items-center justify-center">
      <div className="text-center">
        {/* Spinner animé */}
        <div className="mb-6">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>
        
        {/* Titre */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          📶 Chargement de la Simulation UMTS
        </h2>
        
        {/* Description */}
        <p className="text-gray-600 mb-6 max-w-md">
          Initialisation des composants 3D et calcul des paramètres de simulation...
        </p>
        
        {/* Barre de progression */}
        <div className="w-64 bg-gray-200 rounded-full h-2 mx-auto mb-4">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
        </div>
        
        {/* Étapes de chargement */}
        <div className="text-sm text-gray-500 space-y-1">
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
      </div>
    </div>
  );

  // Afficher le loader pendant le chargement
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Scène 3D */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [0, 100, 200], fov: 60 }}
          shadows
          className="bg-gradient-to-b from-blue-50 to-indigo-100"
        >
          {/* Éclairage */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          
          {/* Environnement */}
          <Environment preset="sunset" />
          
          {/* Sol de référence */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -50, 0]} receiveShadow>
            <planeGeometry args={[2000, 2000]} />
            <meshStandardMaterial color="#e5e7eb" />
          </mesh>
          
          {/* Grille de référence */}
          <gridHelper args={[2000, 50, '#9ca3af', '#d1d5db']} />
          
          {/* Node B principal */}
          <NodeB3D 
            position={[0, 0, 0]} 
            loadFactor={loadFactor} 
          />
          
          {/* Utilisateurs mobiles */}
          {userPositions.map((user, index) => (
            <MobileUser3D
              key={index}
              position={[user.x, user.y, user.z]}
              qos={user.qos}
              index={index}
            />
          ))}
          
          {/* Zones d'interférence (optionnel) */}
          {showInterference && (
            <group>
              {/* Zone d'interférence autour du Node B */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[800, 16, 16]} />
                <meshStandardMaterial 
                  color="#ef4444" 
                  transparent 
                  opacity={0.1}
                  wireframe
                />
              </mesh>
              
              {/* Indicateurs d'interférence */}
              {userPositions.slice(0, 5).map((user, index) => (
                <mesh key={`interference-${index}`} position={[user.x, user.y, user.z]}>
                  <sphereGeometry args={[20, 8, 8]} />
                  <meshStandardMaterial 
                    color="#ef4444" 
                    transparent 
                    opacity={0.3}
                  />
                </mesh>
              ))}
            </group>
          )}
          
          {/* Handovers (optionnel) */}
          {showHandovers && (
            <group>
              {/* Lignes de handover entre utilisateurs proches */}
              {userPositions.slice(0, 10).map((user1, index1) => 
                userPositions.slice(index1 + 1, index1 + 3).map((user2, index2) => {
                  const distance = Math.sqrt(
                    Math.pow(user1.x - user2.x, 2) + 
                    Math.pow(user1.z - user2.z, 2)
                  );
                  
                  if (distance < 200) {
                    return (
                      <mesh key={`handover-${index1}-${index2}`}>
                        <cylinderGeometry args={[0.5, 0.5, distance, 4]} />
                        <meshStandardMaterial 
                          color="#3b82f6" 
                          transparent 
                          opacity={0.6}
                        />
                      </mesh>
                    );
                  }
                  return null;
                })
              )}
            </group>
          )}
          
          {/* Contrôles de caméra */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={1000}
            minDistance={50}
          />
          
          {/* Statistiques de performance */}
          <Stats />
        </Canvas>
        
        {/* Overlay d'informations */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-4 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📡 Simulation UMTS</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Utilisez la souris pour naviguer dans la scène 3D</p>
            <p>• Ajustez les paramètres dans le panneau de droite</p>
            <p>• Observez l'impact sur le facteur de charge</p>
          </div>
        </div>
        
        {/* Indicateur de performance */}
        <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-lg p-3 shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">
              {(loadFactor * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-gray-600">Facteur de charge</div>
          </div>
        </div>
      </div>
      
      {/* Panneau de contrôle */}
      <div className="w-80 bg-white shadow-lg">
        <LoadFactorPanel />
      </div>
    </div>
  );
}; 