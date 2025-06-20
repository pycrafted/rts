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
      const intensity = 0.4 + Math.sin(state.clock.elapsedTime * 1.5 + index) * 0.2 * qos;
      lightRef.current.intensity = intensity;
    }
  });

  // Couleur basée sur la QoS - mémorisée
  const qosColor = useMemo(() => {
    if (qos > 0.8) return '#39ff14'; // Vert citron vif
    if (qos > 0.6) return '#ffff00'; // Jaune vibrant
    if (qos > 0.4) return '#ff8c00'; // Orange vif
    return '#ff2400'; // Rouge écarlate
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
          emissiveIntensity={0.2 * qos} // Augmenter l'intensité
        />
      </mesh>
      
      {/* Éclairage de l'utilisateur - seulement pour les premiers utilisateurs */}
      {index < 10 && (
        <pointLight 
          ref={lightRef}
          position={[0, 0, 0]} 
          intensity={0.5} 
          color={qosColor}
          distance={25} // Augmenter la distance
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
              opacity={0.6 * qos} // Augmenter l'opacité
            />
          </mesh>
          
          {/* Ondes de signal - géométrie mémorisée */}
          <mesh position={[0, 0, 0]}>
            <primitive object={geometries.ring} />
            <meshStandardMaterial 
              color={qosColor} 
              transparent 
              opacity={0.4 * qos} // Augmenter l'opacité
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      )}
      
      {/* Indicateur de charge (petit cube) - seulement pour les premiers utilisateurs */}
      {index < 20 && (
        <mesh position={[0, size + 0.5, 0]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial 
            color={qos > 0.7 ? '#39ff14' : qos > 0.4 ? '#ffff00' : '#ff2400'} 
            emissive={qos > 0.7 ? '#39ff14' : qos > 0.4 ? '#ffff00' : '#ff2400'}
            emissiveIntensity={0.5} // Augmenter l'intensité
          />
        </mesh>
      )}
      
      {/* Étiquette utilisateur pour les premiers utilisateurs */}
      {index < 5 && (
        <group position={[0, size + 1.5, 0]}>
          <mesh>
            <boxGeometry args={[3, 0.8, 0.5]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          {/* Indicateur de QoS */}
          <mesh position={[0, 0, 0.3]}>
            <sphereGeometry args={[0.2, 4, 4]} />
            <meshStandardMaterial 
              color={qosColor} 
              emissive={qosColor}
              emissiveIntensity={0.1}
            />
          </mesh>
        </group>
      )}
      
      {/* Effet de halo lumineux autour de l'utilisateur */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[size + 1, 8, 8]} />
        <meshStandardMaterial 
          color={qosColor} 
          transparent 
          opacity={0.05 * qos}
          emissive={qosColor}
          emissiveIntensity={0.02 * qos}
        />
      </mesh>
    </group>
  );
}; 