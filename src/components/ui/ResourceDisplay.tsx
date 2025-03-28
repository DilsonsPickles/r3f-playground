// src/app/components/ui/ResourceDisplay.tsx
"use client";
import { Text } from "@react-three/drei";
import useGameStore from "../../store/useGameStore";

// Resource display component in 3D space
export function ResourceDisplay() {
  const resources = useGameStore(state => state.resources);
  
  return (
    <group position={[-5, 5, -5]}>
      <Text
        position={[0, 0, 0]}
        color="white"
        fontSize={0.5}
        anchorX="left"
        anchorY="middle"
      >
        {`Gold: ${resources.gold} | Wood: ${resources.wood} | Stone: ${resources.stone}`}
      </Text>
    </group>
  );
}