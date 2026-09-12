import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

const THEME_COLORS = {
  cyber_neon: { primary: '#F59E0B', secondary: '#D97706', glow: '#FBBF24', lightAccent: '#B45309' },
  abyssal_void: { primary: '#06B6D4', secondary: '#0891B2', glow: '#22D3EE', lightAccent: '#0E7490' },
  solar_flare: { primary: '#F59E0B', secondary: '#D97706', glow: '#FBBF24', lightAccent: '#D97706' },
  emerald_matrix: { primary: '#10B981', secondary: '#059669', glow: '#34D399', lightAccent: '#047857' },
};

function CompanionDrone() {
  const droneRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (droneRef.current) {
      droneRef.current.position.x = -1.35 + Math.sin(t * 1.5) * 0.08;
      droneRef.current.position.y = -0.1 + Math.cos(t * 2) * 0.1;
      droneRef.current.position.z = 0.5 + Math.sin(t) * 0.06;
      droneRef.current.rotation.y = t * 0.8;
    }
  });
  return (
    <group ref={droneRef}>
      <mesh>
        <sphereGeometry args={[0.18, 24, 24]} />
        <meshStandardMaterial color="#0B0E14" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Amber glowing visor eyes */}
      <mesh position={[0, 0.02, 0.15]}>
        <boxGeometry args={[0.16, 0.04, 0.05]} />
        <meshBasicMaterial color="#F59E0B" />
      </mesh>
      {/* Ear pods */}
      <mesh position={[-0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
      <mesh position={[0.18, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.06, 12]} />
        <meshStandardMaterial color="#D97706" />
      </mesh>
    </group>
  );
}

function FloatingDiamondCrystal({ position, scale = 1, color = '#F59E0B', speed = 1 }) {
  const crystalRef = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (crystalRef.current) {
      crystalRef.current.rotation.y = t * 0.7;
      crystalRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.08;
    }
  });
  return (
    <group ref={crystalRef} position={position} scale={scale}>
      <mesh>
        <octahedronGeometry args={[0.22, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.88}
        />
      </mesh>
    </group>
  );
}

function CharacterPedestal({ isDark, colors, isLevelingUp }) {
  const ringsRef = useRef();

  useFrame((state, delta) => {
    if (ringsRef.current) {
      ringsRef.current.rotation.z += delta * (isLevelingUp ? 2.5 : 0.35);
    }
  });

  return (
    <group position={[0, -0.72, 0]}>
      {/* Tier 1: Main Platform Disc */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[1.35, 1.5, 0.14, 40]} />
        <meshStandardMaterial
          color="#090C10"
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* Tier 2: Inner Dark Obsidian Platform Inset */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.06, 40]} />
        <meshStandardMaterial
          color="#12161F"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Rotating Electric Amber Runic Ring on Ground */}
      <group ref={ringsRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.07, 0]}>
        <ringGeometry args={[0.95, 1.15, 32]} />
        <meshBasicMaterial
          color="#F59E0B"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </group>

      {/* Outer Glowing Emerald Base Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
        <ringGeometry args={[1.28, 1.33, 32]} />
        <meshBasicMaterial
          color="#10B981"
          transparent
          opacity={0.75}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

// Ambient Floating Motes around Avatar
function CharacterAuraParticles({ isDark, colors }) {
  const pointsRef = useRef();

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.15;
    }
  });

  return (
    <points ref={pointsRef} position={[0, 0.5, 0]}>
      <sphereGeometry args={[1.8, 20, 20]} />
      <pointsMaterial
        size={0.035}
        color={isDark ? colors.primary : '#38BDF8'}
        transparent
        opacity={isDark ? 0.55 : 0.35}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function AvatarMesh({ avatarClass = 'cyber_knight', theme = 'cyber_neon', isLevelingUp = false, isDark = true }) {
  const groupRef = useRef();
  const bladeRef = useRef();
  const ringRef = useRef();
  const auraRef = useRef();

  const colors = THEME_COLORS[theme] || THEME_COLORS.cyber_neon;

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;

    if (groupRef.current) {
      // Subtle Mouse Parallax
      const targetY = state.pointer.x * 0.3;
      if (isLevelingUp) {
        groupRef.current.rotation.y += delta * 5.5;
      } else {
        const baseIdle = Math.sin(time * 0.8) * 0.25;
        groupRef.current.rotation.y += (baseIdle + targetY - groupRef.current.rotation.y) * 0.08;
      }
    }

    if (bladeRef.current) {
      bladeRef.current.position.y = Math.sin(time * 2) * 0.08;
    }

    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.8;
      ringRef.current.rotation.x += delta * 0.4;
    }

    if (auraRef.current) {
      const s = 1 + Math.sin(time * 3) * 0.08;
      auraRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* Head / Cyber Visor */}
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[0.55, 0.6, 0.6]} />
        <meshStandardMaterial
          color={isDark ? '#0E1326' : '#1E293B'}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Visor Glow Strip */}
      <mesh position={[0, 1.35, 0.32]}>
        <boxGeometry args={[0.45, 0.12, 0.05]} />
        <meshStandardMaterial
          color={isLevelingUp ? '#FBBF24' : colors.primary}
          emissive={isLevelingUp ? '#FBBF24' : colors.primary}
          emissiveIntensity={isLevelingUp ? 3.5 : 2.0}
        />
      </mesh>

      {/* Torso / Power Core */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.45, 0.35, 0.9, 6]} />
        <meshStandardMaterial
          color={isDark ? '#1E2945' : '#334155'}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {/* Arc Reactor Core */}
      <mesh position={[0, 0.55, 0.22]}>
        <circleGeometry args={[0.16, 16]} />
        <meshBasicMaterial color={isLevelingUp ? '#FBBF24' : colors.primary} />
      </mesh>

      {/* Shoulders */}
      <mesh position={[-0.6, 0.8, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.4]} />
        <meshStandardMaterial color={colors.secondary} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.6, 0.8, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.4]} />
        <meshStandardMaterial color={colors.secondary} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Class Specific Weapon / Artifact */}
      {avatarClass === 'cyber_knight' && (
        <group ref={bladeRef} position={[0.85, 0.3, 0.2]}>
          {/* Energy Greatsword */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.08, 1.4, 0.04]} />
            <meshStandardMaterial
              color={colors.primary}
              emissive={colors.primary}
              emissiveIntensity={1.8}
            />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
            <meshStandardMaterial color={isDark ? '#0A0C16' : '#1E293B'} metalness={1} />
          </mesh>
        </group>
      )}

      {avatarClass === 'neon_sorcerer' && (
        <group ref={bladeRef} position={[0.85, 0.4, 0.3]}>
          {/* Levitating Cyber Grimoire / Hologram Orb */}
          <mesh>
            <dodecahedronGeometry args={[0.25, 0]} />
            <meshStandardMaterial
              color={colors.primary}
              emissive={colors.glow}
              emissiveIntensity={2.0}
              wireframe
            />
          </mesh>
        </group>
      )}

      {avatarClass === 'quantum_rogue' && (
        <group ref={bladeRef}>
          {/* Dual Phase Daggers */}
          <mesh position={[0.75, 0.2, 0.2]}>
            <coneGeometry args={[0.08, 0.7, 4]} />
            <meshStandardMaterial color={colors.primary} emissive={colors.primary} emissiveIntensity={1.5} />
          </mesh>
          <mesh position={[-0.75, 0.2, 0.2]}>
            <coneGeometry args={[0.08, 0.7, 4]} />
            <meshStandardMaterial color={colors.primary} emissive={colors.primary} emissiveIntensity={1.5} />
          </mesh>
        </group>
      )}

      {/* Floating Aura Halo / Orbiting Ring */}
      <mesh ref={ringRef} position={[0, 1.9, 0]}>
        <torusGeometry args={[0.5, 0.02, 16, 32]} />
        <meshStandardMaterial
          color={isLevelingUp ? '#FBBF24' : colors.glow}
          emissive={isLevelingUp ? '#FBBF24' : colors.glow}
          emissiveIntensity={isLevelingUp ? 2.5 : 1.5}
        />
      </mesh>

      {/* Base Energy Field */}
      <mesh ref={auraRef} position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.9, 32]} />
        <meshBasicMaterial
          color={isLevelingUp ? '#FBBF24' : colors.primary}
          transparent
          opacity={isLevelingUp ? 0.9 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Dynamic Character Lighting */}
      <pointLight position={[0, 0.5, 1]} intensity={isDark ? 2.2 : 1.6} color={colors.primary} distance={5} />
      <pointLight position={[0, 2, 0]} intensity={isDark ? 1.8 : 1.4} color={colors.glow} distance={4} />
    </group>
  );
}

function FallbackCharacter({ avatarClass = 'cyber_knight', theme = 'cyber_neon' }) {
  const colors = THEME_COLORS[theme] || THEME_COLORS.cyber_neon;
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
      <div
        className="w-32 h-32 rounded-3xl flex items-center justify-center shadow-lg border-2 animate-pulse"
        style={{ borderColor: colors.primary, backgroundColor: `${colors.primary}15` }}
      >
        <div className="font-orbitron text-4xl font-black" style={{ color: colors.primary }}>
          {avatarClass === 'cyber_knight' ? '🛡️' : avatarClass === 'neon_sorcerer' ? '🔮' : '⚡'}
        </div>
      </div>
      <span className="mt-3 font-orbitron text-xs tracking-widest text-slate-400 uppercase">
        {avatarClass.replace('_', ' ')}
      </span>
    </div>
  );
}

export default function CharacterScene3D({
  avatarClass = 'cyber_knight',
  theme = 'cyber_neon',
  isLevelingUp = false,
  interactive = true,
}) {
  const { isDark } = useTheme();
  const [hasWebGL, setHasWebGL] = useState(true);

  const colors = THEME_COLORS[theme] || THEME_COLORS.cyber_neon;

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
    return <FallbackCharacter avatarClass={avatarClass} theme={theme} />;
  }

  return (
    <div className="w-full h-full min-h-[260px] sm:min-h-[320px] relative select-none">
      <Canvas
        camera={{ position: [0, 0.7, 3.8], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={isDark ? 0.65 : 0.95} />
        <directionalLight position={[5, 10, 5]} intensity={isDark ? 1.2 : 1.5} />
        <directionalLight position={[-5, -5, -5]} intensity={isDark ? 0.5 : 0.3} color="#A855F7" />

        {/* 3D Ground Pedestal */}
        <CharacterPedestal
          isDark={isDark}
          colors={colors}
          isLevelingUp={isLevelingUp}
        />

        {/* Floating Companion Drone */}
        <CompanionDrone />

        {/* Floating 3D Prismatic Crystals around character matching reference */}
        <FloatingDiamondCrystal position={[-1.5, 0.35, 0.2]} scale={1.1} color="#F59E0B" speed={1.2} />
        <FloatingDiamondCrystal position={[1.45, -0.15, 0.5]} scale={0.9} color="#10B981" speed={0.9} />
        <FloatingDiamondCrystal position={[-0.8, 1.45, -0.3]} scale={0.7} color="#06B6D4" speed={1.4} />

        {/* Floating Motes */}
        <CharacterAuraParticles
          isDark={isDark}
          colors={colors}
        />

        {/* Character Mesh with Subtle Float */}
        <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.4}>
          <AvatarMesh
            avatarClass={avatarClass}
            theme={theme}
            isLevelingUp={isLevelingUp}
            isDark={isDark}
          />
        </Float>
      </Canvas>
    </div>
  );
}
