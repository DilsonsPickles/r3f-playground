// src/app/components/ui/CoreHealthUI.tsx
"use client";
import useGameStore from "../../store";

export function CoreHealthUI() {
  const { coreHealth, coreMaxHealth } = useGameStore();
  
  // Calculate health percentage
  const healthPercentage = (coreHealth / coreMaxHealth) * 100;
  
  // Determine color based on health percentage
  const getHealthColor = () => {
    if (healthPercentage > 70) return "#4caf50"; // Green
    if (healthPercentage > 40) return "#ff9800"; // Orange
    return "#f44336"; // Red
  };
  
  return (
    <div style={{
      position: 'absolute',
      top: '80px',
      left: '20px',
      padding: '10px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      borderRadius: '5px',
      width: '200px'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Core Health</h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between' 
      }}>
        <span>{coreHealth} / {coreMaxHealth}</span>
        <span>{Math.round(healthPercentage)}%</span>
      </div>
      
      <div style={{
        width: '100%',
        height: '10px',
        background: '#333',
        borderRadius: '5px',
        marginTop: '5px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${healthPercentage}%`,
          height: '100%',
          background: getHealthColor(),
          transition: 'width 0.3s ease-in-out'
        }} />
      </div>
    </div>
  );
}