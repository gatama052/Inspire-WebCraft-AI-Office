import React, { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { ROOMS } from '../../constants/officeData';
import { useOfficeStore } from '../../store/officeStore';
import { createWoodFloorTexture, createTileFloorTexture, createInspireLogoTexture } from './ProceduralTextures';
import {
  WorkDesk,
  OfficeChair,
  MonitorSetup,
  ServerRack,
  PottedPlant,
  Bookshelf,
  CoffeeBarLounge
} from './Furniture';

const wallMaterial = new THREE.MeshStandardMaterial({
  color: '#f8fafc',
  roughness: 0.8,
  metalness: 0.05
});

const wallTrimMaterial = new THREE.MeshStandardMaterial({
  color: '#334155',
  roughness: 0.5,
  metalness: 0.2
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: '#e0f2fe',
  transmission: 0.85,
  roughness: 0.1,
  ior: 1.5,
  thickness: 0.1,
  transparent: true,
  opacity: 0.45
});

const dioramaBaseMaterial = new THREE.MeshStandardMaterial({
  color: '#0f172a',
  roughness: 0.6,
  metalness: 0.2
});

// Doorway positions for placing readable 3D room entrance signs
const ROOM_DOORWAYS: Record<string, [number, number, number]> = {
  owner_office: [-7, 2.2, -6],
  manager_office: [-7, 2.2, 2],
  programmer_room: [0, 2.2, -4],
  creative_room: [0, 2.2, 4],
  planning_room: [7, 2.2, -6],
  content_studio: [7, 2.2, 1.5],
  ceo_office: [7, 2.2, 10]
};

export const OfficeBuilding: React.FC = () => {
  const selectedRoomId = useOfficeStore((state) => state.selectedRoomId);
  const selectRoom = useOfficeStore((state) => state.selectRoom);

  const woodTexture = useMemo(() => createWoodFloorTexture(), []);
  const tileTexture = useMemo(() => createTileFloorTexture(), []);
  const horizontalLogoTexture = useMemo(() => createInspireLogoTexture('horizontal'), []);
  const badgeLogoTexture = useMemo(() => createInspireLogoTexture('badge'), []);

  return (
    <group>
      {/* 1. DIORAMA BASE FOUNDATION */}
      <mesh receiveShadow position={[0, -0.3, 0]} material={dioramaBaseMaterial}>
        <boxGeometry args={[36, 0.6, 28]} />
      </mesh>
      {/* Diorama Trim Accent Bevel */}
      <mesh position={[0, -0.02, 0]} material={wallTrimMaterial}>
        <boxGeometry args={[36.4, 0.06, 28.4]} />
      </mesh>

      {/* 2. CENTRAL CORRIDOR FLOOR */}
      <mesh
        receiveShadow
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[14, 24]} />
        <meshStandardMaterial map={tileTexture} roughness={0.7} />
      </mesh>

      {/* 3. ROOM FLOORS & CLICKABLE REGIONS & 3D ROOM SIGNS */}
      {ROOMS.map((room) => {
        const width = room.bounds.maxX - room.bounds.minX;
        const depth = room.bounds.maxZ - room.bounds.minZ;
        const centerX = (room.bounds.minX + room.bounds.maxX) / 2;
        const centerZ = (room.bounds.minZ + room.bounds.maxZ) / 2;
        const isSelected = selectedRoomId === room.id;
        const doorwayPos = ROOM_DOORWAYS[room.id] || [centerX, 2.2, centerZ];

        return (
          <group key={room.id}>
            {/* Room Floor Plane */}
            <mesh
              receiveShadow
              position={[centerX, 0.02, centerZ]}
              rotation={[-Math.PI / 2, 0, 0]}
              onClick={(e) => {
                e.stopPropagation();
                selectRoom(room.id);
              }}
              onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto';
              }}
            >
              <planeGeometry args={[width, depth]} />
              <meshStandardMaterial
                map={woodTexture}
                roughness={0.6}
                color={isSelected ? '#ffffff' : '#f8f4ee'}
              />
            </mesh>

            {/* Room Area Rug beneath workstation */}
            <mesh
              position={[room.center.x, 0.03, room.center.z]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <planeGeometry args={[4.2, 3.8]} />
              <meshStandardMaterial
                color={room.colorAccent}
                roughness={0.9}
                transparent
                opacity={0.35}
              />
            </mesh>

            {/* Prominent 3D Room Signboard above Doorway (Readable from camera) */}
            <Html
              position={doorwayPos}
              center
              distanceFactor={20}
              zIndexRange={[15, 0]}
            >
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  selectRoom(room.id);
                }}
                className={`pointer-events-auto cursor-pointer select-none px-3 py-1 rounded-xl shadow-2xl flex items-center gap-1.5 transition-all duration-200 border ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-300 scale-110 shadow-blue-500/40'
                    : 'bg-slate-900/95 hover:bg-slate-800 text-slate-100 border-slate-700/80 hover:border-slate-500'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: room.colorAccent }}
                />
                <span className="text-[11px] font-bold uppercase tracking-wide whitespace-nowrap">
                  {room.name}
                </span>
              </div>
            </Html>
          </group>
        );
      })}

      {/* 4. PERIMETER OUTER WALLS (1.8m height cutaway for clear isometric viewing) */}
      {/* North Outer Wall */}
      <mesh castShadow receiveShadow position={[0, 0.9, -13]} material={wallMaterial}>
        <boxGeometry args={[34, 1.8, 0.3]} />
      </mesh>
      {/* A. Papan Nama Wall-Mounted Sign Dinding Utama Kantor */}
      <group position={[0, 1.25, -12.83]}>
        <mesh position={[0, 0, 0]} material={wallTrimMaterial}>
          <boxGeometry args={[4.2, 1.3, 0.04]} />
        </mesh>
        <mesh position={[0, 0, 0.025]}>
          <planeGeometry args={[4.0, 1.2]} />
          <meshStandardMaterial
            map={horizontalLogoTexture}
            roughness={0.25}
            metalness={0.15}
            emissive="#0284c7"
            emissiveIntensity={0.12}
          />
        </mesh>
      </group>
      {/* South Outer Wall */}
      <mesh castShadow receiveShadow position={[0, 0.9, 13]} material={wallMaterial}>
        <boxGeometry args={[34, 1.8, 0.3]} />
      </mesh>
      {/* West Outer Wall */}
      <mesh castShadow receiveShadow position={[-17, 0.9, 0]} material={wallMaterial}>
        <boxGeometry args={[0.3, 1.8, 26]} />
      </mesh>
      {/* East Outer Wall */}
      <mesh castShadow receiveShadow position={[17, 0.9, 0]} material={wallMaterial}>
        <boxGeometry args={[0.3, 1.8, 26]} />
      </mesh>

      {/* 5. INTERIOR PARTITION WALLS WITH DOORWAY OPENINGS */}
      {/* West Corridor Partition (Separating Owner & Manager from Corridor, with 2 Doorway Openings) */}
      <mesh castShadow receiveShadow position={[-7, 0.9, -9.5]} material={wallMaterial}>
        <boxGeometry args={[0.24, 1.8, 5]} />
      </mesh>
      <mesh castShadow receiveShadow position={[-7, 0.9, -2]} material={wallMaterial}>
        <boxGeometry args={[0.24, 1.8, 6]} />
      </mesh>
      <mesh castShadow receiveShadow position={[-7, 0.9, 7.5]} material={wallMaterial}>
        <boxGeometry args={[0.24, 1.8, 9]} />
      </mesh>
      {/* Horizontal wall between Owner Office & Manager Office */}
      <mesh castShadow receiveShadow position={[-12, 0.9, -3]} material={wallMaterial}>
        <boxGeometry args={[10, 1.8, 0.24]} />
      </mesh>

      {/* East Corridor Partition (Separating Planning, Studio, and CEO from Corridor) */}
      <mesh castShadow receiveShadow position={[7, 0.9, -9.5]} material={wallMaterial}>
        <boxGeometry args={[0.24, 1.8, 5]} />
      </mesh>
      <mesh castShadow receiveShadow position={[7, 0.9, -2]} material={wallMaterial}>
        <boxGeometry args={[0.24, 1.8, 5]} />
      </mesh>
      <mesh castShadow receiveShadow position={[7, 0.9, 5.5]} material={wallMaterial}>
        <boxGeometry args={[0.24, 1.8, 6]} />
      </mesh>
      <mesh castShadow receiveShadow position={[7, 0.9, 12]} material={wallMaterial}>
        <boxGeometry args={[0.24, 1.8, 2]} />
      </mesh>

      {/* Horizontal divider between Planning Room & Content Studio */}
      <mesh castShadow receiveShadow position={[12, 0.9, -3]} material={wallMaterial}>
        <boxGeometry args={[10, 1.8, 0.24]} />
      </mesh>
      {/* Glass partition between Content Studio & CEO Office */}
      <mesh position={[12, 0.9, 6]} material={glassMaterial}>
        <boxGeometry args={[10, 1.8, 0.12]} />
      </mesh>

      {/* North Center Wall (Programmer Room boundary with doorway at X: 0, Z: -4) */}
      <mesh castShadow receiveShadow position={[-3.2, 0.9, -4]} material={wallMaterial}>
        <boxGeometry args={[4.4, 1.8, 0.24]} />
      </mesh>
      <mesh castShadow receiveShadow position={[3.2, 0.9, -4]} material={wallMaterial}>
        <boxGeometry args={[4.4, 1.8, 0.24]} />
      </mesh>

      {/* South Center Wall (Creative Room boundary with doorway at X: 0, Z: 4) */}
      <mesh castShadow receiveShadow position={[-3.2, 0.9, 4]} material={wallMaterial}>
        <boxGeometry args={[4.4, 1.8, 0.24]} />
      </mesh>
      <mesh castShadow receiveShadow position={[3.2, 0.9, 4]} material={wallMaterial}>
        <boxGeometry args={[4.4, 1.8, 0.24]} />
      </mesh>

      {/* 6. CORRIDOR BRANDING WALL & LOUNGE */}
      {/* D. Logo Identitas Kantor di Koridor Utama */}
      <group position={[0, 1.1, -1.8]}>
        <mesh castShadow material={wallTrimMaterial}>
          <boxGeometry args={[3.2, 1.6, 0.16]} />
        </mesh>
        <mesh position={[0, 0.25, 0.09]}>
          <planeGeometry args={[2.8, 0.88]} />
          <meshStandardMaterial
            map={horizontalLogoTexture}
            roughness={0.2}
            metalness={0.2}
            emissive="#0284c7"
            emissiveIntensity={0.18}
          />
        </mesh>
      </group>

      {/* Corridor Espresso & Water Lounge */}
      <CoffeeBarLounge position={[0, 0, 1.4]} rotation={[0, Math.PI, 0]} />

      {/* Corridor Planters */}
      <PottedPlant position={[-5.8, 0, -4.8]} scale={1.2} />
      <PottedPlant position={[5.8, 0, -4.8]} scale={1.2} />
      <PottedPlant position={[-5.8, 0, 4.8]} scale={1.2} />
      <PottedPlant position={[5.8, 0, 4.8]} scale={1.2} />

      {/* 7. ROOM SPECIFIC FURNITURE & TECH RIGS */}

      {/* A. KANTOR OWNER — PAK YOGA */}
      <WorkDesk position={[-10.5, 0, -8]} rotation={[0, -Math.PI / 2, 0]} width={2.6} depth={1.2} />
      <OfficeChair position={[-12, 0, -8]} rotation={[0, Math.PI / 2, 0]} color="#1e3a8a" />
      <MonitorSetup position={[-10.5, 0.74, -8]} rotation={[0, -Math.PI / 2, 0]} type="dual" />
      <Bookshelf position={[-16, 0, -5.8]} rotation={[0, Math.PI / 2, 0]} />
      <PottedPlant position={[-15.8, 0, -11]} scale={1.3} />
      {/* B. Logo Brand Resmi di Dinding Belakang Meja Pak Yoga (Ruang Owner) */}
      <group position={[-16.83, 1.4, -8]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.92, 0.92, 0.03, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <circleGeometry args={[0.88, 32]} />
          <meshStandardMaterial
            map={badgeLogoTexture}
            roughness={0.2}
            metalness={0.1}
            emissive="#0284c7"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>

      {/* B. RUANG MANAGER (DIANA) */}
      <WorkDesk position={[-10.5, 0, 2]} rotation={[0, -Math.PI / 2, 0]} width={2.6} depth={1.2} />
      <OfficeChair position={[-12, 0, 2]} rotation={[0, Math.PI / 2, 0]} color="#0369a1" />
      <MonitorSetup position={[-10.5, 0.74, 2]} rotation={[0, -Math.PI / 2, 0]} type="dual" />
      <Bookshelf position={[-16, 0, 4.2]} rotation={[0, Math.PI / 2, 0]} />
      <PottedPlant position={[-15.8, 0, -1.2]} scale={1.1} />
      {/* C. Logo Brand di Dinding Belakang Meja Manager Diana */}
      <group position={[-16.83, 1.35, 2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.72, 0.72, 0.03, 32]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <circleGeometry args={[0.68, 32]} />
          <meshStandardMaterial
            map={badgeLogoTexture}
            roughness={0.2}
            metalness={0.1}
            emissive="#0284c7"
            emissiveIntensity={0.15}
          />
        </mesh>
      </group>

      {/* C. RUANG PROGRAMMER (ALEX) */}
      <WorkDesk position={[0, 0, -10.5]} width={3.2} depth={1.2} />
      <OfficeChair position={[0, 0, -8.8]} rotation={[0, 0, 0]} color="#047857" />
      <MonitorSetup position={[0, 0.74, -10.5]} type="triple" />
      <ServerRack position={[-3.8, 0, -11.5]} rotation={[0, 0.3, 0]} />
      <ServerRack position={[3.8, 0, -11.5]} rotation={[0, -0.3, 0]} />
      <PottedPlant position={[-4, 0, -5]} scale={1.1} />

      {/* D. RUANG STRATEGI KREATIF (MAYA) */}
      <WorkDesk position={[0, 0, 10.5]} width={3.0} depth={1.2} materialType="light" />
      <OfficeChair position={[0, 0, 8.8]} rotation={[0, Math.PI, 0]} color="#b45309" />
      <MonitorSetup position={[0, 0.74, 10.5]} rotation={[0, Math.PI, 0]} type="dual" />
      <Bookshelf position={[-4, 0, 11]} rotation={[0, 0.4, 0]} />
      <PottedPlant position={[4, 0, 5]} scale={1.2} />

      {/* E. RUANG PERENCANAAN KONTEN (DAVID) */}
      <WorkDesk position={[10.5, 0, -8]} rotation={[0, Math.PI / 2, 0]} width={2.6} depth={1.2} materialType="light" />
      <OfficeChair position={[12, 0, -8]} rotation={[0, -Math.PI / 2, 0]} color="#6d28d9" />
      <MonitorSetup position={[10.5, 0.74, -8]} rotation={[0, Math.PI / 2, 0]} type="dual" />
      <Bookshelf position={[16, 0, -8]} rotation={[0, -Math.PI / 2, 0]} />
      <PottedPlant position={[15.8, 0, -11]} scale={1.1} />

      {/* F. STUDIO PRODUKSI KONTEN (ZARA) */}
      <WorkDesk position={[10.5, 0, 1.5]} rotation={[0, Math.PI / 2, 0]} width={2.6} depth={1.2} />
      <OfficeChair position={[12, 0, 1.5]} rotation={[0, -Math.PI / 2, 0]} color="#be185d" />
      <MonitorSetup position={[10.5, 0.74, 1.5]} rotation={[0, Math.PI / 2, 0]} type="dual" />
      <group position={[8.5, 0, 3.2]} rotation={[0, -0.6, 0]}>
        <mesh position={[0, 1.2, 0]} material={wallTrimMaterial}>
          <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
        </mesh>
        <mesh position={[0, 2.2, 0.2]} rotation={[0.4, 0, 0]} material={new THREE.MeshStandardMaterial({ color: '#f8fafc', emissive: '#f8fafc', emissiveIntensity: 0.5 })}>
          <boxGeometry args={[0.6, 0.6, 0.15]} />
        </mesh>
      </group>
      <PottedPlant position={[15.8, 0, 4.2]} scale={1.1} />

      {/* G. RUANG CEO (VICTOR) */}
      <WorkDesk position={[10.5, 0, 10]} rotation={[0, Math.PI / 2, 0]} width={2.8} depth={1.2} materialType="glass" />
      <OfficeChair position={[12, 0, 10]} rotation={[0, -Math.PI / 2, 0]} color="#3730a3" />
      <MonitorSetup position={[10.5, 0.74, 10]} rotation={[0, Math.PI / 2, 0]} type="executive" />
      <Bookshelf position={[16, 0, 10]} rotation={[0, -Math.PI / 2, 0]} />
      <PottedPlant position={[15.8, 0, 12]} scale={1.3} />
    </group>
  );
};
