import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Sphere, 
  Cylinder, 
  Box, 
  Environment
} from '@react-three/drei';
import * as THREE from 'three';

// Interface pour les props du composant
interface GsmCoverageSceneProps {
  coverageRadius?: number;
  obstaclePosition?: [number, number, number];
  obstacleSize?: [number, number, number];
  antennaHeight?: number;
}

// Composant pour l'antenne GSM
const Antenna: React.FC<{ height: number }> = ({ height }) => {
  return (
    <group position={[0, height / 2, 0]}>
      {/* Corps principal de l'antenne */}
      <Cylinder
        args={[0.2, 0.2, height, 8]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#2c3e50" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Panneau de l'antenne */}
      <Box args={[0.1, 0.8, 0.4]} position={[0, 0, 0.3]}>
        <meshStandardMaterial color="#34495e" metalness={0.6} roughness={0.3} />
      </Box>
      
      {/* Base de l'antenne */}
      <Cylinder args={[0.4, 0.4, 0.2, 8]} position={[0, -height / 2 - 0.1, 0]}>
        <meshStandardMaterial color="#7f8c8d" metalness={0.4} roughness={0.6} />
      </Cylinder>
    </group>
  );
};

// Composant pour la zone de couverture
const CoverageZone: React.FC<{ radius: number; obstaclePosition: [number, number, number]; obstacleSize: [number, number, number] }> = ({ 
  radius, 
  obstaclePosition, 
  obstacleSize 
}) => {
  const coverageRef = useRef<THREE.Mesh>(null);
  const [coverageMaterial] = useState(() => new THREE.MeshStandardMaterial({
    color: '#3498db',
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
  }));

  // Calcul de l'atténuation du signal derrière l'obstacle
  useFrame(() => {
    if (coverageRef.current) {
      // Vérifier si le point est derrière l'obstacle
      const isBehindObstacle = (x: number, y: number, z: number) => {
        return z > obstaclePosition[2] && 
               Math.abs(x - obstaclePosition[0]) < obstacleSize[0] / 2 &&
               Math.abs(y - obstaclePosition[1]) < obstacleSize[1] / 2;
      };
      
      // Ajuster l'opacité en fonction de la position par rapport à l'obstacle
      const geometry = coverageRef.current.geometry;
      if (geometry) {
        const positions = geometry.attributes.position;
        const colors = new Float32Array(positions.count * 3);
        
        for (let i = 0; i < positions.count; i++) {
          const x = positions.getX(i);
          const y = positions.getY(i);
          const z = positions.getZ(i);
          
          if (isBehindObstacle(x, y, z)) {
            // Atténuation progressive derrière l'obstacle
            const distanceToObstacle = Math.sqrt(
              Math.pow(x - obstaclePosition[0], 2) + 
              Math.pow(y - obstaclePosition[1], 2) + 
              Math.pow(z - obstaclePosition[2], 2)
            );
            const attenuation = Math.max(0.1, 1 - (distanceToObstacle / radius));
            // Appliquer l'atténuation aux couleurs
            colors[i * 3] = 0.2 * attenuation;     // R
            colors[i * 3 + 1] = 0.6 * attenuation; // G
            colors[i * 3 + 2] = 0.9 * attenuation; // B
          } else {
            colors[i * 3] = 0.2;     // R
            colors[i * 3 + 1] = 0.6; // G
            colors[i * 3 + 2] = 0.9; // B
          }
        }
        
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        coverageMaterial.opacity = 0.3;
      }
    }
  });

  return (
    <Sphere ref={coverageRef} args={[radius, 32, 32]} position={[0, 0, 0]}>
      <primitive object={coverageMaterial} />
    </Sphere>
  );
};

// Composant pour l'obstacle
const Obstacle: React.FC<{ position: [number, number, number]; size: [number, number, number] }> = ({ 
  position, 
  size 
}) => {
  return (
    <Box args={size} position={position}>
      <meshStandardMaterial color="#e74c3c" opacity={0.8} transparent />
    </Box>
  );
};

// Composant principal de la scène
const Scene: React.FC<GsmCoverageSceneProps> = ({ 
  coverageRadius = 5, 
  obstaclePosition = [2, 0, 3], 
  obstacleSize = [1, 2, 1], 
  antennaHeight = 3 
}) => {
  return (
    <>
      {/* Éclairage d'ambiance */}
      <ambientLight intensity={0.4} />
      
      {/* Lumière directionnelle (soleil) */}
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Lumière ponctuelle pour l'antenne */}
      <pointLight position={[0, antennaHeight, 0]} intensity={0.5} color="#3498db" />
      
      {/* Antenne GSM */}
      <Antenna height={antennaHeight} />
      
      {/* Zone de couverture */}
      <CoverageZone 
        radius={coverageRadius} 
        obstaclePosition={obstaclePosition} 
        obstacleSize={obstacleSize} 
      />
      
      {/* Obstacle */}
      <Obstacle position={obstaclePosition} size={obstacleSize} />
      
      {/* Sol de référence */}
      <Box args={[20, 0.1, 20]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#95a5a6" />
      </Box>
      
      {/* Contrôles de caméra */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={2}
        maxDistance={20}
        target={[0, 0, 0]}
      />
      
      {/* Environnement */}
      <Environment preset="sunset" />
    </>
  );
};

// Composant principal exporté
const GsmCoverageScene: React.FC<GsmCoverageSceneProps> = (props) => {
  const [coverageRadius, setCoverageRadius] = useState(props.coverageRadius || 5);

  return (
    <div className="w-full h-full">
      {/* Interface de contrôle */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-800">Contrôles GSM</h3>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Rayon de couverture: {coverageRadius}m
          </label>
          <input
            type="range"
            min="2"
            max="10"
            step="0.5"
            value={coverageRadius}
            onChange={(e) => setCoverageRadius(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
      
      {/* Canvas 3D */}
      <Canvas
        camera={{ position: [8, 6, 8], fov: 60 }}
        shadows
        className="w-full h-full"
      >
        <Scene 
          {...props} 
          coverageRadius={coverageRadius}
        />
      </Canvas>
    </div>
  );
};

export default GsmCoverageScene; 