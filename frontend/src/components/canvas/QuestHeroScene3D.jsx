import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

function HolographicQuestTablet() {
  const tabletRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (tabletRef.current) {
      tabletRef.current.position.y = 0.55 + Math.sin(t * 2) * 0.02;
    }
  });

  return (
    <group ref={tabletRef} position={[0, 0.55, 0.42]} rotation={[-0.25, 0, 0]}>
      {/* Outer Hologram Glass Plane */}
      <mesh>
        <planeGeometry args={[0.55, 0.36]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Glowing Hologram Border Frame */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(0.55, 0.36)]} />
        <lineBasicMaterial color="#FBBF24" linewidth={2} />
      </lineSegments>

      {/* Hologram Data Lines */}
      <mesh position={[0, 0.08, 0.005]}>
        <planeGeometry args={[0.42, 0.03]} />
        <meshBasicMaterial color="#FEF3C7" transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.005]}>
        <planeGeometry args={[0.32, 0.02]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.75} />
      </mesh>
      <mesh position={[0.02, -0.04, 0.005]}>
        <planeGeometry args={[0.38, 0.02]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.75} />
      </mesh>
      <mesh position={[-0.08, -0.1, 0.005]}>
        <planeGeometry args={[0.26, 0.02]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function FloatingCrystal({ position, scale = 1, color = '#818CF8', speed = 1 }) {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (ref.current) {
      ref.current.rotation.y = t * 0.8;
      ref.current.position.y = position[1] + Math.sin(t * 1.6) * 0.07;
    }
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

function QuestPedestal() {
  const ringRef = useRef();

  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.4;
    }
  });

  return (
    <group position={[0, -0.72, 0]}>
      {/* Tier 1: Main Platform Disc */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.3, 1.45, 0.14, 40]} />
        <meshStandardMaterial color="#090C10" roughness={0.25} metalness={0.9} />
      </mesh>

      {/* Tier 2: Dark Metallic Inner Disc */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[1.15, 1.15, 0.06, 40]} />
        <meshStandardMaterial color="#12161F" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* Glowing Electric Amber Ring 1 */}
      <group ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[0.9, 1.05, 32]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.9} side={THREE.DoubleSide} />
      </group>

      {/* Outer Glowing Emerald Ring 2 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[1.18, 1.24, 32]} />
        <meshBasicMaterial color="#10B981" transparent opacity={0.75} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function RobotHeroMesh() {
  const headRef = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.8) * 0.08;
      headRef.current.rotation.x = 0.08 + Math.cos(t * 0.6) * 0.04;
    }
  });

  return (
    <group position={[0, -0.15, 0]}>
      {/* Head Group */}
      <group ref={headRef} position={[0, 0.85, 0]}>
        {/* Robot Head Box */}
        <mesh>
          <boxGeometry args={[0.42, 0.38, 0.38]} />
          <meshStandardMaterial color="#0F172A" metalness={0.85} roughness={0.15} />
        </mesh>

        {/* Amber Glowing Visor Eyes */}
        <mesh position={[0, 0.02, 0.2]}>
          <boxGeometry args={[0.28, 0.09, 0.02]} />
          <meshBasicMaterial color="#F59E0B" />
        </mesh>

        {/* Ear Antennas */}
        <mesh position={[-0.23, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
          <meshStandardMaterial color="#D97706" metalness={0.9} />
        </mesh>
        <mesh position={[0.23, 0.06, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 0.08, 12]} />
          <meshStandardMaterial color="#D97706" metalness={0.9} />
        </mesh>
      </group>

      {/* Torso */}
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.48, 0.52, 0.32]} />
        <meshStandardMaterial color="#0D1117" metalness={0.9} roughness={0.15} />
      </mesh>

      {/* Chest Glowing Energy Reactor */}
      <mesh position={[0, 0.42, 0.17]}>
        <octahedronGeometry args={[0.07, 0]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>

      {/* Arms posed holding tablet forward */}
      <mesh position={[-0.32, 0.45, 0.18]} rotation={[0.8, -0.3, 0]}>
        <boxGeometry args={[0.12, 0.35, 0.12]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} />
      </mesh>
      <mesh position={[0.32, 0.45, 0.18]} rotation={[0.8, 0.3, 0]}>
        <boxGeometry args={[0.12, 0.35, 0.12]} />
        <meshStandardMaterial color="#0F172A" metalness={0.8} />
      </mesh>

      {/* Holographic Tablet held by robot */}
      <HolographicQuestTablet />

      {/* Hips & Legs */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.4, 0.14, 0.28]} />
        <meshStandardMaterial color="#0F172A" metalness={0.85} />
      </mesh>
      <mesh position={[-0.14, -0.3, 0]}>
        <boxGeometry args={[0.15, 0.52, 0.18]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} />
      </mesh>
      <mesh position={[0.14, -0.3, 0]}>
        <boxGeometry args={[0.15, 0.52, 0.18]} />
        <meshStandardMaterial color="#1E293B" metalness={0.9} />
      </mesh>
      {/* Feet */}
      <mesh position={[-0.14, -0.58, 0.04]}>
        <boxGeometry args={[0.16, 0.08, 0.24]} />
        <meshStandardMaterial color="#0F172A" metalness={0.9} />
      </mesh>
      <mesh position={[0.14, -0.58, 0.04]}>
        <boxGeometry args={[0.16, 0.08, 0.24]} />
        <meshStandardMaterial color="#0F172A" metalness={0.9} />
      </mesh>
    </group>
  );
}

export default function QuestHeroScene3D() {
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
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-cyan-100 flex items-center justify-center text-4xl shadow-md animate-pulse">
          🤖
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[200px] sm:min-h-[240px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.4, 3.2], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 8, 4]} intensity={1.2} color="#F59E0B" />
        <directionalLight position={[-4, -2, -4]} intensity={0.5} color="#06B6D4" />
        <pointLight position={[0, 0.8, 1]} intensity={1.6} color="#F59E0B" distance={4} />

        {/* 3D Pedestal */}
        <QuestPedestal />

        {/* Floating Diamond Crystals around Robot */}
        <FloatingCrystal position={[-1.25, 0.4, 0.2]} scale={1} color="#F59E0B" speed={1.1} />
        <FloatingCrystal position={[1.2, 0.1, 0.3]} scale={0.85} color="#10B981" speed={0.9} />
        <FloatingCrystal position={[-0.6, 1.2, -0.3]} scale={0.6} color="#06B6D4" speed={1.3} />

        {/* Floating Robot Mesh with Tablet */}
        <Float speed={1.6} rotationIntensity={0.08} floatIntensity={0.25}>
          <RobotHeroMesh />
        </Float>
      </Canvas>
    </div>
  );
}
