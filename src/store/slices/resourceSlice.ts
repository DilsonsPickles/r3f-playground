// src/store/slices/resourceSlice.ts
import { StateCreator } from 'zustand';
import { RootState, ResourceState } from '../types';
import { INITIAL_RESOURCES } from '../constants';

export interface ResourceActions {
  addResources: (resourceUpdate: Record<string, number>) => void;
  deductResources: (resourceCosts: Record<string, number>) => boolean;
  resetResources: () => void;
}

export type ResourceSlice = ResourceState & ResourceActions;

export const createResourceSlice: StateCreator<
  RootState,
  [],
  [],
  ResourceSlice
> = (set, get) => ({
  // Initial state
  resources: { ...INITIAL_RESOURCES },

  // Actions
  addResources: (resourceUpdate) => {
    const { resources } = get();
    set({
      resources: Object.entries(resourceUpdate).reduce((acc, [key, value]) => {
        acc[key] = (resources[key] || 0) + value;
        return acc;
      }, { ...resources })
    });
  },
  
  deductResources: (resourceCosts) => {
    const { resources } = get();
    
    // Check if we have enough resources
    for (const [resource, amount] of Object.entries(resourceCosts)) {
      if ((resources[resource] || 0) < amount) {
        console.log(`Not enough ${resource}`);
        return false;
      }
    }
    
    // Deduct resources
    const newResources = { ...resources };
    for (const [resource, amount] of Object.entries(resourceCosts)) {
      newResources[resource] = (newResources[resource] || 0) - amount;
    }
    
    set({ resources: newResources });
    return true;
  },
  
  resetResources: () => {
    set({ resources: { ...INITIAL_RESOURCES } });
  }
});