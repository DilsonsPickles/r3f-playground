// src/app/components/grid/Building.tsx
"use client";
import { Building as BuildingType, cartesianToIsometric } from "@/app/utils/isometricUtils";

interface BuildingProps {
  building: BuildingType;
  position: [number, number];
}

// Building visualization component
export function Building({ building, position }: BuildingProps) {
  const buildingType = building.type;
  const [isoX, isoZ] = cartesianToIsometric(position[0], position[1]);
  
  // Different 3D models based on building type
  const BuildingModel = () => {
    switch(buildingType) {
      case 'wall':
        return (
          <mesh position={[0, 0.3, 0]} scale={[0.8, 0.6, 0.8]}>
            <boxGeometry />
            <meshStandardMaterial color="#795548" />
          </mesh>
        );
      case 'tower':
        return (
          <group>
            <mesh position={[0, 0.4, 0]} scale={[0.8, 0.8, 0.8]}>
              <boxGeometry />
              <meshStandardMaterial color="#795548" />
            </mesh>
            <mesh position={[0, 0.9, 0]} scale={[0.6, 0.2, 0.6]}>
              <cylinderGeometry />
              <meshStandardMaterial color="#4e342e" />
            </mesh>
            <mesh position={[0, 1.1, 0]} scale={[0.7, 0.1, 0.7]}>
              <cylinderGeometry />
              <meshStandardMaterial color="#5d4037" />
            </mesh>
          </group>
        );
      case 'house':
        return (
          <group>
            <mesh position={[0, 0.3, 0]} scale={[0.8, 0.6, 0.8]}>
              <boxGeometry />
              <meshStandardMaterial color="#e57373" />
            </mesh>
            <mesh position={[0, 0.8, 0]} rotation={[0, Math.PI / 4, 0]} scale={[0.9, 0.4, 0.9]}>
              <coneGeometry />
              <meshStandardMaterial color="#c62828" />
            </mesh>
          </group>
        );
      default:
        return (
          <mesh position={[0, 0.3, 0]} scale={[0.5, 0.5, 0.5]}>
            <boxGeometry />
            <meshStandardMaterial color="#9e9e9e" />
          </mesh>
        );
    }
  };
  
  return (
    <group position={[isoX, 0, isoZ]}>
      <BuildingModel />
    </group>
  );
}