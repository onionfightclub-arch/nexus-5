
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial, Torus } from '@react-three/drei';
import * as THREE from 'three';

interface ShapeProps {
  position: [number, number, number];
  color: string;
  type: 'sphere' | 'torus' | 'distort';
  parallaxFactor?: number;
}

const Shape = ({ position, color, type, parallaxFactor = 1 }: ShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Store initial position to calculate offsets correctly relative to base
  const initialY = position[1];

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      
      // Rotational movement
      meshRef.current.rotation.x = Math.cos(t / 4) / 4;
      meshRef.current.rotation.y = Math.sin(t / 4) / 4;
      
      // Floating animation (subtle hover)
      const hover = Math.sin(t) * 0.15;
      
      // Parallax calculation
      // window.scrollY is reliable for standard HTML page scrolling
      // We use a small multiplier to map pixels to 3D coordinate space
      const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;
      const parallax = scrollY * 0.004 * parallaxFactor;
      
      // Apply total vertical position
      meshRef.current.position.y = initialY + hover + parallax;
    }
  });

  if (type === 'distort') {
    return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <Sphere args={[1, 64, 64]} position={position} ref={meshRef}>
          <MeshDistortMaterial
            color={color}
            speed={3}
            distort={0.4}
            radius={1}
          />
        </Sphere>
      </Float>
    );
  }

  if (type === 'torus') {
    return (
      <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
        <Torus args={[0.8, 0.2, 16, 100]} position={position} ref={meshRef}>
          <MeshWobbleMaterial color={color} factor={0.5} speed={2} />
        </Torus>
      </Float>
    );
  }

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[0.5, 32, 32]} position={position} ref={meshRef}>
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
      </Sphere>
    </Float>
  );
};

export const FloatingShapes: React.FC = () => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        {/* Each shape has a different parallaxFactor to create a tiered depth effect */}
        <Shape position={[-2, 1, 0]} color="#4f46e5" type="distort" parallaxFactor={0.8} />
        <Shape position={[2, -1, -1]} color="#db2777" type="torus" parallaxFactor={1.2} />
        <Shape position={[0, -2, 1]} color="#10b981" type="sphere" parallaxFactor={0.5} />
        <Shape position={[-3, -2, -2]} color="#f59e0b" type="sphere" parallaxFactor={1.5} />
        <Shape position={[3, 2, -1]} color="#6366f1" type="sphere" parallaxFactor={1.0} />
      </Canvas>
    </div>
  );
};
