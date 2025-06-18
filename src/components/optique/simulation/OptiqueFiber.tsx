import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Tube } from '@react-three/drei';
import * as THREE from 'three';

interface OptiqueFiberProps {
  length: number;
}

const OptiqueFiber: React.FC<OptiqueFiberProps> = ({ length }) => {
  const fiberRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.Mesh>(null);
  
  // Animation de la lumière
  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      lightRef.current.position.x = (Math.sin(time * 2) + 1) * length / 2;
    }
  });

  // Création de la courbe de la fibre
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(length, 0, 0)
  ]);

  return (
    <group>
      {/* Fibre optique */}
      <Tube
        ref={fiberRef}
        args={[curve, 64, 0.1, 8, false]}
      >
        <meshPhongMaterial
          color="#666666"
          transparent
          opacity={0.8}
        />
      </Tube>

      {/* Cœur de la fibre */}
      <Tube
        args={[curve, 64, 0.05, 8, false]}
      >
        <meshPhongMaterial
          color="#ff0000"
          transparent
          opacity={0.3}
        />
      </Tube>

      {/* Animation de la lumière */}
      <mesh ref={lightRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#ffff00" />
      </mesh>
    </group>
  );
};

export default OptiqueFiber; 