import type { GameState } from '../types';
import { applyAdvancement } from '../engine';

export const createStreetSlice = (set: (fn: (state: GameState) => Partial<GameState>) => void) => ({
  runCreatorContent: () =>
    set((state) => {
      const cost = 400;
      if (state.pl.bag < cost) return {};

      const next: GameState = {
        ...state,
        pl: {
          ...state.pl,
          bag: state.pl.bag - cost,
          clout: Math.min(state.pl.maxClout, state.pl.clout + 100),
          aura: Math.min(state.pl.maxAura, state.pl.aura + 10),
          streetStats: {
            ...state.pl.streetStats,
            ccSubs: state.pl.streetStats.ccSubs + 1000,
          },
        },
        news: ["CONTENT DROP: Produced a viral set of clips. Subscribers up!", ...state.news],
      };
      return applyAdvancement(next, 1);
    }),

  runPodcastSyndicate: () =>
    set((state) => {
      const cost = 200;
      if (state.pl.bag < cost) return {};

      const next: GameState = {
        ...state,
        pl: {
          ...state.pl,
          bag: state.pl.bag - cost + 1500,
          clout: Math.min(state.pl.maxClout, state.pl.clout + 30),
          aura: Math.min(state.pl.maxAura, state.pl.aura + 25),
          streetStats: {
            ...state.pl.streetStats,
            podEpisodes: state.pl.streetStats.podEpisodes + 1,
          },
        },
        news: ["PODCAST: Episode recorded and syndicated. Sponsors paid out.", ...state.news],
      };
      return applyAdvancement(next, 1);
    }),

  runMusicSyndicate: () =>
    set((state) => {
      const cost = 1000;
      if (state.pl.bag < cost) return {};

      const next: GameState = {
        ...state,
        pl: {
          ...state.pl,
          bag: state.pl.bag - cost,
          streetStats: {
            ...state.pl.streetStats,
            audioTracks: state.pl.streetStats.audioTracks + 1,
          },
        },
        news: ["STUDIO SESSION: New track uploaded. Royalties will start flowing.", ...state.news],
      };
      return applyAdvancement(next, 1);
    }),

  runDripLabel: () =>
    set((state) => {
      const cost = 1500;
      if (state.pl.bag < cost) return {};

      const next: GameState = {
        ...state,
        pl: {
          ...state.pl,
          bag: state.pl.bag - cost + 4000,
          clout: Math.min(state.pl.maxClout, state.pl.clout + 50),
          streetStats: {
            ...state.pl.streetStats,
            dripStock: state.pl.streetStats.dripStock + 10,
          },
        },
        news: ["DRIP DROP: Manufacturing complete. The streets are wearing your logo.", ...state.news],
      };
      return applyAdvancement(next, 1);
    }),

  runNightPromo: () =>
    set((state) => {
      const cashBurst = Math.floor(Math.random() * (5000 - 3000 + 1)) + 3000;
      const next: GameState = {
        ...state,
        pl: {
          ...state.pl,
          bag: state.pl.bag + cashBurst,
          aura: Math.min(state.pl.maxAura, state.pl.aura + 80),
          heat: Math.min(100, state.pl.heat + 25),
          mentalHealth: Math.max(0, state.pl.mentalHealth - 30),
        },
        news: [`NIGHT PROMO: Hosted a wild event. Bagged $${cashBurst} but the lifestyle is taking a toll.`, ...state.news],
      };
      return applyAdvancement(next, 1);
    }),

  runMemeDev: () =>
    set((state) => {
      const cost = 2000;
      if (state.pl.bag < cost) return {};

      const successChance = 0.60;
      const roll = Math.random();

      let next: GameState;
      if (roll < successChance) {
        next = {
          ...state,
          pl: {
            ...state.pl,
            bag: state.pl.bag - cost + 6000,
            streetStats: {
              ...state.pl.streetStats,
              activeMemeTokens: state.pl.streetStats.activeMemeTokens + 1,
            },
          },
          news: ["MEME COIN: To the moon! You cashed out before the dip.", ...state.news],
        };
      } else {
        next = {
          ...state,
          pl: {
            ...state.pl,
            bag: state.pl.bag - cost,
            aura: Math.max(0, state.pl.aura - 20),
          },
          news: ["MEME COIN: Rug-pulled! You lost the LP seeding and your reputation took a hit.", ...state.news],
        };
      }
      return applyAdvancement(next, 1);
    }),
});
