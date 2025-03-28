"use client";
import { useRef } from "react";
import { Tile, cartesianToIsometric } from "@/app/utils/isometricUtils";

interface GridTileProps {
  tile: Tile;
  isHovered: boolean;
  isSelected: boolean;
  onTileClick: (tileId: string) => void;
}

// Individual grid tile component
export function GridTile({
  tile,
  isHovered,
  isSelected,
  onTileClick,
}: GridTileProps) {
  // Get reference to meshes for animation
  const meshRef = useRef<THREE.Mesh>(null);

  // Determine colors based on tile type and state
  const getTileBaseColor = () => {
    switch (tile.type) {
      case "grass":
        return "#7cb342";
      case "water":
        return "#42a5f5";
      case "stone":
        return "#9e9e9e";
      case "tree":
        return "#558b2f";
      default:
        return "#7cb342";
    }
  };

  const tileColor = isSelected
    ? "#4caf50"
    : isHovered
    ? "#ffeb3b"
    : getTileBaseColor();
  const height = isSelected ? 0.1 : 0.05;

  // Calculate isometric position
  const [isoX, isoZ] = cartesianToIsometric(tile.position[0], tile.position[1]);

  // Add visual elements based on tile type
  const ResourceIndicator = () => {
    if (tile.type === "stone") {
      return (
        <mesh position={[0, 0.15, 0]} scale={[0.3, 0.3, 0.3]}>
          <dodecahedronGeometry />
          <meshStandardMaterial color="#bdbdbd" roughness={0.8} />
        </mesh>
      );
    } else if (tile.type === "tree") {
      return (
        <group position={[0, 0.3, 0]}>
          <mesh position={[0, 0.1, 0]} scale={[0.2, 0.4, 0.2]}>
            <cylinderGeometry />
            <meshStandardMaterial color="#795548" />
          </mesh>
          <mesh position={[0, 0.4, 0]} scale={[0.5, 0.5, 0.5]}>
            <coneGeometry />
            <meshStandardMaterial color="#33691e" />
          </mesh>
        </group>
      );
    } else if (tile.type === "water") {
      return (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.95, 0.95]} />
          <meshStandardMaterial
            color="#29b6f6"
            transparent={true}
            opacity={0.8}
            roughness={0.1}
          />
        </mesh>
      );
    }
    return null;
  };

  // Check if tile is buildable
  const isTileBuildable = tile.properties?.buildable !== false;

  return (
    <group position={[isoX, 0, isoZ]}>
      <mesh
        ref={meshRef}
        position={[0, height / 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={() => onTileClick(tile.id)}
        userData={{ tileId: tile.id }}
      >
        <planeGeometry args={[0.95, 0.95]} />
        <meshStandardMaterial
          color={tileColor}
          transparent={true}
          opacity={isTileBuildable ? 0.8 : 0.5}
          roughness={0.7}
        />
      </mesh>

      {/* Add visual indicators for tile type */}
      <ResourceIndicator />
    </group>
  );
}
