/**
 * Composant 3D d'une épissure optique
 * 
 * Ce composant crée une représentation 3D d'une épissure avec :
 * - Un cylindre plus large que la fibre
 * - Un effet de brillance différent
 * - Une position alignée sur l'axe X de la fibre
 *
 * @component
 * @param {Object} props - Les propriétés du composant
 * @param {number} props.position - Position de l'épissure (0-100%)
 * @param {number} props.fiberLength - Longueur de la fibre (en unités 3D)
 */
import React from 'react';
import { Cylinder } from '@react-three/drei';

interface OptiqueSpliceProps {
  position: number;
  fiberLength: number;
}

const OptiqueSplice: React.FC<OptiqueSpliceProps> = ({ position, fiberLength }) => {
  // Calcul de la position sur l'axe X
  const xPosition = (position / 100) * fiberLength;

  return (
    <group position={[xPosition, 0, 0]}>
      {/* Boîtier d'épissure */}
      <Cylinder
        args={[0.15, 0.15, 0.3, 32]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshPhongMaterial
          color="#ff0000"
          transparent
          opacity={0.8}
          emissive="#ff0000"
          emissiveIntensity={0.3}
        />
      </Cylinder>

      {/* Indicateur de perte */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>
    </group>
  );
};

export default OptiqueSplice; 