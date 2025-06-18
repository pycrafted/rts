import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface MobileUser3DProps {
  position: [number, number, number];
  qos: number; // 0-1, qualité de service
  index: number;
}

export const MobileUser3D: React.FC<MobileUser3DProps> = ({ position, qos, index }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  // Animation de pulsation basée sur la QoS
  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 3 + index) * 0.1 * qos;
      meshRef.current.scale.setScalar(scale);
    }
    
    if (lightRef.current) {
      const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.3 * qos;
      lightRef.current.intensity = intensity;
    }
  });

  // Couleur basée sur la QoS
  const getQoSColor = (qos: number) => {
    if (qos > 0.8) return '#10b981'; // Vert - excellent
    if (qos > 0.6) return '#f59e0b'; // Orange - bon
    if (qos > 0.4) return '#f97316'; // Orange foncé - moyen
    return '#ef4444'; // Rouge - mauvais
  };

  // Taille basée sur la QoS
  const getSize = (qos: number) => {
    return 2 + qos * 3; // 2-5 unités
  };

  return (
    <group position={position}>
      {/* Utilisateur mobile (sphère) */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[getSize(qos), 8, 8]} />
        <meshStandardMaterial 
          color={getQoSColor(qos)} 
          metalness={0.3} 
          roughness={0.7}
          emissive={getQoSColor(qos)}
          emissiveIntensity={0.2 * qos}
        />
      </mesh>
      
      {/* Éclairage de l'utilisateur */}
      <pointLight 
        ref={lightRef}
        position={[0, 0, 0]} 
        intensity={0.5} 
        color={getQoSColor(qos)}
        distance={20}
      />
      
      {/* Indicateur de signal (lignes de connexion) */}
      {qos > 0.3 && (
        <group>
          {/* Ligne vers le Node B */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, Math.sqrt(position[0]**2 + position[2]**2), 4]} />
            <meshStandardMaterial 
              color={getQoSColor(qos)} 
              transparent 
              opacity={0.6 * qos}
            />
          </mesh>
          
          {/* Ondes de signal */}
          <mesh position={[0, 0, 0]}>
            <ringGeometry args={[getSize(qos) + 1, getSize(qos) + 2, 8]} />
            <meshStandardMaterial 
              color={getQoSColor(qos)} 
              transparent 
              opacity={0.3 * qos}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
      
      {/* Indicateur de charge (petit cube) */}
      <mesh position={[0, getSize(qos) + 1, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial 
          color={qos > 0.7 ? '#10b981' : qos > 0.4 ? '#f59e0b' : '#ef4444'} 
          emissive={qos > 0.7 ? '#10b981' : qos > 0.4 ? '#f59e0b' : '#ef4444'}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}; 