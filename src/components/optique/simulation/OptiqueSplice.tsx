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
  const xPosition = (position / 100) * fiberLength - fiberLength / 2;
  const neonColor = '#ff00ff'; // Magenta néon

  return (
    <group position={[xPosition, 0, 0]}>
      {/* Cylindre principal de l'épissure */}
      <Cylinder args={[0.25, 0.25, 0.4, 16]}>
        <meshStandardMaterial
          color={neonColor}
          emissive={neonColor}
          emissiveIntensity={2}
          toneMapped={false}
          transparent
          opacity={0.8}
        />
      </Cylinder>
      {/* Anneau lumineux central */}
      <Cylinder args={[0.26, 0.26, 0.2, 16]}>
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </Cylinder>
    </group>
  );
};

export default OptiqueSplice; 