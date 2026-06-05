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
  successChance: number;
  icon: string;
  passiveYieldModifier?: string; // For special conditional handling like REIT or Audio track passive checks
  miniGame?: 'chart_match' | 'tap_mine' | 'tic_tac_toe' | 'scene_cut' | 'hype_meter' | 'rocket_launch' | 'grant_sort' | 'pattern_match' | 'rate_balance' | 'heirloom_catch' | 'campaign_trail';
}

export const MASTER_HUSTLE_REGISTRY: HustleConfig[] = [
  // --- TIER 0: THE MUD ---
  { id: 'r_labor', tier: 'MUD', name: 'Manual Labor Grind', description: 'Trade intense physical time for quick legal cash.', upfrontCost: 0, cloutReq: 0, yieldCash: 2400, yieldClout: 0, yieldAura: 0, hitMental: -8, hitHeat: 0, fatigueCost: 40, isPassive: false, successChance: 1.0, icon: '💪' },
  { id: 'r_delivery', tier: 'MUD', name: 'App Delivery Gigs', description: 'Run local restaurant courier logistics routes.', upfrontCost: 0, cloutReq: 0, yieldCash: 2000, yieldClout: 2, yieldAura: 0, hitMental: -5, hitHeat: 0, fatigueCost: 25, isPassive: false, successChance: 1.0, icon: '🛵' },
  { id: 'r_survey', tier: 'MUD', name: 'Safe Online Surveys', description: 'Low-risk digital data entry safety net.', upfrontCost: 0, cloutReq: 0, yieldCash: 1200, yieldClout: 0, yieldAura: 0, hitMental: 3, hitHeat: 0, fatigueCost: 0, isPassive: false, successChance: 1.0, icon: '📝' },
  { id: 'r_plasma', tier: 'MUD', name: 'Sell Medical Plasma', description: 'Fast immediate liquidity at high bodily costs.', upfrontCost: 0, cloutReq: 0, yieldCash: 1500, yieldClout: 0, yieldAura: -5, hitMental: -12, hitHeat: 0, fatigueCost: 0, isPassive: false, successChance: 1.0, icon: '🩸' },
  { id: 'r_scrap', tier: 'MUD', name: 'Scrap & E-Waste Harvesting', description: 'Scavenge local metal and discarded electronics for recycling liquidation.', upfrontCost: 0, cloutReq: 0, yieldCash: 1800, yieldClout: 0, yieldAura: 3, hitMental: -3, hitHeat: 0, fatigueCost: 15, isPassive: false, successChance: 1.0, icon: '♻️' },
  { id: 'tech_flip', tier: 'MUD', name: 'Hardware Refurbishing', description: 'Repair and resell broken localized consumer electronics and micro-soldering lots.', upfrontCost: 300, cloutReq: 0, yieldCash: 2200, yieldClout: 5, yieldAura: 0, hitMental: 5, hitHeat: 0, fatigueCost: 15, isPassive: false, successChance: 0.85, icon: '🔧' },
  { id: 'r_gym_grind', tier: 'MUD', name: 'Local Gym & Sparring Grind', description: 'Sacrifice immediate earnings to build peak physical condition and local respect. Restores armor and focus.', upfrontCost: 50, cloutReq: 0, yieldCash: 0, yieldClout: 2, yieldAura: 25, hitMental: 10, hitHeat: 0, fatigueCost: 15, successChance: 1.0, isPassive: false, icon: '🥊' },

  // --- TIER 1: STREET ---
  { id: 'cc', tier: 'STREET', name: 'Creator Content', description: 'Produce viral clips and build a loyal following.', upfrontCost: 400, cloutReq: 25, yieldCash: 0, yieldClout: 100, yieldAura: 10, hitMental: -10, hitHeat: 5, fatigueCost: 20, isPassive: false, successChance: 0.9, icon: '🤳' },
  { id: 'pod', tier: 'STREET', name: 'Podcast Syndicate', description: 'Host deep-dive conversations with industry figures.', upfrontCost: 200, cloutReq: 40, yieldCash: 1500, yieldClout: 30, yieldAura: 25, hitMental: -5, hitHeat: 2, fatigueCost: 10, isPassive: false, successChance: 0.9, icon: '🎙️' },
  { id: 'audio', tier: 'STREET', name: 'Music Syndicate', description: 'Produce and distribute tracks to major platforms.', upfrontCost: 1000, cloutReq: 50, yieldCash: 0, yieldClout: 50, yieldAura: 40, hitMental: -15, hitHeat: 10, fatigueCost: 25, isPassive: true, successChance: 0.9, icon: '🎵', passiveYieldModifier: 'AUDIO_TRACKS' },
  { id: 'drop', tier: 'STREET', name: 'Viral Dropshipping', description: 'Flip factory items overseas via short-form ads.', upfrontCost: 500, cloutReq: 25, yieldCash: 2500, yieldClout: 10, yieldAura: 0, hitMental: -8, hitHeat: 0, fatigueCost: 20, isPassive: false, successChance: 0.9, icon: '📦' },
  { id: 'vintage', tier: 'STREET', name: 'Streetwear Drip Lab', description: 'Sourcing and flipping high-value thrifted garments.', upfrontCost: 500, cloutReq: 30, yieldCash: 1500, yieldClout: 10, yieldAura: 5, hitMental: -5, hitHeat: 0, fatigueCost: 10, isPassive: false, successChance: 0.9, icon: '👕' },
  { id: 'promo', tier: 'STREET', name: 'Underground Raves', description: 'Hosting exclusive high-stakes nightlife events.', upfrontCost: 0, cloutReq: 80, yieldCash: 4000, yieldClout: 100, yieldAura: 80, hitMental: -30, hitHeat: 25, fatigueCost: 50, isPassive: false, successChance: 0.9, icon: '🎉' },

  // --- TIER 2: STARTUP ---
  { id: 'techFlip', tier: 'STARTUP', name: 'Hardware Refurbishing', description: 'Repair and resell broken localized consumer electronics.', upfrontCost: 300, cloutReq: 0, yieldCash: 1200, yieldClout: 5, yieldAura: 2, hitMental: -8, hitHeat: 0, fatigueCost: 15, isPassive: false, successChance: 0.85, icon: '🔧' },
  { id: 'smm', tier: 'STARTUP', name: 'SMM Agency', description: 'Managing social accounts for local small businesses.', upfrontCost: 0, cloutReq: 10, yieldCash: 2000, yieldClout: 15, yieldAura: 5, hitMental: -12, hitHeat: 0, fatigueCost: 20, isPassive: false, successChance: 0.85, icon: '📱' },
  { id: 'gig', tier: 'STARTUP', name: 'Gig Fleet', description: 'Managing a small fleet of delivery runners.', upfrontCost: 2000, cloutReq: 15, yieldCash: 3500, yieldClout: 20, yieldAura: 10, hitMental: -20, hitHeat: 5, fatigueCost: 30, isPassive: false, successChance: 0.85, icon: '🚚' },
  { id: 'sw', tier: 'STARTUP', name: 'Streetwear Drop', description: 'Limited run apparel for the culture.', upfrontCost: 1000, cloutReq: 20, yieldCash: 4500, yieldClout: 30, yieldAura: 20, hitMental: -10, hitHeat: 2, fatigueCost: 15, isPassive: false, successChance: 0.85, icon: '🧢' },
  { id: 'drip', tier: 'STARTUP', name: 'Drip Label', description: 'High-end streetwear manufacturing and retail.', upfrontCost: 1500, cloutReq: 60, yieldCash: 4000, yieldClout: 50, yieldAura: 30, hitMental: -12, hitHeat: 5, fatigueCost: 15, isPassive: false, successChance: 0.85, icon: '💎' },
  { id: 'meme', tier: 'STARTUP', name: 'Meme Dev', description: 'Deploying and marketing speculative crypto assets.', upfrontCost: 2000, cloutReq: 50, yieldCash: 6000, yieldClout: 20, yieldAura: -20, hitMental: -20, hitHeat: 40, fatigueCost: 10, isPassive: false, successChance: 0.85, icon: '🐸' },
  { id: 'saas_mvp', tier: 'STARTUP', name: 'SaaS MVP', description: 'Build and scale a software-as-a-service platform.', upfrontCost: 5000, cloutReq: 100, yieldCash: 0, yieldClout: 2500, yieldAura: 10, hitMental: -15, hitHeat: 0, fatigueCost: 20, isPassive: false, successChance: 0.85, icon: '💻' },
  { id: 'agency_scale', tier: 'STARTUP', name: 'Agency Scale', description: 'Expanding a service business with full-time staff.', upfrontCost: 0, cloutReq: 150, yieldCash: 6500, yieldClout: 50, yieldAura: 20, hitMental: -20, hitHeat: 5, fatigueCost: 25, isPassive: false, successChance: 0.85, icon: '🏢' },
  { id: 'data_analytics', tier: 'STARTUP', name: 'Data Analytics Firm', description: 'Extracting actionable insights from corporate datasets.', upfrontCost: 5000, cloutReq: 40, yieldCash: 12000, yieldClout: 20, yieldAura: 10, hitMental: -15, hitHeat: 0, fatigueCost: 20, isPassive: false, successChance: 0.85, icon: '📊', miniGame: 'chart_match' },
  { id: 'crypto_mining', tier: 'STARTUP', name: 'Crypto Mining Rig', description: 'Optimizing hash rates for maximum digital yield.', upfrontCost: 8000, cloutReq: 30, yieldCash: 5000, yieldClout: 5, yieldAura: -10, hitMental: -5, hitHeat: 15, fatigueCost: 10, isPassive: false, successChance: 0.8, icon: '⛏️', miniGame: 'tap_mine' },
  { id: 'virtual_assistant_agency', tier: 'STARTUP', name: 'VA Agency', description: 'Outsourcing administrative tasks at scale.', upfrontCost: 3000, cloutReq: 50, yieldCash: 8000, yieldClout: 30, yieldAura: 20, hitMental: -12, hitHeat: 2, fatigueCost: 15, isPassive: false, successChance: 0.9, icon: '👩‍💼', miniGame: 'tic_tac_toe' },
  { id: 'ecom_brand', tier: 'CORPORATE', name: 'DTC Brand Conglomerate', description: 'Full-scale direct-to-consumer product empire.', upfrontCost: 110000, cloutReq: 110, yieldCash: 9000, yieldClout: 30, yieldAura: 15, hitMental: -10, hitHeat: 2, fatigueCost: 15, isPassive: false, successChance: 0.85, icon: '🏢' },
  { id: 'festival', tier: 'CORPORATE', name: 'Global Festival Circuit', description: 'Organize and promote a multi-day live music event.', upfrontCost: 85000, cloutReq: 100, yieldCash: 0, yieldClout: 500, yieldAura: 150, hitMental: -35, hitHeat: 10, fatigueCost: 50, isPassive: false, successChance: 0.75, icon: '🎪' },

  // --- TIER 3: CORPORATE ---
  { id: 'consultant', tier: 'CORPORATE', name: 'Strategy Consultant', description: 'High-level advisory for Fortune 500 firms.', upfrontCost: 10000, cloutReq: 500, yieldCash: 25000, yieldClout: 200, yieldAura: 50, hitMental: -25, hitHeat: 0, fatigueCost: 30, isPassive: false, successChance: 0.8, icon: '💼' },
  { id: 'equity_trader', tier: 'CORPORATE', name: 'Equity Trader', description: 'Leveraging capital in the public markets.', upfrontCost: 50000, cloutReq: 300, yieldCash: 40000, yieldClout: 100, yieldAura: 20, hitMental: -40, hitHeat: 15, fatigueCost: 40, isPassive: false, successChance: 0.8, icon: '📈' },
  { id: 'global_franchise', tier: 'CORPORATE', name: 'Global Franchise Syndicate', description: 'Scale an international network of highly optimized commercial locations and supply chains.', upfrontCost: 50000, cloutReq: 120, yieldCash: 0, yieldClout: 0, yieldAura: 0, hitMental: 0, hitHeat: 0, fatigueCost: 25, successChance: 0.85, icon: '🌍', isPassive: false },

  // --- TIER 5: ELITE ---
  { id: 'venture_capital', tier: 'ELITE', name: 'Venture Capital', description: 'Funding the next generation of unicorns.', upfrontCost: 250000, cloutReq: 1000, yieldCash: 150000, yieldClout: 500, yieldAura: 200, hitMental: -20, hitHeat: 10, fatigueCost: 10, isPassive: true, successChance: 0.75, icon: '🦄' },
  { id: 'film_studio', tier: 'ELITE', name: 'Film Studio', description: 'Producing high-impact cinematic experiences.', upfrontCost: 5000000, cloutReq: 2500, yieldCash: 2000000, yieldClout: 500, yieldAura: 300, hitMental: -40, hitHeat: 15, fatigueCost: 40, isPassive: false, successChance: 0.65, icon: '🎬', miniGame: 'scene_cut' },
  { id: 'fight_promoter', tier: 'ELITE', name: 'Fight Promoter', description: 'Organizing and promoting high-stakes combat events.', upfrontCost: 1000000, cloutReq: 1500, yieldCash: 400000, yieldClout: 300, yieldAura: 200, hitMental: -30, hitHeat: 20, fatigueCost: 30, isPassive: false, successChance: 0.75, icon: '🥊', miniGame: 'hype_meter' },
  { id: 'space_investment', tier: 'ELITE', name: 'Space Investment Fund', description: 'Backing the next frontier of human expansion.', upfrontCost: 3000000, cloutReq: 2000, yieldCash: 1200000, yieldClout: 800, yieldAura: 500, hitMental: -25, hitHeat: 5, fatigueCost: 20, isPassive: false, successChance: 0.70, icon: '🚀', miniGame: 'rocket_launch' },
  { id: 'philanthropy_empire', tier: 'ELITE', name: 'Philanthropy Empire', description: 'Shaping the world through massive charitable initiatives.', upfrontCost: 2000000, cloutReq: 3000, yieldCash: 0, yieldClout: 1500, yieldAura: 2500, hitMental: -15, hitHeat: 0, fatigueCost: 15, isPassive: false, successChance: 0.80, icon: '🤝', miniGame: 'grant_sort' },
  { id: 'data_monopoly', tier: 'ELITE', name: 'Data Monopoly', description: 'Controlling the flow of global information.', upfrontCost: 4000000, cloutReq: 4000, yieldCash: 3000000, yieldClout: 2000, yieldAura: 1000, hitMental: -35, hitHeat: 25, fatigueCost: 35, isPassive: false, successChance: 0.65, icon: '👁️', miniGame: 'pattern_match' },

  // --- TIER 6: MOGUL ---
  { id: 'real_estate_empire', tier: 'MOGUL', name: 'Real Estate Empire', description: 'Acquiring city blocks and commercial hubs.', upfrontCost: 1000000, cloutReq: 5000, yieldCash: 500000, yieldClout: 1000, yieldAura: 500, hitMental: -15, hitHeat: 20, fatigueCost: 5, isPassive: true, successChance: 0.75, icon: '🏙️' },
  { id: 'central_bank_play', tier: 'MOGUL', name: 'Central Bank Play', description: 'Influencing global monetary policy for massive gains.', upfrontCost: 15000000, cloutReq: 10000, yieldCash: 10000000, yieldClout: 5000, yieldAura: 3000, hitMental: -50, hitHeat: 40, fatigueCost: 50, isPassive: false, successChance: 0.60, icon: '🏦', miniGame: 'rate_balance' },
  { id: 'legacy_fund', tier: 'MOGUL', name: 'Legacy Fund', description: 'Securing generational wealth and influence.', upfrontCost: 10000000, cloutReq: 8000, yieldCash: 5000000, yieldClout: 4000, yieldAura: 2000, hitMental: -30, hitHeat: 10, fatigueCost: 30, isPassive: false, successChance: 0.70, icon: '🏺', miniGame: 'heirloom_catch' },

  // --- TIER 8: PRESIDENT ---
  { id: 'the_campaign', tier: 'PRESIDENT', name: 'The Campaign', description: 'Run for the highest office in the land. Dark money, state-by-state strategy, and national destiny.', upfrontCost: 10000000, cloutReq: 50000, yieldCash: 10000000000, yieldClout: 10000000, yieldAura: 5000000, hitMental: -80, hitHeat: 20, fatigueCost: 100, isPassive: false, successChance: 0.4, icon: '🗳️', miniGame: 'campaign_trail' },
  { id: 'policy_flip', tier: 'PRESIDENT', name: 'Policy Influence', description: 'Shaping national legislation for profit.', upfrontCost: 5000000, cloutReq: 20000, yieldCash: 2000000, yieldClout: 5000, yieldAura: 1000, hitMental: -50, hitHeat: 50, fatigueCost: 60, isPassive: false, successChance: 0.7, icon: '⚖️' },

  // --- TIER 9: OPEN ---
  { id: 'global_index', tier: 'OPEN', name: 'Global Index', description: 'Owning the majority share of world production.', upfrontCost: 25000000, cloutReq: 100000, yieldCash: 10000000, yieldClout: 20000, yieldAura: 5000, hitMental: -10, hitHeat: 10, fatigueCost: 0, isPassive: true, successChance: 1.0, icon: '🌍' },

  // --- WELLNESS & RECOVERY (INSTANT) ---
  { id: 'r_sleep', tier: 'MUD', name: 'Deep Sleep & Rest', description: 'Sacrifice a month to catch up on sleep. 100% safe but lowers active cultural presence.', upfrontCost: 0, cloutReq: 0, yieldCash: 0, yieldClout: 0, yieldAura: -5, hitMental: 40, hitHeat: 0, fatigueCost: 0, successChance: 1.0, isPassive: false, icon: '💤' },
  { id: 'r_chill', tier: 'STREET', name: 'Vibe & Couch Gaming', description: 'Unplug from the hype cycle with your close day-ones to destress.', upfrontCost: 150, cloutReq: 0, yieldCash: 0, yieldClout: 5, yieldAura: 0, hitMental: 30, hitHeat: 0, fatigueCost: 0, successChance: 1.0, isPassive: false, icon: '🎮' },
  { id: 'r_therapy', tier: 'STARTUP', name: 'Mental Wellness Coaching', description: 'Hire a high-performance cognitive therapist to process corporate stress.', upfrontCost: 1200, cloutReq: 0, yieldCash: 0, yieldClout: 0, yieldAura: 0, hitMental: 45, hitHeat: 0, fatigueCost: 0, successChance: 1.0, isPassive: false, icon: '🧠' },
  { id: 'r_spa', tier: 'CORPORATE', name: 'Country Club Spa Day', description: 'Step off the trading floor for high-end executive decompression.', upfrontCost: 4500, cloutReq: 0, yieldCash: 0, yieldClout: 0, yieldAura: 25, hitMental: 55, hitHeat: 0, fatigueCost: 0, successChance: 1.0, isPassive: false, icon: '🧖' },
  { id: 'r_vending', tier: 'MUD', name: 'Vending Machine Route', description: 'Deploy cash-flowing candy and beverage machines in local retail breakrooms.', upfrontCost: 1500, cloutReq: 0, yieldCash: 0, yieldClout: 0, yieldAura: 0, hitMental: 0, hitHeat: 0, fatigueCost: 0, successChance: 1.0, isPassive: true, icon: '🪙', passiveYieldModifier: 'VENDING_ROUTE' },

  // --- TIER 0 ADDITION ---
  { id: 'r_flyers', tier: 'MUD', name: 'Guerrilla Poster Campaign', description: 'Spend a month slapping up flyer prints to build local neighborhood name recognition.', upfrontCost: 50, cloutReq: 0, yieldCash: 0, yieldClout: 15, yieldAura: 2, hitMental: -2, hitHeat: 0, fatigueCost: 0, successChance: 1.0, isPassive: false, icon: '📜' },

  // --- TIER 1 ADDITIONS ---
  { id: 'r_pr_campaign', tier: 'STREET', name: 'Publicity PR Campaign', description: 'Hire a local street publicist to manufacture a curated clout stunt. Risky and expensive.', upfrontCost: 1500, cloutReq: 30, yieldCash: 0, yieldClout: 5, yieldAura: 25, hitMental: -10, hitHeat: 10, fatigueCost: 0, successChance: 1.0, isPassive: false, icon: '📣' },
  { id: 'r_ghost_mode', tier: 'STREET', name: 'Lay Low & Ghost Socials', description: 'Stay completely out of the public eye, scrub controversial podcast logs, and let active Heat drain away.', upfrontCost: 0, cloutReq: 0, yieldCash: 0, yieldClout: -10, yieldAura: 0, hitMental: 15, hitHeat: -25, fatigueCost: 0, successChance: 1.0, isPassive: false, icon: '🥷' },
];
