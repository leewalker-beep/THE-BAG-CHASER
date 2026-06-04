export interface HustleNode {
  id: string;
  name: string;
  cost: number;
  yieldCash: number;
  yieldClout: number;
  yieldAura: number;
  successChance: number;
  hitMental: number;
  passiveMonthlyYield: number;
  nextNodes: string[];
}

export const HUSTLE_PROGRESSIONS: Record<string, Record<string, HustleNode>> = {
  r_labor: {
    l1: { id: 'l1', name: 'Manual Labor Grind', cost: 0, yieldCash: 2400, yieldClout: 0, yieldAura: 0, successChance: 1.0, hitMental: -8, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'House Renovation', cost: 15000, yieldCash: 25000, yieldClout: 0, yieldAura: 0, successChance: 0.8, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Skilled Trade', cost: 5000, yieldCash: 8000, yieldClout: 0, yieldAura: 0, successChance: 0.9, hitMental: -10, passiveMonthlyYield: 0, nextNodes: ['l3c'] },
    l3a: { id: 'l3a', name: 'House Flip', cost: 75000, yieldCash: 200000, yieldClout: 0, yieldAura: 0, successChance: 0.7, hitMental: -25, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Rent Portfolio', cost: 50000, yieldCash: 0, yieldClout: 0, yieldAura: 0, successChance: 0.9, hitMental: -10, passiveMonthlyYield: 5000, nextNodes: ['l4a'] },
    l3c: { id: 'l3c', name: 'Construction Firm', cost: 50000, yieldCash: 100000, yieldClout: 0, yieldAura: 0, successChance: 0.85, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l4b'] },
    l4a: { id: 'l4a', name: 'Commercial Real Estate', cost: 500000, yieldCash: 0, yieldClout: 0, yieldAura: 0, successChance: 0.8, hitMental: -15, passiveMonthlyYield: 40000, nextNodes: [] },
    l4b: { id: 'l4b', name: 'Civil Engineering Firm', cost: 250000, yieldCash: 500000, yieldClout: 0, yieldAura: 0, successChance: 0.75, hitMental: -30, passiveMonthlyYield: 0, nextNodes: [] },
  },
  r_delivery: {
    l1: { id: 'l1', name: 'App Delivery Gigs', cost: 0, yieldCash: 2000, yieldClout: 2, yieldAura: 0, successChance: 1.0, hitMental: -5, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Fleet Dispatch', cost: 15000, yieldCash: 6000, yieldClout: 5, yieldAura: 0, successChance: 0.9, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Courier Network', cost: 8000, yieldCash: 0, yieldClout: 5, yieldAura: 0, successChance: 0.85, hitMental: -10, passiveMonthlyYield: 4000, nextNodes: ['l3c'] },
    l3a: { id: 'l3a', name: 'Logistics Hub', cost: 85000, yieldCash: 35000, yieldClout: 20, yieldAura: 0, successChance: 0.8, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Freight Brokerage', cost: 50000, yieldCash: 75000, yieldClout: 30, yieldAura: 0, successChance: 0.75, hitMental: -25, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3c: { id: 'l3c', name: 'Regional Logistics', cost: 40000, yieldCash: 0, yieldClout: 25, yieldAura: 0, successChance: 0.9, hitMental: -15, passiveMonthlyYield: 15000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: '3PL Automated Hub', cost: 2000000, yieldCash: 350000, yieldClout: 100, yieldAura: 50, successChance: 0.85, hitMental: -30, passiveMonthlyYield: 0, nextNodes: [] },
  },
  tech_flip: {
    l1: { id: 'l1', name: 'Bedroom Repair Bench', cost: 300, yieldCash: 2200, yieldClout: 5, yieldAura: 0, successChance: 0.85, hitMental: -5, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Strip-Mall Kiosk', cost: 2500, yieldCash: 6000, yieldClout: 15, yieldAura: 0, successChance: 0.8, hitMental: -10, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Mobile Repair Van', cost: 1500, yieldCash: 0, yieldClout: 10, yieldAura: 0, successChance: 0.85, hitMental: -8, passiveMonthlyYield: 3000, nextNodes: ['l3c'] },
    l3a: { id: 'l3a', name: 'Automated Refurb Plant', cost: 15000, yieldCash: 25000, yieldClout: 40, yieldAura: 10, successChance: 0.75, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Wholesale Supply Chain', cost: 10000, yieldCash: 40000, yieldClout: 30, yieldAura: 5, successChance: 0.7, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3c: { id: 'l3c', name: 'Refurb Plant + Fleet', cost: 20000, yieldCash: 0, yieldClout: 50, yieldAura: 20, successChance: 0.8, hitMental: -15, passiveMonthlyYield: 8000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Global Electronics Recycling', cost: 250000, yieldCash: 500000, yieldClout: 150, yieldAura: 100, successChance: 0.7, hitMental: -25, passiveMonthlyYield: 0, nextNodes: [] },
  },
  techFlip: {
    l1: { id: 'l1', name: 'Bedroom Repair Bench', cost: 300, yieldCash: 2200, yieldClout: 5, yieldAura: 0, successChance: 0.85, hitMental: -5, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Strip-Mall Kiosk', cost: 2500, yieldCash: 6000, yieldClout: 15, yieldAura: 0, successChance: 0.8, hitMental: -10, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Mobile Repair Van', cost: 1500, yieldCash: 0, yieldClout: 10, yieldAura: 0, successChance: 0.85, hitMental: -8, passiveMonthlyYield: 3000, nextNodes: ['l3c'] },
    l3a: { id: 'l3a', name: 'Automated Refurb Plant', cost: 15000, yieldCash: 25000, yieldClout: 40, yieldAura: 10, successChance: 0.75, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Wholesale Supply Chain', cost: 10000, yieldCash: 40000, yieldClout: 30, yieldAura: 5, successChance: 0.7, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3c: { id: 'l3c', name: 'Refurb Plant + Fleet', cost: 20000, yieldCash: 0, yieldClout: 50, yieldAura: 20, successChance: 0.8, hitMental: -15, passiveMonthlyYield: 8000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Global Electronics Recycling', cost: 250000, yieldCash: 500000, yieldClout: 150, yieldAura: 100, successChance: 0.7, hitMental: -25, passiveMonthlyYield: 0, nextNodes: [] },
  },
  cc: {
    l1: { id: 'l1', name: 'Viral Clip Scraper', cost: 400, yieldCash: 0, yieldClout: 100, yieldAura: 0, successChance: 0.9, hitMental: -10, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Content Studio', cost: 5000, yieldCash: 10000, yieldClout: 300, yieldAura: 0, successChance: 0.85, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Agency Affiliate', cost: 2000, yieldCash: 0, yieldClout: 150, yieldAura: 0, successChance: 0.8, hitMental: -10, passiveMonthlyYield: 5000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'MCN Network', cost: 25000, yieldCash: 50000, yieldClout: 1000, yieldAura: 50, successChance: 0.75, hitMental: -25, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Brand Deals', cost: 15000, yieldCash: 75000, yieldClout: 500, yieldAura: 30, successChance: 0.8, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Global Content Syndicate', cost: 500000, yieldCash: 500000, yieldClout: 5000, yieldAura: 250, successChance: 0.7, hitMental: -30, passiveMonthlyYield: 0, nextNodes: [] },
  },
  pod: {
    l1: { id: 'l1', name: 'Rookie Podcaster', cost: 200, yieldCash: 1500, yieldClout: 30, yieldAura: 0, successChance: 0.9, hitMental: -5, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Mid-Tier Podcast', cost: 3000, yieldCash: 8000, yieldClout: 100, yieldAura: 0, successChance: 0.85, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Niche Network', cost: 1500, yieldCash: 0, yieldClout: 60, yieldAura: 0, successChance: 0.8, hitMental: -10, passiveMonthlyYield: 3000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'Top-Ranked Podcast', cost: 15000, yieldCash: 40000, yieldClout: 300, yieldAura: 50, successChance: 0.75, hitMental: -25, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Production Studio', cost: 25000, yieldCash: 0, yieldClout: 200, yieldAura: 100, successChance: 0.8, hitMental: -20, passiveMonthlyYield: 25000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Media Empire', cost: 500000, yieldCash: 500000, yieldClout: 2000, yieldAura: 500, successChance: 0.7, hitMental: -35, passiveMonthlyYield: 0, nextNodes: [] },
  },
  audio: {
    l1: { id: 'l1', name: 'Bedroom Producer', cost: 1000, yieldCash: 0, yieldClout: 50, yieldAura: 0, successChance: 0.9, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Studio Owned', cost: 10000, yieldCash: 5000, yieldClout: 150, yieldAura: 0, successChance: 0.85, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Beat Market', cost: 5000, yieldCash: 0, yieldClout: 80, yieldAura: 0, successChance: 0.8, hitMental: -10, passiveMonthlyYield: 2000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'Record Label', cost: 50000, yieldCash: 100000, yieldClout: 500, yieldAura: 100, successChance: 0.75, hitMental: -30, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Sync Licensing', cost: 25000, yieldCash: 0, yieldClout: 300, yieldAura: 50, successChance: 0.8, hitMental: -20, passiveMonthlyYield: 50000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Music Publishing Empire', cost: 1000000, yieldCash: 1000000, yieldClout: 5000, yieldAura: 1000, successChance: 0.7, hitMental: -40, passiveMonthlyYield: 0, nextNodes: [] },
  },
  drop: {
    l1: { id: 'l1', name: 'Trunk Phase', cost: 500, yieldCash: 2500, yieldClout: 5, yieldAura: 0, successChance: 0.9, hitMental: -8, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Store Phase', cost: 4000, yieldCash: 12000, yieldClout: 15, yieldAura: 0, successChance: 0.85, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Amazon FBA', cost: 2000, yieldCash: 0, yieldClout: 10, yieldAura: 0, successChance: 0.8, hitMental: -10, passiveMonthlyYield: 5000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'Chain Phase', cost: 12000, yieldCash: 35000, yieldClout: 40, yieldAura: 10, successChance: 0.8, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Private Label', cost: 8000, yieldCash: 0, yieldClout: 30, yieldAura: 20, successChance: 0.85, hitMental: -15, passiveMonthlyYield: 15000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Global E-Com Empire', cost: 250000, yieldCash: 500000, yieldClout: 150, yieldAura: 100, successChance: 0.75, hitMental: -25, passiveMonthlyYield: 0, nextNodes: [] },
  },
  vintage: {
    l1: { id: 'l1', name: 'Thrift Rack Hunter', cost: 500, yieldCash: 1500, yieldClout: 10, yieldAura: 0, successChance: 0.9, hitMental: -5, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Consignment Boutique', cost: 2000, yieldCash: 6000, yieldClout: 25, yieldAura: 0, successChance: 0.85, hitMental: -10, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Pop-Up Shop', cost: 1000, yieldCash: 0, yieldClout: 15, yieldAura: 0, successChance: 0.8, hitMental: -8, passiveMonthlyYield: 3000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'Luxury Grail Archive', cost: 7000, yieldCash: 0, yieldClout: 10, yieldAura: 15, successChance: 0.85, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Brand Collaboration', cost: 10000, yieldCash: 30000, yieldClout: 50, yieldAura: 20, successChance: 0.75, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Streetwear Empire', cost: 250000, yieldCash: 250000, yieldClout: 200, yieldAura: 100, successChance: 0.7, hitMental: -25, passiveMonthlyYield: 0, nextNodes: [] },
  },
  saas_mvp: {
    l1: { id: 'l1', name: 'MVP Launch', cost: 5000, yieldCash: 0, yieldClout: 2500, yieldAura: 10, successChance: 0.85, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Growth Phase', cost: 25000, yieldCash: 50000, yieldClout: 10000, yieldAura: 50, successChance: 0.8, hitMental: -25, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Bootstrapped', cost: 10000, yieldCash: 0, yieldClout: 5000, yieldAura: 30, successChance: 0.85, hitMental: -15, passiveMonthlyYield: 15000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'Series A', cost: 250000, yieldCash: 500000, yieldClout: 50000, yieldAura: 200, successChance: 0.7, hitMental: -35, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Acquisition', cost: 100000, yieldCash: 1000000, yieldClout: 25000, yieldAura: 100, successChance: 0.75, hitMental: -30, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Unicorn Status', cost: 2000000, yieldCash: 10000000, yieldClout: 250000, yieldAura: 1000, successChance: 0.6, hitMental: -50, passiveMonthlyYield: 0, nextNodes: [] },
  },
  agency_scale: {
    l1: { id: 'l1', name: 'Freelance Agency', cost: 0, yieldCash: 6500, yieldClout: 50, yieldAura: 20, successChance: 0.85, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Boutique Agency', cost: 15000, yieldCash: 25000, yieldClout: 100, yieldAura: 50, successChance: 0.8, hitMental: -25, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Digital Agency', cost: 8000, yieldCash: 0, yieldClout: 60, yieldAura: 30, successChance: 0.85, hitMental: -15, passiveMonthlyYield: 10000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'Full-Service Firm', cost: 50000, yieldCash: 100000, yieldClout: 300, yieldAura: 100, successChance: 0.75, hitMental: -30, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Retainer Model', cost: 25000, yieldCash: 0, yieldClout: 150, yieldAura: 80, successChance: 0.8, hitMental: -20, passiveMonthlyYield: 40000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Global Agency Network', cost: 500000, yieldCash: 500000, yieldClout: 1000, yieldAura: 500, successChance: 0.7, hitMental: -40, passiveMonthlyYield: 0, nextNodes: [] },
  },
  ecom_brand: {
    l1: { id: 'l1', name: 'DTC Startup', cost: 110000, yieldCash: 9000, yieldClout: 30, yieldAura: 15, successChance: 0.85, hitMental: -10, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Warehouse Automation', cost: 50000, yieldCash: 25000, yieldClout: 0, yieldAura: 0, successChance: 0.8, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Influencer Marketing', cost: 20000, yieldCash: 0, yieldClout: 50, yieldAura: 0, successChance: 0.85, hitMental: -10, passiveMonthlyYield: 10000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'Global Fulfillment', cost: 200000, yieldCash: 150000, yieldClout: 100, yieldAura: 50, successChance: 0.75, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Private Label Expansion', cost: 100000, yieldCash: 0, yieldClout: 80, yieldAura: 40, successChance: 0.8, hitMental: -15, passiveMonthlyYield: 50000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Retail Empire', cost: 1000000, yieldCash: 1000000, yieldClout: 500, yieldAura: 250, successChance: 0.7, hitMental: -25, passiveMonthlyYield: 0, nextNodes: [] },
  },
  festival: {
    l1: { id: 'l1', name: 'Local Festival', cost: 85000, yieldCash: 0, yieldClout: 500, yieldAura: 150, successChance: 0.75, hitMental: -35, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Regional Circuit', cost: 150000, yieldCash: 75000, yieldClout: 1500, yieldAura: 0, successChance: 0.7, hitMental: -40, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Artist Agency', cost: 75000, yieldCash: 0, yieldClout: 800, yieldAura: 0, successChance: 0.8, hitMental: -25, passiveMonthlyYield: 30000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'International Tour', cost: 500000, yieldCash: 500000, yieldClout: 5000, yieldAura: 150, successChance: 0.65, hitMental: -50, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Festival Brand', cost: 300000, yieldCash: 0, yieldClout: 2500, yieldAura: 100, successChance: 0.7, hitMental: -35, passiveMonthlyYield: 250000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Global Entertainment Empire', cost: 2000000, yieldCash: 2000000, yieldClout: 25000, yieldAura: 1000, successChance: 0.6, hitMental: -60, passiveMonthlyYield: 0, nextNodes: [] },
  },
  global_franchise: {
    l1: { id: 'l1', name: 'National Franchise', cost: 50000, yieldCash: 25000, yieldClout: 40, yieldAura: 20, successChance: 0.85, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Regional Chain', cost: 150000, yieldCash: 75000, yieldClout: 100, yieldAura: 50, successChance: 0.8, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Franchise Network', cost: 100000, yieldCash: 0, yieldClout: 80, yieldAura: 40, successChance: 0.85, hitMental: -15, passiveMonthlyYield: 40000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'International Franchise', cost: 500000, yieldCash: 250000, yieldClout: 300, yieldAura: 150, successChance: 0.75, hitMental: -25, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Supply Chain Control', cost: 300000, yieldCash: 0, yieldClout: 200, yieldAura: 100, successChance: 0.8, hitMental: -20, passiveMonthlyYield: 150000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Global Syndicate', cost: 2000000, yieldCash: 1000000, yieldClout: 1000, yieldAura: 500, successChance: 0.7, hitMental: -30, passiveMonthlyYield: 0, nextNodes: [] },
  },
  venture_capital: {
    l1: { id: 'l1', name: 'Angel Investor', cost: 250000, yieldCash: 150000, yieldClout: 500, yieldAura: 200, successChance: 0.75, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Seed Fund', cost: 1000000, yieldCash: 500000, yieldClout: 1500, yieldAura: 500, successChance: 0.7, hitMental: -25, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Startup Incubator', cost: 500000, yieldCash: 0, yieldClout: 800, yieldAura: 300, successChance: 0.75, hitMental: -15, passiveMonthlyYield: 300000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'VC Firm', cost: 5000000, yieldCash: 2500000, yieldClout: 5000, yieldAura: 1000, successChance: 0.65, hitMental: -30, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Growth Equity', cost: 3000000, yieldCash: 0, yieldClout: 3000, yieldAura: 800, successChance: 0.7, hitMental: -25, passiveMonthlyYield: 1500000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Global Fund', cost: 25000000, yieldCash: 15000000, yieldClout: 25000, yieldAura: 5000, successChance: 0.6, hitMental: -40, passiveMonthlyYield: 0, nextNodes: [] },
  },
  real_estate_empire: {
    l1: { id: 'l1', name: 'Residential Investor', cost: 1000000, yieldCash: 500000, yieldClout: 1000, yieldAura: 500, successChance: 0.75, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Commercial Properties', cost: 5000000, yieldCash: 2500000, yieldClout: 3000, yieldAura: 1000, successChance: 0.7, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'REIT', cost: 3000000, yieldCash: 0, yieldClout: 2000, yieldAura: 800, successChance: 0.75, hitMental: -10, passiveMonthlyYield: 1500000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'Urban Development', cost: 15000000, yieldCash: 10000000, yieldClout: 10000, yieldAura: 5000, successChance: 0.65, hitMental: -25, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Land Banking', cost: 10000000, yieldCash: 0, yieldClout: 5000, yieldAura: 2500, successChance: 0.7, hitMental: -15, passiveMonthlyYield: 5000000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Global Portfolio', cost: 50000000, yieldCash: 35000000, yieldClout: 25000, yieldAura: 5000, successChance: 0.6, hitMental: -30, passiveMonthlyYield: 0, nextNodes: [] },
  },
  policy_flip: {
    l1: { id: 'l1', name: 'Local Lobbyist', cost: 5000000, yieldCash: 2000000, yieldClout: 5000, yieldAura: 1000, successChance: 0.7, hitMental: -50, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'State-Level Influence', cost: 15000000, yieldCash: 10000000, yieldClout: 15000, yieldAura: 5000, successChance: 0.65, hitMental: -60, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'PAC', cost: 10000000, yieldCash: 0, yieldClout: 10000, yieldAura: 3000, successChance: 0.7, hitMental: -40, passiveMonthlyYield: 5000000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'Federal Lobbying', cost: 50000000, yieldCash: 25000000, yieldClout: 50000, yieldAura: 10000, successChance: 0.55, hitMental: -75, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Regulatory Capture', cost: 30000000, yieldCash: 0, yieldClout: 30000, yieldAura: 5000, successChance: 0.6, hitMental: -55, passiveMonthlyYield: 15000000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Global Governance', cost: 250000000, yieldCash: 150000000, yieldClout: 250000, yieldAura: 50000, successChance: 0.5, hitMental: -100, passiveMonthlyYield: 0, nextNodes: [] },
  },
  global_index: {
    l1: { id: 'l1', name: 'Market Entry', cost: 25000000, yieldCash: 10000000, yieldClout: 20000, yieldAura: 5000, successChance: 1.0, hitMental: -10, passiveMonthlyYield: 0, nextNodes: ['l2a', 'l2b'] },
    l2a: { id: 'l2a', name: 'Index Fund', cost: 100000000, yieldCash: 50000000, yieldClout: 50000, yieldAura: 15000, successChance: 0.9, hitMental: -15, passiveMonthlyYield: 0, nextNodes: ['l3a', 'l3b'] },
    l2b: { id: 'l2b', name: 'Sovereign Wealth', cost: 75000000, yieldCash: 0, yieldClout: 40000, yieldAura: 10000, successChance: 0.95, hitMental: -10, passiveMonthlyYield: 30000000, nextNodes: ['l3a'] },
    l3a: { id: 'l3a', name: 'Global Dominance', cost: 500000000, yieldCash: 250000000, yieldClout: 100000, yieldAura: 50000, successChance: 0.85, hitMental: -20, passiveMonthlyYield: 0, nextNodes: ['l4a'] },
    l3b: { id: 'l3b', name: 'Market Maker', cost: 300000000, yieldCash: 0, yieldClout: 75000, yieldAura: 30000, successChance: 0.9, hitMental: -15, passiveMonthlyYield: 150000000, nextNodes: ['l4a'] },
    l4a: { id: 'l4a', name: 'Hegemony', cost: 1000000000, yieldCash: 750000000, yieldClout: 500000, yieldAura: 250000, successChance: 0.8, hitMental: -25, passiveMonthlyYield: 0, nextNodes: [] },
  },
};
