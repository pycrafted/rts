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
import React from 'react';
import { Box } from '@react-three/drei';

interface OptiqueConnectorProps {
  position: number;
  fiberLength: number;
}

const OptiqueConnector: React.FC<OptiqueConnectorProps> = ({ position, fiberLength }) => {
  const xPosition = (position / 100) * fiberLength - fiberLength / 2;
  const neonColor = '#ffff00'; // Jaune néon

  return (
    <group position={[xPosition, 0, 0]}>
      {/* Boîtier du connecteur */}
      <Box args={[0.5, 0.5, 0.5]}>
        <meshStandardMaterial
          color={neonColor}
          emissive={neonColor}
          emissiveIntensity={1.5}
          toneMapped={false}
          metalness={0.1}
          roughness={0.2}
        />
      </Box>
      {/* Indicateur lumineux */}
      <Box args={[0.55, 0.55, 0.55]}>
        <meshStandardMaterial
          color={neonColor}
          emissive={neonColor}
          emissiveIntensity={1}
          transparent
          opacity={0.3}
        />
      </Box>
    </group>
  );
};

export default OptiqueConnector; 