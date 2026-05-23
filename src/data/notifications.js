export const NOTIFICATION_DATABASE = {
  AUR_LOW_01: {
    id: 'AUR_LOW_01',
    category: 'Aura',
    phase: 1,
    header: '🚨 NEGATIVE AURA DETECTED',
    text: 'Bro, you just stumbled over your words trying to lowball a guy for an iPhone. You have zero presence. Go buy a designer hoodie or do something cool before you become a permanent NPC.',
    template: '[PlayerName] just lost 500 Aura points trying to talk to a real human being.',
    priority: 'high'
  },
  CLT_HIGH_01: {
    id: 'CLT_HIGH_01',
    category: 'Clout',
    phase: 2,
    header: '🚀 THE ALGORITHM SMILES',
    text: 'Your brainrot edit just hit the FYP. 2 million views in 4 hours. The comments are entirely people clowning your existence, but the monetization pennies are rolling in. Secure the bag!',
    template: 'The algorithm chose violence and rewarded [PlayerName] with 1M views of pure brainrot.',
    priority: 'medium'
  },
  BAG_FAIL_01: {
    id: 'BAG_FAIL_01',
    category: 'Bag',
    phase: 1,
    header: '💸 BROKE BOY ALERT',
    text: "You really spent your last $200 on a Wagyu steak to impress a girl who's definitely going to ghost you. You're down bad. Go back to the thrift bins and start over, you absolute clown.",
    template: '[PlayerName] is officially in the trenches. 0 motion detected.',
    priority: 'high'
  },
  HEA_LOW_01: {
    id: 'HEA_LOW_01',
    category: 'Health',
    phase: 1,
    header: '🧠 BRAIN IS COOKED',
    text: "Your vision is blurry and you're starting to see listing descriptions in your sleep. If you don't take a nap and drink some water, you're going to crashout on a random buyer. Log off.",
    template: "[PlayerName] hasn't seen the sun in 3 days. Total crashout imminent.",
    priority: 'high'
  },
  HET_RISE_01: {
    id: 'HET_RISE_01',
    category: 'Heat',
    phase: 2,
    header: '👮 THE OPS ARE WATCHING',
    text: 'Nike just blacklisted your entire proxy range. You were flying too close to the sun with those 50 accounts. The Heat is rising, and your bot farm is currently a paperweight.',
    template: '[PlayerName] got personal-raided by the Nike IT department. Cooked.',
    priority: 'medium'
  },
  AUR_BOOST_01: {
    id: 'AUR_BOOST_01',
    category: 'Aura',
    phase: 2,
    header: '👑 PEAK EXPLOITATION',
    text: 'You just convinced a 14-year-old that "experience" is better than a fair wage. Your corporate villain aura is skyrocketing. This is peak motion.',
    template: '[PlayerName] just mastered the art of the middle-man. Infinite Aura.',
    priority: 'low'
  },
  CLT_FAIL_01: {
    id: 'CLT_FAIL_01',
    category: 'Clout',
    phase: 1,
    header: '🤡 FRAUD DETECTED',
    text: "Someone in the comments just proved you never actually sold that Travis Scott hoodie. You're getting cooked in the group chat. Your digital footprint is stained forever.",
    template: '[PlayerName] got caught in 4K trying to fake the motion.',
    priority: 'medium'
  },
  BAG_WIN_01: {
    id: 'BAG_WIN_01',
    category: 'Bag',
    phase: 3,
    header: '💰 MARKET MANIPULATOR',
    text: "You own 80% of the local stock for the new drop. You're not just a seller; you're the FED. Set whatever price you want—the glazing in your DMs is about to be legendary.",
    template: "[PlayerName] is the reason you can't buy sneakers at retail. Final Boss energy.",
    priority: 'high'
  },
  HET_CRASH_01: {
    id: 'HET_CRASH_01',
    category: 'Heat',
    phase: 3,
    header: '🌑 SHADOWBANNED',
    text: "The platform finally caught onto your bot net. Your engagement is zero. You're out here doing side quests while your main play is rotting in digital purgatory.",
    template: "[PlayerName] reached the 'Find Out' stage of 'F*ck Around'. 100% Shadowbanned.",
    priority: 'high'
  },
  HEA_BOOST_01: {
    id: 'HEA_BOOST_01',
    category: 'Health',
    phase: 2,
    header: '⚡️ FULLY OPTIMIZED',
    text: "You're vibrating. You haven't blinked in six hours. Your energy is at an all-time high, but your heart rate is concerning. Use this motion while your organs still work.",
    template: '[PlayerName] is locked in (literally cannot stop shaking).',
    priority: 'low'
  },
  AUR_FAIL_01: {
    id: 'AUR_FAIL_01',
    category: 'Aura',
    phase: 3,
    header: '🚢 SHIPMENT COOKED',
    text: "Your 'bulk electronics' are currently being disassembled by a guy in a vest. You lost the shipment, the bag, and your reputation with the syndicate. Down bad doesn't even cover it.",
    template: "Customs just ended [PlayerName]'s whole career. Zero motion.",
    priority: 'high'
  },
  CLT_WIN_01: {
    id: 'CLT_WIN_01',
    category: 'Clout',
    phase: 2,
    header: '📈 THE PURE LUCK PLAY',
    text: 'A verified account just shared your brainrot. The followers are flooding in like you actually have talent. Don\'t look a gift horse in the mouth—monetize the glazing immediately.',
    template: '[PlayerName] just fumbled into a million followers. We love a lucky NPC.',
    priority: 'medium'
  },
  HET_LOW_01: {
    id: 'HET_LOW_01',
    category: 'Heat',
    phase: 1,
    header: '🎟️ THE INSIDE MAN',
    text: "You just bought a moderator's soul for the price of a generic hoodie. The reports against your account are disappearing. You're playing the game on easy mode now.",
    template: '[PlayerName] is out here paying off the digital janitors.',
    priority: 'low'
  },
  BAG_BOOST_01: {
    id: 'BAG_BOOST_01',
    category: 'Bag',
    phase: 2,
    header: '💸 SCAM-WHEEL SUPREMACY',
    text: 'You sold a box of bricks to a guy who thought they were GPUs. The bag is secured, but your karma is in the gutter. Hope you don\'t believe in ghosts, because those buyers are coming back.',
    template: '[PlayerName] just sold sand to a beach. Infinite Bag unlocked.',
    priority: 'medium'
  },
  HEA_FAIL_01: {
    id: 'HEA_FAIL_01',
    category: 'Health',
    phase: 3,
    header: '🛌 HOSPITAL HUSTLE',
    text: 'You passed out on your keyboard and woke up in the ER. The doctor says you need "rest," but we both know the bots don\'t sleep. Too bad your body isn\'t automated yet.',
    template: '[PlayerName] tried to out-grind the machine and lost. Cooked in the ICU.',
    priority: 'high'
  }
};
