import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Agent } from '../../types/office';
import { WAYPOINTS } from '../../constants/officeData';
import { useOfficeStore } from '../../store/officeStore';

interface Character3DProps {
  agent: Agent;
}

const WALK_SPEED = 3.2; // Slightly faster for responsive, snappy demo feel
const ROTATION_SMOOTH = 14.0;

export const Character3D: React.FC<Character3DProps> = ({ agent }) => {
  const rootGroupRef = useRef<THREE.Group>(null);
  const hipsRef = useRef<THREE.Group>(null);
  const torsoRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const leftForearmRef = useRef<THREE.Group>(null);
  const rightForearmRef = useRef<THREE.Group>(null);

  const leftLegRef = useRef<THREE.Group>(null);
  const rightLegRef = useRef<THREE.Group>(null);
  const leftCalfRef = useRef<THREE.Group>(null);
  const rightCalfRef = useRef<THREE.Group>(null);

  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const selectAgent = useOfficeStore((state) => state.selectAgent);
  const updateAgent = useOfficeStore((state) => state.updateAgent);
  const addLog = useOfficeStore((state) => state.addLog);
  const addDialogue = useOfficeStore((state) => state.addDialogue);
  const activeDialogues = useOfficeStore((state) => state.activeDialogues);
  const simulation = useOfficeStore((state) => state.simulation);
  const setJourneyStep = useOfficeStore((state) => state.setJourneyStep);
  const moveAgentToWaypoint = useOfficeStore((state) => state.moveAgentToWaypoint);

  const isSelected = selectedAgentId === agent.id;
  const walkCycleTime = useRef<number>(0);
  const sittingTransition = useRef<number>(
    agent.activityState === 'sitting' || agent.activityState === 'typing' ? 1 : 0
  );

  // Check if this character has an active speech bubble
  const activeSpeech = activeDialogues.find((d) => d.speakerId === agent.id);

  // Materials
  const materials = useMemo(() => {
    return {
      skin: new THREE.MeshStandardMaterial({
        color: '#fcd3b0',
        roughness: 0.6,
        metalness: 0.05
      }),
      clothing: new THREE.MeshStandardMaterial({
        color: agent.color,
        roughness: 0.5,
        metalness: 0.1
      }),
      pants: new THREE.MeshStandardMaterial({
        color: agent.secondaryColor,
        roughness: 0.7,
        metalness: 0.1
      }),
      shoes: new THREE.MeshStandardMaterial({
        color: '#1f2937',
        roughness: 0.4,
        metalness: 0.2
      }),
      hair: new THREE.MeshStandardMaterial({
        color: agent.hairColor,
        roughness: 0.8,
        metalness: 0.05
      }),
      glasses: new THREE.MeshStandardMaterial({
        color: '#111827',
        metalness: 0.9,
        roughness: 0.2
      }),
      headset: new THREE.MeshStandardMaterial({
        color: '#0284c7',
        metalness: 0.8,
        roughness: 0.3
      }),
      accent: new THREE.MeshStandardMaterial({
        color: '#ffffff',
        roughness: 0.3,
        metalness: 0.1
      }),
      selectionRing: new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 0.6,
        roughness: 0.2
      })
    };
  }, [agent.color, agent.secondaryColor, agent.hairColor]);

  // Main Animation & Kinematics Loop
  useFrame((state, delta) => {
    if (!rootGroupRef.current) return;

    const time = state.clock.getElapsedTime();
    const clampedDelta = Math.min(delta, 0.1);

    // 1. Path Navigation Handling
    if (agent.currentPath && agent.currentPath.length > 0) {
      const targetWaypointId = agent.currentPath[0];
      const targetWaypoint = WAYPOINTS[targetWaypointId];

      if (targetWaypoint) {
        const currentPos = agent.position;
        const targetPos = targetWaypoint.position;

        const dx = targetPos.x - currentPos.x;
        const dz = targetPos.z - currentPos.z;
        const dist = Math.sqrt(dx * dx + dz * dz);

        // Turn towards target direction smoothly
        const targetAngle = Math.atan2(dx, dz);
        let diffAngle = targetAngle - agent.rotationY;
        while (diffAngle < -Math.PI) diffAngle += Math.PI * 2;
        while (diffAngle > Math.PI) diffAngle -= Math.PI * 2;
        const newRotation = agent.rotationY + diffAngle * Math.min(1.0, clampedDelta * ROTATION_SMOOTH);

        // Move along vector
        if (dist > 0.08) {
          const moveStep = Math.min(dist, WALK_SPEED * clampedDelta);
          const ratio = moveStep / dist;
          const nextX = currentPos.x + dx * ratio;
          const nextZ = currentPos.z + dz * ratio;

          updateAgent(agent.id, {
            position: { x: nextX, y: 0, z: nextZ },
            rotationY: newRotation,
            activityState: 'walking'
          });

          walkCycleTime.current += clampedDelta * (WALK_SPEED * 4.2);
        } else {
          // Reached this waypoint node
          const remainingPath = agent.currentPath.slice(1);
          if (remainingPath.length > 0) {
            updateAgent(agent.id, {
              currentPath: remainingPath,
              position: { x: targetPos.x, y: 0, z: targetPos.z }
            });
          } else {
            // Completely arrived at final destination!
            updateAgent(agent.id, {
              currentPath: [],
              position: { x: targetPos.x, y: 0, z: targetPos.z },
              activityState: targetWaypoint.type.includes('seat') ? 'sitting' : 'standing'
            });

            addLog(
              agent.id,
              agent.name,
              'reached_destination',
              `Tiba di ${targetWaypoint.roomId.replace('_', ' ')} (${targetWaypointId})`
            );

            // Handle Interaction & Face-to-Face Rotation
            handleInteractionArrival(agent.id, targetWaypointId);
          }
        }
      }
    }

    // 2. Sitting / Standing State Transition Interpolation
    const isTargetSitting =
      agent.activityState === 'sitting' ||
      agent.activityState === 'typing' ||
      agent.activityState === 'reviewing';
    const targetSittingVal = isTargetSitting ? 1.0 : 0.0;
    sittingTransition.current = THREE.MathUtils.damp(
      sittingTransition.current,
      targetSittingVal,
      6.0,
      clampedDelta
    );

    const sitProgress = sittingTransition.current;

    // Root position & rotation
    rootGroupRef.current.position.set(agent.position.x, agent.position.y, agent.position.z);
    rootGroupRef.current.rotation.y = agent.rotationY;

    // Pelvis Height: Standing is ~0.85, Sitting drops to ~0.55
    if (hipsRef.current) {
      const walkBob =
        agent.activityState === 'walking'
          ? Math.abs(Math.sin(walkCycleTime.current * 2)) * 0.04
          : 0;
      const breathing = Math.sin(time * 2.0) * 0.01;
      hipsRef.current.position.y =
        THREE.MathUtils.lerp(0.85, 0.56, sitProgress) + walkBob + breathing;
    }

    // 3. Legs Kinematics
    if (leftLegRef.current && rightLegRef.current && leftCalfRef.current && rightCalfRef.current) {
      if (agent.activityState === 'walking') {
        const cycle = walkCycleTime.current;
        const legSwing = Math.sin(cycle) * 0.55;

        leftLegRef.current.rotation.x = legSwing;
        rightLegRef.current.rotation.x = -legSwing;

        leftCalfRef.current.rotation.x = Math.max(0, -Math.sin(cycle) * 0.6);
        rightCalfRef.current.rotation.x = Math.max(0, Math.sin(cycle) * 0.6);
      } else {
        const thighSitAngle = -Math.PI / 2;
        const calfSitAngle = Math.PI / 2;

        leftLegRef.current.rotation.x = THREE.MathUtils.lerp(0, thighSitAngle, sitProgress);
        rightLegRef.current.rotation.x = THREE.MathUtils.lerp(0, thighSitAngle, sitProgress);

        leftCalfRef.current.rotation.x = THREE.MathUtils.lerp(0, calfSitAngle, sitProgress);
        rightCalfRef.current.rotation.x = THREE.MathUtils.lerp(0, calfSitAngle, sitProgress);
      }
    }

    // 4. Arms & Head Kinematics by Activity State
    if (
      leftArmRef.current &&
      rightArmRef.current &&
      leftForearmRef.current &&
      rightForearmRef.current &&
      headRef.current &&
      torsoRef.current
    ) {
      if (agent.activityState === 'walking') {
        const cycle = walkCycleTime.current;
        const armSwing = Math.sin(cycle) * 0.45;

        leftArmRef.current.rotation.x = -armSwing;
        rightArmRef.current.rotation.x = armSwing;
        leftArmRef.current.rotation.z = -0.15;
        rightArmRef.current.rotation.z = 0.15;

        leftForearmRef.current.rotation.x = 0.2;
        rightForearmRef.current.rotation.x = 0.2;

        headRef.current.rotation.set(0, Math.sin(cycle) * 0.05, 0);
        torsoRef.current.rotation.y = -Math.sin(cycle) * 0.08;
      } else if (agent.activityState === 'typing') {
        const leftType = Math.sin(time * 16) * 0.1;
        const rightType = Math.cos(time * 16) * 0.1;

        leftArmRef.current.rotation.set(-0.7, 0.2, -0.2);
        rightArmRef.current.rotation.set(-0.7, -0.2, 0.2);

        leftForearmRef.current.rotation.set(-0.6 + leftType, 0, 0);
        rightForearmRef.current.rotation.set(-0.6 + rightType, 0, 0);

        headRef.current.rotation.set(0.2, Math.sin(time * 1.5) * 0.08, 0);
        torsoRef.current.rotation.set(0.08, 0, 0);
      } else if (agent.activityState === 'talking') {
        const gestureL = Math.sin(time * 4) * 0.2;
        const gestureR = Math.cos(time * 3.5) * 0.25;

        leftArmRef.current.rotation.set(-0.5 + gestureL, 0.3, -0.3);
        rightArmRef.current.rotation.set(-0.6 + gestureR, -0.3, 0.3);

        leftForearmRef.current.rotation.set(-0.5, 0, 0);
        rightForearmRef.current.rotation.set(-0.6, 0, 0);

        headRef.current.rotation.set(
          Math.sin(time * 5) * 0.08,
          Math.cos(time * 2) * 0.12,
          Math.sin(time * 3) * 0.05
        );
        torsoRef.current.rotation.set(0, Math.sin(time * 2) * 0.05, 0);
      } else if (agent.activityState === 'listening') {
        leftArmRef.current.rotation.set(-0.5, 0.4, -0.2);
        rightArmRef.current.rotation.set(-0.5, -0.4, 0.2);

        leftForearmRef.current.rotation.set(-0.7, 0.2, 0);
        rightForearmRef.current.rotation.set(-0.7, -0.2, 0);

        headRef.current.rotation.set(
          0.1 + Math.sin(time * 1.5) * 0.06,
          Math.sin(time * 0.8) * 0.05,
          0.04
        );
        torsoRef.current.rotation.set(0, 0, 0);
      } else {
        const breathing = Math.sin(time * 2) * 0.03;
        leftArmRef.current.rotation.set(0.1 + breathing, 0, -0.12);
        rightArmRef.current.rotation.set(0.1 + breathing, 0, 0.12);
        leftForearmRef.current.rotation.set(0.1, 0, 0);
        rightForearmRef.current.rotation.set(0.1, 0, 0);

        headRef.current.rotation.set(Math.sin(time * 0.8) * 0.03, Math.sin(time * 0.5) * 0.06, 0);
        torsoRef.current.rotation.set(0, 0, 0);
      }
    }
  });

  // Handler for Face-to-Face Interpersonal Interactions & Simulation Steps
  const handleInteractionArrival = (agentId: string, waypointId: string) => {
    // 1. Diana arrives in Ruang Owner (Pak Yoga)
    if (agentId === 'agent_manager' && waypointId === 'wp_owner_interact') {
      // Diana faces Pak Yoga (West: -Math.PI / 2)
      updateAgent('agent_manager', {
        activityState: 'talking',
        rotationY: -Math.PI / 2
      });
      // Pak Yoga turns to face Diana (East: Math.PI / 2)
      updateAgent('agent_owner', {
        activityState: 'listening',
        rotationY: Math.PI / 2
      });

      addDialogue(
        'agent_manager',
        'Baik, Pak Yoga. Saya menerima instruksi Anda. Rencana kerja sudah saya siapkan dan menunggu persetujuan Bapak.',
        4200
      );

      setTimeout(() => {
        updateAgent('agent_owner', {
          activityState: 'talking'
        });
        updateAgent('agent_manager', {
          activityState: 'listening'
        });
        addDialogue(
          'agent_owner',
          'Bagus Diana. Distribusikan ke agen yang tepat dan pastikan kualitasnya sesuai standar Inspire WebCraft.',
          3800
        );

        setTimeout(() => {
          updateAgent('agent_owner', {
            activityState: 'sitting',
            rotationY: Math.PI / 2
          });
        }, 4000);
      }, 4200);
      return;
    }

    // 2. Journey Simulation Handling
    if (!simulation.isActive || agentId !== 'agent_manager') return;

    if (waypointId === 'wp_programmer_interact') {
      // Diana arrived at Alex's workstation
      setJourneyStep(
        'interacting_with_programmer',
        'Diana berdiskusi tatap muka dengan Alex mengenai kebutuhan teknis website & prompt AI.',
        45
      );

      // Diana faces North (Alex), Alex faces South (Diana) -> Face to face!
      updateAgent('agent_manager', {
        activityState: 'talking',
        rotationY: 0
      });
      updateAgent('agent_programmer', {
        activityState: 'listening',
        rotationY: Math.PI
      });

      addDialogue(
        'agent_manager',
        'Alex, Pak Yoga meminta pengembangan arsitektur website responsif dan komponen floating WhatsApp.',
        3800
      );

      setTimeout(() => {
        if (!useOfficeStore.getState().simulation.isActive) return;

        updateAgent('agent_programmer', {
          activityState: 'talking'
        });
        updateAgent('agent_manager', {
          activityState: 'listening'
        });

        addDialogue(
          'agent_programmer',
          'Siap, Diana! Saya susun struktur halaman, komponen interaktif, dan optimasi performanya sekarang.',
          3600
        );

        setTimeout(() => {
          if (!useOfficeStore.getState().simulation.isActive) return;

          // Alex turns back to his triple monitors and starts typing!
          updateAgent('agent_programmer', {
            activityState: 'typing',
            rotationY: -Math.PI / 2
          });

          // Diana proceeds to Ruang CEO (Victor) to report
          setJourneyStep(
            'navigating_to_ceo',
            'Diana berjalan melewati koridor menuju Ruang CEO untuk memberikan laporan kepada Victor.',
            65
          );

          moveAgentToWaypoint('agent_manager', 'wp_ceo_interact');
        }, 3800);
      }, 4000);
    } else if (waypointId === 'wp_ceo_interact') {
      // Diana arrived at Victor's (CEO) desk!
      setJourneyStep(
        'reporting_to_ceo',
        'Diana menyampaikan laporan operasional proyek kepada CEO Victor.',
        85
      );

      // Diana faces East (Victor), Victor faces West (Diana) -> Face to face!
      updateAgent('agent_manager', {
        activityState: 'talking',
        rotationY: Math.PI / 2
      });
      updateAgent('agent_ceo', {
        activityState: 'listening',
        rotationY: -Math.PI / 2
      });

      addDialogue(
        'agent_manager',
        'Pak Victor, laporan operasional: Pekerjaan teknis telah didelegasikan dan target waktu berjalan sesuai jadwal.',
        4000
      );

      setTimeout(() => {
        if (!useOfficeStore.getState().simulation.isActive) return;

        updateAgent('agent_ceo', {
          activityState: 'talking'
        });
        updateAgent('agent_manager', {
          activityState: 'listening'
        });

        addDialogue(
          'agent_ceo',
          'Laporan saya terima, Diana. Koordinasi sangat baik. Pastikan audit mutu selesai sebelum rilis ke Pak Yoga.',
          3800
        );

        setTimeout(() => {
          if (!useOfficeStore.getState().simulation.isActive) return;

          // CEO resumes sitting/evaluating
          updateAgent('agent_ceo', {
            activityState: 'sitting',
            rotationY: -Math.PI / 2
          });

          // Manager returns to Ruang Manager
          setJourneyStep(
            'returning',
            'Diana kembali ke Ruang Manager untuk memantau kelanjutan alur kerja tim.',
            95
          );

          moveAgentToWaypoint('agent_manager', 'wp_manager_seat');
        }, 4000);
      }, 4200);
    } else if (waypointId === 'wp_manager_seat') {
      // Diana returned to her desk
      updateAgent('agent_manager', {
        activityState: 'sitting',
        rotationY: Math.PI / 2
      });

      setJourneyStep(
        'completed',
        'Simulasi Perjalanan Manager berhasil diselesaikan! Semua koordinasi antaragen tuntas.',
        100
      );

      addLog(
        'agent_manager',
        'Diana',
        'task_completed',
        'Uji Perjalanan Manager selesai: Alex menerima brief, CEO Victor menerima laporan, kembali ke meja kerja.'
      );
    }
  };

  return (
    <group
      ref={rootGroupRef}
      onClick={(e) => {
        e.stopPropagation();
        selectAgent(agent.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 3D Floating Name & Role Label Badge (Always faces camera) */}
      <Html position={[0, 1.45, 0]} center distanceFactor={18} zIndexRange={[10, 0]}>
        <div className="pointer-events-none select-none flex flex-col items-center">
          <div className="px-2 py-0.5 rounded-full bg-slate-900/90 text-[10px] font-bold text-white border border-slate-700/80 shadow-md whitespace-nowrap flex items-center gap-1.5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }} />
            <span>{agent.name}</span>
            <span className="text-slate-400 font-normal text-[9px]">({agent.title.split(' ')[0]})</span>
          </div>
        </div>
      </Html>

      {/* 3D Active Speech Bubble attached to character */}
      {activeSpeech && (
        <Html position={[0, 2.05, 0]} center distanceFactor={14} zIndexRange={[25, 0]}>
          <div className="pointer-events-none select-none animate-in fade-in zoom-in-95 duration-200">
            <div className="max-w-[210px] sm:max-w-[240px] bg-slate-900/95 backdrop-blur-md p-2.5 rounded-2xl border-2 border-sky-400 text-slate-100 shadow-2xl relative">
              <div className="text-[9px] font-bold text-sky-300 uppercase tracking-wide mb-0.5 flex items-center gap-1">
                <span>💬 {activeSpeech.speakerName}</span>
              </div>
              <div className="text-[11px] leading-tight text-white font-medium">
                "{activeSpeech.text}"
              </div>
              {/* Downward pointer */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-sky-400" />
            </div>
          </div>
        </Html>
      )}

      {/* Selection Glow Ring under feet */}
      {isSelected && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.52, 32]} />
          <primitive object={materials.selectionRing} attach="material" />
        </mesh>
      )}

      {/* Humanoid Skeleton Rig Hierarchy */}
      <group ref={hipsRef} position={[0, 0.85, 0]}>
        {/* Pelvis */}
        <mesh castShadow receiveShadow material={materials.pants}>
          <boxGeometry args={[0.32, 0.18, 0.22]} />
        </mesh>

        {/* Torso & Shirt / Jacket */}
        <group ref={torsoRef} position={[0, 0.26, 0]}>
          <mesh castShadow receiveShadow material={materials.clothing}>
            <boxGeometry args={[0.36, 0.38, 0.24]} />
          </mesh>

          {/* Collar / Tie detail */}
          <mesh position={[0, 0.16, 0.125]} material={materials.accent}>
            <boxGeometry args={[0.1, 0.08, 0.02]} />
          </mesh>

          {/* Neck */}
          <mesh position={[0, 0.24, 0]} material={materials.skin}>
            <cylinderGeometry args={[0.07, 0.08, 0.12, 16]} />
          </mesh>

          {/* Head */}
          <group ref={headRef} position={[0, 0.42, 0]}>
            <mesh castShadow material={materials.skin}>
              <boxGeometry args={[0.26, 0.28, 0.26]} />
            </mesh>

            {/* Stylized Eyes */}
            <mesh position={[-0.07, 0.03, 0.135]}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color="#1f2937" />
            </mesh>
            <mesh position={[0.07, 0.03, 0.135]}>
              <sphereGeometry args={[0.022, 12, 12]} />
              <meshBasicMaterial color="#1f2937" />
            </mesh>

            {/* Glasses if equipped */}
            {agent.hasGlasses && (
              <group position={[0, 0.03, 0.14]}>
                <mesh position={[-0.07, 0, 0]} material={materials.glasses}>
                  <torusGeometry args={[0.038, 0.007, 8, 16]} />
                </mesh>
                <mesh position={[0.07, 0, 0]} material={materials.glasses}>
                  <torusGeometry args={[0.038, 0.007, 8, 16]} />
                </mesh>
                <mesh position={[0, 0, 0]} material={materials.glasses}>
                  <boxGeometry args={[0.05, 0.008, 0.01]} />
                </mesh>
              </group>
            )}

            {/* Headset if equipped */}
            {agent.hasHeadset && (
              <group position={[0, 0.06, 0]}>
                <mesh position={[-0.14, 0, 0]} material={materials.headset}>
                  <sphereGeometry args={[0.045, 12, 12]} />
                </mesh>
                <mesh position={[0.14, 0, 0]} material={materials.headset}>
                  <sphereGeometry args={[0.045, 12, 12]} />
                </mesh>
                <mesh position={[0, 0.13, 0]} rotation={[0, 0, -Math.PI / 2]} material={materials.headset}>
                  <torusGeometry args={[0.14, 0.015, 8, 24, Math.PI]} />
                </mesh>
              </group>
            )}

            {/* Hair Styles */}
            {agent.hairStyle === 'short' && (
              <mesh position={[0, 0.12, 0]} material={materials.hair}>
                <boxGeometry args={[0.29, 0.12, 0.29]} />
              </mesh>
            )}
            {agent.hairStyle === 'ponytail' && (
              <group position={[0, 0.12, 0]}>
                <mesh material={materials.hair}>
                  <boxGeometry args={[0.28, 0.12, 0.28]} />
                </mesh>
                <mesh position={[0, -0.05, -0.2]} rotation={[0.4, 0, 0]} material={materials.hair}>
                  <cylinderGeometry args={[0.04, 0.07, 0.25, 12]} />
                </mesh>
              </group>
            )}
            {agent.hairStyle === 'curly' && (
              <group position={[0, 0.14, 0]}>
                <mesh material={materials.hair}>
                  <boxGeometry args={[0.31, 0.16, 0.31]} />
                </mesh>
                <mesh position={[0.16, 0.02, 0]} material={materials.hair}>
                  <sphereGeometry args={[0.07, 8, 8]} />
                </mesh>
                <mesh position={[-0.16, 0.02, 0]} material={materials.hair}>
                  <sphereGeometry args={[0.07, 8, 8]} />
                </mesh>
              </group>
            )}
            {agent.hairStyle === 'sidepart' && (
              <mesh position={[0.03, 0.12, 0]} material={materials.hair}>
                <boxGeometry args={[0.29, 0.14, 0.28]} />
              </mesh>
            )}
            {agent.hairStyle === 'bun' && (
              <group position={[0, 0.12, 0]}>
                <mesh material={materials.hair}>
                  <boxGeometry args={[0.28, 0.12, 0.28]} />
                </mesh>
                <mesh position={[0, 0.14, -0.06]} material={materials.hair}>
                  <sphereGeometry args={[0.08, 12, 12]} />
                </mesh>
              </group>
            )}
            {agent.hairStyle === 'sleek' && (
              <mesh position={[0, 0.11, 0]} material={materials.hair}>
                <boxGeometry args={[0.28, 0.1, 0.28]} />
              </mesh>
            )}
          </group>

          {/* Left Arm Rig */}
          <group ref={leftArmRef} position={[-0.23, 0.14, 0]}>
            <mesh castShadow material={materials.clothing} position={[0, -0.12, 0]}>
              <boxGeometry args={[0.1, 0.24, 0.1]} />
            </mesh>
            <group ref={leftForearmRef} position={[0, -0.24, 0]}>
              <mesh castShadow material={materials.clothing} position={[0, -0.1, 0]}>
                <boxGeometry args={[0.09, 0.2, 0.09]} />
              </mesh>
              <mesh position={[0, -0.22, 0]} material={materials.skin}>
                <boxGeometry args={[0.08, 0.08, 0.08]} />
              </mesh>
            </group>
          </group>

          {/* Right Arm Rig */}
          <group ref={rightArmRef} position={[0.23, 0.14, 0]}>
            <mesh castShadow material={materials.clothing} position={[0, -0.12, 0]}>
              <boxGeometry args={[0.1, 0.24, 0.1]} />
            </mesh>
            <group ref={rightForearmRef} position={[0, -0.24, 0]}>
              <mesh castShadow material={materials.clothing} position={[0, -0.1, 0]}>
                <boxGeometry args={[0.09, 0.2, 0.09]} />
              </mesh>
              <mesh position={[0, -0.22, 0]} material={materials.skin}>
                <boxGeometry args={[0.08, 0.08, 0.08]} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Left Leg Rig */}
        <group ref={leftLegRef} position={[-0.1, -0.08, 0]}>
          <mesh castShadow material={materials.pants} position={[0, -0.16, 0]}>
            <boxGeometry args={[0.11, 0.32, 0.12]} />
          </mesh>
          <group ref={leftCalfRef} position={[0, -0.32, 0]}>
            <mesh castShadow material={materials.pants} position={[0, -0.16, 0]}>
              <boxGeometry args={[0.1, 0.32, 0.11]} />
            </mesh>
            <mesh position={[0, -0.34, 0.04]} material={materials.shoes}>
              <boxGeometry args={[0.11, 0.09, 0.18]} />
            </mesh>
          </group>
        </group>

        {/* Right Leg Rig */}
        <group ref={rightLegRef} position={[0.1, -0.08, 0]}>
          <mesh castShadow material={materials.pants} position={[0, -0.16, 0]}>
            <boxGeometry args={[0.11, 0.32, 0.12]} />
          </mesh>
          <group ref={rightCalfRef} position={[0, -0.32, 0]}>
            <mesh castShadow material={materials.pants} position={[0, -0.16, 0]}>
              <boxGeometry args={[0.1, 0.32, 0.11]} />
            </mesh>
            <mesh position={[0, -0.34, 0.04]} material={materials.shoes}>
              <boxGeometry args={[0.11, 0.09, 0.18]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
