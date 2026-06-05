export interface DeathMessage {
  message: string;
  badge: string;
}

export const DEATH_MESSAGES: Record<string, DeathMessage> = {
  r_labor: {
    message: "Your back finally gave out. Turns out 'grinding' is literal when it's your vertebrae.",
    badge: "BONE CRUSHER"
  },
  r_delivery: {
    message: "You died for a cold burger and a 2-star rating. The algorithm has already replaced you.",
    badge: "ROAD KILL"
  },
  r_survey: {
    message: "You died of pure, unadulterated boredom. At least the data was 'statistically significant'.",
    badge: "DATA POINT"
  },
  r_plasma: {
    message: "You literally ran out of juice. There's nothing left but a dry husk and a $15 debit card.",
    badge: "DRY WELL"
  },
  r_scrap: {
    message: "Tetanus or a falling radiator? Either way, you're now part of the heap you were harvesting.",
    badge: "SCRAP HEAP"
  },
  tech_flip: {
    message: "A lithium battery or a bad solder joint? You went out in a literal blaze of glory.",
    badge: "SHORT CIRCUIT"
  },
  techFlip: {
    message: "A lithium battery or a bad solder joint? You went out in a literal blaze of glory.",
    badge: "SHORT CIRCUIT"
  },
  cc: {
    message: "The comments finally got to you. You're trending now, but for all the wrong reasons.",
    badge: "RATIO'D"
  },
  pod: {
    message: "You talked until your lungs collapsed. Nobody was listening, but the mic was still hot.",
    badge: "DEAD AIR"
  },
  audio: {
    message: "The industry chewed you up and spat out a royalty check for $0.0004.",
    badge: "ONE HIT WONDER"
  },
  drop: {
    message: "Your supply chain broke, and so did your heart. Your warehouse is a tomb of plastic junk.",
    badge: "SHIP WRECK"
  },
  vintage: {
    message: "You were buried alive by a mountain of 'authentic' 90s windbreakers.",
    badge: "OLD SCHOOL"
  },
  saas_mvp: {
    message: "The server crashed and you went with it. Your legacy is a 404 page.",
    badge: "NULL POINTER"
  },
  agency_scale: {
    message: "The clients demanded blood, and you finally ran out. Burnout is a silent killer.",
    badge: "MEETING ADJOURNED"
  },
  ecom_brand: {
    message: "The ad spend bled you dry. You're just another failed DTC case study now.",
    badge: "AD SPEND LOSS"
  },
  festival: {
    message: "The stage collapsed and the insurance didn't cover it. The party is officially over.",
    badge: "FESTIVAL FAIL"
  },
  global_franchise: {
    message: "You became a cog in your own machine until the gears finally ground you to dust.",
    badge: "CORPORATE CLONE"
  },
  DEFAULT: {
    message: "You lived fast and died young. The world will remember... maybe.",
    badge: "GHOST IN THE MACHINE"
  }
};
