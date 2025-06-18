import React, { useMemo, useRef } from 'react';
import { Tube, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OptiqueFiberProps {
  length: number;
  type?: 'monomode' | 'multimode';
  wavelength?: number;
  showCrossSection?: boolean;
}

const OptiqueFiber: React.FC<OptiqueFiberProps> = ({ 
  length, 
  type = 'monomode',
  wavelength = 1550,
  showCrossSection = false 
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);

  // Configuration de la fibre en fonction du type
  const fiberConfig = useMemo(() => {
    const baseConfig = {
      coreRadius: type === 'monomode' ? 0.05 : 0.1,
      claddingRadius: type === 'monomode' ? 0.125 : 0.25,
      coreColor: '#ff0000',
      claddingColor: '#FFA500',
      lightSpeed: type === 'monomode' ? 0.5 : 0.3,
      particleCount: type === 'monomode' ? 20 : 50
    };

    // Ajustement des propriétés en fonction de la longueur d'onde
    const wavelengthFactor = wavelength / 1550; // Normalisation par rapport à 1550nm
    return {
      ...baseConfig,
      coreRadius: baseConfig.coreRadius * wavelengthFactor,
      claddingRadius: baseConfig.claddingRadius * wavelengthFactor,
      lightSpeed: baseConfig.lightSpeed * wavelengthFactor,
      particleCount: Math.floor(baseConfig.particleCount * wavelengthFactor)
    };
  }, [type, wavelength]);

  // Création de la courbe de la fibre
  const curve = useMemo(() => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      points.push(new THREE.Vector3(
        length * (t - 0.5),
        Math.sin(t * Math.PI * 2) * 0.1,
        Math.cos(t * Math.PI * 2) * 0.1
      ));
    }
    return new THREE.CatmullRomCurve3(points);
  }, [length]);

  // Animation de la lumière et des particules
  useFrame((state, delta) => {
    if (lightRef.current) {
      lightRef.current.rotation.z += delta * fiberConfig.lightSpeed;
    }
    if (particlesRef.current) {
      particlesRef.current.children.forEach((particle, index) => {
        const t = (state.clock.elapsedTime * 0.5 + index / fiberConfig.particleCount) % 1;
        const point = curve.getPoint(t);
        particle.position.copy(point);
      });
    }
  });

  // Génération des particules de lumière
  const lightParticles = useMemo(() => {
    const particles = [];
    for (let i = 0; i < fiberConfig.particleCount; i++) {
      const t = i / fiberConfig.particleCount;
      const point = curve.getPoint(t);
      particles.push(
        <Sphere
          key={i}
          position={point}
          args={[0.02, 16, 16]}
        >
          <meshPhongMaterial
            color="#ffff00"
            emissive="#ffff00"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </Sphere>
      );
    }
    return particles;
  }, [curve, fiberConfig.particleCount]);

  return (
    <group ref={groupRef}>
      {/* Gaine de la fibre */}
      <Tube
        args={[curve, 64, fiberConfig.claddingRadius, 8, false]}
      >
        <meshPhongMaterial
          color={fiberConfig.claddingColor}
          transparent
          opacity={0.8}
        />
      </Tube>

      {/* Cœur de la fibre */}
      <Tube
        args={[curve, 64, fiberConfig.coreRadius, 8, false]}
      >
        <meshPhongMaterial
          color={fiberConfig.coreColor}
          transparent
          opacity={0.3}
        />
      </Tube>

      {/* Particules de lumière */}
      <group ref={particlesRef}>
        {lightParticles}
      </group>

      {/* Section transversale si demandée */}
      {showCrossSection && (
        <group position={[0, 0, 0]}>
          <mesh>
            <circleGeometry args={[fiberConfig.claddingRadius, 32]} />
            <meshPhongMaterial color={fiberConfig.claddingColor} />
          </mesh>
          <mesh>
            <circleGeometry args={[fiberConfig.coreRadius, 32]} />
            <meshPhongMaterial color={fiberConfig.coreColor} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export default OptiqueFiber; 