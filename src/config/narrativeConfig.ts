import type { GameTab } from "../store/types";

export interface NarrativeBeat {
  title: string;
  message: string;
}

export const NARRATIVE_BEATS: Partial<Record<GameTab, NarrativeBeat>> = {
  STREET: {
    title: "LEVEL UP: THE ASPHALT ASCENSION",
    message: "You're out of the mud. The air is slightly cleaner, but the stakes are higher. The streets recognize the hustle, but they don't forgive mistakes. It's time to turn that petty cash into real influence."
  },
  STARTUP: {
    title: "SYSTEM UPGRADE: THE DISRUPTOR",
    message: "You've traded the pavement for a desk and a dream. Silicon dreams and VC nightmares. You're not just selling products anymore; you're selling a vision. Scale fast, or die trying."
  },
  CORPORATE: {
    title: "THE BOARDROOM TAKEOVER",
    message: "The suits didn't see you coming. You've navigated the labyrinth of bureaucracy and emerged with a corner office. The numbers are bigger, the legal threats are realer, and the soul is getting expensive to maintain."
  },
  ELITE: {
    title: "SOVEREIGN STATUS",
    message: "You've transcended the common market. You're part of the 0.01%. Your name carries weight in rooms you didn't know existed. Power is no longer about money; it's about access."
  },
  MOGUL: {
    title: "EMPIRE BUILDER",
    message: "You don't just participate in the market; you ARE the market. Industries shift when you sneeze. Your legacy is being written in real-time, and the world is your playground."
  },
  PRESIDENT: {
    title: "THE ULTIMATE SEAT",
    message: "The summit. There are no more tiers to climb, only the vast horizon of total control. You hold the levers of the world. Heavy is the head that wears the crown, but the view is unparalleled."
  }
};
