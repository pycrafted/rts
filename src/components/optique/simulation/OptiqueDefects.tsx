import React, { useRef } from 'react';
import { Tube, Sphere } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface OptiqueDefectsProps {
  position: number;
  fiberLength: number;
  type: 'bend' | 'break' | 'dirty' | 'wet';
  severity: number; // 0-1
}

const OptiqueDefects: React.FC<OptiqueDefectsProps> = ({
  position,
  fiberLength,
  type,
  severity
}) => {
  const defectRef = useRef<THREE.Group>(null);
  const xPosition = (position / 100) * fiberLength;

  // Animation des défauts
  useFrame(({ clock }) => {
    if (defectRef.current) {
      const time = clock.getElapsedTime();
      
      switch (type) {
        case 'bend':
          defectRef.current.rotation.z = Math.sin(time) * severity * 0.2;
          break;
        case 'break':
          defectRef.current.scale.y = 1 + Math.sin(time * 2) * severity * 0.1;
          break;
        case 'dirty':
          defectRef.current.rotation.z = time * severity;
          break;
        case 'wet':
          defectRef.current.position.y = Math.sin(time * 3) * severity * 0.1;
          break;
      }
    }
  });

  // Configuration des défauts
  const getDefectConfig = () => {
    switch (type) {
      case 'bend':
        return {
          color: '#ff0000',
          size: 0.3,
          opacity: 0.7
        };
      case 'break':
        return {
          color: '#ff0000',
          size: 0.2,
          opacity: 0.9
        };
      case 'dirty':
        return {
          color: '#8B4513',
          size: 0.25,
          opacity: 0.6
        };
      case 'wet':
        return {
          color: '#0000ff',
          size: 0.3,
          opacity: 0.5
        };
      default:
        return {
          color: '#ff0000',
          size: 0.3,
          opacity: 0.7
        };
    }
  };

  const config = getDefectConfig();

  return (
    <group ref={defectRef} position={[xPosition, 0, 0]}>
      {/* Indicateur de défaut */}
      <Sphere args={[config.size, 16, 16]}>
        <meshPhongMaterial
          color={config.color}
          transparent
          opacity={config.opacity}
          emissive={config.color}
          emissiveIntensity={0.5}
        />
      </Sphere>

      {/* Effets spécifiques selon le type de défaut */}
      {type === 'bend' && (
        <Tube
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(-0.2, 0, 0),
              new THREE.Vector3(0, severity * 0.3, 0),
              new THREE.Vector3(0.2, 0, 0)
            ]),
            32,
            0.05,
            8,
            false
          ]}
        >
          <meshPhongMaterial
            color={config.color}
            transparent
            opacity={config.opacity}
          />
        </Tube>
      )}

      {type === 'break' && (
        <group>
          <Sphere args={[0.05, 16, 16]} position={[-0.1, 0, 0]}>
            <meshPhongMaterial
              color={config.color}
              transparent
              opacity={config.opacity}
            />
          </Sphere>
          <Sphere args={[0.05, 16, 16]} position={[0.1, 0, 0]}>
            <meshPhongMaterial
              color={config.color}
              transparent
              opacity={config.opacity}
            />
          </Sphere>
        </group>
      )}

      {type === 'dirty' && (
        <group>
          {[...Array(5)].map((_, i) => (
            <Sphere
              key={i}
              args={[0.02, 8, 8]}
              position={[
                Math.cos(i * Math.PI * 2 / 5) * 0.15,
                Math.sin(i * Math.PI * 2 / 5) * 0.15,
                0
              ]}
            >
              <meshPhongMaterial
                color={config.color}
                transparent
                opacity={config.opacity}
              />
            </Sphere>
          ))}
        </group>
      )}

      {type === 'wet' && (
        <group>
          <Sphere args={[0.15, 16, 16]}>
            <meshPhongMaterial
              color={config.color}
              transparent
              opacity={config.opacity * 0.5}
            />
          </Sphere>
          {[...Array(3)].map((_, i) => (
            <Sphere
              key={i}
              args={[0.05, 8, 8]}
              position={[
                Math.cos(i * Math.PI * 2 / 3) * 0.2,
                Math.sin(i * Math.PI * 2 / 3) * 0.2,
                0
              ]}
            >
              <meshPhongMaterial
                color={config.color}
                transparent
                opacity={config.opacity}
              />
            </Sphere>
          ))}
        </group>
      )}
    </group>
  );
};

export default OptiqueDefects; 