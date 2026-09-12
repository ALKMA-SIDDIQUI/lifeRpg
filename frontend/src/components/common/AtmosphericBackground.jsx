import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

// Slowly rotating abstract dark fantasy RPG artifact
function AscensionRelic() {
  const artifactGroupRef = useRef();
  const innerCoreRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    
    if (artifactGroupRef.current) {
      // Gentle slow yaw rotation
      artifactGroupRef.current.rotation.y += delta * 0.12;
      artifactGroupRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.y -= delta * 0.25;
      innerCoreRef.current.rotation.z += delta * 0.15;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.18;
      ring1Ref.current.rotation.y += delta * 0.08;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.15;
      ring2Ref.current.rotation.z += delta * 0.12;
    }
  });

  return (
    <group ref={artifactGroupRef} position={[2.8, -0.2, -3.5]} scale={1.35}>
      {/* Outer Faceted Obsidian Polyhedron */}
      <mesh>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#0B0E14"
          roughness={0.25}
          metalness={0.9}
          wireframe={false}
        />
      </mesh>

      {/* Gold & Amber Wireframe Rune Lattice */}
      <mesh>
        <dodecahedronGeometry args={[1.21, 0]} />
        <meshBasicMaterial
          color="#F59E0B"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Pulsing Electric Amber Inner Core */}
      <Float speed={2.0} rotationIntensity={0.4} floatIntensity={0.3}>
        <mesh ref={innerCoreRef}>
          <octahedronGeometry args={[0.55, 0]} />
          <meshStandardMaterial
            color="#F59E0B"
            emissive="#D97706"
            emissiveIntensity={1.2}
            roughness={0.1}
            metalness={0.8}
          />
        </mesh>
      </Float>

      {/* Thin Runic Ring 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.7, 0.015, 16, 48]} />
        <meshBasicMaterial color="#F59E0B" transparent opacity={0.45} />
      </mesh>

      {/* Thin Runic Ring 2 (Muted Cyan Accent) */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[2.0, 0.012, 16, 48]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.3} />
      </mesh>

      {/* Subtle Warm Amber Light Source */}
      <pointLight color="#F59E0B" intensity={1.8} distance={8} decay={2} />
    </group>
  );
}

// Drifting Floating Embers in Obsidian Void
function FloatingEmbers() {
  const pointsRef = useRef();

  const particleCount = 55;
  const [positions] = useState(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    return pos;
  });

  useFrame((state, delta) => {
    if (pointsRef.current) {
      const positionsArr = pointsRef.current.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        // Drift slowly upwards and slightly sway
        positionsArr[i * 3 + 1] += delta * 0.25;
        positionsArr[i * 3] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.003;

        // Wrap around top boundary
        if (positionsArr[i * 3 + 1] > 6) {
          positionsArr[i * 3 + 1] = -6;
          positionsArr[i * 3] = (Math.random() - 0.5) * 16;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#F59E0B"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function AtmosphericBackground() {
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

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Deep Obsidian Charcoal Backdrop */}
      <div className="absolute inset-0 bg-[#06080C]" />
      
      {/* Subtle Atmospheric Radial Gradients */}
      <div 
        className="absolute inset-0 opacity-80"
        style={{
          backgroundImage: `
            radial-gradient(circle at 80% 30%, rgba(245, 158, 11, 0.07) 0%, transparent 50%),
            radial-gradient(circle at 20% 70%, rgba(6, 182, 212, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 50% 10%, rgba(16, 185, 129, 0.03) 0%, transparent 40%),
            linear-gradient(180deg, #06080C 0%, #090C10 35%, #0D1117 70%, #06080C 100%)
          `
        }}
      />

      {/* Faint Tactical HUD Grid Texture Overlay */}
      <div className="absolute inset-0 hud-grid-pattern opacity-40 pointer-events-none" />

      {/* Three.js / React Three Fiber Atmospheric Scene */}
      {hasWebGL && (
        <div className="absolute inset-0 w-full h-full opacity-70">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            {/* Ambient & Rim Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 4]} intensity={0.8} color="#F59E0B" />
            <directionalLight position={[-5, -3, -2]} intensity={0.4} color="#06B6D4" />

            {/* Rotating Dark Fantasy Artifact */}
            <AscensionRelic />

            {/* Floating Ember Particles */}
            <FloatingEmbers />
          </Canvas>
        </div>
      )}

      {/* Top and Bottom Vignette Fades for Depth */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#06080C] to-transparent opacity-80" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#06080C] to-transparent opacity-80" />
    </div>
  );
}

