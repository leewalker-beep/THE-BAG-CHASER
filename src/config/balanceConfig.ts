export const TIER_REQUIREMENTS: Record<string, { cash: number, clout: number, aura: number, fee: number, description: string }> = {
  STREET: { cash: 5000, clout: 20, aura: 20, fee: 3000, description: "HQ Lease & Street Cred" },
  STARTUP: { cash: 15000, clout: 50, aura: 50, fee: 5000, description: "Startup Incorporation" },
  CORPORATE: { cash: 100000, clout: 100, aura: 100, fee: 25000, description: "Institutional Compliance" },
  ELITE: { cash: 5000000, clout: 200, aura: 200, fee: 1000000, description: "Sovereign Elite Syndicate" },
};

export const UNFREEZE_COST = 5000;

export const HUSTLE_BALANCE = {
  audio: {
    studioOwnedProductionCost: 500
  },
  r_labor: {
    level2: {
      baseCosts: { STUDIO: 50000, DUPLEX: 75000, LOFT: 100000 } as Record<string, number>,
      budgetMults: { ECONOMY: 1, PREMIUM: 1.2, LUXURY: 1.5 } as Record<string, number>,
      cloutReq: 40,
    },
    level3: {
      cost: 1500000,
      cloutReq: 100,
      auraReq: 100
    }
  },
  r_delivery: {
    level2: {
      fleetCosts: { 'E-BIKE': 15000, SPRINTER: 40000, FREIGHT: 85000 } as Record<string, number>,
      cloutReq: 40
    },
    level3: {
      cost: 2000000,
      cloutReq: 150,
      auraReq: 100
    }
  },
  vintage: {
    tiers: {
      'UNDERGROUND_IP': { cost: 500, clReq: 0, auReq: 0 },
      'SOHO_STORE': { cost: 8000, clReq: 40, auReq: 30 },
      'PARIS_RUNWAY': { cost: 35000, clReq: 80, auReq: 60 }
    } as Record<string, { cost: number, clReq: number, auReq: number }>
  },
  saas_mvp: {
    infraCosts: { AWS: 500, DEVOPS: 2000, ENTERPRISE: 6000 } as Record<string, number>
  },
  festival: {
    venueCosts: { TOUR: 50000, CIRCUIT: 150000, SATURATION: 500000 } as Record<string, number>,
    insuranceFee: 25000
  },
  ecom_brand: {
    runSizeCosts: {
      5000: 50000,
      25000: 200000
    } as Record<number, number>,
    DEFAULT_RUN_SIZE_COST: 200000
  },
  agency_scale: {
    clientYields: { SMB: 3000, MID: 9000, ENTERPRISE: 25000 } as Record<string, number>,
    freelancerCostMult: 0.5
  },
  global_franchise: {
    baseSetupCosts: { FAST_FOOD: 10000, WELLNESS: 25000, LOGISTICS: 65000 } as Record<string, number>
  }
};
