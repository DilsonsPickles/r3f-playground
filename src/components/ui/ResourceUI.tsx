// src/app/components/ui/ResourceUI.tsx
"use client";
import useGameStore from "../../store";

// Resource display UI component
export function ResourceUI() {
  const resources = useGameStore(state => state.resources);
  
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      padding: '10px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      borderRadius: '5px'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Resources</h3>
      <div>Gold: {resources.gold}</div>
      <div>Wood: {resources.wood}</div>
      <div>Stone: {resources.stone}</div>
    </div>
  );
}