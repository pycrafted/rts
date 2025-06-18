import React from 'react';
import { Cylinder } from '@react-three/drei';

interface OptiqueConnectorProps {
  position: number;
}

const OptiqueConnector: React.FC<OptiqueConnectorProps> = ({ position }) => {
  return (
    <group position={[position, 0, 0]}>
      {/* Corps du connecteur */}
      <Cylinder
        args={[0.2, 0.2, 0.4, 16]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#888888"
          metalness={0.8}
          roughness={0.2}
        />
      </Cylinder>

      {/* Indicateur de perte */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshBasicMaterial color="#ff0000" />
      </mesh>

      {/* Détails du connecteur */}
      <Cylinder
        args={[0.15, 0.15, 0.1, 16]}
        position={[0.2, 0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          color="#666666"
          metalness={0.9}
          roughness={0.1}
        />
      </Cylinder>
    </group>
  );
};

export default OptiqueConnector; 