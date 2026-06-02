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
  checkAndTriggerVFX: (prevBag: number, nextBag: number, hintType?: VFXType) => void;
}

const MILESTONES = [10000, 100000, 1000000, 10000000];

export const useJuiceStore = create<JuiceState>((set, get) => ({
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
  checkAndTriggerVFX: (prevBag, nextBag, hintType) => {
    const diff = nextBag - prevBag;
    const absDiff = Math.abs(diff);
    const percentChange = prevBag > 0 ? absDiff / prevBag : 0;

    const milestoneCrossed = MILESTONES.some(m =>
      (prevBag < m && nextBag >= m) || (prevBag >= m && nextBag < m)
    );

    // Strictly lock VFX to significant moves only
    if (percentChange > 0.3 || milestoneCrossed) {
      if (hintType === 'SURGE' || (diff > 0 && !hintType)) {
        get().triggerSurge();
      } else if (hintType === 'CASCADE' || (diff < 0 && !hintType)) {
        get().triggerCascade();
      }
    }
  }
}));
