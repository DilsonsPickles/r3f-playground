"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { GameMap } from "./grid/GameMap";
import { ResourceDisplay } from "./ui/ResourceDisplay";
import { BuildingUI } from "./ui/BuildingUI";
import { ResourceUI } from "./ui/ResourceUI";
import { GameControlUI } from "./ui/GameControlUI";
import { CoreHealthUI } from "./ui/CoreHealthUI";
import useGameStore from "../store";

// Main game component
export default function IsometricTowerDefense() {
  const { gameStage, gridSize } = useGameStore();
  
  // Calculate initial camera position based on grid size
  const cameraDistance = Math.max(25, gridSize * 0.6); // Scale camera distance based on grid size
  
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas shadows>
        {/* Set up camera with a perspective view */}
        <PerspectiveCamera 
          makeDefault 
          position={[cameraDistance, cameraDistance, cameraDistance]} 
          fov={45}
          near={0.1}
          far={1000} // Increased for larger maps
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[20, 30, 20]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={2048} 
          shadow-mapSize-height={2048}
          shadow-camera-left={-gridSize/2}
          shadow-camera-right={gridSize/2}
          shadow-camera-top={gridSize/2}
          shadow-camera-bottom={-gridSize/2}
        />
        
        {/* Main game map with grid and buildings */}
        <GameMap />
        
        {/* 3D text display for resources */}
        <ResourceDisplay />
        
        {/* Controls - with inertia disabled */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={gridSize * 1.5}
          target={[gridSize/2, 0, gridSize/2]}
          enableDamping={false} // Disable inertia
          dampingFactor={0} // Set damping factor to 0
          rotateSpeed={0.5} // Slightly slower rotation for better control
          zoomSpeed={0.8} // Slightly slower zoom for better control
          panSpeed={0.8} // Slightly slower pan for better control
        />
      </Canvas>
      
      {/* UI Overlays */}
      <ResourceUI />
      <CoreHealthUI />
      {gameStage === 'building' && <BuildingUI />}
      <GameControlUI />
    </div>
  );
}