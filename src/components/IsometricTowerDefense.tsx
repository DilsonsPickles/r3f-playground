"use client";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { IsometricGrid } from "./grid/IsometricGrid";
import { ResourceDisplay } from "./ui/ResourceDisplay";
import { BuildingUI } from "./ui/BuildingUI";
import { ResourceUI } from "./ui/ResourceUI";
import { GameControlUI } from "./ui/GameControlUI";
import useGameStore from "../store/useGameStore";

// Main game component
export default function IsometricTowerDefense() {
  const { gameStage } = useGameStore();
  
  return (
    <div style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Canvas shadows>
        {/* Set up camera for isometric view */}
        <PerspectiveCamera 
          makeDefault 
          position={[10, 10, 10]} 
          fov={45}
          near={0.1}
          far={1000}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        
        {/* Main grid with game elements */}
        <IsometricGrid />
        
        {/* 3D text display for resources */}
        <ResourceDisplay />
        
        {/* Controls - limit rotation to maintain isometric feel */}
        <OrbitControls 
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 3}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
      
      {/* UI Overlays */}
      <ResourceUI />
      {gameStage === 'building' && <BuildingUI />}
      <GameControlUI />
    </div>
  );
}