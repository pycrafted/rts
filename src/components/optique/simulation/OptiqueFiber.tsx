import React, { useMemo, useRef } from 'react';
import { Tube, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OptiqueFiberProps {
  length: number;
  showCrossSection?: boolean;
}

const LightParticles = ({ curve }: { curve: THREE.LineCurve3 }) => {
  const particlesRef = useRef<THREE.Group>(null);
  const particleCount = 50;

  const particles = useMemo(() => {
    const p = [];
    for (let i = 0; i < particleCount; i++) {
      p.push(
        <Sphere key={i} args={[0.05, 8, 8]}>
          <meshStandardMaterial color="#ffff00" emissive="#ffff00" emissiveIntensity={4} toneMapped={false} />
        </Sphere>
      );
    }
    return p;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, index) => {
        const t = (state.clock.elapsedTime * 0.2 + (index / particleCount)) % 1;
        const point = curve.getPoint(t);
        particle.position.copy(point);
      });
    }
  });

  return <group ref={particlesRef}>{particles}</group>;
};

const OptiqueFiber: React.FC<OptiqueFiberProps> = ({ length, showCrossSection = false }) => {
  // Configuration de la fibre (simplifiée)
  const fiberConfig = {
    coreRadius: 0.1,
    claddingRadius: 0.2,
    neonColor: '#00ffff', // Cyan néon
  };

  // Création de la courbe simple pour la fibre
  const curve = useMemo(() => {
    return new THREE.LineCurve3(
      new THREE.Vector3(-length / 2, 0, 0),
      new THREE.Vector3(length / 2, 0, 0)
    );
  }, [length]);

  return (
    <group>
      {/* Gaine extérieure (sombre et transparente) */}
      <Tube args={[curve, 32, fiberConfig.claddingRadius, 8, false]}>
        <meshStandardMaterial color="#2d5a5a" transparent opacity={0.2} />
      </Tube>
      {/* Cœur de la fibre rendu plus transparent */}
      <Tube args={[curve, 32, fiberConfig.coreRadius, 8, false]}>
        <meshStandardMaterial
          color={fiberConfig.neonColor}
          emissive={fiberConfig.neonColor}
          emissiveIntensity={1.5}
          toneMapped={false}
          transparent={true}
          opacity={0.4}
        />
      </Tube>
      {/* Halo lumineux autour du cœur */}
      <Tube args={[curve, 32, fiberConfig.coreRadius + 0.05, 8, false]}>
        <meshStandardMaterial color={fiberConfig.neonColor} transparent opacity={0.2} />
      </Tube>

      {/* Particules de lumière animées */}
      <LightParticles curve={curve} />
      
      {/* Section transversale si demandée */}
      {showCrossSection && (
        <group position={new THREE.Vector3(-length / 2, 0, 0)}>
          <mesh>
            <circleGeometry args={[fiberConfig.claddingRadius, 32]} />
            <meshStandardMaterial color="#2d5a5a" />
          </mesh>
          <mesh>
            <circleGeometry args={[fiberConfig.coreRadius, 32]} />
            <meshStandardMaterial color={fiberConfig.neonColor} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default OptiqueFiber; 