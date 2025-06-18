import React from 'react';
import { Cylinder } from '@react-three/drei';

interface OptiqueSpliceProps {
  position: number;
}

const OptiqueSplice: React.FC<OptiqueSpliceProps> = ({ position }) => {
  return (
    <group position={[position, 0, 0]}>
      {/* Boîtier d'épissure */}
      <Cylinder
        args={[0.15, 0.15, 0.3, 16]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshPhongMaterial
          color="#444444"
          transparent
          opacity={0.9}
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