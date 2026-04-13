import React, { useRef, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CAMERA_URL = 'https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/camera.glb';

// Finalized configuration from user
const CONFIG = {
  posX: 0.21,
  posY: -0.56,
  posZ: -7.52,
  rotX: -0.111592653589793,
  rotY: 2.98840734641021,
  rotZ: 0.388407346410207,
  scale: 1.16,
  sensitivity: 4.01,
  lerp: 0.684,
  blur: 0,
  opacity: 1,
  ambientIntensity: 5,
  spotIntensity: 8.6,
  spotX: 9.5,
  spotY: 17,
  spotZ: 16,
  shadowOpacity: 1,
  shadowScale: 20,
  shadowBlur: 1.9
};

function CameraModel() {
  const { scene } = useGLTF(CAMERA_URL);
  const modelRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  useFrame(() => {
    if (!modelRef.current) return;

    // Smoothly interpolate rotation based on mouse position
    const targetRotationX = CONFIG.rotX + (-mouse.y * CONFIG.sensitivity * 0.1);
    const targetRotationY = CONFIG.rotY + (mouse.x * CONFIG.sensitivity * 0.1);

    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      targetRotationX,
      CONFIG.lerp * 0.1
    );
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      targetRotationY,
      CONFIG.lerp * 0.1
    );
    modelRef.current.rotation.z = THREE.MathUtils.lerp(
      modelRef.current.rotation.z,
      CONFIG.rotZ,
      CONFIG.lerp * 0.1
    );

    // Static Position
    modelRef.current.position.set(CONFIG.posX, CONFIG.posY, CONFIG.posZ);
  });

  return (
    <group ref={modelRef} dispose={null} scale={CONFIG.scale}>
      <primitive object={scene} />
    </group>
  );
}

export function CameraScene() {
  return (
    <div className="fixed inset-0 z-[50] pointer-events-none overflow-hidden">
      <div className="w-full h-full" style={{ opacity: CONFIG.opacity, filter: `blur(${CONFIG.blur}px)` }}>
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          camera={{ position: [0, 0, 5], fov: 40 }}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={CONFIG.ambientIntensity} />
          <spotLight 
            position={[CONFIG.spotX, CONFIG.spotY, CONFIG.spotZ]} 
            angle={0.15} 
            penumbra={1} 
            intensity={CONFIG.spotIntensity} 
            castShadow 
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <Suspense fallback={null}>
            <CameraModel />
            <ContactShadows
              position={[0, -2, 0]}
              opacity={CONFIG.shadowOpacity}
              scale={CONFIG.shadowScale}
              blur={CONFIG.shadowBlur}
              far={4.5}
            />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>
    </div>
  );
}

function ControlGroup({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-white/40 font-medium uppercase tracking-tighter text-[10px]">{label}</p>
      <div className="space-y-2 pl-2 border-l border-white/5">
        {children}
      </div>
    </div>
  );
}

function Slider({ label, value, min, max, step, onChange }: { label: string, value: number, min: number, max: number, step: number, onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-8 text-white/60">{label}</span>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="flex-1 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
      />
      <span className="w-10 text-right font-mono text-[10px]">{value.toFixed(2)}</span>
    </div>
  );
}
