export const fMny = (v) => {
  if (v >= 1e9) return (v / 1e9).toFixed(1) + 'B';
  if (v >= 1e6) return (v / 1e6).toFixed(1) + 'M';
  if (v >= 1e3) return (v / 1e3).toFixed(1) + 'K';
  return Math.floor(v).toLocaleString();
};

export const MARKETS = [
  { n: "NORMAL", desc: "Economy steady." },
  { n: "BULL MARKET", desc: "Crypto pumps. Streetwear sell-out risks higher." },
  { n: "RECESSION", desc: "Inflation: 2x Burn Rate." },
  { n: "CRACKDOWN", desc: "SEC/DOJ raid risks doubled." },
];

export const HF_RUMORS = [
  { tick: "TSLA", dir: -1 },
  { tick: "AAPL", dir:  1 },
  { tick: "AMZN", dir: -1 },
  { tick: "NVDA", dir:  1 },
  { tick: "NFLX", dir: -1 },
];

export const TIER_UNLOCKS = {
  core:   { peakBag: 0,         peakClout: 0,   label: "THE MUD" },
  empire: { peakBag: 500000,    peakClout: 100, label: "THE EMPIRE" },
  god:    { peakBag: 50000000,  peakClout: 300, label: "GOD TIER" },
  pres:   { peakBag: 500000000, peakClout: 450, label: "POTUS" },
};

export const TABS = [
  { id: "HUB",  label: "HUB",    cls: "",           section: "core"  },
  { id: "SW",   label: "DRIP LAB",cls: "font-hype",  section: "core"  },
  { id: "DROP", label: "DROP",    cls: "font-hype",  section: "core"  },
  { id: "CC",   label: "CREATOR", cls: "font-tech",  section: "core"  },
  { id: "POD",  label: "POD",     cls: "font-tech",  section: "core"  },
  { id: "BOX",  label: "FIGHT",   cls: "",           section: "empire"},
  { id: "TECH", label: "SAAS",    cls: "font-tech",  section: "empire"},
  { id: "CRYP", label: "WEB3",    cls: "font-hack",  section: "empire"},
  { id: "TOUR", label: "EVENTS",  cls: "",           section: "empire"},
  { id: "MOV",  label: "STUDIO",  cls: "",           section: "god"   },
  { id: "HF",   label: "FUND",    cls: "font-hack",  section: "god"   },
  { id: "AI",   label: "AGI",     cls: "font-tech",  section: "god"   },
  { id: "BILL", label: "FLEX",    cls: "",           section: "god"   },
  { id: "PRES", label: "POTUS",   cls: "font-gov",   section: "pres"  },
];