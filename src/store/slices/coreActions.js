export const createCoreSlice = (set, get) => ({
  performHardReset: () => {
    if (window.autoSaveInterval) clearInterval(window.autoSaveInterval);
    localStorage.clear(); sessionStorage.clear(); set(get().getInitialGameState());
    setTimeout(() => window.location.href = window.location.origin + window.location.pathname + '?t=' + Date.now(), 150);
  },

  rRetire: () => {
    const { diff, getInitialGameState } = get();
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

  triggerImpact: (kind, amount) => {
    const id = Math.random();
    set(state => ({
      imp: [...state.imp, { id, kind, a: amount, w: amount >= 0 }]
    }));
    setTimeout(() => set(state => ({
      imp: state.imp.filter(i => i.id !== id)
    })), 1900);
  },

  triggerNotification: async (id) => {
    const { seenNotifications } = get();
    if (seenNotifications.includes(id)) return;
    const { NOTIFICATION_DATABASE } = await import('../../data/notifications.js');
    const data = NOTIFICATION_DATABASE[id];
    if (!data) return;

    set(state => ({
      seenNotifications: [...state.seenNotifications, id],
      activeNotification: data,
      gBusy: true
    }));
  },

  closeNotification: () => set({ activeNotification: null, gBusy: false }),

  executeChaosRoll: async (hustleKey, baseSuccessAction) => {
    const roll = Math.floor(Math.random() * 20) + 1; // 1-20
    if (roll === 1) {
      const { mudChaosPools } = await import('../../data/chaosPools.js');
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

  rRest: async () => {
    const { pl, triggerNotification, adv } = get();
    set(state => ({
      pl: { ...state.pl, mentalHealth: Math.min(state.pl.maxMentalHealth, state.pl.mentalHealth + 50) },
      passiveFrozen: false,
      news: ["😴 Resting... Passive income resumes.", ...state.news.slice(0, 15)]
    }));
    adv();
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
      news: ["🏥 DISCHARGED: Mandated wellness rehab completed. -00.", ...state.news.slice(0, 15)]
    }));
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
});
