"use client";
import { useRef } from "react";
import * as THREE from "three";
import useGameStore from "../../store";

// Core structure component that players need to defend
export function CoreStructure() {
  const { grid, gridSize } = useGameStore();
  const coreRef = useRef<THREE.Group>(null);
  
  // Determine the center of the grid
  const centerX = Math.floor(gridSize / 2);
  const centerZ = Math.floor(gridSize / 2);
  
  // Colors and materials
  const stoneColor = "#8d8d8d";
  const roofColor = "#6a3d1d";
  const woodColor = "#a0522d";
  const flagColor = "#c62828";
  
  return (
    <group 
      ref={coreRef} 
      position={[centerX, 0, centerZ]}
    >
      {/* Main keep structure - central tower */}
      <group position={[0, 0, 0]}>
        {/* Base/foundation */}
        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[5, 0.2, 5]} />
          <meshStandardMaterial color={stoneColor} roughness={0.9} />
        </mesh>
        
        {/* Main keep walls */}
        <mesh position={[0, 2, 0]} receiveShadow castShadow>
          <boxGeometry args={[4, 4, 4]} />
          <meshStandardMaterial color={stoneColor} roughness={0.8} />
        </mesh>
        
        {/* Keep roof */}
        <mesh position={[0, 4.5, 0]} receiveShadow castShadow>
          <coneGeometry args={[3, 1.5, 4]} />
          <meshStandardMaterial color={roofColor} roughness={0.7} />
        </mesh>
        
        {/* Main tower */}
        <mesh position={[0, 6, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.6, 0.6, 2.5, 8]} />
          <meshStandardMaterial color={stoneColor} roughness={0.7} />
        </mesh>
        
        {/* Tower roof */}
        <mesh position={[0, 7.5, 0]} receiveShadow castShadow>
          <coneGeometry args={[0.8, 1, 8]} />
          <meshStandardMaterial color={roofColor} roughness={0.6} />
        </mesh>
        
        {/* Flag */}
        <mesh position={[0, 8.2, 0]} rotation={[0, 0, Math.PI/8]} receiveShadow castShadow>
          <boxGeometry args={[0.05, 0.5, 0.05]} />
          <meshStandardMaterial color={woodColor} />
        </mesh>
        <mesh position={[0.25, 8.3, 0]} rotation={[0, 0, Math.PI/8]} receiveShadow castShadow>
          <boxGeometry args={[0.5, 0.3, 0.02]} />
          <meshStandardMaterial color={flagColor} roughness={0.5} />
        </mesh>
      </group>
      
      {/* Corner towers */}
      {[
        [1.8, 0, 1.8], 
        [1.8, 0, -1.8], 
        [-1.8, 0, 1.8], 
        [-1.8, 0, -1.8]
      ].map((position, index) => (
        <group key={index} position={position}>
          <mesh position={[0, 1.5, 0]} receiveShadow castShadow>
            <cylinderGeometry args={[0.8, 0.8, 3, 8]} />
            <meshStandardMaterial color={stoneColor} roughness={0.8} />
          </mesh>
          
          {/* Crenellations on corner towers */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
            const angle = (i * Math.PI / 4);
            const x = Math.cos(angle) * 0.8;
            const z = Math.sin(angle) * 0.8;
            return (
              <mesh key={i} position={[x, 3.1, z]} receiveShadow castShadow>
                <boxGeometry args={[0.2, 0.3, 0.2]} />
                <meshStandardMaterial color={stoneColor} roughness={0.7} />
              </mesh>
            );
          })}
          
          {/* Tower top */}
          <mesh position={[0, 3.4, 0]} receiveShadow castShadow>
            <coneGeometry args={[0.9, 1, 8]} />
            <meshStandardMaterial color={roofColor} roughness={0.6} />
          </mesh>
        </group>
      ))}
      
      {/* Crenellations on main walls */}
      {/* North wall */}
      {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((x, i) => (
        <mesh key={`north-${i}`} position={[x, 4.1, -2]} receiveShadow castShadow>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshStandardMaterial color={stoneColor} roughness={0.7} />
        </mesh>
      ))}
      
      {/* South wall */}
      {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((x, i) => (
        <mesh key={`south-${i}`} position={[x, 4.1, 2]} receiveShadow castShadow>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshStandardMaterial color={stoneColor} roughness={0.7} />
        </mesh>
      ))}
      
      {/* East wall */}
      {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((z, i) => (
        <mesh key={`east-${i}`} position={[2, 4.1, z]} receiveShadow castShadow>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshStandardMaterial color={stoneColor} roughness={0.7} />
        </mesh>
      ))}
      
      {/* West wall */}
      {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((z, i) => (
        <mesh key={`west-${i}`} position={[-2, 4.1, z]} receiveShadow castShadow>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshStandardMaterial color={stoneColor} roughness={0.7} />
        </mesh>
      ))}
      
      {/* Gate/entrance */}
      <mesh position={[0, 1, -2.1]} receiveShadow castShadow>
        <boxGeometry args={[1.5, 2, 0.3]} />
        <meshStandardMaterial color={stoneColor} roughness={0.8} />
      </mesh>
      
      <mesh position={[0, 1, -2.2]} receiveShadow castShadow>
        <boxGeometry args={[1, 1.6, 0.1]} />
        <meshStandardMaterial color={woodColor} roughness={0.9} />
      </mesh>
      
      {/* Windows */}
      {[[1.5, 2, 0], [-1.5, 2, 0], [0, 2, 1.5]].map((pos, i) => (
        <mesh key={`window-${i}`} position={pos} receiveShadow castShadow>
          <boxGeometry args={[0.5, 0.8, 0.1]} />
          <meshStandardMaterial color="#222" roughness={0.5} />
        </mesh>
      ))}
      
      {/* Torches/lights */}
      {[
        [2.1, 2, 0], 
        [-2.1, 2, 0], 
        [0, 2, 2.1], 
        [0, 2, -2.1]
      ].map((pos, i) => (
        <group key={`torch-${i}`} position={pos}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.3, 0.1]} />
            <meshStandardMaterial color={woodColor} />
          </mesh>
          <pointLight position={[0, 0.2, 0]} intensity={0.3} color="#ff9933" distance={3} />
        </group>
      ))}
      
      {/* Add some ambient lighting */}
      <pointLight position={[0, 3, 0]} intensity={0.4} color="#ffeecc" distance={10} />
    </group>
  );
}