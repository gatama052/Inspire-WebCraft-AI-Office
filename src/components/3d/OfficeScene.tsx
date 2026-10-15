import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { useOfficeStore } from '../../store/officeStore';
import { OfficeBuilding } from './OfficeBuilding';
import { Character3D } from './Character3D';
import { CameraController } from './CameraController';

export const OfficeScene: React.FC = () => {
  const agents = useOfficeStore((state) => state.agents);
  const isNightMode = useOfficeStore((state) => state.isNightMode);
  const graphicsQuality = useOfficeStore((state) => state.graphicsQuality);

  const shadowMapSize = graphicsQuality === 'high' ? 2048 : graphicsQuality === 'medium' ? 1024 : 512;
  const enableShadows = graphicsQuality !== 'low';

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        shadows={enableShadows}
        camera={{ position: [26, 28, 26], fov: 38 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: isNightMode ? 0.9 : 1.15,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance'
        }}
        dpr={graphicsQuality === 'high' ? [1, 2] : 1}
      >
        <Suspense fallback={null}>
          {/* Studio Lighting Setup */}
          <ambientLight intensity={isNightMode ? 0.35 : 0.75} color={isNightMode ? '#3b82f6' : '#ffffff'} />

          {/* Key Sun Light */}
          <directionalLight
            position={[18, 28, 14]}
            intensity={isNightMode ? 0.4 : 1.4}
            color={isNightMode ? '#93c5fd' : '#fffbeb'}
            castShadow={enableShadows}
            shadow-mapSize-width={shadowMapSize}
            shadow-mapSize-height={shadowMapSize}
            shadow-bias={-0.0004}
            shadow-camera-left={-22}
            shadow-camera-right={22}
            shadow-camera-top={22}
            shadow-camera-bottom={-22}
            shadow-camera-near={0.5}
            shadow-camera-far={70}
          />

          {/* Fill Light (Soft cool bounce) */}
          <directionalLight
            position={[-16, 18, -14]}
            intensity={isNightMode ? 0.2 : 0.55}
            color="#bae6fd"
          />

          {/* Cozy Room Interior Point Lights */}
          {/* Owner Office */}
          <pointLight position={[-11.5, 2.4, -8]} intensity={isNightMode ? 1.8 : 0.8} distance={8} color="#fef08a" />
          {/* Manager Office */}
          <pointLight position={[-11.5, 2.4, 2]} intensity={isNightMode ? 1.8 : 0.8} distance={8} color="#e0f2fe" />
          {/* Programmer Room */}
          <pointLight position={[0, 2.4, -8]} intensity={isNightMode ? 2.0 : 0.9} distance={8} color="#a7f3d0" />
          {/* Creative Room */}
          <pointLight position={[0, 2.4, 8]} intensity={isNightMode ? 1.8 : 0.8} distance={8} color="#fed7aa" />
          {/* Planning Room */}
          <pointLight position={[11.5, 2.4, -8]} intensity={isNightMode ? 1.8 : 0.8} distance={8} color="#e9d5ff" />
          {/* Content Studio */}
          <pointLight position={[11.5, 2.4, 1.5]} intensity={isNightMode ? 2.2 : 0.9} distance={8} color="#fbcfe8" />
          {/* CEO Office */}
          <pointLight position={[11.5, 2.4, 10]} intensity={isNightMode ? 1.9 : 0.8} distance={8} color="#c7d2fe" />
          {/* Corridor Hub */}
          <pointLight position={[0, 2.2, 0]} intensity={isNightMode ? 1.4 : 0.6} distance={10} color="#ffffff" />

          {/* Ground Contact Shadow Plinth */}
          <mesh position={[0, -0.65, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[44, 36]} />
            <meshBasicMaterial color="#050811" />
          </mesh>

          {/* Office Architecture */}
          <OfficeBuilding />

          {/* 7 Autonomous 3D Agents */}
          {agents.map((agent) => (
            <Character3D key={agent.id} agent={agent} />
          ))}

          {/* Interactive Camera Controller */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
};
