// src/app/components/ui/GameControlUI.tsx
"use client";
import useGameStore from "../../store";

export function GameControlUI() {
  const { 
    gameStage, 
    startWave, 
    waveNumber,
    resetGame
  } = useGameStore();
  
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      right: '20px',
      padding: '10px',
      background: 'rgba(0,0,0,0.7)',
      color: 'white',
      borderRadius: '5px'
    }}>
      <h3 style={{ margin: '0 0 10px 0' }}>Game Controls</h3>
      <div>Wave: {waveNumber}</div>
      <div>Stage: {gameStage}</div>
      
      {gameStage === 'building' && (
        <button
          onClick={startWave}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            background: '#ff9800',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Start Wave
        </button>
      )}
      
      <button
        onClick={resetGame}
        style={{
          marginTop: '10px',
          padding: '8px 16px',
          background: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Reset Game
      </button>
    </div>
  );
}