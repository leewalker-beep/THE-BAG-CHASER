import type { GameState } from '../types';
import { applyAdvancement } from '../engine';

export const createStreetSlice = (_set: (fn: (state: GameState) => Partial<GameState>) => void) => ({
  setSwInput: (field: string, value: any) => _set((state) => ({
    pl: {
      ...state.pl,
      swPanelState: {
        ...state.pl.swPanelState,
        [field]: value
      }
    }
  })),

  executeStreetwearDrop: () => _set((state) => {
    const { selectedBatchSize, selectedQuality, retailPrice } = state.pl.swPanelState;

    // 1. Calculate Sourcing Cost
    const qualityCosts = {
      'BUDGET': 10,
      'PREMIUM': 30,
      'LUXURY': 70
    };
    const unitCost = qualityCosts[selectedQuality];
    const totalManufacturingCost = selectedBatchSize * unitCost;

    // 2. Validate Capital
    if (state.pl.bag < totalManufacturingCost) {
      return {
        news: [`INSUFFICIENT FUNDS: Need $${totalManufacturingCost.toLocaleString()} for this drop production.`, ...state.news]
      };
    }

    // 3. Deduct Manufacturing Cost
    let nextBag = state.pl.bag - totalManufacturingCost;

    // 4. Calculate Hype Demand Ratio
    const qualityModifiers = {
      'BUDGET': 1.0,
      'PREMIUM': 1.3,
      'LUXURY': 1.8
    };
    const qualityModifier = qualityModifiers[selectedQuality];

    // Demand Ratio Formula = ((pl.clout * 2) + pl.aura) / (retailPrice * qualityModifier)
    let demandRatio = ((state.pl.clout * 2) + state.pl.aura) / (retailPrice * qualityModifier);
    demandRatio = Math.min(1.0, Math.max(0.0, demandRatio));

    // 5. Crunch Sales Volume
    const unitsSold = Math.floor(selectedBatchSize * demandRatio);
    const unitsBricked = selectedBatchSize - unitsSold;

    // 6. Calculate Financials & Stat Yields
    let grossRevenue = unitsSold * retailPrice;

    let cloutReward = Math.floor(unitsSold * 0.2);
    if (state.pl.crises.shadowbanTurns > 0) {
      cloutReward = Math.floor(cloutReward * 0.5);
    }
    let auraReward = 0;
    if (selectedQuality === 'LUXURY') auraReward = Math.floor(unitsSold * 0.5);
    else if (selectedQuality === 'PREMIUM') auraReward = Math.floor(unitsSold * 0.1);

    // 7. Manage Upgrades (Hustle Level tracking modifier)
    const currentLvl = state.pl.hustleLevels['drop'] || 1;
    const levelMultipliers: Record<number, number> = {
      1: 1.0,
      2: 1.8,
      3: 3.5
    };
    const multiplier = levelMultipliers[currentLvl] || 1.0;
    grossRevenue *= multiplier;

    // 8. Update State
    const nextPl = {
      ...state.pl,
      bag: nextBag + grossRevenue,
      clout: Math.min(state.pl.maxClout, state.pl.clout + cloutReward),
      aura: Math.min(state.pl.maxAura, state.pl.aura + auraReward),
      swPanelState: {
        ...state.pl.swPanelState,
        warehouseBrickedStock: state.pl.swPanelState.warehouseBrickedStock + unitsBricked
      },
      swCooldownTurns: 3 // Standard drop cooldown
    };

    const summaryMessage = `DROP SUMMARY: ${selectedQuality} Drop of ${selectedBatchSize} units. Sold ${unitsSold} @ $${retailPrice} (${(demandRatio * 100).toFixed(1)}% Demand). Revenue: $${grossRevenue.toLocaleString()}. Bricked: ${unitsBricked}.`;

    const nextState: GameState = {
      ...state,
      pl: nextPl,
      news: [summaryMessage, ...state.news]
    };

    // 9. Automatically trigger advancement
    return applyAdvancement(nextState, 1);
  }),
});
