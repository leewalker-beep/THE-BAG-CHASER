import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GameState } from './types';
import { getInitialGameState } from './initialState';

const SAVE_KEY = 'bag-chaser-state';

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      ...getInitialGameState() as GameState,

      setPh: (ph) => set({ ph }),

      setTab: (tab) => set({ tab }),

      adv: (intervals = 1) => set((state) => ({
        pl: {
          ...state.pl,
          mo: state.pl.mo + intervals
        },
        lastProcessedTimestamp: Date.now()
      })),
    }),
    {
      name: SAVE_KEY,
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try {
            const str = localStorage.getItem(name);
            if (!str) return null;
            // Robustness: Try parsing to ensure it's valid JSON
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
    }
  )
);
