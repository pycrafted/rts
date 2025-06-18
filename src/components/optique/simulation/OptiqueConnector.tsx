/**
 * Composant 3D d'un connecteur optique
 * 
 * Ce composant crée une représentation 3D d'un connecteur avec :
 * - Un cylindre plus large que la fibre
 * - Un effet de brillance distinct
 * - Une position alignée sur l'axe X de la fibre
 * - Une animation de pulsation
 * 
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {number} props.position - Position du connecteur (0-100%)
 * @param {number} props.fiberLength - Longueur de la fibre (en unités 3D)
 */
import React, { useRef } from 'react';
import { Cylinder } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OptiqueConnectorProps {
  position: number;
  fiberLength: number;
}

const OptiqueConnector: React.FC<OptiqueConnectorProps> = ({ position, fiberLength }) => {
  // Référence pour l'animation
  const connectorRef = useRef<THREE.Mesh>(null);

  // Calcul de la position sur l'axe X
  const xPosition = (position / 100) * fiberLength - fiberLength / 2;

  // Animation de pulsation
  useFrame(({ clock }) => {
    if (connectorRef.current) {
      const time = clock.getElapsedTime();
      const material = connectorRef.current.material as THREE.MeshPhongMaterial;
      material.opacity = 0.6 + Math.sin(time * 3) * 0.2;
    }
  });

  return (
    <Cylinder
      ref={connectorRef}
      args={[0.2, 0.2, 0.4, 32]}
      position={[xPosition, 0, 0]}
      rotation={[Math.PI / 2, 0, 0]}
    >
      <meshPhongMaterial
        color="#0000ff"
        transparent
        opacity={0.7}
        emissive="#0000ff"
        emissiveIntensity={0.4}
      />
    </Cylinder>
  );
};

export default OptiqueConnector; 