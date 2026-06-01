import { useState, useEffect } from 'react';
import { useJuiceStore } from '../../store/juiceStore';

export function MemeCoinMatch({ onResult }: { onResult: (success: boolean) => void }) {
  const [points, setPoints] = useState<{x: number, y: number}[]>([]);
  const [isCrashed, setIsCrashed] = useState(false);
  const { triggerSurge, triggerCascade } = useJuiceStore();

  useEffect(() => {
    let x = 0;
    let y = 50;
    const interval = setInterval(() => {
      x += 5;
      const volatility = Math.random() * 20 - 10;
      y = Math.max(10, Math.min(90, y + volatility + 2)); // Upward bias

      setPoints(p => [...p, {x, y}]);

      if (Math.random() < 0.05 || x > 100) {
        clearInterval(interval);
        if (x > 100) {
           // Success! Reach the end
        } else {
           setIsCrashed(true);
        }
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleSell = () => {
    if (isCrashed) return;
    const lastPoint = points[points.length - 1];
    const success = lastPoint && lastPoint.y > 60;
    if (success) triggerSurge(); else triggerCascade();
    onResult(success);
  };

  return (
    <div className="p-6 bg-slate-900 rounded-2xl text-center border border-slate-800">
      <h3 className="text-lg font-black uppercase text-white mb-4">🚀 MEME-COIN RIDE</h3>
      <div className="h-40 w-full bg-black rounded border border-slate-800 relative overflow-hidden mb-6">
        <svg className="w-full h-full">
          <polyline
            fill="none"
            stroke={isCrashed ? "#ef4444" : "#10b981"}
            strokeWidth="3"
            points={points.map(p => `${p.x}%,${100 - p.y}%`).join(' ')}
          />
        </svg>
        {isCrashed && <div className="absolute inset-0 flex items-center justify-center text-red-500 font-black text-2xl uppercase">CRASHED!</div>}
      </div>
      <button
        onClick={handleSell}
        disabled={isCrashed}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black rounded-xl uppercase transition-all"
      >
        SELL AT PEAK
      </button>
    </div>
  );
}

export function ViralStreamMatch({ onResult }: { onResult: (success: boolean) => void }) {
  const [chat, setChat] = useState<{user: string, msg: string, red?: boolean}[]>([]);
  const { triggerSurge, triggerCascade } = useJuiceStore();

  useEffect(() => {
    const users = ['bag_chaser99', 'clout_king', 'fomo_master', 'rug_pull_expert'];
    const msgs = ['L L L', 'W', 'TO THE MOON', 'SCAM', 'PUMP IT'];
    const interval = setInterval(() => {
      setChat(c => [{user: users[Math.floor(Math.random()*users.length)], msg: msgs[Math.floor(Math.random()*msgs.length)]}, ...c].slice(0, 5));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleAction = (isGood: boolean) => {
    if (isGood) triggerSurge(); else triggerCascade();
    onResult(isGood);
  };

  return (
    <div className="p-6 bg-slate-800 rounded-2xl text-left border border-slate-700">
      <h3 className="text-lg font-black uppercase text-white mb-4 text-center">📺 VIRAL STREAM CHAT</h3>
      <div className="h-40 bg-black rounded p-3 mb-6 font-mono text-[10px] overflow-hidden flex flex-col-reverse gap-1 border border-slate-700">
        {chat.map((c, i) => (
          <div key={i} className={c.red ? 'text-red-500' : 'text-emerald-400'}>
            <span className="opacity-50">[{c.user}]:</span> {c.msg}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleAction(true)} className="py-3 bg-emerald-600 text-white font-black rounded uppercase text-[10px]">REWARD SUB</button>
        <button onClick={() => handleAction(false)} className="py-3 bg-red-600 text-white font-black rounded uppercase text-[10px]">BAN TROLL</button>
      </div>
    </div>
  );
}
