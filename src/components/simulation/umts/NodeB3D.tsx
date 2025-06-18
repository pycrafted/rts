import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface NodeB3DProps {
  position?: [number, number, number];
  loadFactor: number;
}

export const NodeB3D: React.FC<NodeB3DProps> = ({ 
  position = [0, 0, 0], 
  loadFactor
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const antennaRef = useRef<THREE.Mesh>(null);
  
  // Animation de l'antenne
  useFrame((state) => {
    if (antennaRef.current) {
      // Légère oscillation basée sur le facteur de charge
      antennaRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1 * loadFactor;
    }
  });

  // Couleur de l'antenne basée sur le facteur de charge
  const getAntennaColor = () => {
    if (loadFactor < 0.3) return '#10b981'; // Vert - excellent
    if (loadFactor < 0.6) return '#f59e0b'; // Orange - bon
    if (loadFactor < 0.8) return '#f97316'; // Orange foncé - moyen
    return '#ef4444'; // Rouge - mauvais
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Base de la tour */}
      <mesh position={[0, -20, 0]}>
        <cylinderGeometry args={[5, 8, 40, 8]} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Plateforme de l'antenne */}
      <mesh position={[0, 20, 0]}>
        <cylinderGeometry args={[12, 12, 2, 8]} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Antenne principale */}
      <mesh ref={antennaRef} position={[0, 25, 0]}>
        <boxGeometry args={[1, 8, 1]} />
        <meshStandardMaterial color={getAntennaColor()} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Antennes secondaires */}
      <mesh position={[3, 25, 0]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshStandardMaterial color={getAntennaColor()} metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[-3, 25, 0]}>
        <boxGeometry args={[0.5, 6, 0.5]} />
        <meshStandardMaterial color={getAntennaColor()} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Éclairage de l'antenne */}
      <pointLight 
        position={[0, 30, 0]} 
        intensity={0.5} 
        color={getAntennaColor()}
        distance={50}
      />
      
      {/* Indicateur de puissance */}
      <mesh position={[0, 15, 0]}>
        <sphereGeometry args={[2, 8, 8]} />
        <meshStandardMaterial 
          color={getAntennaColor()} 
          transparent 
          opacity={0.3}
          emissive={getAntennaColor()}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Zone de couverture (sphère transparente) */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1000, 16, 16]} />
        <meshStandardMaterial 
          color={getAntennaColor()} 
          transparent 
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}; 