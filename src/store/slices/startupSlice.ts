import { applyAdvancement } from '../engine';
import type { GameState } from '../types';

export const createStartupSlice = (set: (fn: (state: GameState) => Partial<GameState>) => void) => ({
  setSaaSInput: (field: string, value: any) => set((state) => ({
    pl: {
      ...state.pl,
      saasPanel: { ...state.pl.saasPanel, [field]: value }
    }
  })),

  executeSaaSProject: () => set((state) => {
    const { infra, focus, subscriptionPrice } = state.pl.saasPanel;
    const infraCosts = { AWS: 500, DEVOPS: 2000, ENTERPRISE: 6000 };
    const cost = infraCosts[infra];

    if (state.pl.bag < cost) {
      return { news: [`INSUFFICIENT FUNDS: Need $${cost.toLocaleString()} for SaaS infrastructure.`, ...state.news] };
    }

    let outageRisk = 0;
    if (focus === 'GROWTH') {
      if (infra === 'AWS') outageRisk = 0.5;
      else if (infra === 'DEVOPS') outageRisk = 0.2;
    }

    const isOutage = Math.random() < outageRisk;
    const currentNews = [...state.news];
    let yieldCash = 0;
    let yieldClout = 0;
    let hitMental = -15;
    const nextStartupStats = { ...state.pl.startupStats };

    if (isOutage) {
      yieldClout = -15;
      currentNews.unshift(`DATABASE COLLAPSE: Your ${infra} stack couldn't handle the growth. Users churned.`);
    } else {
      const growthMult = focus === 'GROWTH' ? 2 : 1;
      const newUsers = Math.floor(state.pl.clout * 10 * growthMult);
      nextStartupStats.saasUsers += newUsers;

      const currentLevel = state.pl.hustleLevels['saas_mvp'] || 1;
      yieldCash = nextStartupStats.saasUsers * subscriptionPrice * currentLevel;
      yieldClout = 50;
      currentNews.unshift(`SUCCESS: SaaS platform scaled. Added ${newUsers.toLocaleString()} users. Revenue: $${yieldCash.toLocaleString()}.`);
    }

    const nextState = {
      ...state,
      pl: {
        ...state.pl,
        bag: state.pl.bag - cost + yieldCash,
        clout: Math.max(0, state.pl.clout + yieldClout),
        mentalHealth: Math.max(0, state.pl.mentalHealth + hitMental),
        startupStats: nextStartupStats
      },
      news: currentNews
    };

    return applyAdvancement(nextState as GameState, 1);
  }),

  setFestivalInput: (field: string, value: any) => set((state) => ({
    pl: {
      ...state.pl,
      festivalPanel: { ...state.pl.festivalPanel, [field]: value }
    }
  })),

  executeConcertFestival: () => set((state) => {
    const { venue, insured, ticketPrice } = state.pl.festivalPanel;
    const venueCosts = { TOUR: 50000, CIRCUIT: 150000, SATURATION: 500000 };
    const insuranceCost = 25000;
    const totalUpfront = venueCosts[venue] + (insured ? insuranceCost : 0);

    if (state.pl.bag < totalUpfront) {
      return { news: [`INSUFFICIENT FUNDS: Need $${totalUpfront.toLocaleString()} for circuit booking.`, ...state.news] };
    }

    const isSuccess = Math.random() < 0.75;
    const currentNews = [...state.news];
    let finalYieldCash = 0;
    let finalYieldAura = 0;
    let finalHitMental = -35;
    const nextPl = { ...state.pl };

    if (isSuccess) {
      const capacities = { TOUR: 50000, CIRCUIT: 250000, SATURATION: 1000000 };
      const demandScore = state.pl.aura / (ticketPrice / 10); // Scaled for corporate aura
      const attendance = Math.min(capacities[venue], Math.floor(capacities[venue] * demandScore * 0.5));

      finalYieldCash = attendance * ticketPrice;

      if (state.pl.crises.laborStrikeTurns > 0) {
        finalYieldCash = 0;
        currentNews.unshift(`LABOR STRIKE: Global festival revenue halted by union action.`);
      }

      finalYieldAura = 150;
      currentNews.unshift(`CIRCUIT SUCCESS: ${attendance.toLocaleString()} fans attended! Domestic market saturated in ${venue}. Grossed $${finalYieldCash.toLocaleString()}.`);
    } else {
      currentNews.unshift(`HEADLINER BREACH: A key headliner canceled the circuit.`);
      if (insured) {
        const reimbursement = Math.floor(venueCosts[venue] * 0.8);
        nextPl.bag += reimbursement;
        currentNews.unshift(`INSURANCE: Global policy triggered. Recovered $${reimbursement.toLocaleString()} in damages.`);
      } else {
        finalYieldAura = -40;
        currentNews.unshift(`DISASTER: No coverage. Total capital loss and massive reputational hit.`);
      }
    }

    const nextState = {
      ...state,
      pl: {
        ...nextPl,
        bag: nextPl.bag - totalUpfront + finalYieldCash,
        aura: Math.max(0, nextPl.aura + finalYieldAura),
        mentalHealth: Math.max(0, nextPl.mentalHealth + finalHitMental),
      },
      news: currentNews
    };

    return applyAdvancement(nextState as GameState, 1);
  }),

  setEcomBrandInput: (field: string, value: any) => set((state) => ({
    pl: {
      ...state.pl,
      ecomBrandPanel: { ...state.pl.ecomBrandPanel, [field]: value }
    }
  })),

  executeEcomBrand: () => set((state) => {
    const { runSize, adSpend } = state.pl.ecomBrandPanel;
    const baseCost = runSize === 5000 ? 50000 : 200000;
    const totalCost = baseCost + adSpend;

    if (state.pl.bag < totalCost) {
      return { news: [`INSUFFICIENT FUNDS: Need $${totalCost.toLocaleString()} for conglomerate operations.`, ...state.news] };
    }

    const isSeizure = Math.random() < 0.15;
    const currentNews = [...state.news];
    const nextCrises = { ...state.pl.crises };
    let yieldCash = 0;
    const nextStartupStats = { ...state.pl.startupStats };

    if (isSeizure) {
      nextCrises.deadstockOverhead += 2000;
      currentNews.unshift(`SUPPLY CHAIN WARFARE: Global trade embargo destroyed your container ships. Deadstock overhead increased.`);
    } else {
      const conversions = Math.min(runSize, Math.floor((adSpend / 10 + state.pl.clout * 100) * (runSize / 5000)));
      yieldCash = conversions * 125; // High-margin corporate profit

      if (state.pl.crises.laborStrikeTurns > 0) {
        yieldCash = 0;
        currentNews.unshift(`LABOR STRIKE: Conglomerate warehouse automation halted by union action.`);
      }

      nextStartupStats.ecomOrders += conversions;
      currentNews.unshift(`CONGLOMERATE SUCCESS: Generated ${conversions.toLocaleString()} high-margin orders. Net profit: $${yieldCash.toLocaleString()}.`);
    }

    const nextState = {
      ...state,
      pl: {
        ...state.pl,
        bag: state.pl.bag - totalCost + yieldCash,
        startupStats: nextStartupStats,
        crises: nextCrises,
        mentalHealth: Math.max(0, state.pl.mentalHealth - 10)
      },
      news: currentNews
    };

    return applyAdvancement(nextState as GameState, 1);
  }),

  setAgencyInput: (field: string, value: any) => set((state) => ({
    pl: {
      ...state.pl,
      agencyPanel: { ...state.pl.agencyPanel, [field]: value }
    }
  })),

  executeAgencyRetainer: () => set((state) => {
    const { client, staff } = state.pl.agencyPanel;
    const yields = { SMB: 3000, MID: 9000, ENTERPRISE: 25000 };
    const baseYield = yields[client];

    let successChance = staff === 'INTERNS' ? 0.6 : 0.95;
    let payrollCost = staff === 'FREELANCERS' ? baseYield * 0.5 : 0;

    if (state.pl.bag < payrollCost) {
      return { news: [`INSUFFICIENT FUNDS: Need $${payrollCost.toLocaleString()} to pay freelancers.`, ...state.news] };
    }

    const isSuccess = Math.random() < successChance;
    const currentNews = [...state.news];
    const nextCrises = { ...state.pl.crises };
    let finalYield = 0;
    const nextStartupStats = { ...state.pl.startupStats };

    if (isSuccess) {
      finalYield = baseYield;
      nextStartupStats.agencyStaff += (staff === 'FREELANCERS' ? 2 : 5);
      currentNews.unshift(`AGENCY SUCCESS: Secured the ${client} retainer. Staffing expanded.`);
    } else {
      nextCrises.accountsFrozen = true;
      currentNews.unshift(`LITIGATION: The ${client} client is suing for gross negligence. Accounts frozen.`);
    }

    const nextState = {
      ...state,
      pl: {
        ...state.pl,
        bag: state.pl.bag - payrollCost + finalYield,
        startupStats: nextStartupStats,
        crises: nextCrises,
        mentalHealth: Math.max(0, state.pl.mentalHealth - 20)
      },
      news: currentNews
    };

    return applyAdvancement(nextState as GameState, 1);
  }),
});
