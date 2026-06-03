import type { GameState } from '../types';
import { TIER_REQUIREMENTS } from '../../config/balanceConfig';

export const createMudSlice = (_set: (fn: (state: GameState) => Partial<GameState>) => void) => ({
  sourceTechPallet: () => _set((state) => {
    let cost = 100;
    if (state.marketType === 'RECESSION' || state.marketType === 'CRACKDOWN') {
      cost = cost * 1.2;
    }
    if (state.pl.bag < cost) return {};

    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag - cost,
        techInventory: {
          ...state.pl.techInventory,
          raw: state.pl.techInventory.raw + 1
        }
      }
    };
  }),

  repairTech: () => _set((state) => {
    if (state.pl.techInventory.raw <= 0) return {};
    return {
      pl: {
        ...state.pl,
        techInventory: {
          raw: state.pl.techInventory.raw - 1,
          refined: state.pl.techInventory.refined + 1
        },
        hustleFatigue: {
          ...state.pl.hustleFatigue,
          techFlip: (state.pl.hustleFatigue.techFlip || 0) + 15
        }
      }
    };
  }),

  sellTech: () => _set((state) => {
    if (state.pl.techInventory.refined <= 0) return {};
    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag + 350,
        techInventory: {
          ...state.pl.techInventory,
          refined: state.pl.techInventory.refined - 1
        }
      }
    };
  }),

  buyVintageStock: () => _set((state) => {
    const cost = 150;
    if (state.pl.bag < cost) return {};
    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag - cost,
        vintageInventoryValue: state.pl.vintageInventoryValue + 150
      }
    };
  }),

  recruitRunner: () => _set((state) => {
    const cost = 500;
    const cloutCost = 5;
    if (state.pl.bag < cost || state.pl.clout < cloutCost) return {};
    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag - cost,
        clout: state.pl.clout - cloutCost,
        runnerCount: state.pl.runnerCount + 1
      }
    };
  }),

  payRunnerBonus: () => _set((state) => {
    const cost = 200;
    if (state.pl.bag < cost) return {};
    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag - cost,
        runnerBurnout: false
      }
    };
  }),

  signSmmClient: () => _set((state) => {
    const cloutCost = 10;
    if (state.pl.clout < cloutCost) return {};
    return {
      pl: {
        ...state.pl,
        clout: state.pl.clout - cloutCost,
        clientCount: state.pl.clientCount + 1
      }
    };
  }),

  resolveClientCrisis: () => _set((state) => {
    const cloutCost = 5;
    if (state.pl.clout < cloutCost) return {};
    return {
      pl: {
        ...state.pl,
        clout: state.pl.clout - cloutCost,
        clientCrisis: false
      }
    };
  }),

  escapeTheMud: () => _set((state) => {
    const { cash: minBag, clout: minClout, aura: minAura, fee: leaseDeposit } = TIER_REQUIREMENTS.STREET;

    if (state.pl.bag < minBag || state.pl.clout < minClout || state.pl.aura < minAura) return {};

    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag - leaseDeposit,
        tier: 1
      },
      unlockedHustles: {
        ...state.unlockedHustles,
        r_labor: false,
        r_delivery: false,
        r_survey: false,
        r_plasma: false,
        r_scrap: false,
        cc: true,
        pod: true,
        music: true,
        drop: true,
        vintage: true,
        promo: true
      },
      news: ["GRADUATION: You've moved out of the basement and into a real HQ. The manual grind is behind you.", ...state.news]
    };
  }),
});
