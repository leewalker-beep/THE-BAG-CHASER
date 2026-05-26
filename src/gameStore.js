import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { NOTIFICATION_DATABASE } from './data/notifications.js';
import { fMny } from './config.js';

export const TIERS = [
  { id: 0, label: 'Mud',       req: { bag: 0,           clout: 0,    aura: 0   }, hustles: ['SW', 'DROP', 'TECH_FLIP', 'VINTAGE', 'SMM', 'GIG', 'DELIVERY', 'PLASMA', 'SURVEY', 'LABOR'] },
  { id: 1, label: 'Street',    req: { bag: 100000,      clout: 30,   aura: 0   }, hustles: ['CC', 'POD', 'BOX', 'AUDIO'] },
  { id: 2, label: 'Corporate', req: { bag: 1000000,     clout: 150,  aura: 50  }, hustles: ['TECH', 'AI_AGENCY', 'CRE_FLIP', 'FRANCHISE'] },
  { id: 3, label: 'Elite',     req: { bag: 25000000,    clout: 500,  aura: 0   }, hustles: ['CRYP', 'TOUR', 'PE_ROLLUP', 'ART_SPEC'] },
  { id: 4, label: 'Mogul',     req: { bag: 250000000,   clout: 1500, aura: 500 }, hustles: ['HF', 'CONGLOMERATE', 'PMC', 'SOVEREIGN', 'MOV', 'SYNDICATE'] },
  { id: 5, label: 'President', req: { bag: 1000000000,  clout: 5000, aura: 2500 }, hustles: ['PAC', 'BLITZ', 'SMEAR', 'ELECTION'] },
];

export const mudChaosPools = {
  VINTAGE: [
    { title: "THE BIOHAZARD", text: "You dig deep into a raw clearance bin and your hand squishes into a melted piece of vintage bubblegum.", bag: 0, mh: -10, aura: 0, clout: 0 },
    { title: "THE STEAL", text: "You spot an authentic 90s band tee mispriced for $2. You instantly flip it on a reselling app while standing in line.", bag: 150, mh: 5, aura: 0, clout: 10 },
    { title: "HYPE-LEACH ENCOUNTER", text: "An aggressive TikTok 'thrift-flipper' points a camera in your face and demands to know what you pay for rent. You freeze up and stutter.", bag: 0, mh: -10, aura: -15, clout: 0 },
    { title: "NOSTALGIA TRAP", text: "You find the exact action figure you lost when you were 8. Instead of selling it, you keep it for your desk.", bag: -15, mh: 25, aura: 5, clout: 0 },
    { title: "MOTH INFESTATION", text: "The vintage sweaters you brought home are riddled with larvae. Your closet is ruined.", bag: -80, mh: -20, aura: 0, clout: 0 },
    { title: "GATEKEEPER BLOCKED", text: "A hipster glares at you for touching the denim rack and loudly sighs 'gentrified' under their breath.", bag: 0, mh: -5, aura: -5, clout: 0 },
    { title: "THE REPLAY EVENT", text: "You wear a vintage varsity jacket you found to a diner. An old timer buys your breakfast out of absolute respect.", bag: 15, mh: 15, aura: 15, clout: 0 },
    { title: "REP EXPOSED", text: "You try to list a fake designer hoodie as real. Local hypebeasts catch it and roast you in the comments.", bag: 0, mh: -15, aura: -30, clout: -20 },
    { title: "THE ODOR MATRIX", text: "A rare jacket smells so heavily of basement mold that you spend 4 hours hand scrubbing it in a bathtub.", bag: 0, mh: -15, aura: 10, clout: 0 },
    { title: "WALLET REMNANT", text: "You check the hidden pocket of a discarded leather coat and find a crisp, forgotten $50 bill.", bag: 50, mh: 10, aura: 0, clout: 0 }
  ],
  TECH: [
    { title: "THE LOWBALL SPECIAL", text: "You list a working phone for $300. Someone offers you a broken Xbox, a half-eaten bag of chips, and $12 cash. The utter disrespect ruins your day.", bag: 0, mh: -15, aura: 0, clout: 0 },
    { title: "GHOSTED IN PUBLIC", text: "You drive 20 minutes to a sketchy gas station to buy a laptop, but the seller blocks your number the millisecond you pull in.", bag: -15, mh: -15, aura: -5, clout: 0 },
    { title: "LOOSE CHANGE NIGHTMARE", text: "A buyer pays the final $40 of a deal entirely in loose nickels and dimes. You sit in your car counting coins like a loser.", bag: 40, mh: -5, aura: -10, clout: 0 },
    { title: "ICLOUD BRICK", text: "You bought a tablet cheap, only to realize it's hard-locked to an elementary school district's server in Ohio. It's a paperweight.", bag: -100, mh: -20, aura: 0, clout: 0 },
    { title: "RICE TRICK WIZARD", text: "You buy a water-damaged phone for $10, leave it in dry rice overnight, and it boots up flawlessly. Complete fleece.", bag: 180, mh: 15, aura: 0, clout: 15 },
    { title: "SPICY BATTERY EXPULSION", text: "While prying open a cheap screen, you puncture the lithium battery. It hisses green smoke and melts your desk setup.", bag: -200, mh: -30, aura: -10, clout: 0 },
    { title: "SWEET OLD LADY", text: "You clean a nasty malware virus off an elderly woman's desktop. She hands you warm chocolate chip cookies on top of your fee.", bag: 70, mh: 35, aura: 15, clout: 0 },
    { title: "FRANKENSTEIN CONSOLE", text: "You merge two completely broken, identical consoles into one perfectly working super-machine.", bag: 150, mh: 10, aura: 0, clout: 20 },
    { title: "THE REVIEW BOMB", text: "A buyer drops their phone down an elevator shaft 3 weeks later, but leaves a 1-star review claiming you scammed them.", bag: 0, mh: -10, aura: -20, clout: -25 },
    { title: "ALT-COIN REMNANT", text: "You boot up a dusty, abandoned office PC and discover a fractional crypto-wallet left on the hard drive.", bag: 350, mh: 10, aura: 0, clout: 5 }
  ],
  DELIVERY: [
    { title: "THE TIP-BAIT", text: "A customer offers a $20 tip on a massive catering order, but deletes it and modifies it to $0 the second you walk away.", bag: 0, mh: -25, aura: 0, clout: 0 },
    { title: "THE HIGH-RISE MAZE", text: "The apartment complex geometry makes zero sense. You spend 25 minutes tracking down 'Building 4, Floor 3, Room 302B' behind a dumpster.", bag: 0, mh: -15, aura: -5, clout: 0 },
    { title: "RANCH DRESSING RAGE", text: "You forgot to grab extra dipping sauces. The customer follows you to your car, filming you on their phone while screaming.", bag: 0, mh: -15, aura: -20, clout: 0 },
    { title: "THE FRY TAX", text: "The smell of fresh, hot fries in the passenger seat is overwhelming. You eat exactly three from the bottom of the bag. Clean crime.", bag: 0, mh: 15, aura: 0, clout: 0 },
    { title: "GATE CODE GHOST", text: "The customer goes completely AWOL at a locked gate. You cancel the order per app policy and eat a luxury $40 sushi platter for free.", bag: 0, mh: 35, aura: 0, clout: 0 },
    { title: "MIDNIGHT STONER WINDMALL", text: "You deliver fast food to a hazy apartment at 2 AM. The guy thinks you are a divine entity and hands you a crisp $50 bill.", bag: 50, mh: 10, aura: 5, clout: 0 },
    { title: "GUTTER WATER SPLASH", text: "A luxury SUV speeds through a puddle next to your bike, completely drenching your body right before your drop-off.", bag: 0, mh: -20, aura: -25, clout: 0 },
    { title: "SERVER MELTDOWN", text: "The delivery app crash loops while you are holding someone's hot dinner. You sit on the curb staring into space.", bag: -5, mh: -15, aura: 0, clout: 0 },
    { title: "INFLUENCER CONTENT HOOK", text: "You drop off food and get trapped in a TikTok 'Giving delivery drivers life-changing tips' video. Smile for the camera.", bag: 40, mh: -5, aura: 0, clout: 30 },
    { title: "BEAST MODE DRIFT", text: "You weave through standstill traffic like a professional stunt cyclist, executing 3 deliveries in record speed.", bag: 45, mh: 10, aura: 20, clout: 0 }
  ],
  PLASMA: [
    { title: "THE NEW INTERN", text: "The phlebotomist training on their first day misses your arm vein entirely on the first three painful attempts.", bag: 0, mh: -25, aura: -5, clout: 0 },
    { title: "DEHYDRATION HALT", text: "You didn't drink enough water. The machine starts aggressively buzzing because your blood flow is moving like molasses.", bag: -10, mh: -15, aura: 0, clout: 0 },
    { title: "STALE COOKIE JACKPOT", text: "The receptionist feels bad about a two-hour wait line and slips you two extra juice boxes and a bag of mini cookies.", bag: 0, mh: 25, aura: 0, clout: 0 },
    { title: "THE HOLLOW MOON CHAT", text: "The regular on the donor machine next to you spends 45 minutes explaining why the moon is an artificial alien surveillance hub.", bag: 0, mh: -15, aura: 0, clout: 0 },
    { title: "IRON LEVEL FLEX", text: "Your pre-donation finger prick shows perfect biological stats because you randomly ate a cheap can of spinach yesterday.", bag: 20, mh: 10, aura: 10, clout: 0 },
    { title: "THE FREQUENCY BONUS", text: "You hit your 6th donation milestone of the month, triggering a premium promotional load onto your prepaid card.", bag: 120, mh: 5, aura: 0, clout: 0 },
    { title: "POST-PUMP WOBBLE", text: "You stand up too fast after unplugging, your eyes roll back, and you pass out clean into a plastic recycling bin. The whole clinic saw it.", bag: 0, mh: -15, aura: -45, clout: 0 },
    { title: "SCAR TISSUE STATUS", text: "Your arm needle mark is setting in permanently. A guy at the corner store asks if you are an underground prize-fighter.", bag: 0, mh: -5, aura: 15, clout: 0 },
    { title: "SUB-ZERO FREEZE", text: "The clinic's industrial AC unit is blasting arctic air. You sit there shivering under thin sheets for an hour.", bag: 0, mh: -15, aura: 0, clout: 0 },
    { title: "EXEMPLARY HYDRATION", text: "The screening doctor reviews your blood vitals and remarks that your hydration curves are 'frighteningly impressive.'", bag: 10, mh: 15, aura: 20, clout: 0 }
  ],
  SURVEY: [
    { title: "THE 99% SCREEN-OUT", text: "You spend 35 minutes filling out highly specific questions about laundry detergent, only to hit a screen saying: 'Sorry, you do not fit this demographic.' You get paid $0.01.", bag: 0, mh: -30, aura: 0, clout: 0 },
    { title: "INFINITE MOTORCYCLES", text: "The security CAPTCHA asks you to click the motorcycles, but the pixelated squares fade into more motorcycles for 10 straight loops.", bag: 0, mh: -15, aura: -5, clout: 0 },
    { title: "BRAIN-ROT DIAGNOSTIC", text: "An AI filter question asks: 'If a rectangle was a corporate feeling, would it taste like blue or Thursday?' You stare into the screen as your brain cells evaporate.", bag: 0, mh: -20, aura: 0, clout: 0 },
    { title: "DATA BREACH RECKONING", text: "The sketchy router site leaks your registration email to the dark web. You instantly receive 500 spam emails about crypto scams.", bag: 0, mh: -10, aura: 0, clout: -15 },
    { title: "CARPAL TUNNEL STRIKE", text: "Your index finger goes completely numb from clicking 'Next' 400 times. You have to finish the survey using your knuckles.", bag: 5, mh: -15, aura: 0, clout: 0 },
    { title: "BOT-DETECTION JAIL", text: "You clicked through the checkboxes too fast without reading the text blocks. The automated script flags you and freezes your balance for a week.", bag: -30, mh: -20, aura: -10, clout: 0 },
    { title: "THE DARK MIRROR QUESTION", text: "The validation engine suddenly asks you to honestly rate your satisfaction with your current real life. The results are highly un-optimized.", bag: 0, mh: -25, aura: -5, clout: 0 },
    { title: "THE TRANSACTION VAMPIRE", text: "You finally cash out your hard-earned balance, but the processing wallet hits you with massive verification fees, eating your margins.", bag: -5, mh: -10, aura: 0, clout: 0 },
    { title: "MACRO BREAKTHROUGH", text: "You code a small automated macro script that mimics cursor coordinates perfectly, completing surveys while you eat breakfast.", bag: 50, mh: 20, aura: 0, clout: 15 },
    { title: "PREMIUM AUDIT FOCUS", text: "You get selected for an elite, high-ticket consumer focus study group because of your unique profile answers.", bag: 90, mh: 10, aura: 5, clout: 5 }
  ],
  LABOR: [
    { title: "THE STAPLE GUN JAM", text: "Your industrial staple gun jams on a telephone pole, firing a heavy metal staple cleanly into your left thumb.", bag: -10, mh: -20, aura: 0, clout: 0 },
    { title: "HOA BOSS ENCOUNTER", text: "An aggressive neighborhood HOA president tracks you down in a golf cart, ripping down your lawn-care flyers the second you place them.", bag: 0, mh: -20, aura: -25, clout: 0 },
    { title: "CHIHUAHUA HEAT-SEEKER", text: "You walk up a long driveway to drop a card, and an unleashed chihuahua chases you down the street like a heat-seeking missile.", bag: 0, mh: -15, aura: -15, clout: 0 },
    { title: "MONSOON WASHOUT", text: "You spend 4 hours stickering a brick wall with concert posters right before a sudden downpour washes the ink entirely off the paper.", bag: -25, mh: -20, aura: 0, clout: 0 },
    { title: "GARAGE GOLD STRIKE", text: "While cleaning out an old garage for day labor, the homeowner lets you keep a dusty crate of retro items.", bag: 100, mh: 20, aura: 10, clout: 0 },
    { title: "THE BOOMER LECTURE", text: "The contractor who hired you spends 3 hours explaining why your generation hates work while slowly counting out dirty dollar bills.", bag: 40, mh: -20, aura: 0, clout: 0 },
    { title: "THE LOBSTER SUNBURN", text: "You forget sunscreen during a brutal 8-hour outdoor shift. You leave looking like a boiled crustacean and your neck is on fire.", bag: 0, mh: -20, aura: -10, clout: 0 },
    { title: "THE CONTRACT LEAD", text: "You hand a flyer to a pedestrian who happens to run a massive operations agency. He hires your team directly for next week.", bag: 80, mh: 15, aura: 15, clout: 10 },
    { title: "EQUIPMENT EXPLOSION", text: "Your cheap staple gun snaps into 4 spring-loaded pieces and drops straight down a storm drain.", bag: -20, mh: -10, aura: -5, clout: 0 },
    { title: "STREET TEAM CRED", text: "You plaster a hype music producer's show bills so perfectly across a trendy district that they shout you out on their main Instagram story.", bag: 0, mh: 10, aura: 25, clout: 45 }
  ]
};

const SAVE_KEY = 'bag-chaser-save-v1';

export const getInitialGameState = () => ({
  version: "1.1",
  lastProcessedTimestamp: Date.now(),
  // Navigation & Core Frame
  ph: 'PROLOGUE',
  proSt: 0,
  alias: '',
  diff: 2,
  tab: 'HUB',
  selTier: '0',
  death: null,
  cancelIntro: null,
  gBusy: false,
  rain: false,
  swFatigue: 0,
  hustleFatigue: { streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 },
  karmaFlags: { usedCheapBlanks: false, ignoredRefunds: false, soldBootleg: false, ignoredSmmCrisis: false, usedCheapParts: false, ignoredRunnerWelfare: false },
  fatalTragedyMessage: null,
  lastHustle: null,
  dropshipLock: 0,
  vintageLock: 0,
  smmPenalty: false,
  techSourceCost: 150,

  smmClients: 0,
  clientCrisis: false,
  vinCh: null,
  hustleClicks: { streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 },
  techItem: null,
  techFlipsComplete: 0,
  runnerCount: 0,
  runnerBurnout: false,

  saasUsers: 0,
  saasPrice: 50,
  saasChurn: 0.05,
  saasPenaltyActive: false,
  corpClients: 0,
  apiLockoutMonths: 0,
  creOfficeCount: 0,
  creRetailCount: 0,
  franchiseCount: 0,
  unionStrikeActive: false,
  unionStrikeIgnored: false,

  peProgress: 0,
  guttedFirms: 0,
  supplyChainDisruption: false,
  peCompoundingYield: 1.0,
  artMarketSentiment: 0,
  artCollection: [],
  venueState: "THE VAULT",

  audioTracks: 0,
  sampleStrike: false,
  pmcSquads: 0,
  intelLeak: false,

  // Tech Flipping Extensions
  techInterns: 0,
  bulkPalletsUnlocked: false,
  enterpriseContracts: 0,

  // Indie Audio Syndicate Extensions
  audioUpgrades: { mixingSuite: false, analogConsole: false },
  talentScouters: 0,
  holwoodSyncActive: false,

  // Vintage to Collectible Empire Evolution Line
  collectiblePhase: 'VINTAGE',
  vintageRevenueTracker: 0,
  vintageBoostActive: false,
  sneakerBackdoorPlug: false,
  consignmentFeeActive: false,
  vaultHoldings: [],

  // SMM Retainer Phase 2
  smmRetainerActive: false,
  aiSmmFactory: false,
  smmEmpireActive: false,

  // PMC Loop Phase 4
  pmcUnlocked: false,
  pmcMercenaries: 0,
  pmcActiveContracts: 0,
  pmcHeatLevel: 0.0,
  pmcMercCost: 50000,
  pmcBribeCost: 25000,

  conglomActive: false,
  movieProject: { status: 'IDLE', budgetTier: 1, hypeLevel: 0 },
  antitrustRisk: 0,
  swfInvestment: 0,
  geoStability: 1.0,
  swfFrozen: false,

  // Politics Tier 5
  superPacFunds: 0,
  approvalRating: 15.0,
  lobbyists: 0,
  lobbyistCost: 5000000,
  mediaBlitzCost: 10000000,
  isPresident: false,

  politicalSyndicate: { politicalCapital: 0, assetLeasing: { governors: 0, senators: 0, networkAnchors: 0 }, status: 'IDLE' },
  presidencyEligible: false,

  // Real World Monitor Ticker Engine
  tickerAdvice: 'MARKET WATCH: Global conditions stable. Continue the grind.',
  artBubbleMonths: 0,
  supplyChainShockMonths: 0,
  viralPopMonths: 0,

  // Flex Showcase System State
  flex: {
    // Bridge 1 - Corporate
    penthouse: { owned: false, expiresAt: 0 },
    logistics: { owned: false, expiresAt: 0 },
    jet: { owned: false, expiresAt: 0 },
    watch: { owned: false, prActive: false },
    car: { owned: false, prActive: false },
    art: { owned: false, prActive: false },
    // Bridge 2 - Sovereign
    yacht: { owned: false, expiresAt: 0 },
    media: { owned: false, expiresAt: 0 },
    foundation: { owned: false, expiresAt: 0 },
    spt: { owned: false, prActive: false },
    island: { owned: false, prActive: false },
    archive: { owned: false, prActive: false }
  },

  campaign: {
    currentWeek: 1,
    currentMonth: 1,
    warchest: 10000000000,
    phase: 'POLITICS',
    regionalPolling: { blueWall: 35, rustBelt: 35, sunBelt: 35 },
    opponentPolling: { blueWall: 42, rustBelt: 42, sunBelt: 42 }
  },

  seenNotifications: [],
  activeNotification: null,

  mhEmergencies: 0,
  pfwActive: false,
  activeEvent: null,
  isEventModalOpen: false,

  isBreakdownActive: false,
  shakeActive: false,
  passiveFrozen: false,

  // Financial Systems & Vital Signs
  pl: { bag: 25000, aura: 100, clout: 20, mo: 0, tier: 0, mentalHealth: 100, maxMentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 },

  // Macro Environment
  mkt: 0,
  news: ['Booting life simulation... System optimal.', 'Market Cycle initialized: NORMAL economy.'],
  imp: [],
  mod: { s: false, t: '', m: '', o: [], ui: '' },

  // Tech Tree Infrastructure
  up: { swIp: false, swFlg: false, swPar: false, swGlb: false, drpFac: false, ccAge: false, ccNet: false, podCmp: false, boxLg: false, boxBrd: false, trFst: false, tchGov: false, movStr: false, movUni: false },
  skl: { neg: 0, tax: 0, inf: 0 },
  ass: { mtgPent: false, mans: false, mtgMans: false, mtgJet: false, mtgYct: false, spc: false, swf: false, legalTeam: false },

  // Active Venture Vectors
  sw: { i: 1, u: 250, p: 45, a: 5000 },
  drp: { i: 1, u: 500, p: 35, a: 10000 },
  cc: { m: 'solo', v: 1, n: 1 },
  pod: { g: 1, q: 20000 },
  box: { v: 1, t: 1, b: 100000, p: 1 },
  tur: { t: 1, m: 150000, a: 50000, l: 100000 },
  tch: { l: false, u: 1200, srv: 0.15, pw: false, vc: false, m: 15000 },
  crp: { l: 0, t: '', i: 25000, m: 15000 },
  mov: { g: 1, w: 1, d: 1, s: 1, m: 5000000 },
  hf: { r: 0, t: 'NVDA', c: 5000000, l: 5 },
  ai: { ig: false, p: 0, r: 0, d: 1, c: 1, s: 1, dj: 0 },
  prs: { r: false, m: 0, cd: 0, rem: false, rst: 44, sun: 42, sub: 45, vp: 1, fr: false, vu: false, du: false, sh: false, ot: false, p1tt: false, p1op: false, p1et: false, ev: { d1: false, d2: false, o: false }, chest: 0, polls: 0 },

  // Legacy Registry
  peaks: { peakB: 25000, peakA: 100, peakC: 20 },
  hl: { sw: 0, drop: 0, cc: 0, pod: 0, box: 0, tch: 0, cryp: 0, tour: 0, mov: 0, hf: 0 },
  tally: { cryp: 0, box: 0, hf: 0, pres: 0 },
  generationCount: 0
});

export const useGameStore = create()(
  persist(
    (set, get) => ({
      ...getInitialGameState(),

      setPh: (ph) => set({ ph }),
      setProSt: (proSt) => set({ proSt }),
      setAlias: (alias) => set({ alias }),
      setDiff: (diff) => set({ diff }),
      setTab: (tab) => set({ tab }),
      setSelTier: (selTier) => set({ selTier }),
      setDeath: (death) => set({ death }),
      setCancelIntro: (cancelIntro) => set({ cancelIntro }),
      setGBusy: (gBusy) => set({ gBusy }),
      setSwFatigue: (swFatigue) => set({ swFatigue }),
      setHustleFatigue: (hustleFatigue) => set(state => ({ hustleFatigue: typeof hustleFatigue === 'function' ? hustleFatigue(state.hustleFatigue) : hustleFatigue })),
      setKarmaFlags: (karmaFlags) => set(state => ({ karmaFlags: typeof karmaFlags === 'function' ? karmaFlags(state.karmaFlags) : karmaFlags })),
      setFatalTragedyMessage: (msg) => set({ fatalTragedyMessage: msg }),
      setPl: (pl) => set(state => ({ pl: typeof pl === 'function' ? pl(state.pl) : pl })),
      setMkt: (mkt) => set({ mkt }),
      setNews: (news) => set(state => ({ news: typeof news === 'function' ? news(state.news) : news })),
      setUp: (up) => set(state => ({ up: typeof up === 'function' ? up(state.up) : up })),
      setSkl: (skl) => set(state => ({ skl: typeof skl === 'function' ? skl(state.skl) : skl })),
      setAss: (ass) => set(state => ({ ass: typeof ass === 'function' ? ass(state.ass) : ass })),
      setSw: (sw) => set(state => ({ sw: typeof sw === 'function' ? sw(state.sw) : sw })),
      setDrp: (drp) => set(state => ({ drp: typeof drp === 'function' ? drp(state.drp) : drp })),
      setCc: (cc) => set(state => ({ cc: typeof cc === 'function' ? cc(state.cc) : cc })),
      setPod: (pod) => set(state => ({ pod: typeof pod === 'function' ? pod(state.pod) : pod })),
      setBox: (box) => set(state => ({ box: typeof box === 'function' ? box(state.box) : box })),
      setTur: (tur) => set(state => ({ tur: typeof tur === 'function' ? tur(state.tur) : tur })),
      setTch: (tch) => set(state => ({ tch: typeof tch === 'function' ? tch(state.tch) : tch })),
      setCrp: (crp) => set(state => ({ crp: typeof crp === 'function' ? crp(state.crp) : crp })),
      setMov: (mov) => set(state => ({ mov: typeof mov === 'function' ? mov(state.mov) : mov })),
      setHf: (hf) => set(state => ({ hf: typeof hf === 'function' ? hf(state.hf) : hf })),
      setAi: (ai) => set(state => ({ ai: typeof ai === 'function' ? ai(state.ai) : ai })),
      setPrs: (prs) => set(state => ({ prs: typeof prs === 'function' ? prs(state.prs) : prs })),
      setPeaks: (peaks) => set(state => ({ peaks: typeof peaks === 'function' ? peaks(state.peaks) : peaks })),
      setHl: (hl) => set(state => ({ hl: typeof hl === 'function' ? hl(state.hl) : hl })),
      setTally: (tally) => set(state => ({ tally: typeof tally === 'function' ? tally(state.tally) : tally })),
      setMod: (mod) => set(state => ({ mod: typeof mod === 'function' ? mod(state.mod) : mod })),
      setIsEventModalOpen: (isOpen) => set({ isEventModalOpen: isOpen }),
      setPfwActive: (active) => set({ pfwActive: active }),
      setPassiveFrozen: (frozen) => set({ passiveFrozen: frozen }),
      setSmmClients: (smmClients) => set(state => ({ smmClients: typeof smmClients === 'function' ? smmClients(state.smmClients) : smmClients })),
      setClientCrisis: (clientCrisis) => set({ clientCrisis }),
      setVinCh: (vinCh) => set({ vinCh }),
      setHustleClicks: (hustleClicks) => set(state => ({ hustleClicks: typeof hustleClicks === 'function' ? hustleClicks(state.hustleClicks) : hustleClicks })),
      setTechItem: (techItem) => set({ techItem }),
      setTechFlipsComplete: (techFlipsComplete) => set(state => ({ techFlipsComplete: typeof techFlipsComplete === 'function' ? techFlipsComplete(state.techFlipsComplete) : techFlipsComplete })),
      setRunnerCount: (runnerCount) => set(state => ({ runnerCount: typeof runnerCount === 'function' ? runnerCount(state.runnerCount) : runnerCount })),
      setRunnerBurnout: (runnerBurnout) => set({ runnerBurnout }),
      setSaasUsers: (saasUsers) => set(state => ({ saasUsers: typeof saasUsers === 'function' ? saasUsers(state.saasUsers) : saasUsers })),
      setCorpClients: (corpClients) => set(state => ({ corpClients: typeof corpClients === 'function' ? corpClients(state.corpClients) : corpClients })),
      setCreOfficeCount: (creOfficeCount) => set(state => ({ creOfficeCount: typeof creOfficeCount === 'function' ? creOfficeCount(state.creOfficeCount) : creOfficeCount })),
      setCreRetailCount: (creRetailCount) => set(state => ({ creRetailCount: typeof creRetailCount === 'function' ? creRetailCount(state.creRetailCount) : creRetailCount })),
      setFranchiseCount: (franchiseCount) => set(state => ({ franchiseCount: typeof franchiseCount === 'function' ? franchiseCount(state.franchiseCount) : franchiseCount })),
      setSupplyChainDisruption: (disruption) => set({ supplyChainDisruption: disruption }),
      setArtCollection: (artCollection) => set(state => ({ artCollection: typeof artCollection === 'function' ? artCollection(state.artCollection) : artCollection })),
      setArtMarketSentiment: (artMarketSentiment) => set(state => ({ artMarketSentiment: typeof artMarketSentiment === 'function' ? artMarketSentiment(state.artMarketSentiment) : artMarketSentiment })),
      setVenueState: (venueState) => set({ venueState }),
      setAudioTracks: (audioTracks) => set(state => ({ audioTracks: typeof audioTracks === 'function' ? audioTracks(state.audioTracks) : audioTracks })),
      setSampleStrike: (sampleStrike) => set({ sampleStrike }),
      setPmcSquads: (pmcSquads) => set(state => ({ pmcSquads: typeof pmcSquads === 'function' ? pmcSquads(state.pmcSquads) : pmcSquads })),
      setIntelLeak: (intelLeak) => set({ intelLeak }),
      setTechInterns: (techInterns) => set(state => ({ techInterns: typeof techInterns === 'function' ? techInterns(state.techInterns) : techInterns })),
      setBulkPalletsUnlocked: (bulkPalletsUnlocked) => set({ bulkPalletsUnlocked }),
      setEnterpriseContracts: (enterpriseContracts) => set(state => ({ enterpriseContracts: typeof enterpriseContracts === 'function' ? enterpriseContracts(state.enterpriseContracts) : enterpriseContracts })),
      setAudioUpgrades: (audioUpgrades) => set(state => ({ audioUpgrades: typeof audioUpgrades === 'function' ? audioUpgrades(state.audioUpgrades) : audioUpgrades })),
      setTalentScouters: (talentScouters) => set(state => ({ talentScouters: typeof talentScouters === 'function' ? talentScouters(state.talentScouters) : talentScouters })),
      setHollywoodSyncActive: (active) => set({ holwoodSyncActive: active }),
      setCollectiblePhase: (collectiblePhase) => set({ collectiblePhase }),
      setVintageRevenueTracker: (vintageRevenueTracker) => set(state => ({ vintageRevenueTracker: typeof vintageRevenueTracker === 'function' ? vintageRevenueTracker(state.vintageRevenueTracker) : vintageRevenueTracker })),
      setVintageBoostActive: (vintageBoostActive) => set({ vintageBoostActive }),
      setSneakerBackdoorPlug: (sneakerBackdoorPlug) => set({ sneakerBackdoorPlug }),
      setConsignmentFeeActive: (consignmentFeeActive) => set({ consignmentFeeActive }),
      setVaultHoldings: (vaultHoldings) => set(state => ({ vaultHoldings: typeof vaultHoldings === 'function' ? vaultHoldings(state.vaultHoldings) : vaultHoldings })),
      setPmcUnlocked: (pmcUnlocked) => set({ pmcUnlocked }),
      setPmcMercenaries: (pmcMercenaries) => set(state => ({ pmcMercenaries: typeof pmcMercenaries === 'function' ? pmcMercenaries(state.pmcMercenaries) : pmcMercenaries })),
      setPmcActiveContracts: (pmcActiveContracts) => set(state => ({ pmcActiveContracts: typeof pmcActiveContracts === 'function' ? pmcActiveContracts(state.pmcActiveContracts) : pmcActiveContracts })),
      setPmcHeatLevel: (pmcHeatLevel) => set(state => ({ pmcHeatLevel: typeof pmcHeatLevel === 'function' ? pmcHeatLevel(state.pmcHeatLevel) : pmcHeatLevel })),
      setPmcMercCost: (pmcMercCost) => set(state => ({ pmcMercCost: typeof pmcMercCost === 'function' ? pmcMercCost(state.pmcMercCost) : pmcMercCost })),
      setPmcBribeCost: (pmcBribeCost) => set(state => ({ pmcBribeCost: typeof pmcBribeCost === 'function' ? pmcBribeCost(state.pmcBribeCost) : pmcBribeCost })),
      setSuperPacFunds: (superPacFunds) => set(state => ({ superPacFunds: typeof superPacFunds === 'function' ? superPacFunds(state.superPacFunds) : superPacFunds })),
      setApprovalRating: (approvalRating) => set(state => ({ approvalRating: typeof approvalRating === 'function' ? approvalRating(state.approvalRating) : approvalRating })),
      setLobbyists: (lobbyists) => set(state => ({ lobbyists: typeof lobbyists === 'function' ? lobbyists(state.lobbyists) : lobbyists })),
      setLobbyistCost: (lobbyistCost) => set(state => ({ lobbyistCost: typeof lobbyistCost === 'function' ? lobbyistCost(state.lobbyistCost) : lobbyistCost })),
      setMediaBlitzCost: (mediaBlitzCost) => set(state => ({ mediaBlitzCost: typeof mediaBlitzCost === 'function' ? mediaBlitzCost(state.mediaBlitzCost) : mediaBlitzCost })),
      setIsPresident: (isPresident) => set({ isPresident }),
      setPoliticalSyndicate: (politicalSyndicate) => set(state => ({ politicalSyndicate: typeof politicalSyndicate === 'function' ? politicalSyndicate(state.politicalSyndicate) : politicalSyndicate })),
      setPresidencyEligible: (presidencyEligible) => set({ presidencyEligible }),
      setCampaign: (campaign) => set(state => ({ campaign: typeof campaign === 'function' ? campaign(state.campaign) : campaign })),
      setFlex: (flex) => set(state => ({ flex: typeof flex === 'function' ? flex(state.flex) : flex })),
      setMhEmergencies: (mhEmergencies) => set(state => ({ mhEmergencies: typeof mhEmergencies === 'function' ? mhEmergencies(state.mhEmergencies) : mhEmergencies })),
      setIsBreakdownActive: (active) => set({ isBreakdownActive: active }),
      setShakeActive: (active) => set({ shakeActive: active }),
      setLastProcessedTimestamp: (ts) => set({ lastProcessedTimestamp: ts }),

      exStart: () => {
        const { alias, diff } = get();
        if (alias.length < 3) return;
        let plU;
        if (diff === 1) plU = { bag: 25000, aura: 30, clout: 30, maxMentalHealth: 100, mentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 };
        else if (diff === 2) plU = { bag: 5000, clout: 15, aura: 15, maxMentalHealth: 150, mentalHealth: 150, heat: 0, maxClout: 100, maxAura: 100 };
        else plU = { bag: 1000, clout: 5, aura: 5, maxMentalHealth: 100, mentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 };
        set(state => ({ pl: { ...state.pl, ...plU }, selTier: '0', tab: 'HUB', ph: 'PROLOGUE_INTRO' }));
      },

      dUp: (key, cost, flashMsg) => {
        const { pl } = get(); if (pl.bag < cost) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost }, up: { ...state.up, [key]: true }, news: [flashMsg, ...state.news.slice(0, 15)] }));
      },

      bAss: (key, cost, label, cloutBump = 45, auraBump = 0) => {
        const { pl } = get(); if (pl.bag < cost) return;
        set(state => ({
          pl: { ...state.pl, bag: state.pl.bag - cost, clout: Math.min(state.pl.maxClout, Number(state.pl.clout || 0) + Number(cloutBump || 0)), aura: Math.min(state.pl.maxAura, Number(state.pl.aura || 0) + Number(key === "spt" ? 5000 : auraBump || 0)) },
          ass: key !== 'sneakerBackdoorPlug' ? { ...state.ass, [key]: true } : state.ass,
          sneakerBackdoorPlug: key === 'sneakerBackdoorPlug' ? true : state.sneakerBackdoorPlug,
          passiveFrozen: (key === 'pent' || key === 'hePent') ? false : state.passiveFrozen,
          news: [`💎 FLEET UPGRADE: ${label}.`, ...state.news.slice(0, 15)]
        }));
      },

      getUpdatedCaps: (tier, currentFlex) => {
        const caps = [100, 250, 300, 5000, 5000, 999999999];
        const mhCaps = [100, 150, 300, 500, 500, 1000];
        let auraCap = caps[tier] || caps[0];
        let mhCap = mhCaps[tier] || mhCaps[0];
        let cloutCap = auraCap;

        if (!currentFlex) return { auraCap, cloutCap, mhCap };

        if (currentFlex?.yacht?.owned && tier < 5) {
          cloutCap = auraCap * 10;
        }

        if (currentFlex?.penthouse?.owned) {
          auraCap = Math.max(auraCap, 600);
          cloutCap = Math.max(cloutCap, 1500);
        }
        if (currentFlex?.logistics?.owned) {
          auraCap = Math.max(auraCap, 1200);
          cloutCap = Math.max(cloutCap, 1500);
        }
        if (currentFlex?.jet?.owned) {
          auraCap = Math.max(auraCap, 2000);
          cloutCap = Math.max(cloutCap, 2000);
        }

        if (currentFlex?.watch?.owned && currentFlex?.watch?.prActive) {
          auraCap = Math.max(200, auraCap);
        }

        return { auraCap, cloutCap, mhCap };
      },

      triggerImpact: (kind, amount) => {
        const id = Math.random();
        set(state => ({
          imp: [...state.imp, { id, kind, a: amount, w: amount >= 0 }]
        }));
        setTimeout(() => set(state => ({
          imp: state.imp.filter(i => i.id !== id)
        })), 1900);
      },

      triggerNotification: (id) => {
        const { seenNotifications } = get();
        if (seenNotifications.includes(id)) return;
        const data = NOTIFICATION_DATABASE[id];
        if (!data) return;

        set(state => ({
          seenNotifications: [...state.seenNotifications, id],
          activeNotification: data,
          gBusy: true
        }));
      },

      closeNotification: () => set({ activeNotification: null, gBusy: false }),

      updateFatigue: (activeHustle) => {
        const { flex, lastHustle } = get();
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);

        set(state => {
          const next = { ...state.hustleFatigue };
          const isDifferent = lastHustle !== activeHustle;
          Object.keys(next).forEach(k => {
            if (k === activeHustle) {
              const increase = 15 * (1 - mhReduction);
              next[k] = Math.min(100, next[k] + increase);
            } else if (isDifferent) {
              next[k] = Math.max(0, next[k] - 10);
            }
          });
          return { hustleFatigue: next, lastHustle: activeHustle };
        });
      },

      triggerChaos: (hustleKey) => {
        const { hustleFatigue, ass } = get();
        const fatigue = hustleFatigue[hustleKey] || 0;
        let risk = 0.02 + (fatigue / 100);
        if (ass.legalTeam) risk *= 0.5;
        return Math.random() < risk;
      },

      executeChaosRoll: async (hustleKey, baseSuccessAction) => {
        const roll = Math.floor(Math.random() * 20) + 1; // 1-20
        if (roll === 1) {
          const pool = mudChaosPools[hustleKey];
          if (!pool) return await baseSuccessAction();

          const event = pool[Math.floor(Math.random() * pool.length)];
          let updatedEventText = event.text;

          const { pl } = get();
          const willBeNegative = {
            bag: (pl.bag + event.bag) < 0,
            aura: (pl.aura + event.aura) < 0,
            clout: (pl.clout + event.clout) < 0,
            mh: (pl.mentalHealth + event.mh) < 0
          };

          if (willBeNegative.aura) updatedEventText += " (Hint: Go flip Vintage Tees to get your respect back.)";
          if (willBeNegative.mh) updatedEventText += " (Hint: Click MENTAL HEALTH TIME before you crash.)";
          if (willBeNegative.clout) updatedEventText += " (Hint: Run SMM packages or fix laptops.)";
          if (willBeNegative.bag) updatedEventText += " (Hint: Grind Surveys or deliver food.)";

          set(state => ({
            pl: {
              ...state.pl,
              bag: state.pl.bag + event.bag,
              aura: Math.max(0, Math.min(state.pl.maxAura, state.pl.aura + event.aura)),
              clout: Math.min(state.pl.maxClout, state.pl.clout + event.clout),
              mentalHealth: Math.max(0, Math.min(state.pl.maxMentalHealth, state.pl.mentalHealth + event.mh))
            },
            activeEvent: { ...event, text: updatedEventText },
            isEventModalOpen: true
          }));
          return undefined;
        }
        return await baseSuccessAction();
      },

      rVintage: async () => {
        const { pl, sneakerBackdoorPlug, vintageLock, flex, triggerChaos, updateFatigue, triggerNotification, karmaFlags, triggerImpact, collectiblePhase, adv } = get();
        const cost = sneakerBackdoorPlug ? 500 : 50;
        if (pl.bag < cost || pl.mentalHealth < 10) return;
        if (vintageLock > 0) {
          if (pl.bag >= 150) {
            set(state => ({
              mod: {
                s: true,
                t: "WAREHOUSE BRIBE",
                m: "The warehouse boss is still blocking your entry. Pay a $150 bribe to clear the blacklist?",
                o: [
                  { label: "PAY BRIBE ($150)", action: () => {
                    get().triggerNotification('HET_LOW_01');
                    set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 150 }, vintageLock: 0, mod: { s: false } }));
                  } },
                  { label: "CANCEL", action: () => set(state => ({ mod: { s: false } })) }
                ],
                ui: "ui-modal"
              }
            }));
          }
          return;
        }
        updateFatigue('vintage');
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);

        set(state => ({
          pl: { ...state.pl, bag: state.pl.bag - cost, mentalHealth: state.pl.mentalHealth - (10 * (1 - mhReduction)) },
          hustleClicks: { ...state.hustleClicks, vintage: state.hustleClicks.vintage + 1 }
        }));

        if (triggerChaos('vintage')) {
          const { pl: currentPl, karmaFlags: currentKarma } = get();
          const financialPhase = currentPl.bag < 10000 ? 1 : currentPl.bag < 100000 ? 2 : currentPl.bag < 500000 ? 3 : 0;
          if (currentPl.bag < 500000 && financialPhase === 3) triggerNotification('AUR_FAIL_01');

          if (currentKarma.soldBootleg) {
            set(state => ({
              pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 20) },
              smmPenalty: true,
              news: ["🚫 THE COMMUNITY EXPOSURE: Thrift community exposed your bootleg sales online. -20 Aura, SMM access locked.", ...state.news.slice(0, 15)]
            }));
          } else {
            set(state => ({
              vintageLock: 3,
              news: ["🚫 THE WAREHOUSE BLACKLIST: Boss blocks entry for 3 months unless you pay a $150 bribe.", ...state.news.slice(0, 15)]
            }));
          }
          return undefined;
        }

        await new Promise(r => setTimeout(r, 800));

        const roll = Math.random();
        let profit = -cost;
        if (roll < 0.01) { // GRAIL!
          set(state => ({
            pl: { ...state.pl, bag: state.pl.bag + 600, clout: Math.min(state.pl.maxClout, state.pl.clout + 15), aura: Math.min(state.pl.maxAura, state.pl.aura + 1) },
            vaultHoldings: collectiblePhase === 'VAULT' ? [...state.vaultHoldings, { name: "Thrifted Grail", cost: 600 }] : state.vaultHoldings,
            news: ["👕 GRAIL FOUND! A rare archive piece secured for the vault.", ...state.news.slice(0, 15)],
            mod: {
              s: true,
              t: "GRAIL SECURED! 🏆",
              m: "You hit the bins and found an authentic 1990s Grail. The street authenticity and clout boost is massive.",
              o: [{ label: "CELEBRATE", action: () => set(state => ({ mod: { s: false } })) }],
              ui: "ui-modal"
            }
          }));
          triggerImpact('bag', 600);
          profit = 600;
        } else if (roll < 0.61) { // Mid-Tier
          set(state => ({
            pl: { ...state.pl, bag: state.pl.bag + 120, clout: Math.min(state.pl.maxClout, state.pl.clout + 3) }
          }));
          triggerImpact('bag', 120);
          profit = 120;
        } else if (roll < 0.90) { // Common Thrift
          set(state => ({
            pl: { ...state.pl, bag: state.pl.bag + 35 }
          }));
          triggerImpact('bag', 35);
          profit = 35;
        } else { // Bootleg
          set({ vinCh: 'bootleg' });
          return undefined;
        }

        const net = profit - cost;
        if (net > 0) {
          set(state => {
            const nextRev = state.vintageRevenueTracker + net;
            let nextPhase = state.collectiblePhase;
            let nextBoost = state.vintageBoostActive;
            let nextAura = state.pl.aura;
            let newsUpdate = [];

            if (nextRev >= 2500 && state.collectiblePhase === 'VINTAGE') {
              nextPhase = 'SNEAKER';
              nextBoost = true;
              nextAura += 500;
              newsUpdate = ["🌟 VINTAGE EMPIRE UNLOCKED! +500 Aura & +50% Passive Revenue Boost!"];
            }

            return {
              vintageRevenueTracker: nextRev,
              collectiblePhase: nextPhase,
              vintageBoostActive: nextBoost,
              pl: { ...state.pl, aura: nextAura },
              news: [...newsUpdate, ...state.news.slice(0, 15 - newsUpdate.length)]
            };
          });
        }

        adv();
        return profit;
      },

      rVinCh: async (choice) => {
        const { adv, triggerImpact, triggerNotification } = get();
        if (choice === 'burn') {
          set(state => ({
            pl: { ...state.pl, aura: Math.min(state.pl.maxAura, state.pl.aura + 1) },
            news: ["🔥 VINTAGE: Burned the bootleg. Street authenticity +1.", ...state.news.slice(0, 15)]
          }));
        } else if (choice === 'pass') {
          triggerNotification('CLT_FAIL_01');
          set(state => ({
            pl: { ...state.pl, bag: state.pl.bag + 150, aura: Math.max(0, state.pl.aura - 10) },
            news: ["💀 VINTAGE: Passed off a rep. Reputation damaged, but bags secured.", ...state.news.slice(0, 15)]
          }));
          triggerImpact('bag', 150);
        }
        set({ vinCh: null });
        adv();
      },

      rSw: async () => {
        const { pl, sw, up, flex, swFatigue, updateFatigue, triggerChaos, triggerNotification, ass, karmaFlags, triggerImpact, adv, mkt, legacyMultiplier } = get();
        const totalOut = (sw.u * (sw.i === 1 ? 15 : sw.i === 2 ? 40 : 90)) + (up.swFlg ? 0 : sw.a);
        if (pl.mentalHealth < 15) return;
        updateFatigue('streetwear');
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);

        set(state => ({
          pl: { ...state.pl, bag: state.pl.bag - totalOut, mentalHealth: state.pl.mentalHealth - (15 * (1 - mhReduction)) },
          hustleClicks: { ...state.hustleClicks, streetwear: state.hustleClicks.streetwear + 1 }
        }));

        if (triggerChaos('streetwear')) {
          const { pl: currentPl } = get();
          const financialPhase = currentPl.bag < 10000 ? 1 : currentPl.bag < 100000 ? 2 : currentPl.bag < 500000 ? 3 : 0;
          if (financialPhase === 2) triggerNotification('HET_RISE_01');

          if (karmaFlags.usedCheapBlanks) {
            const cloutPen = ass.legalTeam ? 7 : 15;
            set(state => ({
              pl: { ...state.pl, clout: Math.max(0, state.pl.clout - cloutPen) },
              news: ["💀 KARMA DETONATION: Influencer rips your stitching apart. Penalty mitigated by legal.", ...state.news.slice(0, 15)]
            }));
          } else {
            const bagPen = ass.legalTeam ? 200 : 400;
            const cloutPen = ass.legalTeam ? 7 : 15;
            const mhPen = ass.legalTeam ? 12 : 25;
            set(state => ({
              pl: { ...state.pl, bag: state.pl.bag - bagPen, clout: Math.max(0, state.pl.clout - cloutPen), mentalHealth: Math.max(0, state.pl.mentalHealth - mhPen) },
              news: ["🚫 THE COPYRIGHT STRIKE: Legal team reduced damages.", ...state.news.slice(0, 15)]
            }));
          }
          return undefined;
        }

        await new Promise(r => setTimeout(r, 1000));

        const baseValue = sw.i === 1 ? 50 : sw.i === 2 ? 125 : 300;
        let hype = (pl.aura * 0.5) + (pl.clout * 0.3) + (sw.a / 2500);
        if (mkt === 1) hype *= 1.6;

        if (sw.p > baseValue) {
          hype *= Math.max(0, 1 - ((sw.p - baseValue) * 0.04));
        }

        hype *= Math.max(0, 1 - (swFatigue * 0.15));

        let unitsSold = Math.floor(Math.min(sw.u, Math.max(0, hype * (5 + Math.random() * 5))));
        unitsSold = Math.max(0, unitsSold);

        const revenue = Math.floor(unitsSold * sw.p * legacyMultiplier);
        const profit = revenue - totalOut;

        set(state => ({ swFatigue: state.swFatigue + (sw.u / 1000) }));

        let auraGain = 0;
        let cloutGain = 0;
        let newsMsg = "";

        if (unitsSold >= sw.u * 0.8) {
          const { pl: currentPl } = get();
          const financialPhase = currentPl.bag < 10000 ? 1 : currentPl.bag < 100000 ? 2 : currentPl.bag < 500000 ? 3 : 0;
          if (currentPl.bag < 500000 && financialPhase === 3) triggerNotification('BAG_WIN_01');

          auraGain = 10;
          cloutGain = 5;
          newsMsg = "👟 VIRAL SELLOUT! Cleared all inventory.";
        } else if (unitsSold < sw.u * 0.2) {
          auraGain = -15;
          newsMsg = "👟 Bricked. Heavy boxes sitting in the warehouse.";
        } else {
          newsMsg = `👟 Drop concluded. Moved ${unitsSold.toLocaleString()} units.`;
        }

        set(state => ({
          pl: {
            ...state.pl,
            bag: state.pl.bag + revenue,
            aura: Math.min(state.pl.maxAura, Math.max(0, state.pl.aura + auraGain)),
            clout: Math.min(state.pl.maxClout, state.pl.clout + (cloutGain || 0))
          },
          news: [newsMsg, ...state.news.slice(0, 15)],
          hl: { ...state.hl, sw: state.hl.sw + Math.max(0, profit) }
        }));

        triggerImpact('bag', profit);
        adv();
        return profit;
      },

      rSwSpin: async (bet) => {
        const { pl, pfwActive, up, adv } = get();
        if (pl.bag < bet || pl.mentalHealth < 10) return;

        const effectivePfw = pfwActive && up.swFlg;
        const pool = effectivePfw ? ['🧍‍♂️', '🧍‍♀️', '🕴️'] : ['👕', '🧥', '🥼'];
        const theme = effectivePfw ? "High Fashion Editorial Payout" : "Standard Drop Payout";

        set(state => ({
          pl: { ...state.pl, bag: state.pl.bag - bet, mentalHealth: state.pl.mentalHealth - 10 }
        }));

        await new Promise(r => setTimeout(r, 600));

        const reels = [
          pool[Math.floor(Math.random() * pool.length)],
          pool[Math.floor(Math.random() * pool.length)],
          pool[Math.floor(Math.random() * pool.length)],
          pool[Math.floor(Math.random() * pool.length)]
        ];

        let streak = 1;
        for (let i = 1; i < 4; i++) {
          if (reels[i] === reels[0]) streak++;
          else break;
        }

        let multiplier = 0;
        if (streak === 4) multiplier = 2.0;
        else if (streak === 3) multiplier = 1.0;
        else if (streak === 2) multiplier = 0.5;

        const payout = Math.floor(bet * multiplier);
        const profit = payout - bet;

        set(state => ({
          pl: { ...state.pl, bag: state.pl.bag + payout },
          news: [`🎰 RISK TERMINAL: ${theme}. [${reels.join('')}] Streak: ${streak}. Net: $${fMny(profit)}`, ...state.news.slice(0, 15)]
        }));

        adv();
        return { reels, profit, streak };
      },

      adv: (intervals = 1) => {
        const { fatalTragedyMessage, clientCrisis, karmaFlags, runnerBurnout, apiLockoutMonths, saasPenaltyActive, artBubbleMonths, supplyChainShockMonths, viralPopMonths, talentScouters, isPresident, politicalSyndicate, flex, saasChurn, corpClients, saasPrice, mkt, ass, skl, tch, smmEmpireActive, smmClients, aiSmmFactory, smmRetainerActive, runnerCount, audioTracks, sampleStrike, pmcSquads, pmcActiveContracts, techInterns, enterpriseContracts, vintageBoostActive, collectiblePhase, peCompoundingYield, swfFrozen, swfInvestment, geoStability, conglomActive, antitrustRisk, ai, prs, legacyMultiplier, pmcHeatLevel, passiveFrozen, hustleClicks } = get();

        if (fatalTragedyMessage) return;

        set(state => {
          const now = Date.now();
          const nextHustleFatigue = { ...state.hustleFatigue };
          Object.keys(nextHustleFatigue).forEach(k => { nextHustleFatigue[k] = Math.max(0, nextHustleFatigue[k] - (20 * intervals)); });

          const nextState = {
            swFatigue: Math.max(0, state.swFatigue - (0.25 * intervals)),
            hustleFatigue: nextHustleFatigue,
            dropshipLock: Math.max(0, state.dropshipLock - intervals),
            vintageLock: Math.max(0, state.vintageLock - intervals),
            apiLockoutMonths: Math.max(0, state.apiLockoutMonths - intervals),
            saasPenaltyActive: false,
            artBubbleMonths: Math.max(0, state.artBubbleMonths - intervals),
            supplyChainShockMonths: Math.max(0, state.supplyChainShockMonths - intervals),
            viralPopMonths: Math.max(0, state.viralPopMonths - intervals)
          };

          let newsUpdate = [];
          if (clientCrisis) {
            if (karmaFlags.ignoredSmmCrisis) {
              nextState.smmClients = Math.max(0, state.smmClients - 2);
              newsUpdate.push("📉 SMM: Disgruntled clients post terrible reviews. 2 clients churned.");
            } else {
              nextState.smmClients = Math.max(0, state.smmClients - 1);
              newsUpdate.push("📉 SMM: Client churned due to unresolved crisis.");
            }
            nextState.clientCrisis = false;
          }

          if (runnerBurnout) {
            if (karmaFlags.ignoredRunnerWelfare) {
              nextState.pl = { ...state.pl, bag: state.pl.bag - 500, clout: Math.max(0, state.pl.clout - 10) };
              newsUpdate.push("📉 GIG: A disgruntled runner stole a premium package. -$500, -10 Clout.");
            } else {
              nextState.runnerCount = Math.max(0, state.runnerCount - 1);
              newsUpdate.push("📉 GIG: Runner mutinied and stole inventory due to burnout.");
            }
            nextState.runnerBurnout = false;
          }

          if (artBubbleMonths > 0 && artBubbleMonths <= intervals) nextState.tickerAdvice = "WALL STREET: Art Market bubble has burst. Margins normalized.";
          if (supplyChainShockMonths > 0 && supplyChainShockMonths <= intervals) nextState.tickerAdvice = "SUPPLY CHAIN: Component logistics restored. Tech Flipping costs normalized.";
          if (viralPopMonths > 0 && viralPopMonths <= intervals) nextState.tickerAdvice = "TREND WATCH: Retro-synth viral wave fading. Audio Syndicate rates normalized.";

          if (Math.random() < 0.10) {
            const eventRoll = Math.random();
            if (eventRoll < 0.33) {
              nextState.artBubbleMonths = 3;
              nextState.tickerAdvice = "📈 WALL STREET: Art Market experiencing speculative bubble! Art Hustle resale margins boosted by +40% for the next 3 months.";
            } else if (eventRoll < 0.66) {
              nextState.supplyChainShockMonths = 3;
              nextState.tickerAdvice = "⚠️ SUPPLY CHAIN SHOCK: Electronic component shortages hit logistics. Tech Flipping Pallet costs increased by 20%.";
            } else {
              nextState.viralPopMonths = 3;
              nextState.tickerAdvice = "🎙️ VIRAL POP TREND: Retro-synth sounds going hyper-viral. Indie Audio Syndicate success rates boosted to 90%.";
            }
          }

          if (talentScouters > 0) {
            nextState.audioTracks = state.audioTracks + (talentScouters * intervals);
          }

          if (lobbyists > 0) {
            nextState.pl = nextState.pl || { ...state.pl };
            nextState.pl.clout = Math.min(nextState.pl.maxClout, nextState.pl.clout + (lobbyists * 25 * intervals));
            nextState.approvalRating = Math.min(100, state.approvalRating + (0.5 * lobbyists * intervals));
          }

          if (!isPresident) {
            nextState.approvalRating = Math.max(0, (nextState.approvalRating ?? state.approvalRating) - (2.5 * intervals));
          }

          const psAssets = politicalSyndicate.assetLeasing;
          if (psAssets.governors > 0 || psAssets.senators > 0 || psAssets.networkAnchors > 0) {
            let gain = (psAssets.governors * 0.5) + (psAssets.senators * 1.5) + (psAssets.networkAnchors * 3.0);
            if (flex.yacht.owned) {
              const isBlitzed = flex.yacht.expiresAt > Date.now();
              gain *= (isBlitzed ? 2.0 : 1.5);
            }
            let nextCapital = Math.min(100, politicalSyndicate.politicalCapital + (gain * intervals));
            nextState.politicalSyndicate = { ...politicalSyndicate, politicalCapital: nextCapital, status: nextCapital >= 100 ? 'CAMPAIGN_READY' : politicalSyndicate.status };
          }

          nextState.saasUsers = Math.max(0, state.saasUsers + ((corpClients * (10 + Math.floor(state.pl.clout / 20))) - Math.floor(state.saasUsers * saasChurn)) * intervals);
          nextState.geoStability = Math.min(1.5, Math.max(0.5, state.geoStability + (Math.random() - 0.5) * 0.1));

          let expenseBurn = 500;
          if (mkt === 2) expenseBurn *= 2;
          if (corpClients > 0) expenseBurn += 10000;
          let yieldIncome = 0;
          if (flex.watch.owned) yieldIncome += 750;
          if (flex.penthouse.owned) yieldIncome += 15000;
          if (flex.car.owned) expenseBurn += 8000;
          if (flex.yacht.owned) expenseBurn += 250000;
          if (ass.legalTeam) expenseBurn += 1000000;
          expenseBurn = Math.floor(expenseBurn * (1 - (skl.tax * 0.04)));

          let passiveSrv = (tch.l && tch.pw) ? Math.floor(500 + (tch.u * tch.srv)) : 0;
          let smmRev = smmEmpireActive ? Math.floor(25000 * (state.pl.clout / 300)) : (state.smmClients * 300) + (aiSmmFactory ? 1000 : (smmRetainerActive ? 500 : 0));
          if (flex.penthouse.owned) {
            const isBlitzed = flex.penthouse.expiresAt > Date.now();
            smmRev = Math.floor(smmRev * (isBlitzed ? 1.70 : 1.35));
          }
          const runnerRev = state.runnerCount * 150;
          const audioYield = sampleStrike ? 0 : (state.audioTracks * 400 * (state.holwoodSyncActive ? 2.0 : 1.0));
          const pmcYield = (state.pmcSquads * 75000) + (state.pmcActiveContracts * 100000);
          const techInternRev = state.techInterns * 500;
          const enterpriseRev = state.enterpriseContracts * 5000;
          let vintagePassives = vintageBoostActive ? (hustleClicks.vintage * 50) * 0.5 : 0;
          let consignmentRev = (collectiblePhase === "CONSIGNMENT") ? Math.floor(5000 * (state.pl.clout / 100)) : 0;
          const saasRev = (state.saasUsers * saasPrice) * (state.saasPenaltyActive ? 0.5 : 1);
          const saasOverhead = state.saasUsers * 2;
          const aiRev = state.apiLockoutMonths > 0 ? 0 : (corpClients * 8000);
          let creGross = (state.creOfficeCount * 45000) + (state.creRetailCount * 15000);
          if (mkt === 2 || mkt === 3) creGross = 0;
          let vacancyMult = ((state.creOfficeCount > 0 || state.creRetailCount > 0) && Math.random() < 0.15) ? 0.5 + (Math.random() * 0.4) : 1.0;
          const creNet = (creGross * vacancyMult) - (state.creOfficeCount * 20000) - (state.creRetailCount * 5000);
          const franchiseRev = (state.unionStrikeActive || state.supplyChainDisruption) ? 0 : (state.franchiseCount * 25000);
          let peRev = state.supplyChainDisruption ? -500000 : (state.guttedFirms * 100000 * state.peCompoundingYield);
          const auraBleed = (state.unionStrikeIgnored ? 50 : 0) + (state.intelLeak ? 20 : 0);
          const totalArtCount = state.artCollection?.length || 0;
          const artClout = totalArtCount * 20;
          let artPassiveRev = 0;
          if (totalArtCount >= 50) {
            const totalValue = state.artCollection.reduce((acc, curr) => acc + curr.baseValue, 0);
            artPassiveRev = Math.floor(totalValue * (totalArtCount >= 75 && flex.archive?.owned ? 0.003 : 0.001));
          }
          const artDrift = (flex.art.owned && flex.art.prActive) ? 5 : 0;

          if (collectiblePhase === "VAULT" && state.vaultHoldings.length > 0) {
            let cycles = 0;
            for (let i = 1; i <= intervals; i++) if ((state.pl.mo + i) % 12 === 0) cycles++;
            if (cycles > 0) nextState.vaultHoldings = state.vaultHoldings.map(h => ({ ...h, cost: Math.floor(h.cost * Math.pow(1.12, cycles)) }));
          }

          const currentPl = nextState.pl ?? state.pl;
          let basePassive = Math.floor((passiveSrv + smmRev + runnerRev + audioYield + pmcYield + (saasRev - saasOverhead) + aiRev + creNet + franchiseRev + peRev + techInternRev + enterpriseRev + consignmentRev + vintagePassives + artPassiveRev) * legacyMultiplier);
          if (passiveFrozen) basePassive = 0;
          const conglomBonus = conglomActive ? Math.floor(basePassive * 0.25) : 0;
          const swfYield = !state.swfFrozen ? Math.floor(state.swfInvestment * 0.06 * state.geoStability) : 0;

          nextState.pl = {
            ...currentPl,
            mo: currentPl.mo + intervals,
            bag: currentPl.bag + (-expenseBurn + yieldIncome + basePassive + (swfYield * legacyMultiplier) + conglomBonus) * intervals,
            aura: Math.min(currentPl.maxAura, Math.max(0, currentPl.aura + (-auraBleed + (collectiblePhase === "VAULT" ? (nextState.vaultHoldings ?? state.vaultHoldings).length * 50 : 0) + artDrift) * intervals)),
            clout: Math.min(currentPl.maxClout, currentPl.clout + (artClout + (nextState.audioTracks ?? state.audioTracks) * 2) * intervals),
            heat: currentPl.heat + (state.pmcSquads * 2 * (isPresident ? 0.5 : 1) * intervals),
            mentalHealth: Math.min(currentPl.maxMentalHealth, currentPl.mentalHealth + ((flex.penthouse.owned ? 30 : 15) * intervals))
          };

          let heatAdded = (state.pmcActiveContracts > 0) ? (10.0 * state.pmcActiveContracts * intervals * (isPresident ? 0.5 : 1)) : 0;
          const finalHeat = state.pmcHeatLevel + heatAdded;
          if (finalHeat > 80 && Math.random() < 0.05) {
            nextState.pl.bag -= 500000; nextState.pmcMercenaries = Math.floor(state.pmcMercenaries * 0.5);
            nextState.pmcActiveContracts = 0; nextState.pmcHeatLevel = Math.max(0, finalHeat - 30);
            newsUpdate.push("<span class='news-scandal'>🚨 INTERPOL RAID: Your PMC operations were compromised!</span>");
          } else if (heatAdded > 0) nextState.pmcHeatLevel = finalHeat;

          if (state.geoStability < 0.7 && !state.swfFrozen && Math.random() < 0.15) { nextState.swfFrozen = true; newsUpdate.push("🌍 SWF ALERT: International asset freeze."); }
          else if (state.geoStability > 1.1 && state.swfFrozen) { nextState.swfFrozen = false; newsUpdate.push("🌍 SWF: Asset freeze lifted."); }

          if (conglomActive) {
            nextState.antitrustRisk = state.antitrustRisk + (3 * intervals);
            if (nextState.antitrustRisk > (Math.random() * 80 + 20)) { nextState.pl.bag -= 50000000; newsUpdate.push("🏛️ ANTI-TRUST fine."); nextState.antitrustRisk = 0; }
          }

          if (Math.random() < 0.15) { nextState.mkt = Math.floor(Math.random() * 4); newsUpdate.push(`🚨 MARKET WATCH shift.`); }
          if (state.smmClients > 0 && Math.random() < 0.20) { nextState.clientCrisis = true; newsUpdate.push("🚨 SMM ALERT."); }
          if (state.runnerCount > 0 && Math.random() < 0.15) { nextState.runnerBurnout = true; newsUpdate.push("🚨 RUNNER ALERT."); }
          nextState.artMarketSentiment = Math.min(1, Math.max(-1, state.artMarketSentiment + (Math.random() - 0.5) * 0.4));
          if (state.guttedFirms > 0 || state.franchiseCount > 0) {
            if (Math.random() < 0.02) { nextState.supplyChainDisruption = true; newsUpdate.push("🚨 EMPIRE ALERT."); }
            if (!state.supplyChainDisruption && state.guttedFirms > 0) nextState.peCompoundingYield = state.peCompoundingYield + 0.02;
          }
          if (ai.ig) nextState.ai = { ...ai, p: Math.min(100, ai.p + ai.c * (1.2 + Math.random() * 2) * intervals), r: Math.min(100, ai.r + (1.8 + Math.random() * 2.5) * intervals) };
          if (prs.r) nextState.prs = { ...prs, m: prs.m + intervals };

          return { ...nextState, lastProcessedTimestamp: now, news: [...newsUpdate, ...state.news.slice(0, 15 - newsUpdate.length)] };
        });
      },

      performHardReset: () => {
        if (window.autoSaveInterval) clearInterval(window.autoSaveInterval);
        localStorage.clear(); sessionStorage.clear(); set(getInitialGameState());
        setTimeout(() => window.location.href = window.location.origin + window.location.pathname + '?t=' + Date.now(), 150);
      },

      rBuyFlex: (id, cost) => {
        const { pl, flex, getUpdatedCaps } = get();
        if (pl.bag < cost) return;
        const updatedFlex = { ...flex, [id]: { ...flex[id], owned: true } };
        const { auraCap, cloutCap, mhCap } = getUpdatedCaps(pl.tier, updatedFlex);
        set(state => ({
          pl: { ...state.pl, bag: state.pl.bag - cost, maxClout: cloutCap, maxAura: auraCap, maxMentalHealth: mhCap },
          flex: updatedFlex, passiveFrozen: id === 'penthouse' ? false : state.passiveFrozen,
          news: [`💎 FLEX ACQUIRED.`, ...state.news.slice(0, 15)]
        }));
      },

      rRest: async () => {
        const { pl, triggerNotification, adv } = get();
        if (pl.bag < 100000 && pl.bag >= 10000) triggerNotification('HEA_BOOST_01');
        set(state => ({
          pl: { ...state.pl, mentalHealth: Math.min(state.pl.maxMentalHealth, state.pl.mentalHealth + 50) },
          passiveFrozen: false,
          news: ["😴 Resting... Passive income resumes.", ...state.news.slice(0, 15)]
        }));
        adv();
      },

      rRetire: () => {
        const { diff } = get();
        let plUpdate;
        if (diff === 1) plUpdate = { bag: 25000, aura: 30, clout: 30, mo: 0, tier: 0, mentalHealth: 300, maxMentalHealth: 300, heat: 0, maxClout: 100, maxAura: 100 };
        else if (diff === 2) plUpdate = { bag: 5000, clout: 15, aura: 15, mo: 0, tier: 0, mentalHealth: 150, maxMentalHealth: 150, heat: 0, maxClout: 100, maxAura: 100 };
        else plUpdate = { bag: 1000, clout: 5, aura: 5, mo: 0, tier: 0, mentalHealth: 100, maxMentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 };

        const initialState = getInitialGameState();
        set({
          ...initialState,
          pl: { ...initialState.pl, ...plUpdate },
          generationCount: get().generationCount + 1,
          news: ['Your legacy continues...', 'Market Cycle: NORMAL.']
        });
      },

      rSubmitToHallOfFame: async (playerName) => {
        const { pl, isPresident, mhEmergencies } = get();
        set({ alias: playerName });
        await new Promise(r => setTimeout(r, 1500));
        localStorage.removeItem('bag-chaser-save-v1');
        set({ ph: 'POST_MORTEM' });
      },

      rDischarge: () => {
        set(state => ({
          pl: {
            ...state.pl,
            bag: state.pl.bag - 300,
            mo: state.pl.mo + 1,
            mentalHealth: Math.min(state.pl.maxMentalHealth, Math.floor(state.pl.maxMentalHealth * 0.5))
          },
          isBreakdownActive: false,
          gBusy: false,
          news: ["🏥 DISCHARGED: Mandated wellness rehab completed. -$300.", ...state.news.slice(0, 15)]
        }));
      },

      rSneakerDrop: async () => {
        const { pl, flex, sneakerBackdoorPlug, updateFatigue, triggerImpact, adv } = get();
        if (pl.bag < 300 || pl.mentalHealth < 15) return;
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 300, mentalHealth: state.pl.mentalHealth - (15 * (1 - mhReduction)) } }));
        await new Promise(r => setTimeout(r, 800));
        const success = sneakerBackdoorPlug || Math.random() < 0.5;
        let profit = -300;
        if (success) {
          profit = 600;
          set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 900, clout: Math.min(state.pl.maxClout, state.pl.clout + 15), aura: Math.min(state.pl.maxAura, state.pl.aura + 10) }, news: ["🔥 HYPEBEAST WIN!", ...state.news.slice(0, 15)] }));
          triggerImpact('bag', 600);
        } else {
          set(state => ({ pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 20), mentalHealth: Math.max(0, state.pl.mentalHealth - 10) }, news: ["💀 CAUGHT BUSTED!", ...state.news.slice(0, 15)] }));
        }
        adv(); return profit;
      },

      rBuyConsignment: async () => {
        const { pl } = get(); if (pl.bag < 1500000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 1500000 }, collectiblePhase: 'CONSIGNMENT', consignmentFeeActive: true, news: ["📱 PLATFORM: Hype Consignment Network launched.", ...state.news.slice(0, 15)] }));
      },

      rBuyVault: async () => {
        const { pl } = get(); if (pl.bag < 5000000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 5000000 }, collectiblePhase: 'VAULT', news: ["🔒 VAULT: Blue-Chip Collectible Vault constructed.", ...state.news.slice(0, 15)] }));
      },

      rBuyVaultAsset: async (asset) => {
        const { pl } = get(); if (pl.bag < asset.cost) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - asset.cost, aura: Math.min(state.pl.maxAura, state.pl.aura + asset.aura) }, vaultHoldings: [...state.vaultHoldings, { name: asset.name, cost: asset.cost }], news: [`🏆 VAULT: Acquired ${asset.name}.`, ...state.news.slice(0, 15)] }));
      },

      rVaultAuction: async () => {
        const { pl, adv } = get(); if (pl.bag < 500000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 500000 } }));
        await new Promise(r => setTimeout(r, 1000));
        const itemNames = ["1985 Game-Worn Jordans", "Original Comic Art #1", "Pre-War Luxury Timepiece", "Historical Document Fragment"];
        const name = itemNames[Math.floor(Math.random() * itemNames.length)];
        set(state => ({ vaultHoldings: [...state.vaultHoldings, { name, cost: 500000 }], news: [`🏆 AUCTION: Secured ${name}.`, ...state.news.slice(0, 15)] }));
        adv();
      },

      rLaunchSmmRetainer: async () => {
        const { pl } = get(); if (pl.bag < 4000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 4000 }, smmRetainerActive: true, news: ["📱 SMM: Retainer packages launched.", ...state.news.slice(0, 15)] }));
      },

      rBuySmmFactory: async () => {
        const { pl } = get(); if (pl.bag < 20000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 20000 }, aiSmmFactory: true, news: ["🤖 SMM: AI Content Factory deployed.", ...state.news.slice(0, 15)] }));
      },

      rBuySmmEmpire: async () => {
        const { pl } = get(); if (pl.bag < 250000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 250000 }, smmEmpireActive: true, news: ["🌍 SMM: Global Media Empire established.", ...state.news.slice(0, 15)] }));
      },

      rSmmPitch: async () => {
        const { pl, smmPenalty, smmRetainerActive, flex, updateFatigue, triggerChaos, triggerNotification, karmaFlags, adv } = get();
        if (pl.clout < 15 || pl.mentalHealth < 20 || smmPenalty || smmRetainerActive) return;
        updateFatigue('smm');
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, mentalHealth: state.pl.mentalHealth - (20 * (1 - mhReduction)) }, hustleClicks: { ...state.hustleClicks, smm: state.hustleClicks.smm + 1 } }));
        if (triggerChaos('smm')) {
          const { pl: curPl } = get();
          const phase = curPl.bag < 10000 ? 1 : curPl.bag < 100000 ? 2 : curPl.bag < 500000 ? 3 : 0;
          if (curPl.bag < 500000 && phase === 3) triggerNotification('HET_CRASH_01');
          if (karmaFlags.ignoredSmmCrisis) set(state => ({ smmClients: Math.max(0, state.smmClients - 2), news: ["📉 KARMA DETONATION: 2 clients lost.", ...state.news.slice(0, 15)] }));
          else set(state => ({ smmPenalty: true, news: ["🚫 THE GROUP-CHAT BLACKLIST.", ...state.news.slice(0, 15)] }));
          return undefined;
        }
        await new Promise(r => setTimeout(r, 800));
        if (Math.random() < (smmPenalty ? 0.1 : 0.5)) set(state => ({ smmClients: state.smmClients + 1, news: ["🤝 SMM: Pitch successful!", ...state.news.slice(0, 15)] }));
        else set(state => ({ news: ["❌ SMM: Pitch Rejected.", ...state.news.slice(0, 15)] }));
        adv();
      },

      rSmmFix: async () => {
        const { pl, flex, adv } = get(); if (pl.mentalHealth < 15) return;
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, mentalHealth: state.pl.mentalHealth - (15 * (1 - mhReduction)) } }));
        await new Promise(r => setTimeout(r, 800));
        set({ clientCrisis: false });
        set(state => ({ news: ["✅ SMM: Content strategy fixed.", ...state.news.slice(0, 15)] }));
        adv();
      },

      rDelivery: async () => {
        const { pl, flex, adv } = get(); if (pl.mentalHealth < 15) return;
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 25, mentalHealth: state.pl.mentalHealth - (15 * (1 - mhReduction)) } }));
        adv(); return 25;
      },

      rPlasma: async () => {
        const { pl, flex, adv } = get(); if (pl.mentalHealth < 40) return;
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 60, mentalHealth: state.pl.mentalHealth - (40 * (1 - mhReduction)) } }));
        adv(); return 60;
      },

      rSurvey: async () => {
        const { pl, flex, adv } = get(); if (pl.mentalHealth < 10) return;
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 10, mentalHealth: state.pl.mentalHealth - (10 * (1 - mhReduction)) } }));
        adv(); return 10;
      },

      rLabor: async () => {
        const { pl, flex, adv } = get(); if (pl.mentalHealth < 25) return;
        const isJetOwned = flex.jet.owned;
        const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
        const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 45, mentalHealth: state.pl.mentalHealth - (25 * (1 - mhReduction)) } }));
        adv(); return 45;
      },

      rTechSource: async () => {
        const { pl, bulkPalletsUnlocked, techSourceCost, updateFatigue, triggerChaos, karmaFlags } = get();
        const cost = bulkPalletsUnlocked ? Math.floor(techSourceCost * 0.6) : techSourceCost;
        if (pl.bag < cost) return; updateFatigue('tech');
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost }, techItem: { id: Math.random(), name: "Bricked Hardware" }, hustleClicks: { ...state.hustleClicks, tech: state.hustleClicks.tech + 1 } }));
        if (triggerChaos('tech')) {
          if (karmaFlags.usedCheapParts) set(state => state.pl.bag >= 250 ? { pl: { ...state.pl, bag: state.pl.bag - 250 }, news: ["💸 Swollen screen refund paid.", ...state.news.slice(0, 15)] } : { pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 15) }, news: ["💀 Refused refund.", ...state.news.slice(0, 15)] });
          else set(state => ({ techSourceCost: 250, news: ["🚫 Sourcing climbs to $250.", ...state.news.slice(0, 15)] }));
          return undefined;
        }
        set(state => ({ news: ["💻 TECH: Sourced bricked hardware.", ...state.news.slice(0, 15)] }));
      },

      rTechFixA: async () => {
        const { pl, flex, techItem, triggerNotification, legacyMultiplier, triggerImpact, adv } = get();
        if (pl.bag < 30 || pl.mentalHealth < 10 || !techItem) return;
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 30, mentalHealth: state.pl.mentalHealth - (10 * (1 - reduction)) } }));
        await new Promise(r => setTimeout(r, 800));
        if (flex.logistics.owned || Math.random() < 0.5) {
          if (pl.bag < 100000 && pl.bag >= 10000) triggerNotification('BAG_BOOST_01');
          const payout = Math.floor(750 * legacyMultiplier);
          set(state => ({ pl: { ...state.pl, bag: state.pl.bag + payout }, techItem: null, news: [`✅ Sold for $${payout}.`, ...state.news.slice(0, 15)] }));
          triggerImpact('bag', payout - 30);
        } else set(state => ({ pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 5) }, techItem: null, news: ["💀 Bricked hardware.", ...state.news.slice(0, 15)] }));
        adv();
      },

      rTechFixB: async () => {
        const { pl, flex, techItem, legacyMultiplier, triggerImpact, adv } = get();
        if (pl.bag < 100 || pl.mentalHealth < 15 || !techItem) return;
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 100, mentalHealth: state.pl.mentalHealth - (15 * (1 - reduction)), clout: Math.min(state.pl.maxClout, state.pl.clout + 2), aura: Math.min(state.pl.maxAura, state.pl.aura + 1) }, techFlipsComplete: state.techFlipsComplete + 1 }));
        await new Promise(r => setTimeout(r, 1000));
        const payout = Math.floor(750 * legacyMultiplier);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + payout }, techItem: null, news: [`✅ Sold for $${payout}.`, ...state.news.slice(0, 15)] }));
        triggerImpact('bag', payout - 100); adv(); return 650;
      },

      rProcessBulkPallet: async (correct = 0, incorrect = 0) => {
        const { pl, supplyChainShockMonths, legacyMultiplier, triggerImpact, adv } = get();
        const baseCost = 5000; const cost = Math.floor(baseCost * (supplyChainShockMonths > 0 ? 1.2 : 1.0));
        if (pl.bag < cost || pl.mentalHealth < 40) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost, mentalHealth: Math.max(0, state.pl.mentalHealth - 40 - (incorrect * 2)) } }));
        await new Promise(r => setTimeout(r, 1000));
        const finalPayout = Math.floor((baseCost + (650 * 14 * (correct / Math.max(1, correct + incorrect)))) * legacyMultiplier);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + finalPayout, clout: Math.min(state.pl.maxClout, state.pl.clout + 10) }, techFlipsComplete: state.techFlipsComplete + correct, news: [`📦 Net: $${(finalPayout - cost).toLocaleString()}.`, ...state.news.slice(0, 15)] }));
        triggerImpact('bag', finalPayout - cost); adv();
      },

      rTechMicroSolder: async (success) => {
        const { pl, legacyMultiplier, triggerImpact, adv } = get(); if (pl.bag < 1000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 1000 } }));
        await new Promise(r => setTimeout(r, 500));
        if (success) {
          const payout = Math.floor(1500 * legacyMultiplier);
          set(state => ({ pl: { ...state.pl, bag: state.pl.bag + payout, clout: Math.min(state.pl.maxClout, state.pl.clout + 50), aura: Math.min(state.pl.maxAura, state.pl.aura + 5) }, techFlipsComplete: state.techFlipsComplete + 5, news: [`🔬 Yield doubled, +50 Clout.`, ...state.news.slice(0, 15)] }));
          triggerImpact('bag', payout - 1000);
        } else set(state => ({ pl: { ...state.pl, aura: Math.max(0, state.pl.aura - 10), mentalHealth: Math.max(0, state.pl.mentalHealth - 15) }, news: [`💥 Circuit Shorted!`, ...state.news.slice(0, 15)] }));
        adv();
      },

      rRunnerRecruit: async () => {
        const { pl, flex, updateFatigue, triggerChaos, karmaFlags, triggerNotification, adv } = get();
        if (pl.bag < 300 || pl.mentalHealth < 25 || pl.clout < 20) return; updateFatigue('runners');
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 300, mentalHealth: state.pl.mentalHealth - (25 * (1 - reduction)) }, hustleClicks: { ...state.hustleClicks, runners: state.hustleClicks.runners + 1 } }));
        if (triggerChaos('runners')) {
          if (karmaFlags.ignoredRunnerWelfare) set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 500, clout: Math.max(0, state.pl.clout - 10) }, news: ["📉 Runner stole package.", ...state.news.slice(0, 15)] }));
          else set(state => ({ runnerCount: Math.max(0, state.runnerCount - 3), pl: { ...state.pl, bag: state.pl.bag - 400 }, news: ["🚫 Sidewalk raid.", ...state.news.slice(0, 15)] }));
          return undefined;
        }
        if (pl.bag < 100000 && pl.bag >= 10000) triggerNotification('AUR_BOOST_01');
        set(state => ({ runnerCount: state.runnerCount + 1, news: ["🏃 GIG: New fleet courier recruited.", ...state.news.slice(0, 15)] }));
        adv();
      },

      rRunnerFix: async () => {
        const { pl } = get(); if (pl.bag < 200) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 200 }, runnerBurnout: false, news: ["✅ Fleet burnout resolved.", ...state.news.slice(0, 15)] }));
      },

      rSaasClick: async () => {
        const { pl, flex, updateFatigue, ass, adv, techFlipsComplete } = get();
        if (pl.bag < 5000 || pl.mentalHealth < 20) return;
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 5000, mentalHealth: state.pl.mentalHealth - (20 * (1 - reduction)) }, hustleClicks: { ...state.hustleClicks, saas: (state.hustleClicks.saas || 0) + 1 } }));
        if (Math.random() < (ass.legalTeam ? 0.01 : 0.02)) {
          const pen = ass.legalTeam ? 25000 : 50000;
          set(state => ({ pl: { ...state.pl, bag: state.pl.bag - pen }, saasPenaltyActive: true, news: ["🚨 CYBER BREACH!", ...state.news.slice(0, 15)] }));
          return undefined;
        }
        const gain = techFlipsComplete >= 10 ? 120 : 100;
        set(state => ({ saasUsers: state.saasUsers + gain, news: [`📈 +${gain} users.`, ...state.news.slice(0, 15)] })); adv();
      },

      rAiAgencyClick: async () => {
        const { pl, flex, ass, adv } = get();
        if (pl.bag < 2500 || pl.mentalHealth < 15 || pl.bag < 1000000 || pl.clout < 150 || pl.aura < 100) return;
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 2500, mentalHealth: state.pl.mentalHealth - (15 * (1 - reduction)) }, hustleClicks: { ...state.hustleClicks, ai_agency: (state.hustleClicks.ai_agency || 0) + 1 } }));
        if (Math.random() < (ass.legalTeam ? 0.01 : 0.02)) { set(state => ({ apiLockoutMonths: ass.legalTeam ? 1 : 3, news: ["🚨 Agency suspended.", ...state.news.slice(0, 15)] })); return undefined; }
        if (Math.random() < 0.4) set(state => ({ corpClients: state.corpClients + 1, news: ["🤝 New corporate client.", ...state.news.slice(0, 15)] }));
        else set(state => ({ news: ["❌ Proposal rejected.", ...state.news.slice(0, 15)] }));
        adv();
      },

      rCreBuyOffice: async () => {
        const { pl, flex, adv } = get(); if (pl.bag < 15000000 || pl.mentalHealth < 30 || pl.clout < 200 || pl.aura < 250) return;
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 15000000, mentalHealth: state.pl.mentalHealth - (30 * (1 - reduction)) }, creOfficeCount: state.creOfficeCount + 1, hustleClicks: { ...state.hustleClicks, cre: (state.hustleClicks.cre || 0) + 1 }, news: ["🏢 Office acquisition complete.", ...state.news.slice(0, 15)] }));
        adv();
      },

      rCreBuyRetail: async () => {
        const { pl, flex, adv } = get(); if (pl.bag < 5000000 || pl.mentalHealth < 30 || pl.clout < 200 || pl.aura < 250) return;
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 5000000, mentalHealth: state.pl.mentalHealth - (30 * (1 - reduction)) }, creRetailCount: state.creRetailCount + 1, hustleClicks: { ...state.hustleClicks, cre: (state.hustleClicks.cre || 0) + 1 }, news: ["🏢 Retail Strip acquisition complete.", ...state.news.slice(0, 15)] }));
        adv();
      },

      rFranchiseClick: async () => {
        const { pl, flex, ass, adv } = get(); if (pl.bag < 500000 || pl.mentalHealth < 25 || pl.bag < 5000000 || pl.clout < 300 || pl.aura < 200) return;
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 500000, mentalHealth: state.pl.mentalHealth - (25 * (1 - reduction)) }, hustleClicks: { ...state.hustleClicks, franchise: (state.hustleClicks.franchise || 0) + 1 } }));
        if (Math.random() < (ass.legalTeam ? 0.01 : 0.02)) {
          if (ass.legalTeam && Math.random() < 0.5) set(state => ({ news: ["⚖️ Legal blocked union strike.", ...state.news.slice(0, 15)] }));
          else set(state => ({ unionStrikeActive: true, news: ["🚨 UNION STRIKE!", ...state.news.slice(0, 15)] }));
          return undefined;
        }
        set(state => ({ franchiseCount: state.franchiseCount + 1, news: ["🍟 New territory acquired.", ...state.news.slice(0, 15)] })); adv();
      },

      rResolveUnionStrike: (choice) => {
        const { pl } = get();
        if (choice === 'settle') {
          if (pl.bag < 100000) return;
          set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 100000 }, unionStrikeActive: false, unionStrikeIgnored: false, news: ["✅ Settlement paid.", ...state.news.slice(0, 15)] }));
        } else set(state => ({ unionStrikeIgnored: true, news: ["⚠️ Strike ignored.", ...state.news.slice(0, 15)] }));
      },

      rResolveSupplyChain: async () => {
        const { pl } = get(); if (pl.bag < 2000000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 2000000 }, supplyChainDisruption: false, news: ["✅ Logistics stabilized.", ...state.news.slice(0, 15)] }));
      },

      rPeClick: async () => {
        const { pl, flex, ass, adv, peProgress } = get(); if (pl.bag < 25000000 || pl.mentalHealth < 40) return;
        if (Math.random() < (ass.legalTeam ? 0.01 : 0.02)) {
          const bagPen = ass.legalTeam ? 5000000 : 10000000; const auraPen = ass.legalTeam ? 75 : 150;
          set(state => ({ pl: { ...state.pl, bag: state.pl.bag - bagPen, aura: Math.max(0, state.pl.aura - auraPen) }, news: ["🚨 SEC SUBPOENA!", ...state.news.slice(0, 15)] }));
          return -bagPen;
        }
        set(state => ({ hustleClicks: { ...state.hustleClicks, pe: (state.hustleClicks.pe || 0) + 1 } }));
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        let profit = -25000000;
        if (peProgress + 20 >= 100) {
          set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 25000000, clout: Math.min(state.pl.maxClout, state.pl.clout + 500), mentalHealth: Math.max(0, state.pl.mentalHealth - 30 - (40 * (1 - reduction))) }, peProgress: 0, guttedFirms: state.guttedFirms + 1, news: ["💰 PE: Buyout complete!", ...state.news.slice(0, 15)] }));
          profit = 25000000;
        } else set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 25000000, mentalHealth: state.pl.mentalHealth - (40 * (1 - reduction)) }, peProgress: state.peProgress + 20 }));
        adv(); return profit;
      },

      rArtSpeculate: async () => {
        const { pl, adv } = get(); if (pl.mentalHealth < 20) return;
        set(state => ({ pl: { ...state.pl, mentalHealth: state.pl.mentalHealth - 20 }, artMarketSentiment: Math.max(-1, Math.min(1, state.artMarketSentiment + (Math.random() - 0.5) * 0.4)), news: ["🎨 ART: Market speculation executed.", ...state.news.slice(0, 15)] }));
        adv(); return 0;
      },

      handleArtPurchase: () => {
        const { pl, artCollection, adv } = get(); const ART_PRICE = 12400000;
        if (pl.bag < ART_PRICE) return;
        const nextCount = artCollection.length + 1;
        set(state => ({
          pl: { ...state.pl, bag: state.pl.bag - ART_PRICE },
          artCollection: [...state.artCollection, { id: `art-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, name: `Elite Masterpiece #${state.artCollection.length + 1}`, baseValue: ART_PRICE, isDisplayed: true }],
          venueState: nextCount >= 50 ? "THE GALLERY / MUSEUM" : (nextCount >= 20 ? "THE CURATED EXHIBIT" : "THE VAULT"),
          news: ["🎨 ART: Elite masterpiece acquired.", ...state.news.slice(0, 15)]
        }));
        adv(); return -ART_PRICE;
      },

      rArtBuy: async () => get().handleArtPurchase(),

      finalizeAuction: (piece) => {
        const { legacyMultiplier, artBubbleMonths, adv, triggerImpact } = get();
        const finalPayout = Math.floor(piece.baseValue * (0.8 + Math.random() * 1.7) * legacyMultiplier * (artBubbleMonths > 0 ? 1.4 : 1.0));
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + finalPayout }, artCollection: state.artCollection.filter(p => p.id !== piece.id), news: [`🖼️ AUCTION: ${piece.name} hammered for $${fMny(finalPayout)}.`, ...state.news.slice(0, 15)], mod: { s: false } }));
        triggerImpact('bag', finalPayout); adv();
      },

      rArtHostExhibit: async () => {
        const { artCollection, pl, adv } = get(); if (artCollection.length < 20 || pl.mentalHealth < 40) return;
        set({ gBusy: true }); set(state => ({ pl: { ...state.pl, mentalHealth: Math.max(0, state.pl.mentalHealth - 40) } }));
        await new Promise(r => setTimeout(r, 1500));
        const displayed = artCollection.filter(p => p.isDisplayed);
        const totalVal = displayed.reduce((acc, curr) => acc + curr.baseValue, 0);
        const cloutGain = Math.floor(displayed.length * 15);
        const gateRev = Math.floor(totalVal * 0.05);
        set(state => ({
          pl: { ...state.pl, bag: state.pl.bag + gateRev, clout: Math.min(state.pl.maxClout, state.pl.clout + cloutGain) },
          mod: { s: true, t: "PRIVATE EXHIBITION CONCLUDED", m: `Returns: $${fMny(gateRev)}.`, o: [{ label: "MASTERFUL", action: () => set({ mod: { s: false } }) }], ui: "ui-modal" },
          news: ["🎨 EXHIBIT: Conclusion.", ...state.news.slice(0, 15)],
          gBusy: false
        }));
        adv(); return gateRev;
      },

      rAcceptPatronOffer: (pieceId, offerAmount) => {
        const { adv } = get();
        set(state => ({ artCollection: state.artCollection.filter(p => p.id !== pieceId), pl: { ...state.pl, bag: state.pl.bag + offerAmount }, mod: { s: false }, news: [`🎨 PATRON: Piece sold for $${fMny(offerAmount)}.`, ...state.news.slice(0, 15)] }));
        adv(); return offerAmount;
      },

      rFormConglom: async () => {
        const { pl, saasUsers, corpClients, creOfficeCount, creRetailCount, franchiseCount, guttedFirms, artCollection, tch, crp, tur, hf } = get();
        const hasAssets = saasUsers > 0 || corpClients > 0 || creOfficeCount > 0 || creRetailCount > 0 || franchiseCount > 0 || guttedFirms > 0 || artCollection.length > 0 || tch.l || crp.l > 0 || tur.t > 1 || hf.c > 0;
        if (pl.bag < 250000000 || !hasAssets) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 250000000 }, conglomActive: true, news: ["🏢 CONGLOMERATE: Global Holding Co formed.", ...state.news.slice(0, 15)] }));
      },

      rLobbyRegulators: async () => {
        const { pl } = get(); if (pl.bag < 10000000 || pl.aura < 20) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 10000000, aura: Math.max(0, state.pl.aura - 20) }, antitrustRisk: Math.max(0, state.antitrustRisk - 40), news: ["⚖️ LOBBYING: Strategic donations made.", ...state.news.slice(0, 15)] }));
      },

      rSwfInvest: async () => {
        const { pl } = get(); if (pl.bag < 100000000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 100000000 }, swfInvestment: state.swfInvestment + 100000000, news: ["🌍 SWF: $100M parked.", ...state.news.slice(0, 15)] }));
      },

      rSwfWithdraw: async () => {
        const { swfFrozen, swfInvestment } = get(); if (swfFrozen || swfInvestment <= 0) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + swfInvestment }, swfInvestment: 0, news: ["🌍 SWF: Liquidation.", ...state.news.slice(0, 15)] }));
      },

      rAudioRelease: async () => {
        const { pl, flex, audioUpgrades, viralPopMonths, adv } = get(); if (pl.bag < 1000 || pl.mentalHealth < 15) return;
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 1000, mentalHealth: state.pl.mentalHealth - (15 * (1 - reduction)) } }));
        await new Promise(r => setTimeout(r, 800));
        let successChance = 0.6; if (audioUpgrades.mixingSuite) successChance = 0.8; if (audioUpgrades.analogConsole) successChance = 0.9; if (viralPopMonths > 0) successChance = 0.9;
        if (Math.random() < successChance) set(state => ({ audioTracks: state.audioTracks + 1, news: ["<span class='news-bag'>🎵 AUDIO: New single trending.</span>", ...state.news.slice(0, 15)] }));
        else set(state => ({ news: ["🎵 Single flopped.", ...state.news.slice(0, 15)] }));
        if (Math.random() < 0.02) set(state => ({ sampleStrike: true, news: ["🚨 Sample strike detected!", ...state.news.slice(0, 15)] }));
        adv();
      },

      rAudioSettle: async () => {
        const { pl } = get(); if (pl.bag < 5000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 5000 }, sampleStrike: false, news: ["✅ Legal settlement paid.", ...state.news.slice(0, 15)] }));
      },

      rPmcDeploy: async () => {
        const { pl, flex, adv } = get(); if (pl.bag < 5000000 || pl.mentalHealth < 40) return;
        const reduction = flex.jet.owned && flex.jet.expiresAt > Date.now() ? 0.3 : (flex.jet.owned ? 0.15 : 0);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 5000000, mentalHealth: state.pl.mentalHealth - (40 * (1 - reduction)) } }));
        await new Promise(r => setTimeout(r, 1200));
        if (Math.random() < 0.5) set(state => ({ pmcSquads: state.pmcSquads + 1, news: ["🎖️ PMC: Tactical squad deployed.", ...state.news.slice(0, 15)] }));
        else set(state => ({ news: ["🎖️ Mission failed.", ...state.news.slice(0, 15)] }));
        if (Math.random() < 0.02) set(state => ({ intelLeak: true, news: ["🚨 Intel leak detected!", ...state.news.slice(0, 15)] }));
        adv();
      },

      rPmcSettle: async () => {
        const { pl } = get(); if (pl.bag < 2500000) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 2500000 }, intelLeak: false, news: ["✅ Damage control complete.", ...state.news.slice(0, 15)] }));
      },

      rPmcHire: async () => {
        const { pl, pmcMercCost } = get(); if (pl.bag < pmcMercCost) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - pmcMercCost }, pmcMercenaries: state.pmcMercenaries + 1, pmcMercCost: state.pmcMercCost + 15000, news: ["🎖️ New mercenary asset hired.", ...state.news.slice(0, 15)] }));
      },

      rPmcDeployContract: async () => {
        const { pmcMercenaries } = get(); if (pmcMercenaries < 1) return;
        set(state => ({ pmcMercenaries: state.pmcMercenaries - 1, pmcActiveContracts: state.pmcActiveContracts + 1, news: ["🎖️ Contract deployed.", ...state.news.slice(0, 15)] }));
      },

      rPmcBribe: async () => {
        const { pl, pmcBribeCost } = get(); if (pl.bag < pmcBribeCost) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - pmcBribeCost }, pmcHeatLevel: Math.max(0, state.pmcHeatLevel * 0.6), pmcBribeCost: state.pmcBribeCost + 5000, news: ["⚖️ Authorities bribed.", ...state.news.slice(0, 15)] }));
      },

      rArtAuction: async () => {
        const { artCollection } = get(); if (artCollection.length <= 0) return;
        const piece = artCollection[artCollection.length - 1];
        set({ gBusy: true }); await new Promise(r => setTimeout(r, 1000));
        const bid1 = Math.floor(piece.baseValue * (0.8 + Math.random() * 0.4));
        const bid2 = Math.floor(piece.baseValue * (1.2 + Math.random() * 0.4));
        const bid3 = Math.floor(piece.baseValue * (1.6 + Math.random() * 0.4));
        set({
          mod: { s: true, t: "SOTHEBY'S LIVE AUCTION", m: `Intense bidding war for "${piece.name}".\n\n- Floor: $${fMny(bid1)}\n- Phone: $${fMny(bid2)}\n- Proxy: $${fMny(bid3)}`, o: [{ label: "WATCH HAMMER FALL", action: () => get().finalizeAuction(piece) }], ui: "ui-modal" },
          gBusy: false
        });
      },

      rAcquirePoliticalAsset: async (type, cost, limit) => {
        const { pl, politicalSyndicate, adv } = get(); if (pl.bag < cost || politicalSyndicate.assetLeasing[type] >= limit) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost }, politicalSyndicate: { ...state.politicalSyndicate, assetLeasing: { ...state.politicalSyndicate.assetLeasing, [type]: state.politicalSyndicate.assetLeasing[type] + 1 } }, news: [`⚖️ SYNDICATE: Political asset acquired: ${type.toUpperCase()}.`, ...state.news.slice(0, 15)] }));
        adv();
      },

      rDeployNarrativeOp: async (opType) => {
        const { politicalSyndicate, pl, adv } = get(); const assets = politicalSyndicate.assetLeasing;
        if (opType === 'TAX_LOOPHOLE') {
          if (assets.senators < 2 || pl.clout < 100) return;
          set(state => ({ pl: { ...state.pl, bag: state.pl.bag + 40000000, clout: Math.max(0, state.pl.clout - 100) }, news: ["⚖️ SYNDICATE: Tax Loophole Bill passed.", ...state.news.slice(0, 15)] }));
          get().triggerImpact('bag', 40000000);
        } else if (opType === 'CULTURE_WAR') {
          if (assets.networkAnchors < 1 || pl.aura < 40) return;
          set(state => ({ pl: { ...state.pl, clout: Math.min(state.pl.maxClout, state.pl.clout + 500), aura: Math.max(0, state.pl.aura - 40) }, politicalSyndicate: { ...state.politicalSyndicate, politicalCapital: Math.min(100, state.politicalSyndicate.politicalCapital + 15), status: (state.politicalSyndicate.politicalCapital + 15 >= 100) ? 'CAMPAIGN_READY' : state.politicalSyndicate.status }, news: ["⚖️ SYNDICATE: Culture War manufactured.", ...state.news.slice(0, 15)] }));
        } else if (opType === 'LOBBYIST_STRIKE') {
          if (pl.bag < 10000000) return;
          set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 10000000 }, politicalSyndicate: { ...state.politicalSyndicate, politicalCapital: Math.min(100, state.politicalSyndicate.politicalCapital + 10), status: (state.politicalSyndicate.politicalCapital + 10 >= 100) ? 'CAMPAIGN_READY' : state.politicalSyndicate.status }, news: ["⚖️ SYNDICATE: Lobbyist Strike Team deployed.", ...state.news.slice(0, 15)] }));
        }
        adv();
      },

      rHostPolicySummit: async () => {
        const { politicalSyndicate, pl, adv, triggerNotification } = get(); if (politicalSyndicate.politicalCapital < 100) return;
        set({ gBusy: true }); await new Promise(r => setTimeout(r, 1500)); set({ gBusy: false });
        set(state => ({
          politicalSyndicate: { ...state.politicalSyndicate, politicalCapital: 0, status: 'IDLE' },
          pl: { ...state.pl, bag: state.pl.bag + 10000000000, aura: Math.min(state.pl.maxAura, state.pl.aura + 2000), clout: Math.min(state.pl.maxClout, state.pl.clout + 1500) },
          presidencyEligible: true,
          mod: { s: true, t: "THE SUMMIT CONCLUDED", m: "Primed for POTUS.", o: [{ label: "PREPARE FOR CAMPAIGN", action: () => set({ mod: { s: false } }) }], ui: "ui-modal" },
          news: ["🏆 SYNDICATE: Global Policy Summit concluded.", ...state.news.slice(0, 15)]
        }));
        triggerNotification('SYNDICATE_COMPLETE'); adv();
      },

      rCampaignAction: async (type) => {
        const { campaign, pl, adv } = get(); if (campaign.phase !== 'POLITICS') return;
        let cMH = 0, cClt = 0, cAur = 0, cBag = 0, gAur = 0, gClt = 0, gWch = 0, gPol = { r: '', a: 0 };
        if (type === 'RUST_BELT_RALLY') { cMH = 20; cClt = 50; gPol = { r: 'rustBelt', a: 5 }; gAur = 20; }
        else if (type === 'SUN_BELT_ADS') { cBag = 500000000; gPol = { r: 'sunBelt', a: 4 }; gClt = 300; }
        else if (type === 'SILICON_GALA') { cAur = 150; gWch = 1200000000; gPol = { r: 'blueWall', a: 6 }; }
        if (pl.mentalHealth < cMH || pl.clout < cClt || pl.aura < cAur || campaign.warchest < cBag) return;
        set(state => ({
          pl: { ...state.pl, mentalHealth: Math.max(0, state.pl.mentalHealth - cMH), clout: Math.max(0, Math.min(state.pl.maxClout, state.pl.clout - cClt - 10 + gClt)), aura: Math.max(0, Math.min(state.pl.maxAura, state.pl.aura - cAur - 5 + gAur)) },
          campaign: { ...state.campaign, currentWeek: state.campaign.currentWeek + 1, warchest: state.campaign.warchest - cBag - 100000000 + gWch, regionalPolling: { ...state.campaign.regionalPolling, [gPol.r]: Math.min(100, state.campaign.regionalPolling[gPol.r] + (gPol.a || 0)) }, opponentPolling: { blueWall: Math.min(100, state.campaign.opponentPolling.blueWall + 0.5), rustBelt: Math.min(100, state.campaign.opponentPolling.rustBelt + 0.5), sunBelt: Math.min(100, state.campaign.opponentPolling.sunBelt + 0.5) } }
        }));

        const updatedWeek = get().campaign.currentWeek;
        if ((updatedWeek - 1) % 4 === 0) return true; // Signal October Surprise
        else { adv(); return false; }
      },

      rResumeCampaign: () => set(state => ({ campaign: { ...state.campaign, currentMonth: state.campaign.currentMonth + 1, phase: 'POLITICS' }, tab: 'WAR_ROOM', news: [`🦅 CAMPAIGN: Month ${state.campaign.currentMonth + 1}.`, ...state.news.slice(0, 15)] })),

      rFoundationSink: (amount) => {
        const { pl, flex } = get(); if (pl.bag < amount || !flex.foundation.owned) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - amount }, campaign: { ...state.campaign, regionalPolling: { blueWall: Math.min(100, state.campaign.regionalPolling.blueWall + (amount / 100000000)), rustBelt: Math.min(100, state.campaign.regionalPolling.rustBelt + (amount / 100000000)), sunBelt: Math.min(100, state.campaign.regionalPolling.sunBelt + (amount / 100000000)) } }, news: [`🏛️ PHILANTHROPY baseline increased.`, ...state.news.slice(0, 15)] }));
      },

      rPod: async () => {
        const { up, pod, pl, adv, triggerImpact } = get();
        const cost = (up.podCmp ? 0 : pod.q) + (pod.g === 1 ? 10000 : pod.g === 2 ? 50000 : pod.g === 3 ? 100000 : 250000);
        if (pl.bag < cost) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost } }));
        await new Promise(r => setTimeout(r, 1000));
        const legacy = (1 + (get().generationCount * 0.25));
        const rev = Math.floor(cost * (1.2 + Math.random() * 1.8) * legacy);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + rev, clout: Math.min(state.pl.maxClout, state.pl.clout + 15) }, hl: { ...state.hl, pod: state.hl.pod + rev - cost } }));
        triggerImpact('bag', rev - cost); adv(); return rev - cost;
      },

      rBox: async () => {
        const { box, up, pl, flex, ass, isPresident, adv, triggerImpact } = get();
        const isPPV = box.v === 3 || box.t === 4;
        let vCost = up.boxLg ? 0 : (box.v === 1 ? 10000 : box.v === 2 ? 250000 : 2000000);
        let cost = (up.boxBrd ? 0 : box.b) + vCost; if (isPPV && cost < 150000) cost = 150000;
        if (pl.bag < cost) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost } }));
        await new Promise(r => setTimeout(r, 1200));
        let rev = 0, gClt = 0, gAur = 0, gHet = 0;
        const legacy = (1 + (get().generationCount * 0.25));
        if (isPPV) { rev = Math.floor((Math.pow(pl.clout, 1.8) * 10 + Math.pow(pl.aura, 1.5) * 50 + cost * 1.5) * legacy); gClt = 300; gAur = 200; gHet = 20; }
        else if (up.boxBrd) { rev = Math.floor((12000 + (pl.clout * 250)) * legacy); gClt = 5; gHet = 10; }
        else { rev = Math.floor(Math.min(cost * 2.0, cost * (1.1 + Math.random() * 0.5)) * legacy); gClt = 10; gHet = 5; }
        let finalHet = ass.legalTeam ? Math.floor(gHet * 0.5) : gHet; if (isPresident) finalHet *= 0.5;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + rev, clout: Math.min(state.pl.maxClout, state.pl.clout + gClt), aura: Math.min(state.pl.maxAura, state.pl.aura + gAur), heat: state.pl.heat + finalHet }, tally: { ...state.tally, box: state.tally.box + 1 }, hl: { ...state.hl, box: state.hl.box + rev - cost } }));
        if (flex.media.owned && gClt > 0) set(state => ({ politicalSyndicate: { ...state.politicalSyndicate, politicalCapital: Math.min(100, state.politicalSyndicate.politicalCapital + gClt * 0.1), status: (state.politicalSyndicate.politicalCapital + gClt * 0.1 >= 100) ? 'CAMPAIGN_READY' : state.politicalSyndicate.status } }));
        triggerImpact('bag', rev - cost); adv(); return rev - cost;
      },

      rTur: async () => {
        const { tur, pl, up, adv, triggerImpact } = get();
        const cost = tur.m + tur.a + tur.l; if (pl.bag < cost) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost } }));
        await new Promise(r => setTimeout(r, 1500));
        const legacy = (1 + (get().generationCount * 0.25));
        const rev = Math.floor(cost * (Math.random() * (up.trFst ? 2.5 : 1.6)) * legacy);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + rev, clout: Math.min(state.pl.maxClout, state.pl.clout + 55), aura: Math.min(state.pl.maxAura, state.pl.aura + 15) }, hl: { ...state.hl, tour: state.hl.tour + rev - cost } }));
        triggerImpact('bag', rev - cost); adv(); return rev - cost;
      },

      rMovieGreenlight: (tier) => {
        const { pl } = get(); const costs = [0, 5000000, 50000000, 200000000];
        if (pl.bag < costs[tier]) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - costs[tier] }, movieProject: { status: 'PRODUCTION', budgetTier: tier, hypeLevel: 0 }, news: ["🎬 MOVIE: Project greenlit.", ...state.news.slice(0, 15)] }));
      },

      rMovieHypeBag: async () => {
        const { pl, movieProject } = get(); if (pl.bag < 500000 || movieProject.status !== 'PRODUCTION') return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - 500000 }, movieProject: { ...state.movieProject, hypeLevel: Math.min(100, state.movieProject.hypeLevel + 10) }, news: ["🎬 MOVIE: PR firm hired.", ...state.news.slice(0, 15)] }));
      },

      rMovieHypeClout: async () => {
        const { pl, movieProject } = get(); if (pl.clout < 50 || movieProject.status !== 'PRODUCTION') return;
        set(state => ({ pl: { ...state.pl, clout: state.pl.clout - 50 }, movieProject: { ...state.movieProject, hypeLevel: Math.min(100, state.movieProject.hypeLevel + 15) }, news: ["🎬 MOVIE: Viral activation.", ...state.news.slice(0, 15)] }));
      },

      rMovieHypeAura: async () => {
        const { pl, movieProject } = get(); if (pl.aura < 25 || movieProject.status !== 'PRODUCTION') return;
        set(state => ({ pl: { ...state.pl, aura: state.pl.aura - 25 }, movieProject: { ...state.movieProject, hypeLevel: Math.min(100, state.movieProject.hypeLevel + 25) }, news: ["🎬 MOVIE: Celebrity endorsement.", ...state.news.slice(0, 15)] }));
      },

      rMovieRelease: async () => {
        const { movieProject, flex, adv } = get(); if (movieProject.status !== 'PRODUCTION') return;
        set({ gBusy: true }); await new Promise(r => setTimeout(r, 2000)); set({ gBusy: false });
        const budget = [0, 5000000, 50000000, 200000000][movieProject.budgetTier];
        const roll = Math.random() * 100 + (movieProject.hypeLevel / 2);
        let title = "", text = "", bagR = 0, gAur = 0, gClt = 0, mhP = 0, ui = "ui-modal";
        if (roll < 40) { title = "BOX OFFICE FLOP 💀"; text = "Commercial disaster."; bagR = Math.floor(budget * 0.1); gAur = -100; mhP = 30; ui = "ui-cyberpunk"; }
        else if (roll < 85) { title = "BOX OFFICE HIT! 📈"; text = "Cultural moment."; bagR = budget * 2; gClt = 300; gAur = 100; }
        else { title = "ACADEMY AWARD SWEEP 🏆"; text = "Cinematic perfection."; bagR = Math.floor(budget * 1.2); gClt = 500; gAur = 2500; }
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + bagR, aura: Math.min(state.pl.maxAura, Math.max(0, state.pl.aura + gAur)), clout: Math.min(state.pl.maxClout, state.pl.clout + gClt), mentalHealth: Math.max(0, state.pl.mentalHealth - mhP) }, mod: { s: true, t: title, m: text + ` Returns: $${fMny(bagR)}.`, o: [{ label: "ACCEPT LEGACY", action: () => set({ mod: { s: false } }) }], ui }, movieProject: { status: 'IDLE', budgetTier: 1, hypeLevel: 0 }, hl: { ...state.hl, mov: state.hl.mov + (bagR - budget) } }));
        if (flex.media.owned && gClt > 0) set(state => ({ politicalSyndicate: { ...state.politicalSyndicate, politicalCapital: Math.min(100, state.politicalSyndicate.politicalCapital + gClt * 0.1), status: (state.politicalSyndicate.politicalCapital + gClt * 0.1 >= 100) ? 'CAMPAIGN_READY' : state.politicalSyndicate.status } }));
        adv();
      },

      rMov: async () => {
        const { mov, pl, up, legacyMultiplier, adv, triggerImpact } = get();
        const cost = (mov.g === 1 ? 2000000 : mov.g === 2 ? 15000000 : 100000000) + mov.m; if (pl.bag < cost) return;
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag - cost } })); await new Promise(r => setTimeout(r, 2000));
        const rev = Math.floor(cost * (Math.random() * (up.movUni ? 3.0 : 1.8)) * legacyMultiplier);
        set(state => ({ pl: { ...state.pl, bag: state.pl.bag + rev, clout: Math.min(state.pl.maxClout, state.pl.clout + 75) }, hl: { ...state.hl, mov: state.hl.mov + rev - cost } }));
        triggerImpact('bag', rev - cost); adv(); return rev - cost;
      },
    }),
    {
      name: SAVE_KEY,
      version: 1.1,
      migrate: (persistedState, version) => {
        if (version === 1.0) {
          const deepMerge = (target, source) => {
            for (const key in source) {
              if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!target[key]) target[key] = {};
                deepMerge(target[key], source[key]);
              } else {
                target[key] = source[key];
              }
            }
            return target;
          };

          let d = persistedState;
          if (d.blitzExpiry) {
            if (d.flex?.penthouse?.owned) {
              d.flex.penthouse.expiresAt = d.blitzExpiry;
            }
            delete d.blitzExpiry;
          }

          if (d?.artHoldings !== undefined && !d?.artCollection) {
            const legacyCount = d.artHoldings;
            const migrated = [];
            for (let i = 0; i < legacyCount; i++) {
              migrated.push({
                id: `migrated-${i}-${Math.random().toString(36).substr(2, 9)}`,
                name: `Legacy Masterpiece #${i + 1}`,
                baseValue: 10000000,
                isDisplayed: true
              });
            }
            d.artCollection = migrated;
          }

          return deepMerge(getInitialGameState(), d);
        }
        return persistedState;
      }
    }
  )
);
