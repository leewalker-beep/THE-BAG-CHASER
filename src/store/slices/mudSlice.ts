import type { GameState } from '../types';

export const createMudSlice = (set: (fn: (state: GameState) => Partial<GameState>) => void) => ({
  rLabor: () => set((state) => {
    if (!state.unlockedHustles.labor) return {};
    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag + 50,
        hustleFatigue: {
          ...state.pl.hustleFatigue,
          labor: state.pl.hustleFatigue.labor + 15
        }
      }
    };
  }),

  rDelivery: () => set((state) => {
    if (!state.unlockedHustles.delivery) return {};
    const reward = Math.floor(Math.random() * (45 - 25 + 1)) + 25;
    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag + reward,
        hustleFatigue: {
          ...state.pl.hustleFatigue,
          delivery: state.pl.hustleFatigue.delivery + 10
        }
      }
    };
  }),

  rSurvey: () => set((state) => {
    if (!state.unlockedHustles.survey) return {};
    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag + 5
      }
    };
  }),

  rPlasma: () => set((state) => {
    if (!state.unlockedHustles.plasma || state.pl.plasmaUsedThisMonth) return {};
    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag + 300,
        mentalHealth: state.pl.mentalHealth - 25,
        aura: state.pl.aura - 15,
        plasmaUsedThisMonth: true
      }
    };
  }),

  rTechFlip: () => {},
  rVintage: () => {},
  rSmm: () => {},
  rGig: () => {},
  rSw: () => {},
  rDrop: () => {},
});
