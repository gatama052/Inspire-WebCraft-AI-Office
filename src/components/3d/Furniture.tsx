import React, { useMemo } from 'react';
import * as THREE from 'three';
import {
  createCodeScreenTexture,
  createAnalyticsScreenTexture,
  createKanbanScreenTexture
} from './ProceduralTextures';

// Shared Materials
const woodMaterial = new THREE.MeshStandardMaterial({
  color: '#85593c',
  roughness: 0.6,
  metalness: 0.1
});

const lightWoodMaterial = new THREE.MeshStandardMaterial({
  color: '#c9a57c',
  roughness: 0.6,
  metalness: 0.05
});

const darkMetalMaterial = new THREE.MeshStandardMaterial({
  color: '#1f2937',
  roughness: 0.3,
  metalness: 0.8
});

const chromeMaterial = new THREE.MeshStandardMaterial({
  color: '#e2e8f0',
  roughness: 0.15,
  metalness: 0.95
});

const chairFabricMaterial = new THREE.MeshStandardMaterial({
  color: '#334155',
  roughness: 0.7,
  metalness: 0.1
});

const leafMaterial = new THREE.MeshStandardMaterial({
  color: '#15803d',
  roughness: 0.5,
  metalness: 0.05
});

const planterMaterial = new THREE.MeshStandardMaterial({
  color: '#f8fafc',
  roughness: 0.3,
  metalness: 0.1
});

export const WorkDesk: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  width?: number;
  depth?: number;
  materialType?: 'dark' | 'light' | 'glass';
}> = ({ position, rotation = [0, 0, 0], width = 2.4, depth = 1.1, materialType = 'dark' }) => {
  const topMat =
    materialType === 'light'
      ? lightWoodMaterial
      : materialType === 'glass'
      ? new THREE.MeshPhysicalMaterial({
          color: '#ffffff',
          transmission: 0.9,
          roughness: 0.1,
          ior: 1.5,
          thickness: 0.2
        })
      : woodMaterial;

  return (
    <group position={position} rotation={rotation}>
      {/* Tabletop */}
      <mesh castShadow receiveShadow position={[0, 0.72, 0]} material={topMat}>
        <boxGeometry args={[width, 0.06, depth]} />
      </mesh>

      {/* Frame & Legs */}
      <mesh castShadow position={[-width / 2 + 0.08, 0.36, 0]} material={darkMetalMaterial}>
        <boxGeometry args={[0.06, 0.72, depth - 0.1]} />
      </mesh>
      <mesh castShadow position={[width / 2 - 0.08, 0.36, 0]} material={darkMetalMaterial}>
        <boxGeometry args={[0.06, 0.72, depth - 0.1]} />
      </mesh>
      {/* Stretcher bar */}
      <mesh position={[0, 0.2, -depth / 2 + 0.1]} material={darkMetalMaterial}>
        <boxGeometry args={[width - 0.3, 0.04, 0.04]} />
      </mesh>
    </group>
  );
};

export const OfficeChair: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}> = ({ position, rotation = [0, 0, 0], color }) => {
  const mat = useMemo(() => {
    if (!color) return chairFabricMaterial;
    return new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 });
  }, [color]);

  return (
    <group position={position} rotation={rotation}>
      {/* Caster base */}
      <mesh position={[0, 0.08, 0]} material={darkMetalMaterial}>
        <cylinderGeometry args={[0.3, 0.3, 0.04, 5]} />
      </mesh>
      {/* Hydraulic stem */}
      <mesh position={[0, 0.26, 0]} material={chromeMaterial}>
        <cylinderGeometry args={[0.035, 0.035, 0.34, 16]} />
      </mesh>
      {/* Seat cushion */}
      <mesh castShadow position={[0, 0.44, 0]} material={mat}>
        <boxGeometry args={[0.48, 0.08, 0.46]} />
      </mesh>
      {/* Backrest */}
      <mesh castShadow position={[0, 0.8, -0.21]} rotation={[-0.08, 0, 0]} material={mat}>
        <boxGeometry args={[0.44, 0.64, 0.06]} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.26, 0.6, 0]} material={darkMetalMaterial}>
        <boxGeometry args={[0.04, 0.24, 0.3]} />
      </mesh>
      <mesh position={[0.26, 0.6, 0]} material={darkMetalMaterial}>
        <boxGeometry args={[0.04, 0.24, 0.3]} />
      </mesh>
    </group>
  );
};

export const MonitorSetup: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
  type: 'triple' | 'dual' | 'single' | 'executive';
}> = ({ position, rotation = [0, 0, 0], type }) => {
  const codeTexture = useMemo(() => createCodeScreenTexture(), []);
  const analyticsTexture = useMemo(() => createAnalyticsScreenTexture(), []);
  const kanbanTexture = useMemo(() => createKanbanScreenTexture(), []);

  return (
    <group position={position} rotation={rotation}>
      {/* Stand Base */}
      <mesh position={[0, 0.015, 0]} material={darkMetalMaterial}>
        <boxGeometry args={[0.4, 0.02, 0.2]} />
      </mesh>
      <mesh position={[0, 0.2, -0.05]} material={darkMetalMaterial}>
        <cylinderGeometry args={[0.02, 0.02, 0.38, 12]} />
      </mesh>

      {/* Center Screen */}
      <group position={[0, 0.28, 0]}>
        <mesh castShadow material={darkMetalMaterial}>
          <boxGeometry args={[0.82, 0.48, 0.03]} />
        </mesh>
        <mesh position={[0, 0, 0.018]}>
          <planeGeometry args={[0.78, 0.44]} />
          <meshBasicMaterial
            map={
              type === 'triple'
                ? codeTexture
                : type === 'executive'
                ? analyticsTexture
                : kanbanTexture
            }
          />
        </mesh>
      </group>

      {/* Triple setup has left & right angled wings */}
      {type === 'triple' && (
        <>
          <group position={[-0.76, 0.28, 0.12]} rotation={[0, 0.38, 0]}>
            <mesh castShadow material={darkMetalMaterial}>
              <boxGeometry args={[0.74, 0.48, 0.03]} />
            </mesh>
            <mesh position={[0, 0, 0.018]}>
              <planeGeometry args={[0.7, 0.44]} />
              <meshBasicMaterial map={kanbanTexture} />
            </mesh>
          </group>
          <group position={[0.76, 0.28, 0.12]} rotation={[0, -0.38, 0]}>
            <mesh castShadow material={darkMetalMaterial}>
              <boxGeometry args={[0.74, 0.48, 0.03]} />
            </mesh>
            <mesh position={[0, 0, 0.018]}>
              <planeGeometry args={[0.7, 0.44]} />
              <meshBasicMaterial map={analyticsTexture} />
            </mesh>
          </group>
        </>
      )}

      {/* Dual setup has secondary display */}
      {type === 'dual' && (
        <group position={[0.76, 0.28, 0.08]} rotation={[0, -0.28, 0]}>
          <mesh castShadow material={darkMetalMaterial}>
            <boxGeometry args={[0.74, 0.48, 0.03]} />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <planeGeometry args={[0.7, 0.44]} />
            <meshBasicMaterial map={analyticsTexture} />
          </mesh>
        </group>
      )}

      {/* Keyboard & Mouse */}
      <mesh position={[0, 0.01, 0.28]} material={darkMetalMaterial}>
        <boxGeometry args={[0.42, 0.015, 0.14]} />
      </mesh>
      <mesh position={[0.3, 0.01, 0.28]} material={darkMetalMaterial}>
        <boxGeometry args={[0.07, 0.02, 0.11]} />
      </mesh>
    </group>
  );
};

export const ServerRack: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Cabinet Frame */}
      <mesh castShadow receiveShadow position={[0, 1.1, 0]} material={darkMetalMaterial}>
        <boxGeometry args={[0.8, 2.2, 0.7]} />
      </mesh>
      {/* Glass door */}
      <mesh position={[0, 1.1, 0.36]}>
        <planeGeometry args={[0.7, 2.05]} />
        <meshPhysicalMaterial
          color="#38bdf8"
          transmission={0.8}
          roughness={0.1}
          metalness={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
      {/* Flashing server indicator lights */}
      {[-0.6, -0.3, 0.0, 0.3, 0.6, 0.8].map((yOffset, idx) => (
        <group key={idx} position={[0, 1.1 + yOffset, 0.34]}>
          <mesh position={[-0.2, 0, 0]}>
            <sphereGeometry args={[0.016, 8, 8]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#10b981' : '#38bdf8'} />
          </mesh>
          <mesh position={[-0.14, 0, 0]}>
            <sphereGeometry args={[0.014, 8, 8]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.18, 0.02, 0.01]} />
            <meshBasicMaterial color="#0284c7" />
          </mesh>
        </group>
      ))}
    </group>
  );
};

export const PottedPlant: React.FC<{
  position: [number, number, number];
  scale?: number;
}> = ({ position, scale = 1 }) => {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Planter pot */}
      <mesh castShadow receiveShadow position={[0, 0.3, 0]} material={planterMaterial}>
        <cylinderGeometry args={[0.26, 0.2, 0.6, 16]} />
      </mesh>
      {/* Soil */}
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.24, 0.24, 0.04, 16]} />
        <meshStandardMaterial color="#382212" roughness={0.9} />
      </mesh>
      {/* Leaves cluster */}
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <group key={i} position={[0, 0.6 + (i % 3) * 0.1, 0]} rotation={[0.3, rad, 0.1]}>
            <mesh castShadow material={leafMaterial} position={[0, 0.25, 0.15]} rotation={[0.4, 0, 0]}>
              <boxGeometry args={[0.2, 0.35, 0.01]} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

export const Bookshelf: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Shelf Frame */}
      <mesh castShadow receiveShadow position={[0, 1.1, 0]} material={woodMaterial}>
        <boxGeometry args={[1.6, 2.2, 0.4]} />
      </mesh>
      {/* Open cavity */}
      <mesh position={[0, 1.1, 0.05]} material={new THREE.MeshStandardMaterial({ color: '#271b12' })}>
        <boxGeometry args={[1.44, 2.04, 0.32]} />
      </mesh>
      {/* Shelves dividers */}
      {[-0.5, 0.0, 0.5].map((y, idx) => (
        <mesh key={idx} position={[0, 1.1 + y, 0.05]} material={woodMaterial}>
          <boxGeometry args={[1.44, 0.04, 0.32]} />
        </mesh>
      ))}
      {/* Stylized books */}
      {[-0.4, 0.1, 0.6].map((y, rowIdx) => (
        <group key={rowIdx} position={[-0.5, 1.1 + y + 0.12, 0.08]}>
          {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'].map((c, i) => (
            <mesh key={i} position={[i * 0.12, 0, 0]} material={new THREE.MeshStandardMaterial({ color: c })}>
              <boxGeometry args={[0.08, 0.22 - (i % 2) * 0.04, 0.22]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

export const CoffeeBarLounge: React.FC<{
  position: [number, number, number];
  rotation?: [number, number, number];
}> = ({ position, rotation = [0, 0, 0] }) => {
  return (
    <group position={position} rotation={rotation}>
      {/* Counter */}
      <mesh castShadow receiveShadow position={[0, 0.48, 0]} material={woodMaterial}>
        <boxGeometry args={[2.0, 0.96, 0.8]} />
      </mesh>
      {/* Marble countertop */}
      <mesh position={[0, 0.98, 0]} material={new THREE.MeshStandardMaterial({ color: '#f1f5f9', roughness: 0.2 })}>
        <boxGeometry args={[2.06, 0.06, 0.86]} />
      </mesh>
      {/* Espresso Machine */}
      <mesh castShadow position={[-0.4, 1.22, 0]} material={chromeMaterial}>
        <boxGeometry args={[0.5, 0.42, 0.4]} />
      </mesh>
      {/* Coffee cups */}
      <mesh position={[0.2, 1.05, 0.1]} material={planterMaterial}>
        <cylinderGeometry args={[0.04, 0.03, 0.08, 12]} />
      </mesh>
      <mesh position={[0.35, 1.05, 0.08]} material={planterMaterial}>
        <cylinderGeometry args={[0.04, 0.03, 0.08, 12]} />
      </mesh>
    </group>
  );
};
