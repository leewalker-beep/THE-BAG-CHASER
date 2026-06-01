import { create } from 'zustand';

type VFXType = 'SURGE' | 'CASCADE';

interface VFXEvent {
  id: string;
  type: VFXType;
}

interface JuiceState {
  events: VFXEvent[];
  triggerSurge: () => void;
  triggerCascade: () => void;
  removeEvent: (id: string) => void;
}

export const useJuiceStore = create<JuiceState>((set) => ({
  events: [],
  triggerSurge: () => set((state) => ({
    events: [...state.events, { id: Math.random().toString(36).substring(7), type: 'SURGE' }]
  })),
  triggerCascade: () => set((state) => ({
    events: [...state.events, { id: Math.random().toString(36).substring(7), type: 'CASCADE' }]
  })),
  removeEvent: (id) => set((state) => ({
    events: state.events.filter((e) => e.id !== id)
  })),
}));
