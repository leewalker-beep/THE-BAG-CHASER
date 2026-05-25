export const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700;800&family=Bebas+Neue&family=Rajdhani:wght@400;700&family=Share+Tech+Mono&family=Playfair+Display:wght@700;900&display=swap');

  body, button, input, textarea, select { font-family: 'Space Grotesk', sans-serif; }
  .font-hype { font-family: 'Bebas Neue', cursive !important; letter-spacing: 0.08em; }
  .font-tech { font-family: 'Rajdhani', sans-serif !important; font-weight: 700; }
  .font-hack { font-family: 'Share Tech Mono', monospace !important; }
  .font-gov  { font-family: 'Playfair Display', serif !important; }

  @keyframes shake { 0%, 100% { transform: translateX(0); } 25%, 75% { transform: translateX(-10px) rotate(-3deg); } 50% { transform: translateX(10px) rotate(3deg); } }
  .animate-shake-hard { animation: shake 0.2s ease-in-out infinite; box-shadow: inset 0 0 100px rgba(239, 68, 68, 0.5); }
  .aura-glow { box-shadow: 0 0 15px rgba(234, 179, 8, 0.8); } .clout-glow { box-shadow: 0 0 15px rgba(239, 68, 68, 0.8); }
  .mh-glow { box-shadow: 0 0 15px rgba(168, 85, 247, 0.8); }
  @keyframes rain { 0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg); opacity: 0; } }
  .money-rain { position: fixed; color: #22c55e; font-weight: bold; font-size: 2.5rem; z-index: 100; animation: rain 1.5s linear forwards; pointer-events: none; text-shadow: 0 0 10px #22c55e; }
  @keyframes floatUp { 0% { opacity: 1; transform: translate(-50%, 0) scale(0.5); } 20% { transform: translate(-50%, -20px) scale(1.2); } 100% { opacity: 0; transform: translate(-50%, -100px) scale(1); } }
  .impact-text { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 4rem; font-weight: 900; z-index: 200; pointer-events: none; animation: floatUp 2s ease-out forwards; text-shadow: 0px 10px 30px rgba(0,0,0,0.9); }
  .bg-basement { background: linear-gradient(to bottom right, #0f172a, #000000); } .bg-penthouse { background: linear-gradient(to bottom right, #1e1b4b, #000000, #312e81); }
  .bg-mansion { background: linear-gradient(to bottom right, #064e3b, #0f172a, #022c22); } .bg-oval { background: linear-gradient(to bottom right, #1e3a8a, #0f172a, #7f1d1d); }
  .bg-washington { background: linear-gradient(to bottom right, #f59e0b, #92400e, #f59e0b); background-size: 400% 400%; animation: billionaireShimmer 15s ease infinite; }
  body { color: white; margin: 0; overflow-x: hidden; background: #000; }
  .ui-modal { background: #0f172a; border: 2px solid #3b82f6; border-radius: 12px; } .ui-crisis { background: #450a0a; border: 2px solid #ef4444; border-radius: 12px; }
  .ui-victory { background: linear-gradient(135deg, #f59e0b 0%, #78350f 100%); border: 4px solid #fef3c7; border-radius: 24px; box-shadow: 0 0 100px rgba(245,158,11,0.6); }
  .mobile-hud { position: sticky; top: 0; z-index: 50; background: rgba(0,0,0,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid #334155; }
  .ticker-wrap { position: fixed; bottom: 0; width: 100%; overflow: hidden; background-color: rgba(0,0,0,0.95); border-top: 2px solid #3b82f6; height: 3rem; z-index: 100; display: flex; align-items: center; box-shadow: 0 -5px 20px rgba(0,0,0,0.5); }
  .ticker { display: inline-block; white-space: nowrap; padding-left: 100%; animation: ticker 45s linear infinite; font-family: 'Share Tech Mono', monospace; font-size: 1.05rem; font-weight: bold; color: #10b981; text-shadow: 0 0 8px #10b981; }
  .ticker-paused { animation-play-state: paused !important; }
  @keyframes ticker { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
  .news-bag { color: #22c55e; font-weight: 900; } .news-scandal { color: #ef4444; font-weight: 900; } .news-viral { color: #ec4899; font-weight: 900; }
  @keyframes floatUpStat { 0% { opacity: 1; transform: translateY(0) scale(0.9); } 100% { opacity: 0; transform: translateY(-60px) scale(1); } }
  .impact-aura { position: fixed; top: 70px; right: 16px; font-size: 1rem; font-weight: 900; z-index: 200; pointer-events: none; animation: floatUpStat 2s ease-out forwards; color: #fbbf24; text-shadow: 0 0 8px rgba(234,179,8,0.9); }
  .impact-clout { position: fixed; top: 96px; right: 16px; font-size: 1rem; font-weight: 900; z-index: 200; pointer-events: none; animation: floatUpStat 2s ease-out forwards; color: #f87171; text-shadow: 0 0 8px rgba(239,68,68,0.9); }
  @keyframes auraPanic { 0%, 100% { box-shadow: inset 0 0 80px rgba(180,0,0,0.35); } 50% { box-shadow: inset 0 0 140px rgba(220,0,0,0.6); } }
  .aura-panic { animation: auraPanic 1.2s ease-in-out infinite; }
  @keyframes fatigueBlink { 0%, 100% { border-color: #ef4444; box-shadow: 0 0 5px #ef4444; } 50% { border-color: #450a0a; box-shadow: none; } }
  .fatigue-warning { animation: fatigueBlink 1s ease-in-out infinite; border-width: 2px !important; }
  @keyframes billionaireShimmer { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
  .billionaire-bag { background: linear-gradient(90deg, #f59e0b, #fde68a, #f59e0b, #d97706, #fbbf24); background-size: 300% 300%; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: billionaireShimmer 2s ease infinite; filter: drop-shadow(0 0 8px rgba(251,191,36,0.8)); }
  .scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }

  @keyframes victoryFlash { 0% { background: white; opacity: 1; } 100% { background: transparent; opacity: 0; } }
  .victory-flash { position: fixed; inset: 0; z-index: 1000; background: white; pointer-events: none; animation: victoryFlash 3s ease-out forwards; }

  .washington-theme { border: 4px solid #f59e0b !important; box-shadow: 0 0 50px rgba(245,158,11,0.4) !important; }
  .golden-seal { background: radial-gradient(circle, #f59e0b 0%, #78350f 100%); width: 80px; height: 80px; border-radius: 50%; border: 4px double #fef3c7; display: flex; items-center; justify-center; font-size: 2.5rem; filter: drop-shadow(0 0 10px rgba(245,158,11,0.8)); }

  /* Tech Flipping Redesign Styles */
  .tech-workbench { background: linear-gradient(135deg, #020617 0%, #0891b2 100%); border: 1px solid #22d3ee; }
  .tech-bulk { background: #334155; border: 4px solid #eab308; }
  .tech-lab { background: rgba(88, 28, 135, 0.4); backdrop-filter: blur(12px); border: 2px solid #a855f7; }

  @keyframes oscillating-target { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(80px); } }
  .animate-oscillate { animation: oscillating-target 3s ease-in-out infinite; }

  @keyframes swipe-hint { 0% { transform: translateX(-20px); opacity: 0.2; } 50% { transform: translateX(20px); opacity: 0.8; } 100% { transform: translateX(-20px); opacity: 0.2; } }
  .swipe-glow { box-shadow: 0 0 20px rgba(34, 211, 238, 0.6); }

  .flick-card { transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s; }
`;
