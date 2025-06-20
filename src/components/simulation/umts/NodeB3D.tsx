import React, { useRef, useMemo } from 'react';
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
  
  // Couleur de l'antenne basée sur le facteur de charge - mémorisée
  const antennaColor = useMemo(() => {
    if (loadFactor < 0.3) return '#39ff14'; // Vert citron vif
    if (loadFactor < 0.6) return '#ffff00'; // Jaune vibrant
    if (loadFactor < 0.8) return '#ff8c00'; // Orange vif
    return '#ff2400'; // Rouge écarlate
  }, [loadFactor]);
  
  // Animation de l'antenne - optimisée
  useFrame((state) => {
    if (antennaRef.current) {
      // Animation plus lente et moins intensive
      antennaRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05 * loadFactor;
    }
  });

  // Mémoriser les géométries pour éviter les recréations
  const geometries = useMemo(() => ({
    base: new THREE.CylinderGeometry(5, 8, 40, 6), // Réduire la résolution
    platform: new THREE.CylinderGeometry(12, 12, 2, 6),
    mainAntenna: new THREE.BoxGeometry(1, 8, 1),
    secondaryAntenna: new THREE.BoxGeometry(0.5, 6, 0.5),
    indicator: new THREE.SphereGeometry(2, 6, 6), // Réduire la résolution
    coverage: new THREE.SphereGeometry(4000, 24, 24) // Zone de couverture très élargie
  }), []);

  return (
    <group ref={groupRef} position={position}>
      {/* Base de la tour - géométrie mémorisée */}
      <mesh position={[0, -20, 0]}>
        <primitive object={geometries.base} />
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Plateforme de l'antenne - géométrie mémorisée */}
      <mesh position={[0, 20, 0]}>
        <primitive object={geometries.platform} />
        <meshStandardMaterial color="#6b7280" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Antenne principale - géométrie mémorisée */}
      <mesh ref={antennaRef} position={[0, 25, 0]}>
        <primitive object={geometries.mainAntenna} />
        <meshStandardMaterial color={antennaColor} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Antennes secondaires - géométrie mémorisée */}
      <mesh position={[3, 25, 0]}>
        <primitive object={geometries.secondaryAntenna} />
        <meshStandardMaterial color={antennaColor} metalness={0.9} roughness={0.1} />
      </mesh>
      
      <mesh position={[3, 25, 0]}>
        <primitive object={geometries.secondaryAntenna} />
        <meshStandardMaterial color={antennaColor} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Éclairage de l'antenne - intensité réduite */}
      <pointLight 
        position={[0, 30, 0]} 
        intensity={0.6} 
        color={antennaColor}
        distance={50} // Augmenter la distance
      />
      
      {/* Indicateur de puissance - géométrie mémorisée */}
      <mesh position={[0, 15, 0]}>
        <primitive object={geometries.indicator} />
        <meshStandardMaterial 
          color={antennaColor} 
          transparent 
          opacity={0.4} // Augmenter l'opacité
          emissive={antennaColor}
          emissiveIntensity={0.2} // Augmenter l'intensité
        />
      </mesh>
      
      {/* Zone de couverture (sphère transparente) - géométrie mémorisée */}
      <mesh position={[0, 0, 0]}>
        <primitive object={geometries.coverage} />
        <meshStandardMaterial 
          color={antennaColor} 
          transparent 
          opacity={0.08} // Augmenter l'opacité
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Étiquette Node B pour plus de clarté */}
      <group position={[0, 35, 0]}>
        <mesh>
          <boxGeometry args={[8, 2, 1]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        {/* Texte 3D simplifié - utiliser des formes géométriques */}
        <mesh position={[0, 0, 0.6]}>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[-1, 0, 0.6]}>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
        </mesh>
        <mesh position={[1, 0, 0.6]}>
          <boxGeometry args={[0.5, 0.5, 0.1]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.1} />
        </mesh>
      </group>
      
      {/* Effet de halo lumineux autour du Node B */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[10, 16, 16]} />
        <meshStandardMaterial 
          color={antennaColor} 
          transparent 
          opacity={0.1}
          emissive={antennaColor}
          emissiveIntensity={0.05}
        />
      </mesh>
    </group>
  );
}; 