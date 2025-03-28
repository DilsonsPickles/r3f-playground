// src/store/slices/coreSlice.ts
import { StateCreator } from 'zustand';
import { RootState, CoreState } from '../types';
import { CORE_MAX_HEALTH } from '../constants';

export interface CoreActions {
  damageCore: (amount: number) => void;
  healCore: (amount: number) => void;
  resetCore: () => void;
}

export type CoreSlice = CoreState & CoreActions;

export const createCoreSlice: StateCreator<
  RootState,
  [],
  [],
  CoreSlice
> = (set, get) => ({
  // Initial state
  coreHealth: CORE_MAX_HEALTH,
  coreMaxHealth: CORE_MAX_HEALTH,

  // Actions
  damageCore: (amount) => {
    const { coreHealth, gameStage } = get();
    const newHealth = Math.max(0, coreHealth - amount);
    
    set({
      coreHealth: newHealth,
      gameStage: newHealth <= 0 ? 'gameover' : gameStage
    });
  },
  
  healCore: (amount) => {
    const { coreHealth, coreMaxHealth } = get();
    const newHealth = Math.min(coreMaxHealth, coreHealth + amount);
    
    set({ coreHealth: newHealth });
  },
  
  resetCore: () => {
    set({
      coreHealth: CORE_MAX_HEALTH
    });
  }
});