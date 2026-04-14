import React, { useRef, Suspense, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CAMERA_URL = 'https://pub-a56d70d158b1414d83c3856ea210601c.r2.dev/camera.glb';

// Finalized configuration from user
const CONFIG = {
  posX: 1.44,
  posY: 0.02,
  posZ: -1.11,
  rotX: -0.17,
  rotY: 2.50,
  rotZ: 0.19,
  scale: 1.77,
  sensitivity: 0.13,
  lerp: 0.04,
  blur: 0,
  opacity: 1,
  ambientIntensity: 0,
  spotIntensity: 20,
  spotX: 16,
  spotY: -1.5,
  spotZ: -10,
  shadowOpacity: 1,
  shadowScale: 29,
  shadowBlur: 1.5
};

function CameraModel({ globalMouse }: { globalMouse: React.MutableRefObject<{ x: number, y: number }> }) {
  const { scene } = useGLTF(CAMERA_URL);
  const modelRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!modelRef.current) return;

    // Use global mouse position since Canvas events are blocked
    const mouseX = globalMouse.current.x;
    const mouseY = globalMouse.current.y;

    // Smoothly interpolate rotation based on mouse position
    const targetRotationX = CONFIG.rotX + (-mouseY * CONFIG.sensitivity);
    const targetRotationY = CONFIG.rotY + (mouseX * CONFIG.sensitivity);

    modelRef.current.rotation.x = THREE.MathUtils.lerp(
      modelRef.current.rotation.x,
      targetRotationX,
      CONFIG.lerp
    );
    modelRef.current.rotation.y = THREE.MathUtils.lerp(
      modelRef.current.rotation.y,
      targetRotationY,
      CONFIG.lerp
    );
    modelRef.current.rotation.z = THREE.MathUtils.lerp(
      modelRef.current.rotation.z,
      CONFIG.rotZ,
      CONFIG.lerp
    );

    // Static Position
    modelRef.current.position.set(CONFIG.posX, CONFIG.posY, CONFIG.posZ);
  });

  return (
    <group ref={modelRef} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

export function CameraScene() {
  // Global mouse tracking since the container has pointer-events-none
  const globalMouse = useRef({ x: 0, y: 0 });
  const [responsiveConfig, setResponsiveConfig] = useState({
    posX: CONFIG.posX,
    posY: CONFIG.posY,
    scale: CONFIG.scale
  });

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      const isPortrait = window.innerHeight > window.innerWidth;
      
      if (isMobile) {
        setResponsiveConfig({
          // On mobile, center it more or move it to a better spot
          posX: isPortrait ? 0.5 : 1.0, 
          posY: isPortrait ? -0.5 : 0.02,
          scale: isPortrait ? CONFIG.scale * 0.7 : CONFIG.scale * 0.8
        });
      } else {
        setResponsiveConfig({
          posX: CONFIG.posX,
          posY: CONFIG.posY,
          scale: CONFIG.scale
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      globalMouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
            <group position={[responsiveConfig.posX, responsiveConfig.posY, CONFIG.posZ]} scale={responsiveConfig.scale}>
              <CameraModel globalMouse={globalMouse} />
            </group>
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
