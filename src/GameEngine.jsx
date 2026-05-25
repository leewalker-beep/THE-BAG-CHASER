import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { NOTIFICATION_DATABASE } from './data/notifications.js';
import { fMny } from './config.js';

const mudChaosPools = {
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

export const TIERS = [
  { id: 0, label: 'Mud',       req: { bag: 0,           clout: 0,    aura: 0   }, hustles: ['SW', 'DROP', 'TECH_FLIP', 'VINTAGE', 'SMM', 'GIG', 'DELIVERY', 'PLASMA', 'SURVEY', 'LABOR'] },
  { id: 1, label: 'Street',    req: { bag: 100000,      clout: 30,   aura: 0   }, hustles: ['CC', 'POD', 'BOX', 'AUDIO'] },
  { id: 2, label: 'Corporate', req: { bag: 1000000,     clout: 150,  aura: 50  }, hustles: ['TECH', 'AI_AGENCY', 'CRE_FLIP', 'FRANCHISE'] },
  { id: 3, label: 'Elite',     req: { bag: 25000000,    clout: 500,  aura: 0   }, hustles: ['CRYP', 'TOUR', 'PE_ROLLUP', 'ART_SPEC'] },
  { id: 4, label: 'Mogul',     req: { bag: 250000000,   clout: 1500, aura: 500 }, hustles: ['HF', 'CONGLOMERATE', 'PMC', 'SOVEREIGN', 'MOV', 'SYNDICATE'] },
  { id: 5, label: 'President', req: { bag: 1000000000,  clout: 5000, aura: 2500 }, hustles: ['PAC', 'BLITZ', 'SMEAR', 'ELECTION'] },
];

const GameContext = createContext();
export const useGame = () => useContext(GameContext);

const SAVE_KEY = 'bag-chaser-save-v1';

export const GameProvider = ({ children }) => {
  // Navigation & Core Frame
  const [ph, setPh] = useState('PROLOGUE');
  const [proSt, setProSt] = useState(0);
  const [alias, setAlias] = useState('');
  const [diff, setDiff] = useState(2);
  const [tab, setTab] = useState('HUB');
  const [selTier, setSelTier] = useState('0');
  const [death, setDeath] = useState(null);
  const [cancelIntro, setCancelIntro] = useState(null);
  const [gBusy, setGBusy] = useState(false);
  const [rain, setRain] = useState(false);
  const [swFatigue, setSwFatigue] = useState(0);
  const [hustleFatigue, setHustleFatigue] = useState({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
  const [karmaFlags, setKarmaFlags] = useState({ usedCheapBlanks: false, ignoredRefunds: false, soldBootleg: false, ignoredSmmCrisis: false, usedCheapParts: false, ignoredRunnerWelfare: false });
  const [fatalTragedyMessage, setFatalTragedyMessage] = useState(null);
  const [lastHustle, setLastHustle] = useState(null);
  const [dropshipLock, setDropshipLock] = useState(0);
  const [vintageLock, setVintageLock] = useState(0);
  const [smmPenalty, setSmmPenalty] = useState(false);
  const [techSourceCost, setTechSourceCost] = useState(150);

  const [smmClients, setSmmClients] = useState(0);
  const [clientCrisis, setClientCrisis] = useState(false);
  const [vinCh, setVinCh] = useState(null);
  const [hustleClicks, setHustleClicks] = useState({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
  const [techItem, setTechItem] = useState(null);
  const [techFlipsComplete, setTechFlipsComplete] = useState(0);
  const [runnerCount, setRunnerCount] = useState(0);
  const [runnerBurnout, setRunnerBurnout] = useState(false);

  const [saasUsers, setSaasUsers] = useState(0);
  const [saasPrice, setSaasPrice] = useState(50);
  const [saasChurn, setSaasChurn] = useState(0.05);
  const [saasPenaltyActive, setSaasPenaltyActive] = useState(false);
  const [corpClients, setCorpClients] = useState(0);
  const [apiLockoutMonths, setApiLockoutMonths] = useState(0);
  const [creOfficeCount, setCreOfficeCount] = useState(0);
  const [creRetailCount, setCreRetailCount] = useState(0);
  const [franchiseCount, setFranchiseCount] = useState(0);
  const [unionStrikeActive, setUnionStrikeActive] = useState(false);
  const [unionStrikeIgnored, setUnionStrikeIgnored] = useState(false);

  const [peProgress, setPeProgress] = useState(0);
  const [guttedFirms, setGuttedFirms] = useState(0);
  const [supplyChainDisruption, setSupplyChainDisruption] = useState(false);
  const [peCompoundingYield, setPeCompoundingYield] = useState(1.0);
  const [artMarketSentiment, setArtMarketSentiment] = useState(0);
  const [artHoldings, setArtHoldings] = useState(0);

  const [audioTracks, setAudioTracks] = useState(0);
  const [sampleStrike, setSampleStrike] = useState(false);
  const [pmcSquads, setPmcSquads] = useState(0);
  const [intelLeak, setIntelLeak] = useState(false);

  // Tech Flipping Extensions
  const [techInterns, setTechInterns] = useState(0);
  const [bulkPalletsUnlocked, setBulkPalletsUnlocked] = useState(false);
  const [enterpriseContracts, setEnterpriseContracts] = useState(0);

  // Indie Audio Syndicate Extensions
  const [audioUpgrades, setAudioUpgrades] = useState({ mixingSuite: false, analogConsole: false });
  const [talentScouters, setTalentScouters] = useState(0);
  const [holwoodSyncActive, setHollywoodSyncActive] = useState(false);

  // Vintage to Collectible Empire Evolution Line
  const [collectiblePhase, setCollectiblePhase] = useState('VINTAGE');
  const [vintageRevenueTracker, setVintageRevenueTracker] = useState(0);
  const [vintageBoostActive, setVintageBoostActive] = useState(false);
  const [sneakerBackdoorPlug, setSneakerBackdoorPlug] = useState(false);
  const [consignmentFeeActive, setConsignmentFeeActive] = useState(false);
  const [vaultHoldings, setVaultHoldings] = useState([]);

  // SMM Retainer Phase 2
  const [smmRetainerActive, setSmmRetainerActive] = useState(false);
  const [aiSmmFactory, setAiSmmFactory] = useState(false);
  const [smmEmpireActive, setSmmEmpireActive] = useState(false);

  // PMC Loop Phase 4
  const [pmcUnlocked, setPmcUnlocked] = useState(false);
  const [pmcMercenaries, setPmcMercenaries] = useState(0);
  const [pmcActiveContracts, setPmcActiveContracts] = useState(0);
  const [pmcHeatLevel, setPmcHeatLevel] = useState(0.0);
  const [pmcMercCost, setPmcMercCost] = useState(50000);
  const [pmcBribeCost, setPmcBribeCost] = useState(25000);

  const [conglomActive, setConglomActive] = useState(false);
  const [movieProject, setMovieProject] = useState({ status: 'IDLE', budgetTier: 1, hypeLevel: 0 });
  const [antitrustRisk, setAntitrustRisk] = useState(0);
  const [swfInvestment, setSwfInvestment] = useState(0);
  const [geoStability, setGeoStability] = useState(1.0);
  const [swfFrozen, setSwfFrozen] = useState(false);

  // Politics Tier 5
  const [superPacFunds, setSuperPacFunds] = useState(0);
  const [approvalRating, setApprovalRating] = useState(15.0);
  const [lobbyists, setLobbyists] = useState(0);
  const [lobbyistCost, setLobbyistCost] = useState(5000000);
  const [mediaBlitzCost, setMediaBlitzCost] = useState(10000000);
  const [isPresident, setIsPresident] = useState(false);

  const [politicalSyndicate, setPoliticalSyndicate] = useState({ politicalCapital: 0, assetLeasing: { governors: 0, senators: 0, networkAnchors: 0 }, status: 'IDLE' });
  const [presidencyEligible, setPresidencyEligible] = useState(false);

  // Real World Monitor Ticker Engine
  const [tickerAdvice, setTickerAdvice] = useState('MARKET WATCH: Global conditions stable. Continue the grind.');
  const [artBubbleMonths, setArtBubbleMonths] = useState(0);
  const [supplyChainShockMonths, setSupplyChainShockMonths] = useState(0);
  const [viralPopMonths, setViralPopMonths] = useState(0);

  // Flex Showcase System State
  const [flex, setFlex] = useState({
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
  });

  const [campaign, setCampaign] = useState({
    currentWeek: 1,
    currentMonth: 1,
    warchest: 10000000000,
    phase: 'POLITICS',
    regionalPolling: { blueWall: 35, rustBelt: 35, sunBelt: 35 },
    opponentPolling: { blueWall: 42, rustBelt: 42, sunBelt: 42 }
  });

  const [seenNotifications, setSeenNotifications] = useState([]);
  const [activeNotification, setActiveNotification] = useState(null);

  const [activeEvent, setActiveEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  const [isBreakdownActive, setIsBreakdownActive] = useState(false);
  const [shakeActive, setShakeActive] = useState(false);
  const [passiveFrozen, setPassiveFrozen] = useState(false);

  // Financial Systems & Vital Signs
  const [pl, setPl] = useState({ bag: 25000, aura: 100, clout: 20, mo: 0, tier: 0, mentalHealth: 100, maxMentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 });
  const displayBag = pl.bag;
  const age = 18 + Math.floor(pl.mo / 12);

  // Macro Environment
  const [mkt, setMkt] = useState(0);
  const [news, setNews] = useState(['Booting life simulation... System optimal.', 'Market Cycle initialized: NORMAL economy.']);
  const [imp, setImp] = useState([]);
  const [mod, setMod] = useState({ s: false, t: '', m: '', o: [], ui: '' });

  // Tech Tree Infrastructure
  const [up, setUp] = useState({ swIp: false, swFlg: false, swPar: false, swGlb: false, drpFac: false, ccAge: false, ccNet: false, podCmp: false, boxLg: false, boxBrd: false, trFst: false, tchGov: false, movStr: false, movUni: false });
  const [skl, setSkl] = useState({ neg: 0, tax: 0, inf: 0 });
  const [ass, setAss] = useState({ mtgPent: false, mans: false, mtgMans: false, mtgJet: false, mtgYct: false, spc: false, swf: false, legalTeam: false });

  // Active Venture Vectors
  const [sw, setSw] = useState({ i: 1, u: 250, p: 45, a: 5000 });
  const [drp, setDrp] = useState({ i: 1, u: 500, p: 35, a: 10000 });
  const [cc, setCc] = useState({ m: 'solo', v: 1, n: 1 });
  const [pod, setPod] = useState({ g: 1, q: 20000 });
  const [box, setBox] = useState({ v: 1, t: 1, b: 100000, p: 1 });
  const [tur, setTur] = useState({ t: 1, m: 150000, a: 50000, l: 100000 });
  const [tch, setTch] = useState({ l: false, u: 1200, srv: 0.15, pw: false, vc: false, m: 15000 });
  const [crp, setCrp] = useState({ l: 0, t: '', i: 25000, m: 15000 });
  const [mov, setMov] = useState({ g: 1, w: 1, d: 1, s: 1, m: 5000000 });
  const [hf, setHf] = useState({ r: 0, t: 'NVDA', c: 5000000, l: 5 });
  const [ai, setAi] = useState({ ig: false, p: 0, r: 0, d: 1, c: 1, s: 1, dj: 0 });
  const [prs, setPrs] = useState({ r: false, m: 0, cd: 0, rem: false, rst: 44, sun: 42, sub: 45, vp: 1, fr: false, vu: false, du: false, sh: false, ot: false, p1tt: false, p1op: false, p1et: false, ev: { d1: false, d2: false, o: false }, chest: 0, polls: 0 });

  // Legacy Registry
  const [peaks, setPeaks] = useState({ peakB: 25000, peakA: 100, peakC: 20 });
  const [hl, setHl] = useState({ sw: 0, drop: 0, cc: 0, pod: 0, box: 0, tch: 0, cryp: 0, tour: 0, mov: 0, hf: 0 });
  const [tally, setTally] = useState({ cryp: 0, box: 0, hf: 0, pres: 0 });
  const [generationCount, setGenerationCount] = useState(0);
  const legacyMultiplier = 1 + (generationCount * 0.25);

  // Persistent Save Engine Ref for Stable Background Saves
  const stateRef = React.useRef();
  stateRef.current = {
    ph, proSt, alias, diff, tab, selTier, swFatigue, hustleFatigue, karmaFlags,
    seenNotifications,
    lastHustle, dropshipLock, vintageLock, smmPenalty, techSourceCost, smmClients,
    clientCrisis, vinCh, hustleClicks, techItem, techFlipsComplete, runnerCount,
    runnerBurnout, saasUsers, saasPrice, saasChurn, saasPenaltyActive, corpClients,
    apiLockoutMonths, creOfficeCount, creRetailCount, franchiseCount, unionStrikeActive,
    unionStrikeIgnored, peProgress, guttedFirms, supplyChainDisruption, peCompoundingYield,
    artMarketSentiment, artHoldings, audioTracks, sampleStrike, pmcSquads, intelLeak,
    techInterns, bulkPalletsUnlocked, enterpriseContracts,
    audioUpgrades, talentScouters, holwoodSyncActive,
    collectiblePhase, vintageRevenueTracker, vintageBoostActive, sneakerBackdoorPlug, consignmentFeeActive, vaultHoldings,
    smmRetainerActive, aiSmmFactory, smmEmpireActive,
    pmcUnlocked, pmcMercenaries, pmcActiveContracts, pmcHeatLevel, pmcMercCost, pmcBribeCost,
    conglomActive, movieProject, antitrustRisk, swfInvestment,
    superPacFunds, approvalRating, lobbyists, lobbyistCost, mediaBlitzCost, isPresident,
    politicalSyndicate, presidencyEligible, tickerAdvice, artBubbleMonths, supplyChainShockMonths, viralPopMonths,
    flex, campaign,
    geoStability, swfFrozen, passiveFrozen, pl, mkt, news, up, skl, ass, sw, drp, cc, pod,
    box, tur, tch, crp, mov, hf, ai, prs, peaks, hl, tally, generationCount
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const d = JSON.parse(saved);
        if (d?.ph) setPh(d.ph);
        if (d?.proSt !== undefined) setProSt(d.proSt);
        if (d?.alias) setAlias(d.alias);
        if (d?.diff !== undefined) setDiff(d.diff);
        if (d?.tab) setTab(d.tab);
        if (d?.selTier) setSelTier(d.selTier);
        if (d?.swFatigue !== undefined) setSwFatigue(d.swFatigue);
        if (d?.hustleFatigue) setHustleFatigue(prev => ({ ...prev, ...d.hustleFatigue }));
        if (d?.karmaFlags) setKarmaFlags(prev => ({ ...prev, ...d.karmaFlags }));
        if (d?.lastHustle) setLastHustle(d.lastHustle);
        if (d?.dropshipLock !== undefined) setDropshipLock(d.dropshipLock);
        if (d?.vintageLock !== undefined) setVintageLock(d.vintageLock);
        if (d?.smmPenalty !== undefined) setSmmPenalty(d.smmPenalty);
        if (d?.techSourceCost !== undefined) setTechSourceCost(d.techSourceCost);
        if (d?.smmClients !== undefined) setSmmClients(d.smmClients);
        if (d?.clientCrisis !== undefined) setClientCrisis(d.clientCrisis);
        if (d?.vinCh) setVinCh(d.vinCh);
        if (d?.hustleClicks) setHustleClicks(prev => ({ ...prev, ...d.hustleClicks }));
        if (d?.techItem) setTechItem(d.techItem);
        if (d?.techFlipsComplete !== undefined) setTechFlipsComplete(d.techFlipsComplete);
        if (d?.runnerCount !== undefined) setRunnerCount(d.runnerCount);
        if (d?.runnerBurnout !== undefined) setRunnerBurnout(d.runnerBurnout);
        if (d?.saasUsers !== undefined) setSaasUsers(d.saasUsers);
        if (d?.saasPrice !== undefined) setSaasPrice(d.saasPrice);
        if (d?.saasChurn !== undefined) setSaasChurn(d.saasChurn);
        if (d?.saasPenaltyActive !== undefined) setSaasPenaltyActive(d.saasPenaltyActive);
        if (d?.corpClients !== undefined) setCorpClients(d.corpClients);
        if (d?.apiLockoutMonths !== undefined) setApiLockoutMonths(d.apiLockoutMonths);
        if (d?.creOfficeCount !== undefined) setCreOfficeCount(d.creOfficeCount);
        if (d?.creRetailCount !== undefined) setCreRetailCount(d.creRetailCount);
        if (d?.franchiseCount !== undefined) setFranchiseCount(d.franchiseCount);
        if (d?.unionStrikeActive !== undefined) setUnionStrikeActive(d.unionStrikeActive);
        if (d?.unionStrikeIgnored !== undefined) setUnionStrikeIgnored(d.unionStrikeIgnored);
        if (d?.peProgress !== undefined) setPeProgress(d.peProgress);
        if (d?.guttedFirms !== undefined) setGuttedFirms(d.guttedFirms);
        if (d?.supplyChainDisruption !== undefined) setSupplyChainDisruption(d.supplyChainDisruption);
        if (d?.peCompoundingYield !== undefined) setPeCompoundingYield(d.peCompoundingYield);
        if (d?.artMarketSentiment !== undefined) setArtMarketSentiment(d.artMarketSentiment);
        if (d?.artHoldings !== undefined) setArtHoldings(d.artHoldings);
        if (d?.audioTracks !== undefined) setAudioTracks(d.audioTracks);
        if (d?.sampleStrike !== undefined) setSampleStrike(d.sampleStrike);
        if (d?.pmcSquads !== undefined) setPmcSquads(d.pmcSquads);
        if (d?.intelLeak !== undefined) setIntelLeak(d.intelLeak);

        if (d?.techInterns !== undefined) setTechInterns(d.techInterns);
        if (d?.bulkPalletsUnlocked !== undefined) setBulkPalletsUnlocked(d.bulkPalletsUnlocked);
        if (d?.enterpriseContracts !== undefined) setEnterpriseContracts(d.enterpriseContracts);
        if (d?.audioUpgrades) setAudioUpgrades(prev => ({ ...prev, ...d.audioUpgrades }));
        if (d?.talentScouters !== undefined) setTalentScouters(d.talentScouters);
        if (d?.holwoodSyncActive !== undefined) setHollywoodSyncActive(d.holwoodSyncActive);
        if (d?.collectiblePhase) setCollectiblePhase(d.collectiblePhase);
        if (d?.vintageRevenueTracker !== undefined) setVintageRevenueTracker(d.vintageRevenueTracker);
        if (d?.vintageBoostActive !== undefined) setVintageBoostActive(d.vintageBoostActive);
        if (d?.sneakerBackdoorPlug !== undefined) setSneakerBackdoorPlug(d.sneakerBackdoorPlug);
        if (d?.consignmentFeeActive !== undefined) setConsignmentFeeActive(d.consignmentFeeActive);
        if (d?.vaultHoldings) setVaultHoldings(d.vaultHoldings);
        if (d?.smmRetainerActive !== undefined) setSmmRetainerActive(d.smmRetainerActive);
        if (d?.aiSmmFactory !== undefined) setAiSmmFactory(d.aiSmmFactory);
        if (d?.smmEmpireActive !== undefined) setSmmEmpireActive(d.smmEmpireActive);

        if (d?.pmcUnlocked !== undefined) setPmcUnlocked(d.pmcUnlocked);
        if (d?.pmcMercenaries !== undefined) setPmcMercenaries(d.pmcMercenaries);
        if (d?.pmcActiveContracts !== undefined) setPmcActiveContracts(d.pmcActiveContracts);
        if (d?.pmcHeatLevel !== undefined) setPmcHeatLevel(d.pmcHeatLevel);
        if (d?.pmcMercCost !== undefined) setPmcMercCost(d.pmcMercCost);
        if (d?.pmcBribeCost !== undefined) setPmcBribeCost(d.pmcBribeCost);
        if (d?.conglomActive !== undefined) setConglomActive(d.conglomActive);
        if (d?.movieProject) setMovieProject(prev => ({ ...prev, ...d.movieProject }));
        if (d?.antitrustRisk !== undefined) setAntitrustRisk(d.antitrustRisk);
        if (d?.swfInvestment !== undefined) setSwfInvestment(d.swfInvestment);
        if (d?.geoStability !== undefined) setGeoStability(d.geoStability);
        if (d?.swfFrozen !== undefined) setSwfFrozen(d.swfFrozen);
        if (d?.superPacFunds !== undefined) setSuperPacFunds(d.superPacFunds);
        if (d?.approvalRating !== undefined) setApprovalRating(d.approvalRating);
        if (d?.lobbyists !== undefined) setLobbyists(d.lobbyists);
        if (d?.lobbyistCost !== undefined) setLobbyistCost(d.lobbyistCost);
        if (d?.mediaBlitzCost !== undefined) setMediaBlitzCost(d.mediaBlitzCost);
        if (d?.isPresident !== undefined) setIsPresident(d.isPresident);
        if (d?.politicalSyndicate) setPoliticalSyndicate(prev => ({ ...prev, ...d.politicalSyndicate }));
        if (d?.presidencyEligible !== undefined) setPresidencyEligible(d.presidencyEligible);
        if (d?.tickerAdvice) setTickerAdvice(d.tickerAdvice);
        if (d?.artBubbleMonths !== undefined) setArtBubbleMonths(d.artBubbleMonths);
        if (d?.supplyChainShockMonths !== undefined) setSupplyChainShockMonths(d.supplyChainShockMonths);
        if (d?.viralPopMonths !== undefined) setViralPopMonths(d.viralPopMonths);
        if (d?.flex) setFlex(prev => ({ ...prev, ...d.flex }));
        if (d?.campaign) setCampaign(prev => ({ ...prev, ...d.campaign }));
        if (d?.seenNotifications) setSeenNotifications(d.seenNotifications);
        if (d?.passiveFrozen !== undefined) setPassiveFrozen(d.passiveFrozen);
        if (d?.pl) setPl(prev => ({ ...prev, ...d.pl }));
        if (d?.mkt !== undefined) setMkt(d.mkt);
        if (d?.news) setNews(d.news);
        if (d?.up) setUp(prev => ({ ...prev, ...d.up }));
        if (d?.skl) setSkl(prev => ({ ...prev, ...d.skl }));
        if (d?.ass) setAss(prev => ({ ...prev, ...d.ass }));
        if (d?.sw) setSw(prev => ({ ...prev, ...d.sw }));
        if (d?.drp) setDrp(prev => ({ ...prev, ...d.drp }));
        if (d?.cc) setCc(prev => ({ ...prev, ...d.cc }));
        if (d?.pod) setPod(prev => ({ ...prev, ...d.pod }));
        if (d?.box) setBox(prev => ({ ...prev, ...d.box }));
        if (d?.tur) setTur(prev => ({ ...prev, ...d.tur }));
        if (d?.tch) setTch(prev => ({ ...prev, ...d.tch }));
        if (d?.crp) setCrp(prev => ({ ...prev, ...d.crp }));
        if (d?.mov) setMov(prev => ({ ...prev, ...d.mov }));
        if (d?.hf) setHf(prev => ({ ...prev, ...d.hf }));
        if (d?.ai) setAi(prev => ({ ...prev, ...d.ai }));
        if (d?.prs) setPrs(prev => ({ ...prev, ...d.prs }));
        if (d?.peaks) setPeaks(prev => ({ ...prev, ...d.peaks }));
        if (d?.hl) setHl(prev => ({ ...prev, ...d.hl }));
        if (d?.tally) setTally(prev => ({ ...prev, ...d.tally }));
        if (d?.generationCount !== undefined) setGenerationCount(d.generationCount);
      }
    } catch (e) {
      console.error("Critical Failure in hydration:", e);
    }
  }, []);

  useEffect(() => {
    window.autoSaveInterval = setInterval(() => {
      if (window.isResetting) return;
      localStorage.setItem(SAVE_KEY, JSON.stringify(stateRef.current));
    }, 10000);
    return () => clearInterval(window.autoSaveInterval);
  }, []);

  const getUpdatedCaps = (tier, currentFlex) => {
    const caps = [100, 250, 300, 5000, 5000, 999999999];
    const mhCaps = [100, 150, 300, 500, 500, 1000];
    let auraCap = caps[tier] || caps[0];
    let mhCap = mhCaps[tier] || mhCaps[0];
    let cloutCap = auraCap;

    if (!currentFlex) return { auraCap, cloutCap, mhCap };

    if (currentFlex?.yacht?.owned && tier < 5) {
      cloutCap = auraCap * 10;
    }

    // Showcase Flex Capacity Shattering
    if (currentFlex?.penthouse?.owned) {
      auraCap = Math.max(auraCap, 600);
      cloutCap = Math.max(cloutCap, 1500); // Mogul Runway
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
  };

  // Dynamic Stat Caps
  useEffect(() => {
    try {
      if (ph !== 'PLAYING') return;
      const { auraCap, cloutCap, mhCap } = getUpdatedCaps(pl?.tier || 0, flex || {});

      setPl(prev => {
        if (!prev) return prev;
        if (prev.maxClout === cloutCap && prev.maxAura === auraCap && prev.maxMentalHealth === mhCap) return prev;
        return {
          ...prev,
          maxClout: cloutCap,
          maxAura: auraCap,
          maxMentalHealth: mhCap,
          clout: Math.min(cloutCap, prev.clout || 0),
          aura: Math.min(auraCap, prev.aura || 0),
          mentalHealth: Math.min(mhCap, prev.mentalHealth || 0)
        };
      });
    } catch (e) {
      console.error("Initialization Error in Stat Caps:", e);
    }
  }, [pl?.tier, ph, flex?.yacht?.owned, flex?.penthouse?.owned, flex?.logistics?.owned, flex?.jet?.owned, flex?.watch?.owned, flex?.watch?.prActive]);

  // Keep Track of Records & Auto Failures
  useEffect(() => {
    try {
      if (ph !== 'PLAYING' || !pl) return;
      if ((pl.bag || 0) > (peaks?.peakB || 0) || (pl.aura || 0) > (peaks?.peakA || 0) || (pl.clout || 0) > (peaks?.peakC || 0)) {
      setPeaks(prev => ({
        peakB: Math.max(prev?.peakB || 0, pl.bag || 0),
        peakA: Math.max(prev?.peakA || 0, pl.aura || 0),
        peakC: Math.max(prev?.peakC || 0, pl.clout || 0)
      }));
    }
    const maxMudAge = 30;
    const isMud = pl.tier === 0;
    const hasPassive = smmClients > 0 || runnerCount > 0 || ass?.watch || ass?.pent || (tch.l && tch.pw);

    if ((pl.bag || 0) < 0 && !fatalTragedyMessage) {
      setFatalTragedyMessage("BANKRUPTCY: Your net worth has dipped into the negative. The creditors have arrived, and they aren't here to talk. The hustle is dead.");
    }

    if (((pl.bag || 0) <= 0 && !hasPassive) || fatalTragedyMessage) {
      const topHustle = Object.keys(hustleClicks).reduce((a, b) => hustleClicks[a] > hustleClicks[b] ? a : b);
      const roasts = {
        vintage: "You spent your best years bin dipping. You died smelling like vintage mothballs, holding a bootleg hoodie you swore was a Grail.",
        streetwear: "Hyped yourself into poverty. You ended up an old man with 500 unsold, screen-printed graphic tees rotting in your parents' garage.",
        dropship: "Automated your way to absolute zero. You spent your whole life staring at unoptimized Facebook ad pixels and arguing with foreign suppliers.",
        tech: "Bricked your own future. You blew your life savings on cheap, third-party phone batteries that ended up melting your workbench.",
        smm: "Killed by client feedback. You spent your youth getting yelled at by a local pizzeria owner over a low-performing Instagram Reel.",
        runners: "Overthrown by local middle-schoolers. Your neighborhood bicycle delivery cartel mutinied and stole your inventory over a $200 bonus dispute."
      };

      setDeath({
        r: "THE AUTOPSY REPORT",
        i: roasts[topHustle] || "You failed to find a groove and the world moved on without you.",
        rank: "BROKE HUSTLER",
        hustle: topHustle
      });
    } else if (age >= maxMudAge && isMud) {
      const topHustle = Object.keys(hustleClicks).reduce((a, b) => hustleClicks[a] > hustleClicks[b] ? a : b);
      const roasts = {
        vintage: "You spent your best years bin dipping. You died smelling like vintage mothballs, holding a bootleg hoodie you swore was a Grail.",
        streetwear: "Hyped yourself into poverty. You ended up an old man with 500 unsold, screen-printed graphic tees rotting in your parents' garage.",
        dropship: "Automated your way to absolute zero. You spent your whole life staring at unoptimized Facebook ad pixels and arguing with foreign suppliers.",
        tech: "Bricked your own future. You blew your life savings on cheap, third-party phone batteries that ended up melting your workbench.",
        smm: "Killed by client feedback. You spent your youth getting yelled at by a local pizzeria owner over a low-performing Instagram Reel.",
        runners: "Overthrown by local middle-schoolers. Your neighborhood bicycle delivery cartel mutinied and stole your inventory over a $200 bonus dispute."
      };

      setDeath({
        r: "THE AUTOPSY REPORT",
        i: "MUD TIER EXCLUSION: " + (roasts[topHustle] || "Your youth expired before your empire began."),
        rank: "MUD TIER CASUALTY",
        hustle: topHustle
      });
    }
    if ((pl.aura || 0) <= 0) {
      setCancelIntro({ r: "PERMANENT DE-PLATFORMING SCANDAL", i: "Public sentiment reached total rejection. Sponsors canceled you, your platforms were erased." });
    }

      if (pl.mentalHealth <= 0 && !isBreakdownActive) {
        setIsBreakdownActive(true);
        setShakeActive(true);
        setGBusy(true);
        setTimeout(() => setShakeActive(false), 500);
      }

      // Notification Trigger Evaluator
      const financialPhase = (pl.bag || 0) < 10000 ? 1 : (pl.bag || 0) < 100000 ? 2 : (pl.bag || 0) < 500000 ? 3 : 0;
      if (financialPhase > 0) {
        if ((pl.bag || 0) <= 0 && financialPhase === 1) triggerNotification('BAG_FAIL_01');
        if ((pl.aura || 0) < ((pl.maxAura || 100) * 0.1) && financialPhase === 1) triggerNotification('AUR_LOW_01');
        if ((pl.mentalHealth || 0) < ((pl.maxMentalHealth || 100) * 0.1) && financialPhase === 1) triggerNotification('HEA_LOW_01');
        if ((pl.mentalHealth || 0) <= 0 && financialPhase === 3) triggerNotification('HEA_FAIL_01');
      }
    } catch (e) {
      console.error("Initialization Error in Records tracking:", e);
    }
  }, [pl, ph, peaks, isBreakdownActive]);

  const rDischarge = () => {
    setPl(prev => ({
      ...prev,
      bag: prev.bag - 300,
      mo: prev.mo + 1,
      mentalHealth: Math.min(prev.maxMentalHealth, Math.floor(prev.maxMentalHealth * 0.5))
    }));
    setIsBreakdownActive(false);
    setGBusy(false);
    setNews(prev => ["🏥 DISCHARGED: You've completed mandatory wellness rehab. -$300 fee applied.", ...prev.slice(0, 15)]);
  };

  // Tier Progression System
  useEffect(() => {
    try {
      if (ph !== 'PLAYING' || !pl) return;
      let nextTier = pl.tier || 0;
    const tiersCount = TIERS?.length || 0;
    for (let i = nextTier + 1; i < tiersCount; i++) {
      const req = TIERS[i]?.req;
      if (!req) break;
      if ((peaks?.peakB || 0) >= (req.bag || 0) && (peaks?.peakC || 0) >= (req.clout || 0) && (peaks?.peakA || 0) >= (req.aura || 0)) {
        nextTier = i;
      } else {
        break;
      }
    }
      if (nextTier !== (pl.tier || 0)) {
        setPl(prev => ({ ...prev, tier: nextTier }));
        if (nextTier >= 4) setPmcUnlocked(true);
        setNews(prev => [`🏆 TIER UP! You have ascended to the ${TIERS[nextTier]?.label || 'Next'} Tier.`, ...prev.slice(0, 15)]);
      }
    } catch (e) {
      console.error("Initialization Error in Tier Progression:", e);
    }
  }, [peaks, ph, pl.tier]);

  // Random Chaos & Empire Alert Engine
  useEffect(() => {
    if (ph !== 'PLAYING') return;

    const interval = setInterval(() => {
      try {
        // Tiny chance (5%) for a random event every 30 seconds
        if (Math.random() > 0.05) return;

        const { conglomActive, ass, pl, saasUsers, artHoldings } = stateRef.current;
        const roll = Math.random();

        // 1. IRS Audit / Anti-Trust Sweep (Requires Conglomerate)
        if (roll < 0.33 && conglomActive) {
          if (ass?.legalTeam) {
            setNews(prev => ["⚖️ LEGAL: Elite defense team blocked a surprise IRS audit.", ...prev.slice(0, 15)]);
          } else {
            const penalty = Math.floor((pl?.bag || 0) * 0.1);
            setPl(prev => ({ ...prev, bag: (prev?.bag || 0) - penalty }));
            setMod({
              s: true,
              t: "IRS ANTI-TRUST SWEEP",
              m: `The feds raided your holding company. Regulators seized $${penalty.toLocaleString()} in 'unaccounted' assets.`,
              o: [{ label: "COMPLY", action: () => setMod({ s: false }) }],
              ui: "ui-crisis"
            });
          }
        }
        // 2. Viral Market Windfall
        else if (roll < 0.66 && ((saasUsers || 0) > 0 || (artHoldings || 0) > 0)) {
          const cloutBonus = Math.floor((pl?.clout || 0) / 10);
          if ((saasUsers || 0) > 0 && Math.random() > 0.5) {
            const gain = 500 + (cloutBonus * 100);
            setSaasUsers(prev => (prev || 0) + gain);
            setMod({
              s: true,
              t: "VIRAL PRODUCT REACTION",
              m: `An A-list celebrity tagged your SaaS. You just gained ${gain.toLocaleString()} new users overnight!`,
              o: [{ label: "RIDE THE WAVE", action: () => setMod({ s: false }) }],
              ui: "ui-modal"
            });
          } else if ((artHoldings || 0) > 0) {
            setArtMarketSentiment(prev => Math.min(1, (prev || 0) + 0.5));
            setMod({
              s: true,
              t: "ART MARKET MANIA",
              m: "A global auction record just shattered. Your fine art collection's valuation is skyrocketing.",
              o: [{ label: "EXCELLENT", action: () => setMod({ s: false }) }],
              ui: "ui-modal"
            });
          }
        }
        // 3. Burnout Crisis
        else if ((pl?.mentalHealth || 0) < 20) {
          setPassiveFrozen(true);
          setMod({
            s: true,
            t: "EMPIRE BURNOUT",
            m: "Your mental state is critical. You've gone AWOL, and passive operations have frozen until you rest or upgrade your lifestyle.",
            o: [{ label: "I NEED A BREAK", action: () => setMod({ s: false }) }],
            ui: "ui-crisis"
          });
        }
      } catch (e) {
        console.error("Chaos Engine Error:", e);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [ph]);

  // Click Chaos Helpers
  const executeChaosRoll = async (hustleKey, baseSuccessAction) => {
    const roll = Math.floor(Math.random() * 20) + 1; // 1-20
    if (roll === 1) {
      const pool = mudChaosPools[hustleKey];
      if (!pool) return await baseSuccessAction();

      const event = pool[Math.floor(Math.random() * pool.length)];
      let updatedEventText = event.text;

      const willBeNegative = {
        bag: (stateRef.current.pl.bag + event.bag) < 0,
        aura: (stateRef.current.pl.aura + event.aura) < 0,
        clout: (stateRef.current.pl.clout + event.clout) < 0,
        mh: (stateRef.current.pl.mentalHealth + event.mh) < 0
      };

      if (willBeNegative.aura) updatedEventText += " (Hint: Go flip Vintage Tees to get your respect back.)";
      if (willBeNegative.mh) updatedEventText += " (Hint: Click MENTAL HEALTH TIME before you crash.)";
      if (willBeNegative.clout) updatedEventText += " (Hint: Run SMM packages or fix laptops.)";
      if (willBeNegative.bag) updatedEventText += " (Hint: Grind Surveys or deliver food.)";

      setPl(prev => ({
        ...prev,
        bag: prev.bag + event.bag,
        aura: Math.max(0, Math.min(prev.maxAura, prev.aura + event.aura)),
        clout: Math.min(prev.maxClout, prev.clout + event.clout),
        mentalHealth: Math.max(0, Math.min(prev.maxMentalHealth, prev.mentalHealth + event.mh))
      }));

      setActiveEvent({ ...event, text: updatedEventText });
      setIsEventModalOpen(true);
      return undefined;
    }
    return await baseSuccessAction();
  };

  const triggerChaos = (hustleKey) => {
    const fatigue = hustleFatigue[hustleKey] || 0;
    let risk = 0.02 + (fatigue / 100);
    if (ass.legalTeam) risk *= 0.5;
    return Math.random() < risk;
  };

  const updateFatigue = (activeHustle) => {
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);

    setHustleFatigue(prev => {
      const next = { ...prev };
      const isDifferent = lastHustle !== activeHustle;
      Object.keys(next).forEach(k => {
        if (k === activeHustle) {
          const increase = 15 * (1 - mhReduction);
          next[k] = Math.min(100, next[k] + increase);
        } else if (isDifferent) {
          next[k] = Math.max(0, next[k] - 10);
        }
      });
      return next;
    });
    setLastHustle(activeHustle);
  };

  // Global Pulse Advance Logic
  const adv = (months = 1) => {
    if (fatalTragedyMessage) return;
    setSwFatigue(prev => Math.max(0, prev - (0.25 * months)));
    setHustleFatigue(prev => {
      const next = { ...prev };
      Object.keys(next).forEach(k => { next[k] = Math.max(0, next[k] - 20); });
      return next;
    });
    setDropshipLock(prev => Math.max(0, prev - months));
    setVintageLock(prev => Math.max(0, prev - months));

    if (clientCrisis) {
      if (karmaFlags.ignoredSmmCrisis) {
        setSmmClients(c => Math.max(0, c - 2));
        setNews(prev => ["📉 SMM: Disgruntled clients post terrible reviews. 2 clients churned.", ...prev.slice(0, 15)]);
      } else {
        setSmmClients(c => Math.max(0, c - 1));
        setNews(prev => ["📉 SMM: Client churned due to unresolved crisis.", ...prev.slice(0, 15)]);
      }
      setClientCrisis(false);
    }

    if (runnerBurnout) {
      if (karmaFlags.ignoredRunnerWelfare) {
        setPl(prev => ({ ...prev, bag: prev.bag - 500, clout: Math.max(0, prev.clout - 10) }));
        setNews(prev => ["📉 GIG: A disgruntled runner stole a premium package. -$500, -10 Clout.", ...prev.slice(0, 15)]);
      } else {
        setRunnerCount(c => Math.max(0, c - 1));
        setNews(prev => ["📉 GIG: Runner mutinied and stole inventory due to burnout.", ...prev.slice(0, 15)]);
      }
      setRunnerBurnout(false);
    }

    if (apiLockoutMonths > 0) setApiLockoutMonths(m => m - 1);
    if (saasPenaltyActive) setSaasPenaltyActive(false);

    // Real World Monitor Ticker countdowns
    if (artBubbleMonths > 0) setArtBubbleMonths(prev => Math.max(0, prev - months));
    if (supplyChainShockMonths > 0) setSupplyChainShockMonths(prev => Math.max(0, prev - months));
    if (viralPopMonths > 0) setViralPopMonths(prev => Math.max(0, prev - months));

    if (artBubbleMonths === 1 && months === 1) setTickerAdvice("WALL STREET: Art Market bubble has burst. Margins normalized.");
    if (supplyChainShockMonths === 1 && months === 1) setTickerAdvice("SUPPLY CHAIN: Component logistics restored. Tech Flipping costs normalized.");
    if (viralPopMonths === 1 && months === 1) setTickerAdvice("TREND WATCH: Retro-synth viral wave fading. Audio Syndicate rates normalized.");

    // Dynamic Micro-Event Engine (Real World Monitor)
    if (Math.random() < 0.10) {
      const eventRoll = Math.random();
      if (eventRoll < 0.33) {
        setArtBubbleMonths(3);
        setTickerAdvice("📈 WALL STREET: Art Market experiencing speculative bubble! Art Hustle resale margins boosted by +40% for the next 3 months.");
      } else if (eventRoll < 0.66) {
        setSupplyChainShockMonths(3);
        setTickerAdvice("⚠️ SUPPLY CHAIN SHOCK: Electronic component shortages hit logistics. Tech Flipping Pallet costs increased by 20%.");
      } else {
        setViralPopMonths(3);
        setTickerAdvice("🎙️ VIRAL POP TREND: Retro-synth sounds going hyper-viral. Indie Audio Syndicate success rates boosted to 90%.");
      }
    }

    // Indie Audio Syndicate: Talent Scouters passive signing
    if (stateRef.current.talentScouters > 0) {
      setAudioTracks(prev => prev + (stateRef.current.talentScouters * months));
    }

    // Politics Game Loop
    const currentLobbyists = stateRef.current.lobbyists;
    if (currentLobbyists > 0) {
      setPl(p => ({ ...p, clout: Math.min(p.maxClout, p.clout + (currentLobbyists * 25)) }));
      setApprovalRating(prev => Math.min(100, prev + (0.5 * currentLobbyists)));
    }

    if (!stateRef.current.isPresident) {
      setApprovalRating(prev => Math.max(0, prev - 2.5));
    }

    // Political Syndicate passive generation
    const assets = stateRef.current.politicalSyndicate.assetLeasing;
    if (assets.governors > 0 || assets.senators > 0 || assets.networkAnchors > 0) {
      setPoliticalSyndicate(prev => {
        let gain = (assets.governors * 0.5) + (assets.senators * 1.5) + (assets.networkAnchors * 3.0);
        if (stateRef.current.flex.yacht.owned) {
          const isBlitzed = stateRef.current.flex.yacht.expiresAt > Date.now();
          gain *= (isBlitzed ? 2.0 : 1.5);
        }
        let nextCapital = Math.min(100, prev.politicalCapital + (gain * months));
        let nextStatus = nextCapital >= 100 ? 'CAMPAIGN_READY' : prev.status;
        return { ...prev, politicalCapital: nextCapital, status: nextStatus };
      });
    }

    setSaasUsers(prev => {
      const churned = Math.floor(prev * saasChurn);
      let growth = 0;
      if (corpClients > 0) {
        growth = corpClients * (10 + Math.floor(stateRef.current.pl.clout / 20));
      }
      return Math.max(0, prev - churned + growth);
    });

    setGeoStability(prev => {
      const next = prev + (Math.random() - 0.5) * 0.1;
      return Math.min(1.5, Math.max(0.5, next));
    });

    setPl(prev => {
      let expenseBurn = 500;
      if (mkt === 2) expenseBurn *= 2;
      if (corpClients > 0) expenseBurn += 10000; // AI Agency ad spend overhead

      // Asset Yield and Maintenance
      let yieldIncome = 0;
      if (flex.watch.owned) yieldIncome += 750;
      if (flex.penthouse.owned) yieldIncome += 15000;

      // New balance sheet impacts
      if (flex.car.owned) expenseBurn += 8000;
      if (flex.yacht.owned) expenseBurn += 250000;

      // Deducting level perk buffs
      if (ass.legalTeam) expenseBurn += 1000000;

      const reduction = 1 - (skl.tax * 0.04);
      expenseBurn = Math.floor(expenseBurn * reduction);

      let passiveSrv = 0;
      if (tch.l && tch.pw) {
        passiveSrv = Math.floor(500 + (tch.u * tch.srv));
      }

      let smmRev = stateRef.current.smmEmpireActive
        ? Math.floor(25000 * (stateRef.current.pl.clout / 300))
        : (stateRef.current.smmClients * 300) + (stateRef.current.aiSmmFactory ? 1000 : (stateRef.current.smmRetainerActive ? 500 : 0));

      if (stateRef.current.flex.penthouse.owned) {
        const isBlitzed = stateRef.current.flex.penthouse.expiresAt > Date.now();
        smmRev = Math.floor(smmRev * (isBlitzed ? 1.70 : 1.35));
      }
      const runnerRev = stateRef.current.runnerCount * 150;

      // Audio Syndicate passives
      const audioMult = stateRef.current.holwoodSyncActive ? 2.0 : 1.0;
      const audioYield = sampleStrike ? 0 : (stateRef.current.audioTracks * 400 * audioMult);

      const pmcYield = (stateRef.current.pmcSquads * 75000) + (stateRef.current.pmcActiveContracts * 100000);

      // Tech Flipping passives
      const techInternRev = stateRef.current.techInterns * 500;
      const enterpriseRev = stateRef.current.enterpriseContracts * 5000;

      // Vintage / Collectible passives
      let vintagePassives = 0;
      if (stateRef.current.vintageBoostActive) {
        vintagePassives = (stateRef.current.hustleClicks.vintage * 50) * 0.5; // Estimated 50% boost value
      }
      let consignmentRev = 0; if (stateRef.current.collectiblePhase === "CONSIGNMENT") { consignmentRev = Math.floor(5000 * (stateRef.current.pl.clout / 100)); }

      const saasRev = (stateRef.current.saasUsers * saasPrice) * (saasPenaltyActive ? 0.5 : 1);
      const saasOverhead = saasUsers * 2;
      const aiRev = apiLockoutMonths > 0 ? 0 : (corpClients * 8000);

      let creGross = (creOfficeCount * 45000) + (creRetailCount * 15000);
      if (mkt === 2 || mkt === 3) creGross = 0; // Mass Commercial Vacancy

      let vacancyMult = 1.0;
      if ((creOfficeCount > 0 || creRetailCount > 0) && Math.random() < 0.15) {
        vacancyMult = 0.5 + (Math.random() * 0.4);
      }
      const creNet = (creGross * vacancyMult) - (creOfficeCount * 20000) - (creRetailCount * 5000);

      const franchiseRev = (unionStrikeActive || supplyChainDisruption) ? 0 : (franchiseCount * 25000);
      let peRev = supplyChainDisruption ? -500000 : (guttedFirms * 100000 * peCompoundingYield);

      const auraBleed = (unionStrikeIgnored ? 50 : 0) + (intelLeak ? 20 : 0);
      const artClout = artHoldings * 20;
      const artDrift = (stateRef.current.flex.art.owned && stateRef.current.flex.art.prActive) ? 5 : 0;

      // Annual 12% Asset Appreciation for Vault Holdings
      if (stateRef.current.collectiblePhase === "VAULT" && stateRef.current.vaultHoldings.length > 0) {
        if (prev.mo % 12 === 0 && months > 0) {
          setVaultHoldings(prevHoldings => prevHoldings.map(h => ({
            ...h,
            cost: Math.floor(h.cost * 1.12)
          })));
        }
      }

      const vaultAura = stateRef.current.collectiblePhase === "VAULT" ? stateRef.current.vaultHoldings.length * 50 : 0;
      const audioClout = audioTracks * 2;
      let pmcHeatContribution = (pmcSquads * 2);

      if (stateRef.current.isPresident) {
        pmcHeatContribution *= 0.5;
      }

      const swfYield = !swfFrozen ? Math.floor(swfInvestment * 0.06 * geoStability) : 0;
      let basePassive = Math.floor((passiveSrv + smmRev + runnerRev + audioYield + pmcYield + (saasRev - saasOverhead) + aiRev + creNet + franchiseRev + peRev + techInternRev + enterpriseRev + consignmentRev + vintagePassives) * legacyMultiplier);
      if (passiveFrozen) basePassive = 0;
      const conglomBonus = conglomActive ? Math.floor(basePassive * 0.25) : 0;

      return {
        ...prev,
        mo: prev.mo + months,
        bag: prev.bag - expenseBurn + yieldIncome + basePassive + (swfYield * legacyMultiplier) + conglomBonus,
        aura: Math.min(prev.maxAura, Math.max(0, prev.aura - auraBleed + vaultAura + artDrift)),
        clout: Math.min(prev.maxClout, prev.clout + artClout + audioClout),
        heat: prev.heat + pmcHeatContribution,
        mentalHealth: Math.min(prev.maxMentalHealth, prev.mentalHealth + (flex.penthouse.owned ? 30 : 15))
      };
    });

    // PMC Loop Phase 4: Heat & Raids
    const currentActiveContracts = stateRef.current.pmcActiveContracts;
    let currentPmcHeat = stateRef.current.pmcHeatLevel;
    let heatAdded = 0;

    if (currentActiveContracts > 0) {
      heatAdded = (10.0 * currentActiveContracts);
    }

    if (stateRef.current.isPresident) {
      heatAdded *= 0.5;
    }

    const finalHeatBeforeRaid = currentPmcHeat + heatAdded;

    if (finalHeatBeforeRaid > 80 && Math.random() < 0.05) {
      // Interpol Raid!
      setPl(prev => ({ ...prev, bag: prev.bag - 500000 }));
      setPmcMercenaries(prev => Math.floor(prev * 0.5));
      setPmcActiveContracts(0);
      setPmcHeatLevel(Math.max(0, finalHeatBeforeRaid - 30));
      setNews(prev => ["<span class='news-scandal'>🚨 INTERPOL RAID: Your PMC operations were compromised! -$500k fine, contracts zeroed, assets seized.</span>", ...prev.slice(0, 15)]);
    } else if (heatAdded > 0) {
      setPmcHeatLevel(finalHeatBeforeRaid);
    }

    // SWF Freeze / Unfreeze
    if (geoStability < 0.7 && !swfFrozen && Math.random() < 0.15) {
      setSwfFrozen(true);
      setNews(prev => ["🌍 SWF ALERT: Geopolitical instability has triggered an international asset freeze.", ...prev.slice(0, 15)]);
    } else if (geoStability > 1.1 && swfFrozen) {
      setSwfFrozen(false);
      setNews(prev => ["🌍 SWF: Global stability restored. Asset freeze lifted.", ...prev.slice(0, 15)]);
    }

    // Conglomerate Risk & Fines
    if (conglomActive) {
      setAntitrustRisk(prev => {
        const next = prev + 3;
        if (next > (Math.random() * 80 + 20)) {
          setPl(p => ({ ...p, bag: p.bag - 50000000 }));
          setNews(prevNews => ["🏛️ ANTI-TRUST: Monopoly investigation triggered a $50M regulatory fine.", ...prevNews.slice(0, 15)]);
          return 0;
        }
        return next;
      });
    }

    // Market Cycle Shift Calculation
    if (Math.random() < 0.15) {
      const nextMarket = Math.floor(Math.random() * 4);
      setMkt(nextMarket);
      const mktNames = ["NORMAL", "BULL MARKET", "RECESSION", "CRACKDOWN"];
      setNews(prev => [`🚨 MARKET WATCH: Shift detected. Economy is now in ${mktNames[nextMarket]} mode.`, ...prev.slice(0, 15)]);
    }

    // SMM Crisis Trigger
    if (smmClients > 0 && Math.random() < 0.20) {
      setClientCrisis(true);
      setNews(prev => ["🚨 SMM ALERT: Client Crisis! Algorithm Shift detected.", ...prev.slice(0, 15)]);
    }

    // 3 AM CLIENT MELTDOWN (Phase 2)
    if (stateRef.current.smmRetainerActive && !stateRef.current.aiSmmFactory && Math.random() < 0.05) {
      setMod({
        s: true,
        t: "3 AM CLIENT MELTDOWN",
        m: "Your biggest retainer client is blowing up your phone because their latest post didn't go viral. How do you respond?",
        o: [
          {
            label: "STAY UP ANSWERING TEXTS (-30 MH)",
            action: () => {
              setPl(prev => ({ ...prev, mentalHealth: Math.max(0, prev.mentalHealth - 30) }));
              setMod({ s: false });
            }
          },
          {
            label: "ISSUE IMMEDIATE REFUND (-$1,000 BAG)",
            action: () => {
              setPl(prev => ({ ...prev, bag: prev.bag - 1000 }));
              setMod({ s: false });
            }
          }
        ],
        ui: "ui-crisis"
      });
    }

    // Runner Burnout Trigger
    if (runnerCount > 0 && Math.random() < 0.15) {
      setRunnerBurnout(true);
      setNews(prev => ["🚨 RUNNER ALERT: Fleet Burnout! Bonus required to retain courier.", ...prev.slice(0, 15)]);
    }

    // Art Market Sentiment Shift
    setArtMarketSentiment(prev => {
      const shift = (Math.random() - 0.5) * 0.4;
      return Math.min(1, Math.max(-1, prev + shift));
    });

    // Private Equity & Franchise Disruption
    if (guttedFirms > 0 || franchiseCount > 0) {
      if (Math.random() < 0.02) {
        setSupplyChainDisruption(true);
        const alertMsg = franchiseCount > 0
          ? "🚨 EMPIRE ALERT: Supply Chain Disruption! National franchise operations frozen."
          : "🚨 PE ALERT: Supply Chain Disruption! Operations frozen. High overhead spike detected.";
        setNews(prev => [alertMsg, ...prev.slice(0, 15)]);
      }
      if (!supplyChainDisruption && guttedFirms > 0) {
        setPeCompoundingYield(prev => prev + 0.02);
      }
    }

    // AI Engine Race Simulation
    if (ai.ig) {
      setAi(prev => {
        const compGains = prev.c * (1.2 + Math.random() * 2);
        const rivalGains = 1.8 + Math.random() * 2.5;
        return {
          ...prev,
          p: Math.min(100, prev.p + compGains),
          r: Math.min(100, prev.r + rivalGains)
        };
      });
    }

    // Campaign Clock System
    if (prs.r) {
      setPrs(prev => {
        const nextMonth = prev.m + 1;
        if (nextMonth >= 12) {
          const winRst = prev.rst >= 51;
          const winSun = prev.sun >= 51;
          const winSub = prev.sub >= 51;
          const score = (winRst ? 1 : 0) + (winSun ? 1 : 0) + (winSub ? 1 : 0);
          setTimeout(() => {
            if (score >= 2) {
              setMod({ s: true, t: "VICTORY ACHIEVED", m: "You won the presidential race and secured the Oval Office control.", o: [{ label: "ACCEPT TERM", action: () => window.location.reload() }], ui: "ui-modal" });
            } else {
              setDeath({ r: "CAMPAIGN CONCESSION NIGHT", i: "Failed to gather 270 electoral units across swing systems.", rank: "DEFEATED NOMINEE" });
            }
          }, 100);
        }
        return { ...prev, m: nextMonth };
      });
    }
  };

  const exStart = () => {
    if (alias.length < 3) return;

    if (diff === 1) { // TRUST FUND (Easy)
      setPl(p => ({ ...p, bag: 25000, clout: 30, aura: 30, maxMentalHealth: 100, mentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 }));
    } else if (diff === 2) { // HUSTLER (Normal)
      setPl(p => ({ ...p, bag: 5000, clout: 15, aura: 15, maxMentalHealth: 150, mentalHealth: 150, heat: 0, maxClout: 100, maxAura: 100 }));
    } else { // GRINDER (Difficult)
      setPl(p => ({ ...p, bag: 1000, clout: 5, aura: 5, maxMentalHealth: 100, mentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 }));
    }

    setSelTier('0');
    setTab('HUB');
    setPh('PROLOGUE_INTRO');
  };

  const dUp = (key, cost, flashMsg) => {
    if (pl.bag >= cost) {
      setPl(p => ({ ...p, bag: p.bag - cost }));
      setUp(u => ({ ...u, [key]: true }));
      setNews(n => [flashMsg, ...n.slice(0, 15)]);
    }
  };

  const bAss = (key, cost, label, cloutBump = 45, auraBump = 0) => {
    if (pl.bag >= cost) {
      setPl(p => ({
        ...p,
        bag: p.bag - cost,
        clout: Math.min(p.maxClout, Number(p.clout || 0) + Number(cloutBump || 0)),
        aura: Math.min(p.maxAura, Number(p.aura || 0) + Number(key === "spt" ? 5000 : auraBump || 0))
      }));
      if (key === 'sneakerBackdoorPlug') setSneakerBackdoorPlug(true);
      else setAss(a => ({ ...a, [key]: true }));
      if (key === 'pent' || key === 'hePent') setPassiveFrozen(false);
      setNews(n => [`💎 FLEET UPGRADE: Acquired ownership rights to ${label}. Balance sheet updated.`, ...n.slice(0, 15)]);
    }
  };

  const triggerImpact = (kind, amount) => {
    const id = Math.random();
    setImp(prev => [...prev, { id, kind, a: amount, w: amount >= 0 }]);
    setTimeout(() => setImp(curr => curr.filter(i => i.id !== id)), 1900);
  };

  const rVintage = async () => {
    const cost = stateRef.current.sneakerBackdoorPlug ? 500 : 50;
    if (pl.bag < cost || pl.mentalHealth < 10) return;
    if (vintageLock > 0) {
      if (pl.bag >= 150) {
        setMod({
          s: true,
          t: "WAREHOUSE BRIBE",
          m: "The warehouse boss is still blocking your entry. Pay a $150 bribe to clear the blacklist?",
          o: [
            { label: "PAY BRIBE ($150)", action: () => {
              triggerNotification('HET_LOW_01');
              setPl(p => ({ ...p, bag: p.bag - 150 })); setVintageLock(0); setMod({ s: false });
            } },
            { label: "CANCEL", action: () => setMod({ s: false }) }
          ],
          ui: "ui-modal"
        });
      }
      return;
    }
    updateFatigue('vintage');
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - cost, mentalHealth: p.mentalHealth - (10 * (1 - mhReduction)) }));
    setHustleClicks(prev => ({ ...prev, vintage: prev.vintage + 1 }));

    if (triggerChaos('vintage')) {
      const financialPhase = stateRef.current.pl.bag < 10000 ? 1 : stateRef.current.pl.bag < 100000 ? 2 : stateRef.current.pl.bag < 500000 ? 3 : 0;
      if (pl.bag < 500000 && financialPhase === 3) triggerNotification('AUR_FAIL_01');

      if (karmaFlags.soldBootleg) {
        setPl(p => ({ ...p, aura: Math.max(0, p.aura - 20) }));
        setSmmPenalty(true);
        setNews(n => ["🚫 THE COMMUNITY EXPOSURE: Thrift community exposed your bootleg sales online. -20 Aura, SMM access locked.", ...n.slice(0, 15)]);
      } else {
        setVintageLock(3);
        setNews(n => ["🚫 THE WAREHOUSE BLACKLIST: Boss blocks entry for 3 months unless you pay a $150 bribe.", ...n.slice(0, 15)]);
      }
      return undefined;
    }

    await new Promise(r => setTimeout(r, 800));

    const roll = Math.random();
    let profit = -cost;
    if (roll < 0.01) { // GRAIL!
      setPl(p => ({ ...p, bag: p.bag + 600, clout: Math.min(p.maxClout, p.clout + 15), aura: Math.min(p.maxAura, p.aura + 1) }));
      if (collectiblePhase === 'VAULT') {
        setVaultHoldings(prev => [...prev, { name: "Thrifted Grail", cost: 600 }]);
      }
      setNews(n => ["👕 GRAIL FOUND! A rare archive piece secured for the vault.", ...n.slice(0, 15)]);
      setMod({
        s: true,
        t: "GRAIL SECURED! 🏆",
        m: "You hit the bins and found an authentic 1990s Grail. The street authenticity and clout boost is massive.",
        o: [{ label: "CELEBRATE", action: () => setMod({ s: false }) }],
        ui: "ui-modal"
      });
      triggerImpact('bag', 600);
      profit = 600;
    } else if (roll < 0.61) { // Mid-Tier
      setPl(p => ({ ...p, bag: p.bag + 120, clout: Math.min(p.maxClout, p.clout + 3) }));
      triggerImpact('bag', 120);
      profit = 120;
    } else if (roll < 0.90) { // Common Thrift
      setPl(p => ({ ...p, bag: p.bag + 35 }));
      triggerImpact('bag', 35);
      profit = 35;
    } else { // Bootleg
      setVinCh('bootleg');
      return undefined;
    }
    const net = profit - cost;
    if (net > 0) {
      setVintageRevenueTracker(prev => {
        const next = prev + net;
        // Phase Transitions: Only VINTAGE -> SNEAKER is automatic
        if (next >= 2500 && collectiblePhase === 'VINTAGE') {
          setCollectiblePhase('SNEAKER');
          setVintageBoostActive(true);
          setPl(p => ({ ...p, aura: p.aura + 500 }));
          setNews(n => ["🌟 VINTAGE EMPIRE UNLOCKED! +500 Aura & +50% Passive Revenue Boost!", ...n.slice(0, 15)]);
        }
        return next;
      });
    }

    adv();
    return profit;
  };

  const rSneakerDrop = async () => {
    if (pl.bag < 300 || pl.mentalHealth < 15) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 300, mentalHealth: p.mentalHealth - (15 * (1 - mhReduction)) }));

    await new Promise(r => setTimeout(r, 800));

    const success = sneakerBackdoorPlug || Math.random() < 0.5;
    let profit = -300;
    if (success) {
      profit = 600; // Net profit reported for UI FlashBtn
      setPl(p => ({
        ...p,
        bag: p.bag + 900,
        clout: Math.min(p.maxClout, p.clout + 15),
        aura: Math.min(p.maxAura, p.aura + 10)
      }));
      setNews(n => ["🔥 HYPEBEAST WIN! You copped retail and flipped them instantly to a reseller.", ...n.slice(0, 15)]);
      triggerImpact('bag', 600);
    } else {
      setPl(p => ({
        ...p,
        aura: Math.max(0, p.aura - 20),
        mentalHealth: Math.max(0, p.mentalHealth - 10)
      }));
      setNews(n => ["💀 CAUGHT BUSTED! The middleman on Discord scammed you with high-tier replicas. Authentication failed.", ...n.slice(0, 15)]);
    }
    adv();
    return profit;
  };

  const rBuyConsignment = async () => {
    if (pl.bag < 1500000) return;
    setPl(p => ({ ...p, bag: p.bag - 1500000 }));
    setCollectiblePhase('CONSIGNMENT');
    setConsignmentFeeActive(true);
    setNews(n => ["📱 PLATFORM: Hype Consignment Network launched. Passive fees activated.", ...n.slice(0, 15)]);
  };

  const rBuyVault = async () => {
    if (pl.bag < 5000000) return;
    setPl(p => ({ ...p, bag: p.bag - 5000000 }));
    setCollectiblePhase('VAULT');
    setNews(n => ["🔒 VAULT: Blue-Chip Collectible Vault constructed. Now sourcing legends.", ...n.slice(0, 15)]);
  };

  const rBuyVaultAsset = async (asset) => {
    if (pl.bag < asset.cost) return;
    setPl(p => ({
      ...p,
      bag: p.bag - asset.cost,
      aura: Math.min(p.maxAura, p.aura + asset.aura)
    }));
    setVaultHoldings(prev => [...prev, { name: asset.name, cost: asset.cost }]);
    setNews(n => [`🏆 VAULT: Acquired ${asset.name} for the collection.`, ...n.slice(0, 15)]);
  };

  const rVaultAuction = async () => {
    if (pl.bag < 500000) return;
    setPl(p => ({ ...p, bag: p.bag - 500000 }));

    await new Promise(r => setTimeout(r, 1000));

    const itemNames = ["1985 Game-Worn Jordans", "Original Comic Art #1", "Pre-War Luxury Timepiece", "Historical Document Fragment"];
    const name = itemNames[Math.floor(Math.random() * itemNames.length)];
    const newItem = { name, cost: 500000 };
    setVaultHoldings(prev => [...prev, newItem]);
    setNews(n => [`🏆 AUCTION: Secured ${name} for the vault.`, ...n.slice(0, 15)]);
    adv();
  };

  const rLaunchSmmRetainer = async () => {
    if (pl.bag < 4000) return;
    setPl(p => ({ ...p, bag: p.bag - 4000 }));
    setSmmRetainerActive(true);
    setNews(prev => ["📱 SMM: Retainer packages launched. Passive income active.", ...prev.slice(0, 15)]);
  };

  const rBuySmmFactory = async () => {
    if (pl.bag < 20000) return;
    setPl(p => ({ ...p, bag: p.bag - 20000 }));
    setAiSmmFactory(true);
    setNews(prev => ["🤖 SMM: AI Content Factory deployed. Human risk eliminated.", ...prev.slice(0, 15)]);
  };

  const rBuySmmEmpire = async () => {
    if (pl.bag < 250000) return;
    setPl(p => ({ ...p, bag: p.bag - 250000 }));
    setSmmEmpireActive(true);
    setNews(prev => ["🌍 SMM: Global Media Empire established. Revenue now scales with Clout.", ...prev.slice(0, 15)]);
  };

  const rSmmPitch = async () => {
    if (pl.clout < 15 || pl.mentalHealth < 20 || smmPenalty || smmRetainerActive) return;
    updateFatigue('smm');
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, mentalHealth: p.mentalHealth - (20 * (1 - mhReduction)) }));
    setHustleClicks(prev => ({ ...prev, smm: prev.smm + 1 }));

    if (triggerChaos('smm')) {
      const financialPhase = stateRef.current.pl.bag < 10000 ? 1 : stateRef.current.pl.bag < 100000 ? 2 : stateRef.current.pl.bag < 500000 ? 3 : 0;
      if (pl.bag < 500000 && financialPhase === 3) triggerNotification('HET_CRASH_01');

      if (karmaFlags.ignoredSmmCrisis) {
        setSmmClients(c => Math.max(0, c - 2));
        setNews(n => ["📉 KARMA DETONATION: Disgruntled clients post terrible reviews. 2 clients lost.", ...n.slice(0, 15)]);
      } else {
        setNews(n => ["🚫 THE GROUP-CHAT BLACKLIST: Chamber of Commerce tags you as spam. Pitch success drops to 10%.", ...n.slice(0, 15)]);
        setSmmPenalty(true);
      }
      return undefined;
    }

    await new Promise(r => setTimeout(r, 800));

    const successProb = smmPenalty ? 0.1 : 0.5;
    if (Math.random() < successProb) {
      setSmmClients(c => c + 1);
      setNews(prev => ["🤝 SMM: Pitch successful! New client onboarded.", ...prev.slice(0, 15)]);
    } else {
      setNews(prev => ["❌ SMM: Pitch Rejected: Need more street leverage.", ...prev.slice(0, 15)]);
    }
    adv();
  };

  const rSmmFix = async () => {
    if (pl.mentalHealth < 15) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, mentalHealth: p.mentalHealth - (15 * (1 - mhReduction)) }));
    await new Promise(r => setTimeout(r, 800));
    setClientCrisis(false);
    setNews(prev => ["✅ SMM: Content strategy fixed. Crisis averted.", ...prev.slice(0, 15)]);
    return undefined;
  };

  const triggerNotification = (id) => {
    if (stateRef.current.seenNotifications.includes(id)) return;
    const data = NOTIFICATION_DATABASE[id];
    if (!data) return;

    setSeenNotifications(prev => [...prev, id]);
    setActiveNotification(data);
    setGBusy(true);
  };

  const closeNotification = () => {
    setActiveNotification(null);
    setGBusy(false);
  };

  const rDelivery = async () => {
    if (pl.mentalHealth < 15) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag + 25, mentalHealth: p.mentalHealth - (15 * (1 - mhReduction)) }));
    adv();
    return 25;
  };

  const rPlasma = async () => {
    if (pl.mentalHealth < 40) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag + 60, mentalHealth: p.mentalHealth - (40 * (1 - mhReduction)) }));
    adv();
    return 60;
  };

  const rSurvey = async () => {
    if (pl.mentalHealth < 10) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag + 10, mentalHealth: p.mentalHealth - (10 * (1 - mhReduction)) }));
    adv();
    return 10;
  };

  const rLabor = async () => {
    if (pl.mentalHealth < 25) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag + 45, mentalHealth: p.mentalHealth - (25 * (1 - mhReduction)) }));
    adv();
    return 45;
  };

  const rRest = async () => {
    const financialPhase = stateRef.current.pl.bag < 10000 ? 1 : stateRef.current.pl.bag < 100000 ? 2 : stateRef.current.pl.bag < 500000 ? 3 : 0;
    if (financialPhase === 2) triggerNotification('HEA_BOOST_01');

    setPl(p => ({ ...p, mentalHealth: Math.min(p.maxMentalHealth, p.mentalHealth + 50) }));
    setPassiveFrozen(false);
    adv();
    setNews(prev => ["😴 Resting... MentalHealth recovered. Passive income resumes.", ...prev.slice(0, 15)]);
  };

  const rTechSource = async () => {
    const sourceCost = stateRef.current.bulkPalletsUnlocked ? Math.floor(techSourceCost * 0.6) : techSourceCost;
    if (pl.bag < sourceCost) return;
    updateFatigue('tech');
    setPl(p => ({ ...p, bag: p.bag - sourceCost }));
    setTechItem({ id: Math.random(), name: "Bricked Hardware" });
    setHustleClicks(prev => ({ ...prev, tech: prev.tech + 1 }));

    if (triggerChaos('tech')) {
      if (karmaFlags.usedCheapParts) {
        const pay = 250;
        if (pl.bag >= pay) {
          setPl(p => ({ ...p, bag: p.bag - pay }));
          setNews(n => ["💸 KARMA DETONATION: Swollen screen refund paid. -$250.", ...n.slice(0, 15)]);
        } else {
          setPl(p => ({ ...p, aura: Math.max(0, p.aura - 15) }));
          setNews(n => ["💀 KARMA DETONATION: Refused refund. -15 Aura.", ...n.slice(0, 15)]);
        }
      } else {
        setNews(n => ["🚫 THE LISTING TAKEDOWN: Marketplace flags down reach. Sourcing climbs to $250.", ...n.slice(0, 15)]);
        setTechSourceCost(250);
      }
      return undefined;
    }

    setNews(n => ["💻 TECH: Sourced bricked hardware. Ready for repair.", ...n.slice(0, 15)]);
  };

  const rTechFixA = async () => {
    if (pl.bag < 30 || pl.mentalHealth < 10 || !techItem) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 30, mentalHealth: p.mentalHealth - (10 * (1 - mhReduction)) }));
    await new Promise(r => setTimeout(r, 800));

    const isLogisticsOwned = flex.logistics.owned;

    if (isLogisticsOwned || Math.random() < 0.5) {
      const financialPhase = stateRef.current.pl.bag < 10000 ? 1 : stateRef.current.pl.bag < 100000 ? 2 : stateRef.current.pl.bag < 500000 ? 3 : 0;
      if (financialPhase === 2) triggerNotification('BAG_BOOST_01');

      const payout = Math.floor(750 * legacyMultiplier);
      setPl(p => ({ ...p, bag: p.bag + payout }));
      setTechItem(null);
      triggerImpact('bag', payout - 30);
      setNews(n => [`✅ TECH: Repair successful with cheap parts! Sold for $${payout.toLocaleString()}.`, ...n.slice(0, 15)]);
    } else {
      setPl(p => ({ ...p, aura: Math.max(0, p.aura - 5) }));
      setTechItem(null);
      setNews(n => ["💀 TECH: Hardware bricked during repair. Aura decreased.", ...n.slice(0, 15)]);
    }
    adv();
  };

  const rTechFixB = async () => {
    if (pl.bag < 100 || pl.mentalHealth < 15 || !techItem) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 100, mentalHealth: p.mentalHealth - (15 * (1 - mhReduction)), clout: Math.min(p.maxClout, p.clout + 2), aura: Math.min(p.maxAura, p.aura + 1) }));
    setTechFlipsComplete(prev => prev + 1);
    await new Promise(r => setTimeout(r, 1000));
    const payout = Math.floor(750 * legacyMultiplier);
    setPl(p => ({ ...p, bag: p.bag + payout }));
    setTechItem(null);
    triggerImpact('bag', payout - 100);
    setNews(n => [`✅ TECH: Premium repair successful! Sold for $${payout.toLocaleString()}. Hardware Mastery increased.`, ...n.slice(0, 15)]);
    adv();
    return 650;
  };

  const rProcessBulkPallet = async () => {
    const baseCost = 5000;
    const shockMultiplier = stateRef.current.supplyChainShockMonths > 0 ? 1.2 : 1.0;
    const cost = Math.floor(baseCost * shockMultiplier);

    if (pl.bag < cost || pl.mentalHealth < 40) return;
    setPl(p => ({ ...p, bag: p.bag - cost, mentalHealth: p.mentalHealth - 40 }));
    await new Promise(r => setTimeout(r, 1500));
    // Math: 15 units, baseline profit $650 per unit. Scalar 14x for wholesale efficiency.
    const unitProfit = 650;
    const bulkProfit = unitProfit * 14;
    const finalPayout = Math.floor((baseCost + bulkProfit) * legacyMultiplier);
    setPl(p => ({ ...p, bag: p.bag + finalPayout, clout: Math.min(p.maxClout, p.clout + 10) }));
    setTechFlipsComplete(prev => prev + 15);
    triggerImpact('bag', finalPayout - cost);
    setNews(n => [`📦 TECH: Bulk Pallet Processed! 15 units flipped. Net Profit: $${(finalPayout - cost).toLocaleString()}.`, ...n.slice(0, 15)]);
    adv();
  };

  const rRunnerRecruit = async () => {
    if (pl.bag < 300 || pl.mentalHealth < 25 || pl.clout < 20) return;
    updateFatigue('runners');
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 300, mentalHealth: p.mentalHealth - (25 * (1 - mhReduction)) }));
    setHustleClicks(prev => ({ ...prev, runners: prev.runners + 1 }));

    if (triggerChaos('runners')) {
      if (karmaFlags.ignoredRunnerWelfare) {
        setPl(p => ({ ...p, bag: p.bag - 500, clout: Math.max(0, p.clout - 10) }));
        setNews(n => ["📉 KARMA DETONATION: Disgruntled runner stole package. -$500, -10 Clout.", ...n.slice(0, 15)]);
      } else {
        setRunnerCount(c => Math.max(0, c - 3));
        setPl(p => ({ ...p, bag: p.bag - 400 }));
        setNews(n => ["🚫 THE SIDEWALK RAID: Bikes impounded. Lost 3 couriers, -$400 fine.", ...n.slice(0, 15)]);
      }
      return undefined;
    }

    const financialPhase = stateRef.current.pl.bag < 10000 ? 1 : stateRef.current.pl.bag < 100000 ? 2 : stateRef.current.pl.bag < 500000 ? 3 : 0;
    if (financialPhase === 2) triggerNotification('AUR_BOOST_01');

    setRunnerCount(prev => prev + 1);
    setNews(n => ["🏃 GIG: New fleet courier recruited.", ...n.slice(0, 15)]);
    adv();
  };

  const rRunnerFix = async () => {
    if (pl.bag < 200) return;
    setPl(p => ({ ...p, bag: p.bag - 200 }));
    setRunnerBurnout(false);
    setNews(n => ["✅ GIG: Bonus paid. Fleet burnout resolved.", ...n.slice(0, 15)]);
  };

  const rSaasClick = async () => {
    if (pl.bag < 5000 || pl.mentalHealth < 20) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 5000, mentalHealth: p.mentalHealth - (20 * (1 - mhReduction)) }));
    setHustleClicks(prev => ({ ...prev, saas: (prev.saas || 0) + 1 }));

    // Click Catastrophe: Cyber Breach (2%)
    const risk = ass.legalTeam ? 0.01 : 0.02;
    if (Math.random() < risk) {
      const penalty = ass.legalTeam ? 25000 : 50000;
      setPl(p => ({ ...p, bag: p.bag - penalty }));
      setSaasPenaltyActive(true);
      setNews(prev => ["🚨 CYBER BREACH: Hackers breached your SaaS servers. -$50,000 and 50% revenue cut next cycle.", ...prev.slice(0, 15)]);
      return undefined;
    }

    const userGain = techFlipsComplete >= 10 ? 120 : 100;
    setSaasUsers(prev => prev + userGain);
    setNews(prev => [`📈 SAAS: Marketing push successful! +${userGain} users acquired.`, ...prev.slice(0, 15)]);
    adv();
  };

  const rAiAgencyClick = async () => {
    if (pl.bag < 2500 || pl.mentalHealth < 15 || pl.bag < 1000000 || pl.clout < 150 || pl.aura < 100) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 2500, mentalHealth: p.mentalHealth - (15 * (1 - mhReduction)) }));
    setHustleClicks(prev => ({ ...prev, ai_agency: (prev.ai_agency || 0) + 1 }));

    // Click Catastrophe: API Poisoning (2%)
    const risk = ass.legalTeam ? 0.01 : 0.02;
    if (Math.random() < risk) {
      setApiLockoutMonths(ass.legalTeam ? 1 : 3);
      setNews(prev => ["🚨 API POISONING: Your lead bots were flagged. Agency suspended for 3 game months.", ...prev.slice(0, 15)]);
      return undefined;
    }

    if (Math.random() < 0.4) {
      setCorpClients(c => c + 1);
      setNews(prev => ["🤝 AI AGENCY: New high-ticket corporate client secured.", ...prev.slice(0, 15)]);
    } else {
      setNews(prev => ["❌ AI AGENCY: Proposal rejected. Refine your models.", ...prev.slice(0, 15)]);
    }
    adv();
  };

  const rCreBuyOffice = async () => {
    if (pl.bag < 15000000 || pl.mentalHealth < 30 || pl.clout < 200 || pl.aura < 250) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 15000000, mentalHealth: p.mentalHealth - (30 * (1 - mhReduction)) }));
    setCreOfficeCount(t => t + 1);
    setHustleClicks(prev => ({ ...prev, cre: (prev.cre || 0) + 1 }));
    setNews(prev => ["🏢 CRE: Office Tower acquisition complete. Massive passive rent added.", ...prev.slice(0, 15)]);
    adv();
  };

  const rCreBuyRetail = async () => {
    if (pl.bag < 5000000 || pl.mentalHealth < 30 || pl.clout < 200 || pl.aura < 250) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 5000000, mentalHealth: p.mentalHealth - (30 * (1 - mhReduction)) }));
    setCreRetailCount(t => t + 1);
    setHustleClicks(prev => ({ ...prev, cre: (prev.cre || 0) + 1 }));
    setNews(prev => ["🏢 CRE: Retail Strip acquisition complete. Monthly yield increased.", ...prev.slice(0, 15)]);
    adv();
  };

  const rFranchiseClick = async () => {
    if (pl.bag < 500000 || pl.mentalHealth < 25 || pl.bag < 5000000 || pl.clout < 300 || pl.aura < 200) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 500000, mentalHealth: p.mentalHealth - (25 * (1 - mhReduction)) }));
    setHustleClicks(prev => ({ ...prev, franchise: (prev.franchise || 0) + 1 }));

    // Click Catastrophe: Union Strike (2%)
    const risk = ass.legalTeam ? 0.01 : 0.02;
    if (Math.random() < risk) {
      if (ass.legalTeam && Math.random() < 0.5) {
        setNews(prev => ["⚖️ LEGAL: Elite defense team blocked the union strike.", ...prev.slice(0, 15)]);
      } else {
        setUnionStrikeActive(true);
        setNews(prev => ["🚨 UNION STRIKE: Franchise workers have walked out. Operations halted.", ...prev.slice(0, 15)]);
      }
      return undefined;
    }

    setFranchiseCount(f => f + 1);
    setNews(prev => ["🍟 FRANCHISE: New territory acquired. Revenue scaling.", ...prev.slice(0, 15)]);
    adv();
  };

  const rResolveUnionStrike = (choice) => {
    if (choice === 'settle') {
      if (pl.bag < 100000) return;
      setPl(p => ({ ...p, bag: p.bag - 100000 }));
      setUnionStrikeActive(false);
      setUnionStrikeIgnored(false);
      setNews(prev => ["✅ FRANCHISE: Strike resolved via $100,000 wage settlement.", ...prev.slice(0, 15)]);
    } else {
      setUnionStrikeIgnored(true);
      setNews(prev => ["⚠️ FRANCHISE: Strike ignored. Operations remain zeroed, Aura will bleed.", ...prev.slice(0, 15)]);
    }
  };

  const rResolveSupplyChain = async () => {
    if (pl.bag < 2000000) return;
    setPl(p => ({ ...p, bag: p.bag - 2000000 }));
    setSupplyChainDisruption(false);
    setNews(prev => ["✅ SUPPLY CHAIN: Logistics stabilized. Operations resumed.", ...prev.slice(0, 15)]);
  };

  const rPeClick = async () => {
    if (pl.bag < 25000000 || pl.mentalHealth < 40) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 25000000, mentalHealth: p.mentalHealth - (40 * (1 - mhReduction)) }));
    setHustleClicks(prev => ({ ...prev, pe: (prev.pe || 0) + 1 }));

    // Click Catastrophe: SEC Pension Subpoena (2%)
    const risk = ass.legalTeam ? 0.01 : 0.02;
    if (Math.random() < risk) {
      const bagPen = ass.legalTeam ? 5000000 : 10000000;
      const auraPen = ass.legalTeam ? 75 : 150;
      setPl(p => ({ ...p, bag: p.bag - bagPen, aura: Math.max(0, p.aura - auraPen) }));
      setNews(prev => ["🚨 SEC SUBPOENA: Pension fund irregularities detected. -$10,000,000 and -150 Aura.", ...prev.slice(0, 15)]);
      return undefined;
    }

    setPeProgress(p => {
      const next = p + 20;
      if (next >= 100) {
        setPl(prev => ({ ...prev, bag: prev.bag + 25000000 }));
        setGuttedFirms(g => g + 1);
        setNews(prev => ["💰 PE: Buyout complete! Awarded $25,000,000 liquid windfall.", ...prev.slice(0, 15)]);
        return 0;
      }
      return next;
    });
    adv();
  };

  const rArtSpeculate = async () => {
    if (pl.mentalHealth < 20) return;
    setPl(p => ({ ...p, mentalHealth: p.mentalHealth - 20 }));
    // Shift sentiment randomly to represent "Speculation"
    const shift = (Math.random() - 0.5) * 0.4;
    setArtMarketSentiment(prev => Math.max(-1, Math.min(1, prev + shift)));
    setNews(prev => ["🎨 ART: Market speculation executed. Sentiment shifted.", ...prev.slice(0, 15)]);
    adv();
  };

  const rArtBuy = async () => {
    const acquisitionCost = Math.floor(10000000 * (1 + artMarketSentiment * 0.5));
    if (pl.bag < acquisitionCost || pl.mentalHealth < 35) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - acquisitionCost, mentalHealth: p.mentalHealth - (35 * (1 - mhReduction)) }));
    setHustleClicks(prev => ({ ...prev, art: (prev.art || 0) + 1 }));

    // Click Catastrophe: Forgery Scandal (2%)
    const risk = ass.legalTeam ? 0.01 : 0.02;
    if (Math.random() < risk) {
      const cloutPen = ass.legalTeam ? 100 : 200;
      setPl(p => ({ ...p, clout: Math.max(0, p.clout - cloutPen) }));
      setNews(prev => ["🚨 FORGERY SCANDAL: Masterpiece proven fake. Piece confiscated and -200 Clout.", ...prev.slice(0, 15)]);
      return undefined;
    }

    setArtHoldings(a => a + 1);
    setNews(prev => ["🎨 ART: Collection expanded. Passive Clout increased.", ...prev.slice(0, 15)]);
    adv();
  };

  const rArtAuction = async () => {
    if (artHoldings <= 0) return;
    setArtHoldings(a => a - 1);

    const roll = Math.random() - 0.5;
    const bubbleMult = stateRef.current.artBubbleMonths > 0 ? 1.4 : 1.0;
    let yieldAmt = Math.floor(15000000 * (1 + artMarketSentiment * 2 + roll) * legacyMultiplier * bubbleMult);
    yieldAmt = Math.max(500000, yieldAmt);

    setPl(p => ({ ...p, bag: p.bag + yieldAmt }));
    setNews(prev => [`🖼️ ART AUCTION: Piece sold for $${fMny(yieldAmt)}.`, ...prev.slice(0, 15)]);
    triggerImpact('bag', yieldAmt);
    adv();
  };

  const rFormConglom = async () => {
    const hasAssets = saasUsers > 0 || corpClients > 0 || creOfficeCount > 0 || creRetailCount > 0 || franchiseCount > 0 || guttedFirms > 0 || artHoldings > 0 || tch.l || crp.l > 0 || tur.t > 1 || hf.c > 0;
    if (pl.bag < 250000000 || !hasAssets) return;
    setPl(p => ({ ...p, bag: p.bag - 250000000 }));
    setConglomActive(true);
    setNews(prev => ["🏢 CONGLOMERATE: Global Holding Co formed. Passive yields consolidated and boosted. -$250,000,000.", ...prev.slice(0, 15)]);
  };

  const rLobbyRegulators = async () => {
    if (pl.bag < 10000000 || pl.aura < 20) return;
    setPl(p => ({ ...p, bag: p.bag - 10000000, aura: Math.max(0, p.aura - 20) }));
    setAntitrustRisk(prev => Math.max(0, prev - 40));
    setNews(prev => ["⚖️ LOBBYING: Strategic donations made to key regulators. Anti-trust risk decreased.", ...prev.slice(0, 15)]);
  };

  const rSwfInvest = async () => {
    if (pl.bag < 100000000) return;
    setPl(p => ({ ...p, bag: p.bag - 100000000 }));
    setSwfInvestment(prev => prev + 100000000);
    setNews(prev => ["🌍 SWF: $100,000,000 parked in international sovereign assets.", ...prev.slice(0, 15)]);
  };

  const rSwfWithdraw = async () => {
    if (swfFrozen || swfInvestment <= 0) return;
    setPl(p => ({ ...p, bag: p.bag + swfInvestment }));
    setSwfInvestment(0);
    setNews(prev => ["🌍 SWF: International holdings liquidated into Bag.", ...prev.slice(0, 15)]);
  };

  const rAudioRelease = async () => {
    if (pl.bag < 1000 || pl.mentalHealth < 15) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 1000, mentalHealth: p.mentalHealth - (15 * (1 - mhReduction)) }));
    await new Promise(r => setTimeout(r, 800));

    let successChance = 0.6;
    if (stateRef.current.audioUpgrades.mixingSuite) successChance = 0.8;
    if (stateRef.current.audioUpgrades.analogConsole) successChance = 0.9;
    if (stateRef.current.viralPopMonths > 0) successChance = 0.9;

    if (Math.random() < successChance) {
      setAudioTracks(t => t + 1);
      setNews(prev => ["<span class='news-bag'>🎵 AUDIO: New single released and trending.</span>", ...prev.slice(0, 15)]);
    } else {
      setNews(prev => ["🎵 AUDIO: Single flopped. Market didn't vibe.", ...prev.slice(0, 15)]);
    }
    if (Math.random() < 0.02) {
      setSampleStrike(true);
      setNews(prev => ["<span class='news-scandal'>🚨 AUDIO ALERT: Sample strike detected! Royalty yields frozen.</span>", ...prev.slice(0, 15)]);
    }
    adv();
  };

  const rAudioSettle = async () => {
    if (pl.bag < 5000) return;
    setPl(p => ({ ...p, bag: p.bag - 5000 }));
    setSampleStrike(false);
    setNews(prev => ["✅ AUDIO: Legal settlement paid. Royalties resumed.", ...prev.slice(0, 15)]);
  };

  const rPmcDeploy = async () => {
    if (pl.bag < 5000000 || pl.mentalHealth < 40) return;
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - 5000000, mentalHealth: p.mentalHealth - (40 * (1 - mhReduction)) }));
    await new Promise(r => setTimeout(r, 1200));
    if (Math.random() < 0.5) {
      setPmcSquads(s => s + 1);
      setNews(prev => ["🎖️ PMC: Tactical squad deployed to conflict zone.", ...prev.slice(0, 15)]);
    } else {
      setNews(prev => ["🎖️ PMC: Mission failed. Assets lost in field.", ...prev.slice(0, 15)]);
    }
    if (Math.random() < 0.02) {
      setIntelLeak(true);
      setNews(prev => ["🚨 PMC ALERT: Intel leak detected! Aura bleeding due to scandal.", ...prev.slice(0, 15)]);
    }
    adv();
  };

  const rPmcSettle = async () => {
    if (pl.bag < 2500000) return;
    setPl(p => ({ ...p, bag: p.bag - 2500000 }));
    setIntelLeak(false);
    setNews(prev => ["✅ PMC: Damage control complete. Intel leak scrubbed.", ...prev.slice(0, 15)]);
  };

  const rPmcHire = async () => {
    if (pl.bag < pmcMercCost) return;
    setPl(p => ({ ...p, bag: p.bag - pmcMercCost }));
    setPmcMercenaries(prev => prev + 1);
    setPmcMercCost(prev => prev + 15000);
    setNews(prev => ["🎖️ PMC: New mercenary asset hired and ready for deployment.", ...prev.slice(0, 15)]);
  };

  const rPmcDeployContract = async () => {
    if (pmcMercenaries < 1) return;
    setPmcMercenaries(prev => prev - 1);
    setPmcActiveContracts(prev => prev + 1);
    setNews(prev => ["🎖️ PMC: Contract deployed. Mercenary active in the field.", ...prev.slice(0, 15)]);
  };

  const rPmcBribe = async () => {
    if (pl.bag < pmcBribeCost) return;
    setPl(p => ({ ...p, bag: p.bag - pmcBribeCost }));
    setPmcHeatLevel(prev => Math.max(0, prev * 0.6));
    setPmcBribeCost(prev => prev + 5000);
    setNews(prev => ["⚖️ PMC: Authorities bribed. Heat level significantly reduced.", ...prev.slice(0, 15)]);
  };

  const rVinCh = async (choice) => {
    if (choice === 'burn') {
      setPl(p => ({ ...p, aura: Math.min(p.maxAura, p.aura + 1) }));
      setNews(n => ["🔥 VINTAGE: Burned the bootleg. Street authenticity +1.", ...n.slice(0, 15)]);
    } else if (choice === 'pass') {
      triggerNotification('CLT_FAIL_01');
      setPl(p => ({ ...p, bag: p.bag + 150, aura: Math.max(0, p.aura - 10) }));
      setNews(n => ["💀 VINTAGE: Passed off a rep. Reputation damaged, but bags secured.", ...n.slice(0, 15)]);
      triggerImpact('bag', 150);
    }
    setVinCh(null);
    adv();
  };

  const rSw = async () => {
    const totalOut = (sw.u * (sw.i === 1 ? 15 : sw.i === 2 ? 40 : 90)) + (up.swFlg ? 0 : sw.a);
    if (pl.mentalHealth < 15) return;
    updateFatigue('streetwear');
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - totalOut, mentalHealth: p.mentalHealth - (15 * (1 - mhReduction)) }));
    setHustleClicks(prev => ({ ...prev, streetwear: prev.streetwear + 1 }));

    if (triggerChaos('streetwear')) {
      const financialPhase = stateRef.current.pl.bag < 10000 ? 1 : stateRef.current.pl.bag < 100000 ? 2 : stateRef.current.pl.bag < 500000 ? 3 : 0;
      if (financialPhase === 2) triggerNotification('HET_RISE_01');

      if (karmaFlags.usedCheapBlanks) {
        const cloutPen = ass.legalTeam ? 7 : 15;
        setPl(p => ({ ...p, clout: Math.max(0, p.clout - cloutPen) }));
        setNews(n => ["💀 KARMA DETONATION: Influencer rips your stitching apart. Penalty mitigated by legal.", ...n.slice(0, 15)]);
      } else {
        const bagPen = ass.legalTeam ? 200 : 400;
        const cloutPen = ass.legalTeam ? 7 : 15;
        const mhPen = ass.legalTeam ? 12 : 25;
        setPl(p => ({ ...p, bag: p.bag - bagPen, clout: Math.max(0, p.clout - cloutPen), mentalHealth: Math.max(0, p.mentalHealth - mhPen) }));
        setNews(n => ["🚫 THE COPYRIGHT STRIKE: Legal team reduced damages.", ...n.slice(0, 15)]);
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

    setSwFatigue(prev => prev + (sw.u / 1000));

    let auraGain = 0;
    let cloutGain = 0;
    let newsMsg = "";

    if (unitsSold >= sw.u * 0.8) {
      const financialPhase = stateRef.current.pl.bag < 10000 ? 1 : stateRef.current.pl.bag < 100000 ? 2 : stateRef.current.pl.bag < 500000 ? 3 : 0;
      if (pl.bag < 500000 && financialPhase === 3) triggerNotification('BAG_WIN_01');

      auraGain = 10;
      cloutGain = 5;
      newsMsg = "👟 VIRAL SELLOUT! Cleared all inventory.";
    } else if (unitsSold < sw.u * 0.2) {
      auraGain = -15;
      newsMsg = "👟 Bricked. Heavy boxes sitting in the warehouse.";
    } else {
      newsMsg = `👟 Drop concluded. Moved ${unitsSold.toLocaleString()} units.`;
    }

    setPl(p => ({
      ...p,
      bag: p.bag + revenue,
      aura: Math.min(p.maxAura, Math.max(0, p.aura + auraGain)),
      clout: Math.min(p.maxClout, p.clout + (cloutGain || 0))
    }));

    setNews(prev => [newsMsg, ...prev.slice(0, 15)]);
    setHl(h => ({ ...h, sw: h.sw + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rDrp = async () => {
    const costBasis = drp.u * 10 + drp.a;
    if (pl.mentalHealth < 10 || dropshipLock > 0) return;
    updateFatigue('dropship');
    const isJetOwned = flex.jet.owned;
    const isJetBlitzed = isJetOwned && flex.jet.expiresAt > Date.now();
    const mhReduction = isJetBlitzed ? 0.30 : (isJetOwned ? 0.15 : 0);
    setPl(p => ({ ...p, bag: p.bag - costBasis, mentalHealth: p.mentalHealth - (10 * (1 - mhReduction)) }));
    setHustleClicks(prev => ({ ...prev, dropship: prev.dropship + 1 }));

    if (triggerChaos('dropship')) {
      const financialPhase = stateRef.current.pl.bag < 10000 ? 1 : stateRef.current.pl.bag < 100000 ? 2 : stateRef.current.pl.bag < 500000 ? 3 : 0;
      if (financialPhase === 2) triggerNotification('HET_RISE_01');

      if (karmaFlags.ignoredRefunds) {
        const bagPen = ass.legalTeam ? 300 : 600;
        setPl(p => ({ ...p, bag: p.bag - bagPen }));
        setNews(n => ["💸 KARMA DETONATION: Gateway freezes assets. Legal mitigated loss.", ...n.slice(0, 15)]);
      } else {
        const mhPen = ass.legalTeam ? 15 : 30;
        setPl(p => ({ ...p, mentalHealth: Math.max(0, p.mentalHealth - mhPen) }));
        setDropshipLock(ass.legalTeam ? 1 : 2);
        setNews(n => ["🚫 THE ALGORITHM LOCKDOWN: Income zeroed. Legal team accelerated resolution.", ...n.slice(0, 15)]);
      }
      return undefined;
    }

    await new Promise(r => setTimeout(r, 800));

    const modifier = up.drpFac ? 1.5 : 1.1;
    const revenue = Math.floor((drp.u * drp.p) * (Math.random() * modifier) * legacyMultiplier);
    const profit = revenue - costBasis;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(p.maxClout, p.clout + 3) }));
    setHl(h => ({ ...h, drop: h.drop + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rCc = async (type) => {
    await new Promise(r => setTimeout(r, 700));
    let profit = 0; let cloutGain = 0; let auraGain = 0;

    if (type === 'sol') {
      const financialPhase = stateRef.current.pl.bag < 10000 ? 1 : stateRef.current.pl.bag < 100000 ? 2 : stateRef.current.pl.bag < 500000 ? 3 : 0;
      if (financialPhase === 2) triggerNotification('CLT_HIGH_01');

      profit = Math.floor(Math.random() * 2500 * legacyMultiplier);
      cloutGain = 5;
      setPl(p => ({ ...p, bag: p.bag - 500 + profit, clout: Math.min(p.maxClout, p.clout + (cloutGain || 0)) }));
    } else if (type === 'feu') {
      profit = -25000; cloutGain = 35; auraGain = -15;
      setPl(p => ({ ...p, bag: p.bag + profit, clout: Math.min(p.maxClout, p.clout + (cloutGain || 0)), aura: Math.max(0, p.aura + auraGain) }));
    } else {
      const financialPhase = stateRef.current.pl.bag < 10000 ? 1 : stateRef.current.pl.bag < 100000 ? 2 : stateRef.current.pl.bag < 500000 ? 3 : 0;
      if (financialPhase === 2) triggerNotification('CLT_WIN_01');

      profit = Math.floor(Math.random() * 75000 * legacyMultiplier); cloutGain = 20;
      setPl(p => ({ ...p, bag: p.bag + profit, clout: Math.min(p.maxClout, p.clout + (cloutGain || 0)) }));
    }
    setHl(h => ({ ...h, cc: h.cc + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rPod = async () => {
    let rentalCost = up.podCmp ? 0 : pod.q;
    let baseBooking = pod.g === 1 ? 10000 : pod.g === 2 ? 50000 : pod.g === 3 ? 100000 : 250000;
    const totalOut = rentalCost + baseBooking;

    setPl(p => ({ ...p, bag: p.bag - totalOut }));
    await new Promise(r => setTimeout(r, 1000));

    let revenue = Math.floor(totalOut * (1.2 + Math.random() * 1.8) * legacyMultiplier);
    let profit = revenue - totalOut;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(p.maxClout, p.clout + 15) }));
    setHl(h => ({ ...h, pod: h.pod + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rBox = async () => {
    // Upfront investment for Advanced Level (PPV Main Event)
    const isPPV = box.v === 3 || box.t === 4;
    let venueCost = up.boxLg ? 0 : (box.v === 1 ? 10000 : box.v === 2 ? 250000 : 2000000);
    let totalOut = (up.boxBrd ? 0 : box.b) + venueCost;

    // Explicit $150k requirement for high-tier scaling events if not already higher
    if (isPPV && totalOut < 150000) totalOut = 150000;

    setPl(p => ({ ...p, bag: p.bag - totalOut }));
    await new Promise(r => setTimeout(r, 1200));

    let revenue = 0;
    let cloutGain = 0;
    let auraGain = 0;
    let heatGain = 0;

    if (isPPV) {
       // Exponential scaling based on Global Clout (PPV buys) and Aura (Sponsorships)
       const ppvBuys = Math.pow(pl.clout, 1.8) * 10;
       const sponsorships = Math.pow(pl.aura, 1.5) * 50;
       revenue = Math.floor((ppvBuys + sponsorships + totalOut * 1.5) * legacyMultiplier);
       cloutGain = 300;
       auraGain = 200;
       heatGain = 20;
    } else if (up.boxBrd) {
      revenue = Math.floor((12000 + (pl.clout * 250)) * legacyMultiplier);
      cloutGain = 5;
      heatGain = 10;
    } else {
      // Basic Level: Low-tier local warehouse matches yielding capped, low-risk manual cash.
      revenue = Math.floor(Math.min(totalOut * 2.0, totalOut * (1.1 + Math.random() * 0.5)) * legacyMultiplier);
      cloutGain = 10;
      heatGain = 5;
    }

    let profit = revenue - totalOut;

    let finalHeatGain = ass.legalTeam ? Math.floor(heatGain * 0.5) : heatGain;
    if (stateRef.current.isPresident) finalHeatGain *= 0.5;

    setPl(p => ({
      ...p,
      bag: p.bag + revenue,
      clout: Math.min(p.maxClout, p.clout + (cloutGain || 0)),
      aura: Math.min(p.maxAura, p.aura + (auraGain || 0)),
      heat: p.heat + finalHeatGain
    }));

    if (flex.media.owned && (cloutGain || 0) > 0) {
      const pcGain = (cloutGain || 0) * 0.1;
      setPoliticalSyndicate(prev => ({
        ...prev,
        politicalCapital: Math.min(100, prev.politicalCapital + pcGain),
        status: (prev.politicalCapital + pcGain >= 100) ? 'CAMPAIGN_READY' : prev.status
      }));
    }
    setTally(t => ({ ...t, box: t.box + 1 }));
    setHl(h => ({ ...h, box: h.box + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rTur = async () => {
    const totalOut = tur.m + tur.a + tur.l;
    setPl(p => ({ ...p, bag: p.bag - totalOut }));
    await new Promise(r => setTimeout(r, 1500));

    const revMult = up.trFst ? 2.5 : 1.6;
    const revenue = Math.floor(totalOut * (Math.random() * revMult) * legacyMultiplier);
    const profit = revenue - totalOut;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(p.maxClout, p.clout + 55), aura: Math.min(p.maxAura, p.aura + 15) }));
    setHl(h => ({ ...h, tour: h.tour + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rTch = async (action) => {
    if (action === 'seed') {
      setPl(p => ({ ...p, bag: p.bag + 5000000 }));
      setTch(t => ({ ...t, l: true, vc: true, u: 50000 }));
      setNews(n => ['💻 VENTURE CAP: Contract signed. Seed injection completed ($5.0M). VC holds exit equity.', ...n.slice(0, 15)]);
      return 5000000;
    }
    if (action === 'b2b') {
      setPl(p => ({ ...p, bag: p.bag - tch.m }));
      await new Promise(r => setTimeout(r, 900));
      const netGain = Math.floor((tch.m / 5) * (1 + Math.random() * 2));
      setTch(t => ({ ...t, u: t.u + netGain }));
      adv();
      return 0;
    }
    if (action === 'ipo') {
      let value = Math.floor(tch.u * pl.aura * legacyMultiplier);
      if (tch.vc) value = Math.floor(value * 0.7);
      setPl(p => ({ ...p, bag: p.bag + value }));
      setTch({ l: false, u: 0, srv: 0.1, pw: false, vc: false, m: 2000 });
      setTab('HUB');
      setHl(h => ({ ...h, tch: h.tch + value }));
      triggerImpact('bag', value);
      setNews(n => [`🔔 WALL STREET EXIT: IPO finalized. Listed holdings liquidated into $${value.toLocaleString()}.`, ...n.slice(0, 15)]);
      return value;
    }
    return 0;
  };

  const rCrp = async (action) => {
    if (action === 'dep') {
      setPl(p => ({ ...p, bag: p.bag - crp.i }));
      setCrp(c => ({ ...c, l: c.i * 2 }));
      return undefined;
    }
    if (action === 'shil') {
      setPl(p => ({ ...p, bag: p.bag - crp.m }));
      await new Promise(r => setTimeout(r, 800));
      setCrp(c => ({ ...c, l: Math.floor(c.l * (1.1 + Math.random() * 1.5)) }));
      adv();
      return 0;
    }
    if (action === 'rug') {
      let reward = Math.floor(crp.l * legacyMultiplier);
      setPl(p => ({ ...p, bag: p.bag + reward, aura: Math.max(0, p.aura - 120) }));
      setCrp({ l: 0, t: '', i: 5000, m: 5000 });
      setTally(t => ({ ...t, cryp: t.cryp + 1 }));
      setTab('HUB');
      setHl(h => ({ ...h, cryp: h.cryp + reward }));
      triggerImpact('bag', reward);
      setNews(n => [`💀 LIQUIDITY RUGGED: Contract liquidity drained. Net reward: $${reward.toLocaleString()}. Aura crashed.`, ...n.slice(0, 15)]);
      return reward;
    }
  };

  const rMovieGreenlight = (tier) => {
    const costs = [0, 5000000, 50000000, 200000000];
    const cost = costs[tier];
    if (pl.bag < cost) return;
    setPl(p => ({ ...p, bag: p.bag - cost }));
    setMovieProject({ status: 'PRODUCTION', budgetTier: tier, hypeLevel: 0 });
    setNews(n => ["🎬 MOVIE: Project greenlit. Production initialized.", ...n.slice(0, 15)]);
  };

  const rMovieHypeBag = async () => {
    const cost = 500000;
    if (pl.bag < cost || movieProject.status !== 'PRODUCTION') return;
    setPl(p => ({ ...p, bag: p.bag - cost }));
    setMovieProject(prev => ({ ...prev, hypeLevel: Math.min(100, prev.hypeLevel + 10) }));
    setNews(n => ["🎬 MOVIE: PR firm hired. Hype increased.", ...n.slice(0, 15)]);
    return undefined;
  };

  const rMovieHypeClout = async () => {
    if (pl.clout < 50 || movieProject.status !== 'PRODUCTION') return;
    setPl(p => ({ ...p, clout: p.clout - 50 }));
    setMovieProject(prev => ({ ...prev, hypeLevel: Math.min(100, prev.hypeLevel + 15) }));
    setNews(n => ["🎬 MOVIE: Viral clout activation successful.", ...n.slice(0, 15)]);
    return undefined;
  };

  const rMovieHypeAura = async () => {
    if (pl.aura < 25 || movieProject.status !== 'PRODUCTION') return;
    setPl(p => ({ ...p, aura: p.aura - 25 }));
    setMovieProject(prev => ({ ...prev, hypeLevel: Math.min(100, prev.hypeLevel + 25) }));
    setNews(n => ["🎬 MOVIE: Personal celebrity endorsement boosted project hype.", ...n.slice(0, 15)]);
    return undefined;
  };

  const rMovieRelease = async () => {
    if (movieProject.status !== 'PRODUCTION') return;
    setGBusy(true);
    await new Promise(r => setTimeout(r, 2000));
    setGBusy(false);

    const costs = [0, 5000000, 50000000, 200000000];
    const budget = costs[movieProject.budgetTier];
    const roll = Math.random() * 100 + (movieProject.hypeLevel / 2);

    let outcomeTitle = "";
    let outcomeText = "";
    let bagReward = 0;
    let auraGain = 0;
    let cloutGain = 0;
    let mhPen = 0;
    let uiType = "ui-modal";

    if (roll < 40) { // FLOP
      outcomeTitle = "BOX OFFICE FLOP 💀";
      outcomeText = "Critics panned it and audiences stayed home. A total commercial disaster.";
      bagReward = Math.floor(budget * 0.1);
      auraGain = -100;
      mhPen = 30;
      uiType = "ui-crisis";
    } else if (roll < 85) { // HIT
      outcomeTitle = "BOX OFFICE HIT! 📈";
      outcomeText = "The film dominated the weekend charts and became a cultural moment.";
      bagReward = budget * 2;
      cloutGain = 300;
      auraGain = 100;
    } else { // OSCAR SWEEP
      outcomeTitle = "ACADEMY AWARD SWEEP 🏆";
      outcomeText = "Absolute cinematic perfection. You've swept the Oscars and redefined the industry.";
      bagReward = Math.floor(budget * 1.2);
      cloutGain = 500;
      auraGain = 2500;
    }

    setPl(p => ({
      ...p,
      bag: p.bag + bagReward,
      aura: Math.min(p.maxAura, Math.max(0, p.aura + auraGain)),
      clout: Math.min(p.maxClout, p.clout + cloutGain),
      mentalHealth: Math.max(0, p.mentalHealth - mhPen)
    }));

    if (flex.media.owned && cloutGain > 0) {
      const pcGain = cloutGain * 0.1;
      setPoliticalSyndicate(prev => ({
        ...prev,
        politicalCapital: Math.min(100, prev.politicalCapital + pcGain),
        status: (prev.politicalCapital + pcGain >= 100) ? 'CAMPAIGN_READY' : prev.status
      }));
    }

    setMod({
      s: true,
      t: outcomeTitle,
      m: outcomeText + ` Returns: $${fMny(bagReward)}.`,
      o: [{ label: "ACCEPT LEGACY", action: () => setMod({ s: false }) }],
      ui: uiType
    });

    setMovieProject({ status: 'IDLE', budgetTier: 1, hypeLevel: 0 });
    setHl(h => ({ ...h, mov: h.mov + (bagReward - budget) }));
    adv();
  };

  const rMov = async () => {
    const cst = (mov.g === 1 ? 2000000 : mov.g === 2 ? 15000000 : 100000000) + mov.m;
    setPl(p => ({ ...p, bag: p.bag - cst }));
    await new Promise(r => setTimeout(r, 2000));

    const success = Math.random() * (up.movUni ? 3.0 : 1.8);
    const revenue = Math.floor(cst * success * legacyMultiplier);
    const profit = revenue - cst;

    setPl(p => ({ ...p, bag: p.bag + revenue, clout: Math.min(p.maxClout, p.clout + 75) }));
    setHl(h => ({ ...h, mov: h.mov + Math.max(0, profit) }));
    triggerImpact('bag', profit);
    adv();
    return profit;
  };

  const rHf = async (isLong) => {
    setPl(p => ({ ...p, bag: p.bag - hf.c }));
    await new Promise(r => setTimeout(r, 1500));

    const accurate = Math.random() > 0.45;
    const variance = (hf.l * 0.04) * Math.random() * legacyMultiplier;
    const finalReturn = accurate ? hf.c * (1 + variance) : hf.c * (1 - variance);
    const netPayout = Math.floor(finalReturn - hf.c);

    setPl(p => ({ ...p, bag: p.bag + Math.floor(finalReturn) }));
    setTally(t => ({ ...t, hf: t.hf + 1 }));
    setHl(h => ({ ...h, hf: h.hf + Math.max(0, netPayout) }));
    triggerImpact('bag', netPayout);
    adv();
    return netPayout;
  };

  const rPrsA = async (type) => {
    if (type === 'gala') {
      setPl(p => ({ ...p, bag: p.bag + 200000000 }));
      triggerImpact('bag', 200000000);
    } else if (type === 'tv') {
      setPl(p => ({ ...p, bag: p.bag - 100000000, clout: Math.max(0, p.clout - 10) }));
      setPrs(prev => ({ ...prev, rst: prev.rst + 3, sun: prev.sun + 2, sub: prev.sub + 4 }));
    } else if (type === 'smear') {
      setPl(p => ({ ...p, aura: Math.max(0, p.aura - 25) }));
      setPrs(prev => ({ ...prev, rst: prev.rst + 2, sun: prev.sun + 3 }));
    } else {
      setPl(p => ({ ...p, bag: p.bag - 2000000 }));
      setPrs(prev => ({ ...prev, rst: prev.rst + 0.8, sun: prev.sun + 1 }));
    }
    adv();
    return undefined;
  };

  const rPrs1TT = async () => { setPl(p => ({ ...p, bag: p.bag - 100000000, clout: Math.max(0, p.clout - 20) })); setPrs(p => ({ ...p, p1tt: true, sh: true })); return undefined; };
  const rPrs1OP = async () => { setPl(p => ({ ...p, bag: p.bag - 150000000, aura: Math.max(0, p.aura - 30) })); setPrs(p => ({ ...p, p1op: true, ot: true })); return undefined; };
  const rPrs1ET = async () => { setPl(p => ({ ...p, bag: p.bag - 50000000, clout: Math.max(0, p.clout - 25) })); setPrs(p => ({ ...p, p1et: true })); return undefined; };
  const dVp = () => { setPrs(p => ({ ...p, vu: true, rst: p.rst + 4 })); };
  const dDef = () => { setPl(p => ({ ...p, bag: p.bag - 75000000, clout: Math.max(0, p.clout - 20) })); setPrs(p => ({ ...p, du: true, sub: p.sub + 5 })); };

  // Political Syndicate Actions
  const rAcquirePoliticalAsset = async (type, cost, limit) => {
    if (pl.bag < cost || politicalSyndicate.assetLeasing[type] >= limit) return;
    setPl(p => ({ ...p, bag: p.bag - cost }));
    setPoliticalSyndicate(prev => ({
      ...prev,
      assetLeasing: { ...prev.assetLeasing, [type]: prev.assetLeasing[type] + 1 }
    }));
    setNews(n => [`⚖️ SYNDICATE: Political asset acquired: ${type.toUpperCase()}.`, ...n.slice(0, 15)]);
    adv();
  };

  const rDeployNarrativeOp = async (opType) => {
    const assets = politicalSyndicate.assetLeasing;
    if (opType === 'TAX_LOOPHOLE') {
      if (assets.senators < 2 || pl.clout < 100) return;
      setPl(p => ({ ...p, bag: p.bag + 40000000, clout: Math.max(0, p.clout - 100) }));
      setNews(n => ["⚖️ SYNDICATE: Tax Loophole Bill passed. +$40M Corporate Kickback.", ...n.slice(0, 15)]);
      triggerImpact('bag', 40000000);
    } else if (opType === 'CULTURE_WAR') {
      if (assets.networkAnchors < 1 || pl.aura < 40) return;
      setPl(p => ({
        ...p,
        clout: Math.min(p.maxClout, p.clout + 500),
        aura: Math.max(0, p.aura - 40)
      }));
      setPoliticalSyndicate(prev => ({
        ...prev,
        politicalCapital: Math.min(100, prev.politicalCapital + 15),
        status: (prev.politicalCapital + 15 >= 100) ? 'CAMPAIGN_READY' : prev.status
      }));
      setNews(n => ["⚖️ SYNDICATE: Culture War manufactured. Massive Clout and Capital boost.", ...n.slice(0, 15)]);
    } else if (opType === 'LOBBYIST_STRIKE') {
      if (pl.bag < 10000000) return;
      setPl(p => ({ ...p, bag: p.bag - 10000000 }));
      setPoliticalSyndicate(prev => ({
        ...prev,
        politicalCapital: Math.min(100, prev.politicalCapital + 10),
        status: (prev.politicalCapital + 10 >= 100) ? 'CAMPAIGN_READY' : prev.status
      }));
      setNews(n => ["⚖️ SYNDICATE: Lobbyist Strike Team deployed. +10% Political Capital.", ...n.slice(0, 15)]);
    }
    adv();
  };

  const rHostPolicySummit = async () => {
    if (politicalSyndicate.politicalCapital < 100) return;

    setGBusy(true);
    await new Promise(r => setTimeout(r, 1500));
    setGBusy(false);

    setPoliticalSyndicate(prev => ({ ...prev, politicalCapital: 0, status: 'IDLE' }));
    setPl(p => ({
      ...p,
      bag: p.bag + 10000000000,
      aura: Math.min(p.maxAura, p.aura + 2000),
      clout: Math.min(p.maxClout, p.clout + 1500)
    }));
    setPresidencyEligible(true);

    triggerNotification('SYNDICATE_COMPLETE');

    setMod({
      s: true,
      t: "THE STAGE IS SET",
      m: "Wall Street is bought, the media is controlled, and the delegates are locked. You are officially primed to run for President of the United States.",
      o: [{ label: "PREPARE FOR CAMPAIGN", action: () => setMod({ s: false }) }],
      ui: "ui-modal"
    });

    setNews(n => ["🏆 SYNDICATE: Global Policy Summit concluded. Presidency eligibility unlocked.", ...n.slice(0, 15)]);
    adv();
  };

  const rCampaignAction = async (type) => {
    if (campaign.phase !== 'POLITICS') return;

    let costMH = 0;
    let costClout = 0;
    let costAura = 0;
    let costBag = 0;
    let gainAura = 0;
    let gainClout = 0;
    let gainWarchest = 0;
    let gainPolls = { region: '', amount: 0 };

    if (type === 'RUST_BELT_RALLY') {
      costMH = 20;
      costClout = 50;
      gainPolls = { region: 'rustBelt', amount: 5 };
      gainAura = 20;
    } else if (type === 'SUN_BELT_ADS') {
      costBag = 500000000;
      gainPolls = { region: 'sunBelt', amount: 4 };
      gainClout = 300;
    } else if (type === 'SILICON_GALA') {
      costAura = 150;
      gainWarchest = 1200000000;
      gainPolls = { region: 'blueWall', amount: 6 };
    }

    if (pl.mentalHealth < costMH || pl.clout < costClout || pl.aura < costAura || campaign.warchest < costBag) return;

    const nextWeek = campaign.currentWeek + 1;
    const isMonthEnd = nextWeek > 1 && (nextWeek - 1) % 4 === 0;

    // Apply Weekly Institutional Decay: -5 Aura, -10 Clout
    setPl(prev => {
      let nextAura = prev.aura - costAura - 5 + gainAura;
      let nextClout = prev.clout - costClout - 10 + gainClout;
      return {
        ...prev,
        mentalHealth: Math.max(0, prev.mentalHealth - costMH),
        clout: Math.max(0, Math.min(prev.maxClout, nextClout)),
        aura: Math.max(0, Math.min(prev.maxAura, nextAura)),
      };
    });

    setCampaign(prev => ({
      ...prev,
      currentWeek: nextWeek,
      warchest: prev.warchest - costBag - 100000000 + gainWarchest, // Weekly ops fee $100M
      regionalPolling: {
        ...prev.regionalPolling,
        [gainPolls.region]: Math.min(100, prev.regionalPolling[gainPolls.region] + (gainPolls.amount || 0))
      },
      // Weekly Incumbency Advantage: +0.5% Opponent drift in all regions
      opponentPolling: {
        blueWall: Math.min(100, prev.opponentPolling.blueWall + 0.5),
        rustBelt: Math.min(100, prev.opponentPolling.rustBelt + 0.5),
        sunBelt: Math.min(100, prev.opponentPolling.sunBelt + 0.5)
      }
    }));

    if (isMonthEnd) {
      triggerOctoberSurprise();
    } else {
      adv();
    }
  };

  const triggerOctoberSurprise = () => {
    setMod({
      s: true,
      t: "OCTOBER SURPRISE",
      m: "A media source threatens to leak compromising financial records from your early tech-flipping days.",
      o: [
        {
          label: "PAY OFF SOURCE (-$250M Warchest)",
          action: () => {
            setCampaign(prev => ({ ...prev, warchest: prev.warchest - 250000000 }));
            finalizeMonthlyTick();
          }
        },
        {
          label: "LET IT LEAK (+1,000 Clout, +3% Polling, -150 Aura)",
          action: () => {
            setPl(p => ({
              ...p,
              clout: Math.min(p.maxClout, p.clout + 1000),
              aura: Math.max(0, p.aura - 150)
            }));
            setCampaign(prev => ({
              ...prev,
              regionalPolling: {
                blueWall: Math.min(100, prev.regionalPolling.blueWall + 3),
                rustBelt: Math.min(100, prev.regionalPolling.rustBelt + 3),
                sunBelt: Math.min(100, prev.regionalPolling.sunBelt + 3),
              }
            }));
            finalizeMonthlyTick();
          }
        },
        {
          label: "FORMAL APOLOGY (-200 Clout, -40 MH, -5% Polling)",
          action: () => {
            setPl(p => ({
              ...p,
              clout: Math.max(0, p.clout - 200),
              mentalHealth: Math.max(0, p.mentalHealth - 40)
            }));
            setCampaign(prev => ({
              ...prev,
              regionalPolling: {
                blueWall: Math.max(0, prev.regionalPolling.blueWall - 5),
                rustBelt: Math.max(0, prev.regionalPolling.rustBelt - 5),
                sunBelt: Math.max(0, prev.regionalPolling.sunBelt - 5),
              }
            }));
            finalizeMonthlyTick();
          }
        }
      ],
      ui: "ui-crisis"
    });
  };

  const finalizeMonthlyTick = () => {
    setCampaign(prev => ({ ...prev, phase: 'CORPORATE_HQ' }));
    adv(1); // Execute monthly business payout tick
    setMod(prev => ({
      ...prev,
      s: true,
      t: "MONTHLY BRIEFING",
      m: "Passive business yields collected. Return to HQ to reallocate corporate capital and manage your stats.",
      o: [{ label: "ACKNOWLEDGE", action: () => setMod({ s: false }) }],
      ui: "ui-modal"
    }));
  };

  const rResumeCampaign = () => {
    setCampaign(prev => ({
      ...prev,
      currentMonth: prev.currentMonth + 1,
      phase: 'POLITICS'
    }));
    setTab('WAR_ROOM');
    setNews(n => [`🦅 CAMPAIGN: Entering Month ${campaign.currentMonth + 1} of the election cycle.`, ...n.slice(0, 15)]);
  };

  const rBuyFlex = (id, cost) => {
    if (pl.bag < cost) return;
    const updatedFlex = {
      ...flex,
      [id]: { ...flex[id], owned: true }
    };
    const { auraCap, cloutCap, mhCap } = getUpdatedCaps(pl.tier, updatedFlex);

    setPl(prev => ({
      ...prev,
      bag: prev.bag - cost,
      maxClout: cloutCap,
      maxAura: auraCap,
      maxMentalHealth: mhCap
    }));
    setFlex(updatedFlex);
    if (id === 'penthouse') setPassiveFrozen(false);
    setNews(n => [`💎 FLEX ACQUIRED: Ownership confirmed. Points locked until PR release.`, ...n.slice(0, 15)]);
  };

  const rTriggerFlexPR = (id, useCash, cost) => {
    const target = flex[id];
    if (!target.owned || (target.prActive !== undefined && target.prActive)) return;

    if (useCash) {
      if (pl.bag < cost) return;
      setPl(prev => ({ ...prev, bag: prev.bag - cost }));
    }

    setFlex(prev => {
      const next = { ...prev };
      if (prev[id].expiresAt !== undefined) {
        // Functional Flex - 24h Blitz
        next[id] = { ...prev[id], expiresAt: Date.now() + (24 * 60 * 60 * 1000) };
      } else {
        // Badge of Honor - Permanent PR Release
        next[id] = { ...prev[id], prActive: true };
      }
      return next;
    });

    // Grant instant rewards for Badges upon PR activation
    if (target.prActive !== undefined) {
      let cloutGain = 0;
      let auraGain = 0;
      if (id === 'watch') cloutGain = 25;
      if (id === 'car') cloutGain = 150;
      if (id === 'spt') auraGain = 1500;
      if (id === 'island') { cloutGain = 1000; auraGain = 500; }
      if (id === 'archive') auraGain = 800;

      if (cloutGain > 0 || auraGain > 0) {
        setPl(prev => ({
          ...prev,
          clout: Math.min(prev.maxClout, prev.clout + cloutGain),
          aura: Math.min(prev.maxAura, prev.aura + auraGain)
        }));
      }
    }

    setNews(n => [`📢 MEDIA BLITZ: PR campaign launched for ${id.toUpperCase()}. Rewards unlocked.`, ...n.slice(0, 15)]);
  };

  const rFoundationSink = (amount) => {
    if (pl.bag < amount || !flex.foundation.owned) return;
    setPl(prev => ({ ...prev, bag: prev.bag - amount }));
    setCampaign(prev => ({
      ...prev,
      regionalPolling: {
        blueWall: Math.min(100, prev.regionalPolling.blueWall + (amount / 100000000)),
        rustBelt: Math.min(100, prev.regionalPolling.rustBelt + (amount / 100000000)),
        sunBelt: Math.min(100, prev.regionalPolling.sunBelt + (amount / 100000000))
      }
    }));
    setNews(n => [`🏛️ PHILANTHROPY: Global Foundation donation confirmed. Polling baseline increased.`, ...n.slice(0, 15)]);
  };

  const rElectionNightResolution = async () => {
    if (campaign.currentWeek < 52) return;

    setGBusy(true);
    await new Promise(r => setTimeout(r, 3000));
    setGBusy(false);

    let playerEVs = 0;
    const results = {
      blueWall: campaign.regionalPolling.blueWall > campaign.opponentPolling.blueWall,
      rustBelt: campaign.regionalPolling.rustBelt > campaign.opponentPolling.rustBelt,
      sunBelt: campaign.regionalPolling.sunBelt > campaign.opponentPolling.sunBelt,
    };

    if (results.blueWall) playerEVs += 44;
    if (results.rustBelt) playerEVs += 46;
    if (results.sunBelt) playerEVs += 55;

    // Base EVs from non-battleground states (simplified)
    const baseEVs = 130;
    const totalEVs = playerEVs + baseEVs;

    if (totalEVs >= 270) {
      setIsPresident(true);
      setCampaign(prev => ({ ...prev, phase: 'COMPLETED' }));
      setMod({
        s: true,
        t: "VICTORY: PRESIDENT-ELECT",
        m: `With ${totalEVs} Electoral Votes, you have secured the Presidency. A new era begins. Prepare your address to the nation.`,
        o: [{ label: "ASCEND TO THE OVAL OFFICE", action: () => { setTab('VICTORY_SPEECH'); setMod({ s: false }); } }],
        ui: "ui-victory"
      });
    } else {
      setCampaign(prev => ({ ...prev, phase: 'COMPLETED' }));
      setMod({
        s: true,
        t: "CONCESSION NIGHT",
        m: `You finished with ${totalEVs} EVs. The establishment held the line. You return to your empire to plan the next cycle.`,
        o: [{ label: "RESUME MOGUL LIFE", action: () => setMod({ s: false }) }],
        ui: "ui-crisis"
      });
    }
  };

  const rRetire = () => {
    window.isResetting = true;
    setDeath(null);
    setCancelIntro(null);
    setGenerationCount(g => g + 1);

    // Reset core stats based on difficulty
    if (diff === 1) { // TRUST FUND
      setPl({ bag: 25000, aura: 30, clout: 30, mo: 0, tier: 0, mentalHealth: 300, maxMentalHealth: 300, heat: 0, maxClout: 100, maxAura: 100 });
    } else if (diff === 2) { // HUSTLER
      setPl({ bag: 5000, clout: 15, aura: 15, mo: 0, tier: 0, mentalHealth: 150, maxMentalHealth: 150, heat: 0, maxClout: 100, maxAura: 100 });
    } else { // GRINDER
      setPl({ bag: 1000, clout: 5, aura: 5, mo: 0, tier: 0, mentalHealth: 100, maxMentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 });
    }

    // Reset everything else
    setFlex({
      penthouse: { owned: false, expiresAt: 0 },
      logistics: { owned: false, expiresAt: 0 },
      jet: { owned: false, expiresAt: 0 },
      watch: { owned: false, prActive: false },
      car: { owned: false, prActive: false },
      art: { owned: false, prActive: false },
      yacht: { owned: false, expiresAt: 0 },
      media: { owned: false, expiresAt: 0 },
      foundation: { owned: false, expiresAt: 0 },
      spt: { owned: false, prActive: false },
      island: { owned: false, prActive: false },
      archive: { owned: false, prActive: false }
    });
    setTab('HUB');
    setSelTier('0');
    setDeath(null);
    setGBusy(false);
    setSwFatigue(0);
    setHustleFatigue({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
    setKarmaFlags({ usedCheapBlanks: false, ignoredRefunds: false, soldBootleg: false, ignoredSmmCrisis: false, usedCheapParts: false, ignoredRunnerWelfare: false });
    setSeenNotifications([]);
    setFatalTragedyMessage(null);
    setLastHustle(null);
    setDropshipLock(0);
    setVintageLock(0);
    setSmmPenalty(false);
    setTechSourceCost(150);
    setSmmClients(0);
    setClientCrisis(false);
    setVinCh(null);
    setHustleClicks({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
    setTechItem(null);
    setTechFlipsComplete(0);
    setRunnerCount(0);
    setRunnerBurnout(false);
    setSaasUsers(0);
    setSaasPrice(50);
    setSaasChurn(0.05);
    setSaasPenaltyActive(false);
    setCorpClients(0);
    setApiLockoutMonths(0);
    setCreOfficeCount(0);
    setCreRetailCount(0);
    setFranchiseCount(0);
    setUnionStrikeActive(false);
    setUnionStrikeIgnored(false);
    setPeProgress(0);
    setGuttedFirms(0);
    setSupplyChainDisruption(false);
    setPeCompoundingYield(1.0);
    setArtMarketSentiment(0);
    setArtHoldings(0);
    setAudioTracks(0);
    setSampleStrike(false);
    setPmcSquads(0);
    setIntelLeak(false);

    setTechInterns(0);
    setBulkPalletsUnlocked(false);
    setEnterpriseContracts(0);
    setAudioUpgrades({ mixingSuite: false, analogConsole: false });
    setTalentScouters(0);
    setHollywoodSyncActive(false);
    setCollectiblePhase('VINTAGE');
    setVintageRevenueTracker(0);
    setMovieProject({ status: 'IDLE', budgetTier: 1, hypeLevel: 0 });
    setSmmRetainerActive(false);
    setAiSmmFactory(false);
    setSmmEmpireActive(false);
    setSneakerBackdoorPlug(false);
    setConsignmentFeeActive(false);
    setVaultHoldings([]);

    setPmcUnlocked(false);
    setPmcMercenaries(0);
    setPmcActiveContracts(0);
    setPmcHeatLevel(0.0);
    setPmcMercCost(50000);
    setPmcBribeCost(25000);
    setConglomActive(false);
    setAntitrustRisk(0);
    setSwfInvestment(0);
    setGeoStability(1.0);
    setSwfFrozen(false);
    setSuperPacFunds(0);
    setApprovalRating(15.0);
    setLobbyists(0);
    setLobbyistCost(5000000);
    setMediaBlitzCost(10000000);
    setIsPresident(false);
    setPoliticalSyndicate({ politicalCapital: 0, assetLeasing: { governors: 0, senators: 0, networkAnchors: 0 }, status: 'IDLE' });
    setPresidencyEligible(false);
    setTickerAdvice('MARKET WATCH: Global conditions stable. Continue the grind.');
    setArtBubbleMonths(0);
    setSupplyChainShockMonths(0);
    setViralPopMonths(0);
    setIsBreakdownActive(false);
    setPassiveFrozen(false);
    setUp({ swIp: false, swFlg: false, swPar: false, swGlb: false, drpFac: false, ccAge: false, ccNet: false, podCmp: false, boxLg: false, boxBrd: false, trFst: false, tchGov: false, movStr: false, movUni: false });
    setSkl({ neg: 0, tax: 0, inf: 0 });
    setAss({ mtgPent: false, mans: false, mtgMans: false, mtgJet: false, mtgYct: false, spc: false, swf: false, legalTeam: false });
    setPeaks({ peakB: 25000, peakA: 100, peakC: 20 });
    setHl({ sw: 0, drop: 0, cc: 0, pod: 0, box: 0, tch: 0, cryp: 0, tour: 0, mov: 0, hf: 0 });
    setTally({ cryp: 0, box: 0, hf: 0, pres: 0 });
    setPrs({ r: false, m: 0, cd: 0, rem: false, rst: 44, sun: 42, sub: 45, vp: 1, fr: false, vu: false, du: false, sh: false, ot: false, p1tt: false, p1op: false, p1et: false, ev: { d1: false, d2: false, o: false }, chest: 0, polls: 0 });
    setSuperPacFunds(0);
    setApprovalRating(15.0);
    setLobbyists(0);
    setLobbyistCost(5000000);
    setMediaBlitzCost(10000000);
    setIsPresident(false);
    setPoliticalSyndicate({ politicalCapital: 0, assetLeasing: { governors: 0, senators: 0, networkAnchors: 0 }, status: 'IDLE' });
    setPresidencyEligible(false);
    setTickerAdvice('MARKET WATCH: Global conditions stable. Continue the grind.');
    setArtBubbleMonths(0);
    setSupplyChainShockMonths(0);
    setViralPopMonths(0);
    setCampaign({
      currentWeek: 1,
      currentMonth: 1,
      warchest: 10000000000,
      phase: 'POLITICS',
      regionalPolling: { blueWall: 35, rustBelt: 35, sunBelt: 35 },
      opponentPolling: { blueWall: 42, rustBelt: 42, sunBelt: 42 }
    });

    setPh('PROLOGUE');
    setProSt(0);
    setNews(['Your legacy continues... A new generation begins.', 'Market Cycle initialized: NORMAL economy.']);
    setTimeout(() => { window.isResetting = false; }, 2000);
  };

  const isTierUnlocked = useMemo(() => {
    return (tierIdx) => {
      return pl.tier >= tierIdx;
    };
  }, [pl.tier]);

  const cap = useMemo(() => {
    return pl.maxClout || 100;
  }, [pl.maxClout]);

  const performHardReset = () => {
    window.isResetting = true;
    if (window.autoSaveInterval) {
      window.clearInterval(window.autoSaveInterval);
    }
    localStorage.clear();
    sessionStorage.clear();

    // Group 1: Core Framework
    setPl({ bag: 0, aura: 0, clout: 0, mo: 0, tier: 0, mentalHealth: 100, maxMentalHealth: 100, heat: 0, maxClout: 100, maxAura: 100 });
    setPh('PROLOGUE');
    setProSt(0);
    setAlias('');
    setDiff(2);
    setTab('HUB');
    setSelTier('0');
    setDeath(null);
    setCancelIntro(null);
    setGBusy(false);
    setSwFatigue(0);
    setHustleFatigue({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
    setKarmaFlags({ usedCheapBlanks: false, ignoredRefunds: false, soldBootleg: false, ignoredSmmCrisis: false, usedCheapParts: false, ignoredRunnerWelfare: false });
    setSeenNotifications([]);
    setFatalTragedyMessage(null);
    setLastHustle(null);
    setDropshipLock(0);
    setVintageLock(0);
    setSmmPenalty(false);
    setTechSourceCost(150);
    setVinCh(null);
    setHustleClicks({ streetwear: 0, dropship: 0, vintage: 0, tech: 0, smm: 0, runners: 0 });
    setTechFlipsComplete(0);
    setIsBreakdownActive(false);
    setPassiveFrozen(false);
    setMkt(0);
    setNews(['Booting life simulation... System optimal.', 'Market Cycle initialized: NORMAL economy.']);
    setGenerationCount(0);
    setPeaks({ peakB: 0, peakA: 0, peakC: 0 });
    setHl({ sw: 0, drop: 0, cc: 0, pod: 0, box: 0, tch: 0, cryp: 0, tour: 0, mov: 0, hf: 0 });
    setTally({ cryp: 0, box: 0, hf: 0, pres: 0 });

    // Group 2: Business Primitive Reset
    setSw({ i: 1, u: 250, p: 45, a: 5000 });
    setDrp({ i: 1, u: 500, p: 35, a: 10000 });
    setCc({ m: 'solo', v: 1, n: 1 });
    setPod({ g: 1, q: 20000 });
    setBox({ v: 1, t: 1, b: 100000, p: 1 });
    setTur({ t: 1, m: 150000, a: 50000, l: 100000 });
    setTch({ l: false, u: 1200, srv: 0.15, pw: false, vc: false, m: 15000 });
    setCrp({ l: 0, t: '', i: 25000, m: 15000 });
    setMov({ g: 1, w: 1, d: 1, s: 1, m: 5000000 });
    setHf({ r: 0, t: 'NVDA', c: 5000000, l: 5 });
    setAi({ ig: false, p: 0, r: 0, d: 1, c: 1, s: 1, dj: 0 });
    setPrs({ r: false, m: 0, cd: 0, rem: false, rst: 44, sun: 42, sub: 45, vp: 1, fr: false, vu: false, du: false, sh: false, ot: false, p1tt: false, p1op: false, p1et: false, ev: { d1: false, d2: false, o: false }, chest: 0, polls: 0 });
    setUp({ swIp: false, swFlg: false, swPar: false, swGlb: false, drpFac: false, ccAge: false, ccNet: false, podCmp: false, boxLg: false, boxBrd: false, trFst: false, tchGov: false, movStr: false, movUni: false });
    setSkl({ neg: 0, tax: 0, inf: 0 });
    setAss({ mtgPent: false, mans: false, mtgMans: false, mtgJet: false, mtgYct: false, spc: false, swf: false, legalTeam: false });

    // Group 3: Counters & Active Trackers
    setSmmClients(0);
    setRunnerCount(0);
    setSaasUsers(0);
    setSaasPrice(50);
    setSaasChurn(0.05);
    setCorpClients(0);
    setCreOfficeCount(0);
    setCreRetailCount(0);
    setFranchiseCount(0);
    setGuttedFirms(0);
    setPeProgress(0);
    setPeCompoundingYield(1.0);
    setArtHoldings(0);
    setArtMarketSentiment(0);
    setAudioTracks(0);
    setSampleStrike(false);
    setPmcSquads(0);
    setIntelLeak(false);

    setTechInterns(0);
    setBulkPalletsUnlocked(false);
    setEnterpriseContracts(0);
    setAudioUpgrades({ mixingSuite: false, analogConsole: false });
    setTalentScouters(0);
    setHollywoodSyncActive(false);
    setCollectiblePhase('VINTAGE');
    setVintageRevenueTracker(0);
    setMovieProject({ status: 'IDLE', budgetTier: 1, hypeLevel: 0 });
    setSmmRetainerActive(false);
    setAiSmmFactory(false);
    setSmmEmpireActive(false);
    setSneakerBackdoorPlug(false);
    setConsignmentFeeActive(false);
    setVaultHoldings([]);

    setPmcUnlocked(false);
    setPmcMercenaries(0);
    setPmcActiveContracts(0);
    setPmcHeatLevel(0.0);
    setPmcMercCost(50000);
    setPmcBribeCost(25000);
    setSwfInvestment(0);
    setGeoStability(1.0);
    setAntitrustRisk(0);
    setFlex({
      penthouse: { owned: false, expiresAt: 0 },
      logistics: { owned: false, expiresAt: 0 },
      jet: { owned: false, expiresAt: 0 },
      watch: { owned: false, prActive: false },
      car: { owned: false, prActive: false },
      art: { owned: false, prActive: false },
      yacht: { owned: false, expiresAt: 0 },
      media: { owned: false, expiresAt: 0 },
      foundation: { owned: false, expiresAt: 0 },
      spt: { owned: false, prActive: false },
      island: { owned: false, prActive: false },
      archive: { owned: false, prActive: false }
    });
    setPoliticalSyndicate({ politicalCapital: 0, assetLeasing: { governors: 0, senators: 0, networkAnchors: 0 }, status: 'IDLE' });
    setPresidencyEligible(false);
    setCampaign({
      currentWeek: 1,
      currentMonth: 1,
      warchest: 10000000000,
      phase: 'POLITICS',
      regionalPolling: { blueWall: 35, rustBelt: 35, sunBelt: 35 },
      opponentPolling: { blueWall: 42, rustBelt: 42, sunBelt: 42 }
    });

    // Group 4: Crisis & Flag Clears
    setTechItem(null);
    setClientCrisis(false);
    setRunnerBurnout(false);
    setUnionStrikeActive(false);
    setUnionStrikeIgnored(false);
    setSupplyChainDisruption(false);
    setSaasPenaltyActive(false);
    setApiLockoutMonths(0);
    setSwfFrozen(false);
    setConglomActive(false);

    setTimeout(() => {
      window.location.href = window.location.origin + window.location.pathname + '?t=' + Date.now();
    }, 150);
  };

  return (
    <GameContext.Provider value={{
      ph, setPh, proSt, setProSt, alias, setAlias, diff, setDiff, death, setDeath, cancelIntro, gBusy, rain, swFatigue, setSwFatigue, hustleFatigue, setHustleFatigue, karmaFlags, setKarmaFlags, fatalTragedyMessage, setFatalTragedyMessage, smmClients, setSmmClients, clientCrisis, setClientCrisis, vinCh, setVinCh, tab, setTab, selTier, setSelTier, pl, setPl, displayBag, age, mkt, news, imp, mod, setMod, up, setUp, skl, setSkl, ass, setAss, sw, setSw, drp, setDrp, cc, setCc, pod, setPod, box, setBox, tur, setTur, tch, setTch, crp, setCrp, mov, setMov, hf, setHf, ai, setAi, prs, setPrs, peaks, hl, tally, adv, exStart, dUp, bAss, rVintage, rVinCh, rSw, rDrp, rSmmPitch, rSmmFix, rRest, rCc, rPod, rBox, rTur, rTch, rCrp, rMov, rHf, rPrsA, rPrs1TT, rPrs1OP, rPrs1ET, dVp, dDef, isTierUnlocked, cap, executeChaosRoll, rDelivery, rPlasma, rSurvey, rLabor, rProcessBulkPallet, isEventModalOpen, setIsEventModalOpen, activeEvent,
      hustleClicks, setHustleClicks, techItem, setTechItem, techFlipsComplete, setTechFlipsComplete, runnerCount, setRunnerCount, runnerBurnout, setRunnerBurnout,
      rTechSource, rTechFixA, rTechFixB, rRunnerRecruit, rRunnerFix, techSourceCost,
      isBreakdownActive, shakeActive, rDischarge,
      saasUsers, saasPrice, saasChurn, saasPenaltyActive, corpClients, apiLockoutMonths, creOfficeCount, creRetailCount, franchiseCount, unionStrikeActive, unionStrikeIgnored,
      rSaasClick, rAiAgencyClick, rCreBuyOffice, rCreBuyRetail, rFranchiseClick, rResolveUnionStrike,
      supplyChainDisruption, peCompoundingYield, rResolveSupplyChain, peProgress, guttedFirms,
      artMarketSentiment, artHoldings, rArtSpeculate,
      conglomActive, antitrustRisk, swfInvestment, geoStability, swfFrozen,
      passiveFrozen, setPassiveFrozen,
      rFormConglom, rLobbyRegulators, rSwfInvest, rSwfWithdraw,
      audioTracks, setAudioTracks, sampleStrike, setSampleStrike, pmcSquads, setPmcSquads, intelLeak, setIntelLeak,
      techInterns, setTechInterns, bulkPalletsUnlocked, setBulkPalletsUnlocked, enterpriseContracts, setEnterpriseContracts,
      audioUpgrades, setAudioUpgrades, talentScouters, setTalentScouters, holwoodSyncActive, setHollywoodSyncActive,
      collectiblePhase, setCollectiblePhase, vintageRevenueTracker, setVintageRevenueTracker, vintageBoostActive, setVintageBoostActive, sneakerBackdoorPlug, setSneakerBackdoorPlug, consignmentFeeActive, setConsignmentFeeActive, vaultHoldings, setVaultHoldings,
      pmcUnlocked, setPmcUnlocked, pmcMercenaries, setPmcMercenaries, pmcActiveContracts, setPmcActiveContracts,
      pmcHeatLevel, setPmcHeatLevel, pmcMercCost, setPmcMercCost, pmcBribeCost, setPmcBribeCost,
      superPacFunds, setSuperPacFunds, approvalRating, setApprovalRating, lobbyists, setLobbyists,
      lobbyistCost, setLobbyistCost, mediaBlitzCost, setMediaBlitzCost, isPresident, setIsPresident,
      politicalSyndicate, setPoliticalSyndicate, presidencyEligible, setPresidencyEligible,
      campaign, setCampaign,
      rAudioRelease, rAudioSettle, rPmcDeploy, rPmcSettle,
      rPmcHire, rPmcDeployContract, rPmcBribe,
      rAcquirePoliticalAsset, rDeployNarrativeOp, rHostPolicySummit,
      rCampaignAction, rResumeCampaign, rElectionNightResolution,
      rSneakerDrop, rBuyConsignment, rBuyVault, rVaultAuction, rBuyVaultAsset,
      movieProject, rMovieGreenlight, rMovieHypeBag, rMovieHypeClout, rMovieHypeAura, rMovieRelease,
      smmRetainerActive, rLaunchSmmRetainer, aiSmmFactory, rBuySmmFactory, smmEmpireActive, rBuySmmEmpire,
      flex, rBuyFlex, rTriggerFlexPR, rFoundationSink,
      tickerAdvice, artBubbleMonths, supplyChainShockMonths, viralPopMonths,
    activeNotification, triggerNotification, closeNotification,
      generationCount, legacyMultiplier, rRetire, performHardReset,
      cap
    }}>
      {children}
    </GameContext.Provider>
  );
};