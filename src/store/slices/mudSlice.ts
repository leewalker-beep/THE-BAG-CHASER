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

  rTechFlip: () => set((state) => {
    // Placeholder for common tech flip logic if needed,
    // but the sub-actions handle the state mutations.
    return {};
  }),

  rVintage: () => set(() => ({})),
  rSmm: () => set(() => ({})),
  rGig: () => set(() => ({})),

  rSw: () => set((state) => {
    if (state.pl.swCooldownTurns > 0) return {};

    const isRecession = state.marketType === 'RECESSION';
    const lowAura = state.pl.aura < 30;

    if (isRecession || lowAura) {
      // Failure
      return {
        pl: {
          ...state.pl,
          bag: state.pl.bag - 400,
          clout: Math.max(0, state.pl.clout - 15),
          swCooldownTurns: 3
        },
        news: [`FLASH DROP FAILED: ${isRecession ? 'Market recession killed the hype.' : 'Your aura is too low to carry the drop.'}`, ...state.news]
      };
    }

    // Success
    const yieldAmount = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag + yieldAmount,
        clout: Math.min(state.pl.maxClout, state.pl.clout + 10),
        aura: Math.min(state.pl.maxAura, state.pl.aura + 15),
        swCooldownTurns: 3
      },
      news: [`FLASH DROP SUCCESS: Bagged $${yieldAmount} and major cultural clout.`, ...state.news]
    };
  }),

  rDrop: () => set((state) => {
    // Shared cooldown with Streetwear drops as per plan
    if (state.pl.swCooldownTurns > 0) return {};

    const isRecession = state.marketType === 'RECESSION';
    const lowAura = state.pl.aura < 30;

    if (isRecession || lowAura) {
      // Failure
      return {
        pl: {
          ...state.pl,
          bag: state.pl.bag - 400,
          clout: Math.max(0, state.pl.clout - 15),
          swCooldownTurns: 3
        },
        news: [`DROPSHIP CAMPAIGN FAILED: ${isRecession ? 'Consumer spending is at zero.' : 'Your personal brand lacks the aura for conversion.'}`, ...state.news]
      };
    }

    // Success
    const yieldAmount = Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000;
    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag + yieldAmount,
        clout: Math.min(state.pl.maxClout, state.pl.clout + 10),
        aura: Math.min(state.pl.maxAura, state.pl.aura + 15),
        swCooldownTurns: 3
      },
      news: [`DROPSHIP CAMPAIGN SUCCESS: Viral product move! +$${yieldAmount}`, ...state.news]
    };
  }),

  sourceTechPallet: () => set((state) => {
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

  repairTech: () => set((state) => {
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
          techFlip: state.pl.hustleFatigue.techFlip + 15
        }
      }
    };
  }),

  sellTech: () => set((state) => {
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

  buyVintageStock: () => set((state) => {
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

  recruitRunner: () => set((state) => {
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

  payRunnerBonus: () => set((state) => {
    // Assuming some cash cost for bonus to reset burnout
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

  signSmmClient: () => set((state) => {
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

  resolveClientCrisis: () => set((state) => {
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

  escapeTheMud: () => set((state) => {
    const minBag = 5000;
    const minClout = 20;
    const minAura = 20;
    const leaseDeposit = 3000;

    if (state.pl.bag < minBag || state.pl.clout < minClout || state.pl.aura < minAura) return {};

    return {
      pl: {
        ...state.pl,
        bag: state.pl.bag - leaseDeposit,
        tier: 1
      },
      unlockedHustles: {
        ...state.unlockedHustles,
        labor: false,
        delivery: false
      },
      news: ["GRADUATION: You've moved out of the basement and into a real HQ. The manual grind is behind you.", ...state.news]
    };
  }),
});
