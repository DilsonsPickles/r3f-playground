// src/store/slices/gameStateSlice.ts
import { StateCreator } from 'zustand';
import { RootState, GameState, Enemy } from '../types';

export interface GameStateActions {
  startWave: () => void;
  endWave: () => void;
  damagePlayer: (amount: number) => void;
  addEnemy: (enemy: Enemy) => void;
  removeEnemy: (enemyId: string) => void;
  resetGameState: () => void;
}

export type GameStateSlice = GameState & GameStateActions;

export const createGameStateSlice: StateCreator<
  RootState,
  [],
  [],
  GameStateSlice
> = (set, get) => ({
  // Initial state
  gameStage: 'building',
  waveNumber: 0,
  enemies: [],
  playerHealth: 100,

  // Actions
  startWave: () => {
    const currentWave = get().waveNumber + 1;
    set({ 
      gameStage: 'wave', 
      waveNumber: currentWave 
    });
    
    // Here you would add logic to spawn enemies based on wave number
    // For example:
    const numEnemies = Math.min(5 + (currentWave * 2), 30); // Scale with wave, max 30
    
    // This is just placeholder logic, you'd want more sophisticated enemy spawning
    // console.log(`Starting wave ${currentWave} with ${numEnemies} enemies`);
  },
  
  endWave: () => {
    set({ 
      gameStage: 'building', 
      enemies: [] 
    });
    
    // Add rewards for completing the wave
    const { waveNumber, addResources } = get();
    const reward = {
      gold: 50 + (waveNumber * 10),
      wood: 20 + (waveNumber * 5),
      stone: 20 + (waveNumber * 5)
    };
    
    if (typeof addResources === 'function') {
      addResources(reward);
    }
  },
  
  damagePlayer: (amount) => {
    const { playerHealth, gameStage } = get();
    const newHealth = Math.max(0, playerHealth - amount);
    
    set({
      playerHealth: newHealth,
      gameStage: newHealth <= 0 ? 'gameover' : gameStage
    });
  },
  
  addEnemy: (enemy) => {
    const { enemies } = get();
    set({ enemies: [...enemies, enemy] });
  },
  
  removeEnemy: (enemyId) => {
    const { enemies } = get();
    set({ enemies: enemies.filter(e => e.id !== enemyId) });
  },
  
  resetGameState: () => {
    set({
      gameStage: 'building',
      waveNumber: 0,
      enemies: [],
      playerHealth: 100
    });
  }
});