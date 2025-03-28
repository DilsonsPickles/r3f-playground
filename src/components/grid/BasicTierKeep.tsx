"use client";
import { useRef } from "react";
import * as THREE from "three";
import useGameStore from "../../store";

// Core structure component that players need to defend - basic tier
export function CoreStructure() {
  const { grid, gridSize } = useGameStore();
  const coreRef = useRef<THREE.Group>(null);
  
  // Determine the center of the grid
  const centerX = Math.floor(gridSize / 2);
  const centerZ = Math.floor(gridSize / 2);
  
  // Colors and materials
  const stoneColor = "#8d8d8d";
  const woodColor = "#a0522d";
  const roofColor = "#654321";
  
  return (
    <group 
      ref={coreRef} 
      position={[centerX, 0, centerZ]}
    >
      {/* Simple foundation */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[3, 0.2, 3]} />
        <meshStandardMaterial color={stoneColor} roughness={0.9} />
      </mesh>
      
      {/* Main structure - basic stone tower */}
      <mesh position={[0, 1.5, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.2, 1.4, 3, 8]} />
        <meshStandardMaterial color={stoneColor} roughness={0.8} />
      </mesh>
      
      {/* Simple wooden roof */}
      <mesh position={[0, 3.2, 0]} receiveShadow castShadow>
        <coneGeometry args={[1.5, 1, 8]} />
        <meshStandardMaterial color={roofColor} roughness={0.7} />
      </mesh>
      
      {/* Basic wooden palisade wall around the tower */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i * Math.PI / 4);
        const x = Math.cos(angle) * 1.8;
        const z = Math.sin(angle) * 1.8;
        return (
          <mesh key={i} position={[x, 1, z]} receiveShadow castShadow>
            <boxGeometry args={[0.2, 2, 0.2]} />
            <meshStandardMaterial color={woodColor} roughness={0.9} />
          </mesh>
        );
      })}
      
      {/* Entrance - simple wooden door */}
      <mesh position={[0, 0.8, -1.41]} rotation={[0, 0, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.8, 1.6, 0.1]} />
        <meshStandardMaterial color={woodColor} roughness={0.9} />
      </mesh>
      
      {/* Simple windows */}
      {[
        [Math.cos(Math.PI/4) * 1.2, 1.5, Math.sin(Math.PI/4) * 1.2],
        [Math.cos(3*Math.PI/4) * 1.2, 1.5, Math.sin(3*Math.PI/4) * 1.2],
        [Math.cos(5*Math.PI/4) * 1.2, 1.5, Math.sin(5*Math.PI/4) * 1.2],
        [Math.cos(7*Math.PI/4) * 1.2, 1.5, Math.sin(7*Math.PI/4) * 1.2]
      ].map((pos, i) => (
        <mesh key={`window-${i}`} position={pos} rotation={[0, i * Math.PI/2, 0]} receiveShadow castShadow>
          <boxGeometry args={[0.1, 0.5, 0.5]} />
          <meshStandardMaterial color="#222" roughness={0.5} />
        </mesh>
      ))}
      
      {/* Simple torch at entrance */}
      <group position={[0.5, 1.2, -1.41]}>
        <mesh>
          <boxGeometry args={[0.1, 0.3, 0.1]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
        <pointLight position={[0, 0.2, 0]} intensity={0.3} color="#ff9933" distance={2} />
      </group>
      
      {/* Basic lookout post on top */}
      <mesh position={[0, 3.7, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.5, 8]} />
        <meshStandardMaterial color={woodColor} roughness={0.8} />
      </mesh>
      
      {/* Simple ambient light to highlight the structure */}
      <pointLight position={[0, 2, 0]} intensity={0.2} color="#ffeecc" distance={5} />
    </group>
  );
}