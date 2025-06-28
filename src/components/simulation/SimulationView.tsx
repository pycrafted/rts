/**
 * Composant de vue de simulation hertzienne
 * 
 * Ce composant gère l'affichage de la simulation hertzienne avec deux modes :
 * - Bilan de liaison : affiche les calculs de pertes et gains
 * - Obstacles : affiche la visualisation des zones de Fresnel et obstacles
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {boolean} props.isActive - Indique si le mode obstacles est actif
 */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { useSimulationStore } from '@/stores/simulationStore';
import { LinkBudgetService } from '@/services/linkBudget';
import { DiffractionService } from '@/services/diffraction';
import Terrain from './Terrain';
import Antenna from './Antenna';
import FresnelZone from './FresnelZone';
import Obstacle from './Obstacle';
import SimulationControls from './SimulationControls';
import SimulationVisualization from './SimulationVisualization';

// Constantes pour les pertes
const POLARIZATION_LOSS = 0.5; // dB
const MISALIGNMENT_LOSS = 0.5; // dB
const DEFAULT_TX_POWER = 20; // dBm
const DEFAULT_RELIABILITY = 99.9; // %

interface ObstacleData {
  id: string;
  position: [number, number, number];
  dimensions: [number, number, number];
  type: 'building' | 'mountain' | 'forest';
  isInFresnelZone?: boolean;
}

interface LinkBudgetResult {
  freeSpaceLoss: number;
  totalLoss: number;
  totalGain: number;
  receivedPower: number;
  systemMargin: number;
  availability: number;
}

interface DiffractionLosses {
  total: number;
  obstacles: Array<{ loss: number }>;
}

interface SimulationViewProps {
  isActive: boolean;
}

const SimulationView: React.FC<SimulationViewProps> = ({ isActive }) => {
  const { antennas, frequency } = useSimulationStore();
  const [linkBudget, setLinkBudget] = useState<LinkBudgetResult | null>(null);
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const [diffractionLosses, setDiffractionLosses] = useState<DiffractionLosses>({ total: 0, obstacles: [] });
  const [error, setError] = useState<string | null>(null);
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Calcul de la distance entre les antennes
  const distance = useMemo(() => {
    if (antennas.length !== 2) return 0;
    const [ant1, ant2] = antennas;
    return Math.sqrt(
      Math.pow(ant2.position[0] - ant1.position[0], 2) +
      Math.pow(ant2.position[2] - ant1.position[2], 2)
    );
  }, [antennas]);

  // Calcul des pertes par diffraction
  const calculateDiffractionLosses = useCallback(() => {
    if (antennas.length !== 2 || distance <= 0) return;

    try {
      const [ant1, ant2] = antennas;
      const diffractionParams = {
        frequency,
        distance,
        txPosition: ant1.position,
        rxPosition: ant2.position,
        obstacles: obstacles.map(obs => ({
          position: obs.position,
          height: obs.dimensions[1],
          width: obs.dimensions[0]
        }))
      };

      const { totalLoss, obstacleLosses } = DiffractionService.calculateTotalDiffractionLoss(diffractionParams);
      setDiffractionLosses({ total: totalLoss, obstacles: obstacleLosses });

      // Mise à jour des obstacles dans la zone de Fresnel
      setObstacles(prev => prev.map(obs => ({
        ...obs,
        isInFresnelZone: DiffractionService.isInFirstFresnelZone(
          {
            position: obs.position,
            height: obs.dimensions[1],
            width: obs.dimensions[0]
          },
          diffractionParams
        )
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul des pertes par diffraction');
    }
  }, [antennas, frequency, obstacles, distance]);

  // Calcul du bilan de liaison
  const calculateLinkBudget = useCallback(() => {
    if (antennas.length !== 2 || distance <= 0) return;

    try {
      const [ant1, ant2] = antennas;
      const budget = LinkBudgetService.calculateLinkBudget({
        frequency,
        distance,
        txPower: DEFAULT_TX_POWER,
        txGain: ant1.gain,
        rxGain: ant2.gain,
        txHeight: ant1.position[1],
        rxHeight: ant2.position[1],
        climate: 'temperate',
        reliability: DEFAULT_RELIABILITY,
        diffractionLoss: diffractionLosses.total,
        polarizationLoss: POLARIZATION_LOSS,
        misalignmentLoss: MISALIGNMENT_LOSS
      });

      setLinkBudget(budget);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du calcul du bilan de liaison');
    }
  }, [antennas, frequency, distance, diffractionLosses.total]);

  // Effet pour le calcul des pertes par diffraction
  useEffect(() => {
    calculateDiffractionLosses();
  }, [calculateDiffractionLosses]);

  // Effet pour le calcul du bilan de liaison
  useEffect(() => {
    calculateLinkBudget();
  }, [calculateLinkBudget]);

  // Gestion du mode plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Détection de la sortie du mode plein écran
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="flex h-full relative">
      {/* Panneau de contrôle rétractable */}
      <div className={`
        ${isPanelCollapsed ? 'w-12' : 'w-80'} 
        transition-all duration-300 ease-in-out
        bg-gray-100 border-r border-gray-300
        flex flex-col
      `}>
        {/* Bouton de toggle du panneau */}
        <button
          onClick={() => setIsPanelCollapsed(!isPanelCollapsed)}
          className="absolute -right-3 top-4 z-10 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
          title={isPanelCollapsed ? "Afficher le panneau" : "Masquer le panneau"}
        >
          {isPanelCollapsed ? '→' : '←'}
        </button>

        {/* Contenu du panneau */}
        <div className={`${isPanelCollapsed ? 'hidden' : 'block'} p-4 overflow-y-auto flex-1`}>
        {isActive ? <SimulationVisualization setObstacles={setObstacles} /> : <SimulationControls />}
        
        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {linkBudget && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Bilan de Liaison</h3>
            <div className="space-y-2">
              <p>Perte en espace libre: {linkBudget.freeSpaceLoss.toFixed(2)} dB</p>
              <p>Perte totale: {linkBudget.totalLoss.toFixed(2)} dB</p>
              <p>Gain total: {linkBudget.totalGain.toFixed(2)} dB</p>
              <p>Puissance reçue: {linkBudget.receivedPower.toFixed(2)} dBm</p>
              <p>Marge système: {linkBudget.systemMargin.toFixed(2)} dB</p>
              <p>Disponibilité: {linkBudget.availability.toFixed(2)}%</p>
            </div>
          </div>
        )}

        {diffractionLosses.total > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Pertes par Diffraction</h3>
            <p>Perte totale: {diffractionLosses.total.toFixed(2)} dB</p>
            <div className="mt-2">
              <h4 className="font-medium">Détail par obstacle:</h4>
              {diffractionLosses.obstacles.map((loss, index) => (
                <div key={index} className="text-sm">
                  <p>Obstacle {index + 1}: {loss.loss.toFixed(2)} dB</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Légende des marqueurs de distance */}
        <div className="mt-4 p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Marqueurs de distance</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>25m</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span>50m</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
              <span>75m</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span>100m</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de visualisation 3D */}
      <div className="flex-1 h-screen relative">
        {/* Barre d'outils flottante */}
        <div className="absolute top-4 right-4 z-10 flex gap-2">
          <button
            onClick={toggleFullscreen}
            className="px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            title="Mode plein écran"
          >
            {isFullscreen ? '⛶' : '⛶'}
          </button>
        </div>

        <Canvas 
          camera={{ position: [0, 10, 15], fov: 60 }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.6} />
          <directionalLight position={[20, 20, 10]} intensity={1.2} />
          
          <Grid
            args={[200, 200]}
            cellSize={2}
            cellThickness={0.5}
            cellColor="#6f6f6f"
            sectionSize={10}
            sectionThickness={1}
            sectionColor="#9d4b4b"
            fadeDistance={100}
            fadeStrength={1}
            followCamera={false}
            infiniteGrid={true}
          />

          {/* Marqueurs de distance pour la carte élargie */}
          <group>
            {/* Cercle de 25m */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
              <ringGeometry args={[25, 25.1, 32]} />
              <meshStandardMaterial color="#3b82f6" transparent opacity={0.1} />
            </mesh>
            
            {/* Cercle de 50m */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
              <ringGeometry args={[50, 50.1, 32]} />
              <meshStandardMaterial color="#8b5cf6" transparent opacity={0.1} />
            </mesh>
            
            {/* Cercle de 75m */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
              <ringGeometry args={[75, 75.1, 32]} />
              <meshStandardMaterial color="#ec4899" transparent opacity={0.1} />
            </mesh>
            
            {/* Cercle de 100m */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.1, 0]}>
              <ringGeometry args={[100, 100.1, 32]} />
              <meshStandardMaterial color="#ef4444" transparent opacity={0.1} />
            </mesh>
          </group>

          <Terrain />
          
          {antennas.map((antenna, index) => (
            <Antenna
              key={index}
              position={antenna.position}
              gain={antenna.gain}
              type={antenna.type}
            />
          ))}

          {antennas.length === 2 && distance > 0 && (
            <FresnelZone
              frequency={frequency}
              distance={distance}
              color="#00ff00"
              opacity={0.3}
            />
          )}

          {obstacles.map((obstacle) => (
            <Obstacle
              key={obstacle.id}
              position={obstacle.position}
              dimensions={obstacle.dimensions}
              type={obstacle.type}
              isInFresnelZone={obstacle.isInFresnelZone}
            />
          ))}

          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={100}
            minDistance={5}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default SimulationView;