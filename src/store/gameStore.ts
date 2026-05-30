import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState } from './types';
import { getInitialGameState } from './initialState';
import { createMudSlice } from './slices/mudSlice';
import { createStreetSlice } from './slices/streetSlice';
import { applyAdvancement } from './engine';

const SAVE_KEY = 'bag-chaser-state';

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...(getInitialGameState() as GameState),
      ph: 'PROLOGUE_INTRO',

      setPh: (ph) => set({ ph }),

      setTab: (tab) => set({ tab }),

      setActiveTab: (activeTab) => set({ activeTab }),

      setActiveHustleView: (activeHustleView) => set({ activeHustleView }),

      adv: (intervals = 1) => set((state) => applyAdvancement(state, intervals)),

      ...createMudSlice(set),
      ...createStreetSlice(set),
    }),
    {
      name: SAVE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            if (!str) return null;
            JSON.parse(str);
            return str;
          } catch (e) {
            console.error("Storage corruption detected, clearing key", e);
            localStorage.removeItem(name);
            return null;
          }
        },
        setItem: (name, value) => localStorage.setItem(name, value),
        removeItem: (name) => localStorage.removeItem(name),
      })),
      partialize: (state) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { ph, ...rest } = state;
        return rest;
      },
    }
  )
);
