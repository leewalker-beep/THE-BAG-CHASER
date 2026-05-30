import type { GameState } from '../types';
import { applyAdvancement } from '../engine';

export const createStartupSlice = (set: (fn: (state: GameState) => Partial<GameState>) => void) => ({
  runSaasMvp: () =>
    set((state) => {
      const cost = 5000;
      if (state.pl.bag < cost) return {};

      const next: GameState = {
        ...state,
        pl: {
          ...state.pl,
          bag: state.pl.bag - cost,
          clout: Math.min(state.pl.maxClout, state.pl.clout + 2500),
          aura: Math.min(state.pl.maxAura, state.pl.aura + 10),
          mentalHealth: Math.max(0, state.pl.mentalHealth - 15),
          startupStats: {
            ...state.pl.startupStats,
            saasUsers: state.pl.startupStats.saasUsers + 500,
          },
        },
        news: ["SaaS MVP: Server upkeep paid. Users are onboarding and the cloud is scaling.", ...state.news],
      };
      return applyAdvancement(next, 1);
    }),

  runAgencyScale: () =>
    set((state) => {
      if (state.pl.clout < 40) {
        return {
          news: ["AGENCY: You don't have enough clout (need 40) to attract high-value clients.", ...state.news]
        };
      }

      const next: GameState = {
        ...state,
        pl: {
          ...state.pl,
          bag: state.pl.bag + 6500,
          clout: Math.min(state.pl.maxClout, state.pl.clout + 50),
          startupStats: {
            ...state.pl.startupStats,
            agencyStaff: state.pl.startupStats.agencyStaff + 1,
          },
        },
        news: ["AGENCY SCALE: Signed a retainer and hired a new account manager. Cash flowing.", ...state.news],
      };
      return applyAdvancement(next, 1);
    }),

  runEcomBrand: () =>
    set((state) => {
      const manufacturingCost = 2500;
      if (state.pl.bag < manufacturingCost) return {};

      const next: GameState = {
        ...state,
        pl: {
          ...state.pl,
          bag: state.pl.bag - manufacturingCost + 9000,
          clout: Math.min(state.pl.maxClout, state.pl.clout + 30),
          startupStats: {
            ...state.pl.startupStats,
            ecomOrders: state.pl.startupStats.ecomOrders + 200,
          },
        },
        news: ["ECOM BRAND: Bulk manufacturing run complete. Sales are flooding the dashboard.", ...state.news],
      };
      return applyAdvancement(next, 1);
    }),
});
