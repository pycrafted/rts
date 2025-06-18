import React, { useRef, useMemo } from 'react';
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
  
  // Optimisation : Réduire la fréquence des animations
  const animationSpeed = useMemo(() => 1 + (index % 3), [index]);
  
  // Animation de pulsation basée sur la QoS - optimisée
  useFrame((state) => {
    if (meshRef.current) {
      // Réduire la fréquence des animations pour les performances
      const scale = 1 + Math.sin(state.clock.elapsedTime * animationSpeed) * 0.05 * qos;
      meshRef.current.scale.setScalar(scale);
    }
    
    // Éclairage moins fréquent
    if (lightRef.current && index < 10) { // Limiter aux 10 premiers utilisateurs
      const intensity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.2 * qos;
      lightRef.current.intensity = intensity;
    }
  });

  // Couleur basée sur la QoS - mémorisée
  const qosColor = useMemo(() => {
    if (qos > 0.8) return '#10b981'; // Vert - excellent
    if (qos > 0.6) return '#f59e0b'; // Orange - bon
    if (qos > 0.4) return '#f97316'; // Orange foncé - moyen
    return '#ef4444'; // Rouge - mauvais
  }, [qos]);

  // Taille basée sur la QoS - mémorisée
  const size = useMemo(() => 2 + qos * 2, [qos]); // Réduire la taille maximale

  // Mémoriser les géométries pour éviter les recréations
  const geometries = useMemo(() => ({
    sphere: new THREE.SphereGeometry(size, 6, 6), // Réduire la résolution
    ring: new THREE.RingGeometry(size + 0.5, size + 1, 6), // Réduire la résolution
    cylinder: new THREE.CylinderGeometry(0.1, 0.1, Math.sqrt(position[0]**2 + position[2]**2), 4)
  }), [size, position]);

  return (
    <group position={position}>
      {/* Utilisateur mobile (sphère) - géométrie mémorisée */}
      <mesh ref={meshRef}>
        <primitive object={geometries.sphere} />
        <meshStandardMaterial 
          color={qosColor} 
          metalness={0.3} 
          roughness={0.7}
          emissive={qosColor}
          emissiveIntensity={0.1 * qos} // Réduire l'intensité
        />
      </mesh>
      
      {/* Éclairage de l'utilisateur - seulement pour les premiers utilisateurs */}
      {index < 10 && (
        <pointLight 
          ref={lightRef}
          position={[0, 0, 0]} 
          intensity={0.3} 
          color={qosColor}
          distance={15} // Réduire la distance
        />
      )}
      
      {/* Indicateur de signal (lignes de connexion) - simplifié */}
      {qos > 0.3 && index < 15 && ( // Limiter aux 15 premiers utilisateurs
        <group>
          {/* Ligne vers le Node B - géométrie mémorisée */}
          <mesh position={[0, 0, 0]}>
            <primitive object={geometries.cylinder} />
            <meshStandardMaterial 
              color={qosColor} 
              transparent 
              opacity={0.4 * qos} // Réduire l'opacité
            />
          </mesh>
          
          {/* Ondes de signal - géométrie mémorisée */}
          <mesh position={[0, 0, 0]}>
            <primitive object={geometries.ring} />
            <meshStandardMaterial 
              color={qosColor} 
              transparent 
              opacity={0.2 * qos} // Réduire l'opacité
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
      
      {/* Indicateur de charge (petit cube) - seulement pour les premiers utilisateurs */}
      {index < 20 && (
        <mesh position={[0, size + 0.5, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial 
            color={qos > 0.7 ? '#10b981' : qos > 0.4 ? '#f59e0b' : '#ef4444'} 
            emissive={qos > 0.7 ? '#10b981' : qos > 0.4 ? '#f59e0b' : '#ef4444'}
            emissiveIntensity={0.3} // Réduire l'intensité
          />
        </mesh>
      )}
    </group>
  );
}; 