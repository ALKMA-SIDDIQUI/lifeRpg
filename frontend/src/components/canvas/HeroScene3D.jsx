import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

// 3D Core Artifact
function CyberRelic({ isDark }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const particlesRef = useRef();

  useFrame((state, delta) => {
    // Mouse Parallax interpolation
    if (groupRef.current) {
      const targetX = state.pointer.x * 0.4;
      const targetY = state.pointer.y * 0.3;
      groupRef.current.rotation.y += (targetX - groupRef.current.rotation.y) * 0.05;
      groupRef.current.rotation.x += (-targetY - groupRef.current.rotation.x) * 0.05;
    }

    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.35;
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.55;
      ring1Ref.current.rotation.y += delta * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.45;
      ring2Ref.current.rotation.z += delta * 0.35;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z += delta * 0.3;
      ring3Ref.current.rotation.x -= delta * 0.2;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.07;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Floating Crystalline Obsidian Relic */}
      <Float speed={2.0} rotationIntensity={0.5} floatIntensity={0.8}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <octahedronGeometry args={[1.55, 0]} />
          <MeshDistortMaterial
            color="#0B0E14"
            emissive="#F59E0B"
            emissiveIntensity={0.65}
            roughness={0.2}
            metalness={0.9}
            distort={0.15}
            speed={1.5}
          />
        </mesh>
      </Float>

      {/* Orbiting Runic Ring 1 (Electric Amber) */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[2.5, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#F59E0B"
          emissive="#D97706"
          emissiveIntensity={1.4}
          wireframe
        />
      </mesh>

      {/* Orbiting Runic Ring 2 (Muted Cyan) */}
      <mesh ref={ring2Ref}>
        <torusGeometry args={[2.95, 0.02, 16, 64]} />
        <meshStandardMaterial
          color="#06B6D4"
          emissive="#0891B2"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Outer Runic Ring 3 (Emerald) */}
      <mesh ref={ring3Ref}>
        <torusGeometry args={[3.3, 0.015, 16, 64]} />
        <meshStandardMaterial
          color="#10B981"
          emissive="#059669"
          emissiveIntensity={1.2}
        />
      </mesh>

      {/* Ambient Ember Motes */}
      <points ref={particlesRef}>
        <sphereGeometry args={[4.6, 36, 36]} />
        <pointsMaterial
          size={0.038}
          color="#F59E0B"
          transparent
          opacity={0.65}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Atmospheric Lighting */}
      {isDark ? (
        <>
          <pointLight position={[0, 0, 0]} intensity={3.5} color="#00F0FF" distance={10} />
          <pointLight position={[3, 3, 3]} intensity={2.2} color="#A855F7" />
          <pointLight position={[-3, -2, -2]} intensity={1.8} color="#38BDF8" />
        </>
      ) : (
        <>
          <pointLight position={[0, 0, 0]} intensity={2.2} color="#38BDF8" distance={8} />
          <pointLight position={[3, 4, 3]} intensity={1.8} color="#C4B5FD" />
          <pointLight position={[-3, -3, -2]} intensity={1.2} color="#BAE6FD" />
        </>
      )}
    </group>
  );
}

// Fallback CSS 3D Hologram in case WebGL is unavailable
function HologramFallback({ isDark }) {
  return (
    <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
      <div className={`absolute inset-0 rounded-full blur-2xl animate-pulse ${isDark ? 'bg-cyan-500/15' : 'bg-sky-400/20'}`}></div>
      <div className={`relative w-48 h-48 border-2 rounded-full animate-[spin_10s_linear_infinite] flex items-center justify-center ${isDark ? 'border-cyber-cyan/40' : 'border-sky-400/50'}`}>
        <div className={`w-36 h-36 border-2 border-dashed rounded-full animate-[spin_6s_linear_infinite_reverse] flex items-center justify-center ${isDark ? 'border-cyber-purple/50' : 'border-purple-400/50'}`}>
          <div className={`w-24 h-24 rounded-2xl rotate-45 animate-bounce shadow-lg ${isDark ? 'bg-gradient-to-tr from-cyber-cyan via-cyber-purple to-cyber-pink shadow-glow-cyan' : 'bg-gradient-to-tr from-sky-400 via-indigo-400 to-purple-400'}`}></div>
        </div>
      </div>
    </div>
  );
}

export default function HeroScene3D() {
  const { isDark } = useTheme();
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return <HologramFallback isDark={isDark} />;
  }

  return (
    <div className="w-full h-full min-h-[380px] sm:min-h-[480px] relative select-none">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        className="cursor-grab active:cursor-grabbing"
      >
        <ambientLight intensity={isDark ? 0.6 : 0.9} />
        <CyberRelic isDark={isDark} />
      </Canvas>
    </div>
  );
}
