import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { useOfficeStore } from '../../store/officeStore';
import { ROOMS } from '../../constants/officeData';

// Generous isometric overview showing entire office with walls and margins
const DEFAULT_CAM_POS = new THREE.Vector3(30, 38, 30);
const DEFAULT_CAM_TARGET = new THREE.Vector3(0, 0, 0);
const FIT_ENTIRE_POS = new THREE.Vector3(34, 46, 34);

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const cameraMode = useOfficeStore((state) => state.cameraMode);
  const selectedAgentId = useOfficeStore((state) => state.selectedAgentId);
  const selectedRoomId = useOfficeStore((state) => state.selectedRoomId);
  const agents = useOfficeStore((state) => state.agents);
  const cameraResetTrigger = useOfficeStore((state) => state.cameraResetTrigger);
  const fitOfficeTrigger = useOfficeStore((state) => state.fitOfficeTrigger);

  const targetLookAt = useRef<THREE.Vector3>(DEFAULT_CAM_TARGET.clone());
  const targetCamPos = useRef<THREE.Vector3>(DEFAULT_CAM_POS.clone());
  const isTransitioning = useRef<boolean>(false);

  // When reset camera trigger fires
  useEffect(() => {
    if (cameraResetTrigger > 0) {
      targetCamPos.current.copy(DEFAULT_CAM_POS);
      targetLookAt.current.copy(DEFAULT_CAM_TARGET);
      isTransitioning.current = true;
    }
  }, [cameraResetTrigger]);

  // When fit entire office trigger fires
  useEffect(() => {
    if (fitOfficeTrigger > 0) {
      targetCamPos.current.copy(FIT_ENTIRE_POS);
      targetLookAt.current.copy(DEFAULT_CAM_TARGET);
      isTransitioning.current = true;
    }
  }, [fitOfficeTrigger]);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);

    if (cameraMode === 'follow_agent' && selectedAgentId) {
      const agent = agents.find((a) => a.id === selectedAgentId);
      if (agent) {
        targetLookAt.current.set(agent.position.x, 1.2, agent.position.z);
        targetCamPos.current.set(
          agent.position.x + 9.0,
          agent.position.y + 12.0,
          agent.position.z + 9.0
        );

        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 4.5, clampedDelta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 4.5, clampedDelta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 4.5, clampedDelta);

        if (controlsRef.current) {
          controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, targetLookAt.current.x, 5.0, clampedDelta);
          controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, targetLookAt.current.y, 5.0, clampedDelta);
          controlsRef.current.target.z = THREE.MathUtils.damp(controlsRef.current.target.z, targetLookAt.current.z, 5.0, clampedDelta);
          controlsRef.current.update();
        }
      }
    } else if (cameraMode === 'room_focus' && selectedRoomId) {
      const room = ROOMS.find((r) => r.id === selectedRoomId);
      if (room) {
        targetLookAt.current.set(room.cameraTarget.x, room.cameraTarget.y, room.cameraTarget.z);
        targetCamPos.current.set(
          room.center.x + room.cameraPosition.x * 0.95,
          room.cameraPosition.y + 1.0,
          room.center.z + room.cameraPosition.z * 0.95
        );

        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 4.0, clampedDelta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 4.0, clampedDelta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 4.0, clampedDelta);

        if (controlsRef.current) {
          controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, targetLookAt.current.x, 4.5, clampedDelta);
          controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, targetLookAt.current.y, 4.5, clampedDelta);
          controlsRef.current.target.z = THREE.MathUtils.damp(controlsRef.current.target.z, targetLookAt.current.z, 4.5, clampedDelta);
          controlsRef.current.update();
        }
      }
    } else if (isTransitioning.current) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 4.0, clampedDelta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 4.0, clampedDelta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 4.0, clampedDelta);

      if (controlsRef.current) {
        controlsRef.current.target.x = THREE.MathUtils.damp(controlsRef.current.target.x, targetLookAt.current.x, 4.5, clampedDelta);
        controlsRef.current.target.y = THREE.MathUtils.damp(controlsRef.current.target.y, targetLookAt.current.y, 4.5, clampedDelta);
        controlsRef.current.target.z = THREE.MathUtils.damp(controlsRef.current.target.z, targetLookAt.current.z, 4.5, clampedDelta);
        controlsRef.current.update();

        if (camera.position.distanceTo(targetCamPos.current) < 0.25) {
          isTransitioning.current = false;
        }
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={Math.PI / 2.15} // Never dip below floor
      minPolarAngle={Math.PI / 8}    // Allow looking comfortably from high angle
      minDistance={4}                // Allow close zoom on workstations
      maxDistance={140}              // Generous zoom out range to see entire building & perimeter
      target={[0, 0, 0]}
    />
  );
};
