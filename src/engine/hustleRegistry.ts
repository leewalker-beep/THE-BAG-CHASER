export interface HustleConfig {
  id: string;
  tier: 'MUD' | 'STREET' | 'STARTUP' | 'CORPORATE' | 'ELITE' | 'MOGUL' | 'PRESIDENT' | 'OPEN';
  name: string;
  description: string;
  upfrontCost: number;
  cloutReq: number;
  yieldCash: number;
  yieldClout: number;
  yieldAura: number;
  hitMental: number;
  hitHeat: number;
  fatigueCost: number;
  isPassive: boolean;
  icon?: string;
  passiveYieldModifier?: string; // For special conditional handling like REIT or Audio track passive checks
}

export const MASTER_HUSTLE_REGISTRY: HustleConfig[] = [
  // --- TIER 0: THE MUD ---
  { id: 'labor', tier: 'MUD', name: 'Manual Labor Grind', description: 'Trade intense physical time for quick legal cash.', upfrontCost: 0, cloutReq: 0, yieldCash: 750, yieldClout: 0, yieldAura: 0, hitMental: -5, hitHeat: 0, fatigueCost: 40, isPassive: false, icon: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03c2.09-.13 3.75-1.85 3.75-3.97V22h2.5v-9.03c2.09-.13 3.75-1.85 3.75-3.97V2h-2v7z' },
  { id: 'delivery', tier: 'MUD', name: 'App Delivery Gigs', description: 'Run local restaurant courier logistics routes.', upfrontCost: 0, cloutReq: 0, yieldCash: 650, yieldClout: 0, yieldAura: 0, hitMental: -3, hitHeat: 0, fatigueCost: 25, isPassive: false },
  { id: 'survey', tier: 'MUD', name: 'Safe Online Surveys', description: 'Low-risk digital data entry safety net.', upfrontCost: 0, cloutReq: 0, yieldCash: 520, yieldClout: 0, yieldAura: 0, hitMental: -1, hitHeat: 0, fatigueCost: 0, isPassive: false },
  { id: 'plasma', tier: 'MUD', name: 'Sell Medical Plasma', description: 'Fast immediate liquidity at high bodily costs.', upfrontCost: 0, cloutReq: 0, yieldCash: 900, yieldClout: 0, yieldAura: -15, hitMental: -25, hitHeat: 0, fatigueCost: 0, isPassive: false },
  { id: 'drop', tier: 'MUD', name: 'Viral Dropshipping', description: 'Flip factory items overseas via short-form ads.', upfrontCost: 500, cloutReq: 0, yieldCash: 2500, yieldClout: 10, yieldAura: 0, hitMental: -8, hitHeat: 0, fatigueCost: 20, isPassive: false },
  { id: 'techFlip', tier: 'MUD', name: 'Hardware Refurbishing', description: 'Repair and resell broken localized consumer electronics.', upfrontCost: 300, cloutReq: 0, yieldCash: 1200, yieldClout: 5, yieldAura: 2, hitMental: -8, hitHeat: 0, fatigueCost: 15, isPassive: false },
  { id: 'vintage', tier: 'MUD', name: 'Vintage Resale', description: 'Sourcing and flipping high-value thrifted garments.', upfrontCost: 500, cloutReq: 5, yieldCash: 1500, yieldClout: 10, yieldAura: 5, hitMental: -5, hitHeat: 0, fatigueCost: 10, isPassive: false },
  { id: 'smm', tier: 'MUD', name: 'SMM Agency', description: 'Managing social accounts for local small businesses.', upfrontCost: 0, cloutReq: 10, yieldCash: 2000, yieldClout: 15, yieldAura: 5, hitMental: -12, hitHeat: 0, fatigueCost: 20, isPassive: false },
  { id: 'gig', tier: 'MUD', name: 'Gig Fleet', description: 'Managing a small fleet of delivery runners.', upfrontCost: 2000, cloutReq: 15, yieldCash: 3500, yieldClout: 20, yieldAura: 10, hitMental: -20, hitHeat: 5, fatigueCost: 30, isPassive: false },
  { id: 'sw', tier: 'MUD', name: 'Streetwear Drop', description: 'Limited run apparel for the culture.', upfrontCost: 1000, cloutReq: 20, yieldCash: 4500, yieldClout: 30, yieldAura: 20, hitMental: -10, hitHeat: 2, fatigueCost: 15, isPassive: false },

  // --- TIER 1: STREET ---
  { id: 'cc', tier: 'STREET', name: 'Creator Content', description: 'Produce viral clips and build a loyal following.', upfrontCost: 400, cloutReq: 25, yieldCash: 0, yieldClout: 100, yieldAura: 10, hitMental: -10, hitHeat: 5, fatigueCost: 20, isPassive: false },
  { id: 'pod', tier: 'STREET', name: 'Podcast Syndicate', description: 'Host deep-dive conversations with industry figures.', upfrontCost: 200, cloutReq: 40, yieldCash: 1500, yieldClout: 30, yieldAura: 25, hitMental: -5, hitHeat: 2, fatigueCost: 10, isPassive: false },
  { id: 'music', tier: 'STREET', name: 'Music Syndicate', description: 'Produce and distribute tracks to major platforms.', upfrontCost: 1000, cloutReq: 50, yieldCash: 0, yieldClout: 50, yieldAura: 40, hitMental: -15, hitHeat: 10, fatigueCost: 25, isPassive: true, passiveYieldModifier: 'AUDIO_TRACKS' },
  { id: 'drip', tier: 'STREET', name: 'Drip Label', description: 'High-end streetwear manufacturing and retail.', upfrontCost: 1500, cloutReq: 60, yieldCash: 4000, yieldClout: 50, yieldAura: 30, hitMental: -12, hitHeat: 5, fatigueCost: 15, isPassive: false },
  { id: 'promo', tier: 'STREET', name: 'Night Promo', description: 'Hosting exclusive high-stakes nightlife events.', upfrontCost: 0, cloutReq: 80, yieldCash: 4000, yieldClout: 100, yieldAura: 80, hitMental: -30, hitHeat: 25, fatigueCost: 50, isPassive: false },
  { id: 'meme', tier: 'STREET', name: 'Meme Dev', description: 'Deploying and marketing speculative crypto assets.', upfrontCost: 2000, cloutReq: 50, yieldCash: 6000, yieldClout: 20, yieldAura: -20, hitMental: -20, hitHeat: 40, fatigueCost: 10, isPassive: false },

  // --- TIER 2: STARTUP ---
  { id: 'saas_mvp', tier: 'STARTUP', name: 'SaaS MVP', description: 'Build and scale a software-as-a-service platform.', upfrontCost: 5000, cloutReq: 100, yieldCash: 0, yieldClout: 2500, yieldAura: 10, hitMental: -15, hitHeat: 0, fatigueCost: 20, isPassive: false },
  { id: 'agency_scale', tier: 'STARTUP', name: 'Agency Scale', description: 'Expanding a service business with full-time staff.', upfrontCost: 0, cloutReq: 150, yieldCash: 6500, yieldClout: 50, yieldAura: 20, hitMental: -20, hitHeat: 5, fatigueCost: 25, isPassive: false },
  { id: 'ecom_brand', tier: 'STARTUP', name: 'Ecom Brand', description: 'Full-scale direct-to-consumer product empire.', upfrontCost: 2500, cloutReq: 120, yieldCash: 9000, yieldClout: 30, yieldAura: 15, hitMental: -10, hitHeat: 2, fatigueCost: 15, isPassive: false },

  // --- TIER 3: CORPORATE ---
  { id: 'consultant', tier: 'CORPORATE', name: 'Strategy Consultant', description: 'High-level advisory for Fortune 500 firms.', upfrontCost: 10000, cloutReq: 500, yieldCash: 25000, yieldClout: 200, yieldAura: 50, hitMental: -25, hitHeat: 0, fatigueCost: 30, isPassive: false },
  { id: 'equity_trader', tier: 'CORPORATE', name: 'Equity Trader', description: 'Leveraging capital in the public markets.', upfrontCost: 50000, cloutReq: 300, yieldCash: 40000, yieldClout: 100, yieldAura: 20, hitMental: -40, hitHeat: 15, fatigueCost: 40, isPassive: false },

  // --- TIER 5: ELITE ---
  { id: 'venture_capital', tier: 'ELITE', name: 'Venture Capital', description: 'Funding the next generation of unicorns.', upfrontCost: 250000, cloutReq: 1000, yieldCash: 150000, yieldClout: 500, yieldAura: 200, hitMental: -20, hitHeat: 10, fatigueCost: 10, isPassive: true },

  // --- TIER 6: MOGUL ---
  { id: 'real_estate_empire', tier: 'MOGUL', name: 'Real Estate Empire', description: 'Acquiring city blocks and commercial hubs.', upfrontCost: 1000000, cloutReq: 5000, yieldCash: 500000, yieldClout: 1000, yieldAura: 500, hitMental: -15, hitHeat: 20, fatigueCost: 5, isPassive: true },

  // --- TIER 8: PRESIDENT ---
  { id: 'policy_flip', tier: 'PRESIDENT', name: 'Policy Influence', description: 'Shaping national legislation for profit.', upfrontCost: 5000000, cloutReq: 20000, yieldCash: 2000000, yieldClout: 5000, yieldAura: 1000, hitMental: -50, hitHeat: 50, fatigueCost: 60, isPassive: false },

  // --- TIER 9: OPEN ---
  { id: 'global_index', tier: 'OPEN', name: 'Global Index', description: 'Owning the majority share of world production.', upfrontCost: 25000000, cloutReq: 100000, yieldCash: 10000000, yieldClout: 20000, yieldAura: 5000, hitMental: -10, hitHeat: 10, fatigueCost: 0, isPassive: true },
];
