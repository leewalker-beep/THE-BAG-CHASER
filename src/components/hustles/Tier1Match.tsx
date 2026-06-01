import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useJuiceStore } from '../../store/juiceStore';

export function SneakerDropMatch({ onResult }: { onResult: (success: boolean) => void }) {
  const [targetPos] = useState(() => Math.random() * 80 + 10);
  const [currentX, setCurrentX] = useState(0);
  const [moving, setMoving] = useState(true);
  const { triggerSurge, triggerCascade } = useJuiceStore();

  useEffect(() => {
    if (!moving) return;
    const interval = setInterval(() => {
      setCurrentX((x) => (x + 2) % 100);
    }, 20);
    return () => clearInterval(interval);
  }, [moving]);

  const handleTap = () => {
    if (!moving) return;
    setMoving(false);
    const diff = Math.abs(currentX - targetPos);
    const success = diff < 10;
    if (success) triggerSurge(); else triggerCascade();
    setTimeout(() => onResult(success), 1000);
  };

  return (
    <div className="p-6 bg-slate-800 rounded-2xl text-center">
      <h3 className="text-lg font-black uppercase text-white mb-4">👟 SNEAKER DROP: PRECISION TAP</h3>
      <div className="relative h-12 bg-slate-900 rounded-full mb-8 overflow-hidden border-2 border-slate-700">
        <div
          className="absolute h-full w-20 bg-emerald-500/30 border-x-2 border-emerald-500"
          style={{ left: `${targetPos}%`, transform: 'translateX(-50%)' }}
        />
        <motion.div
          className="absolute h-full w-2 bg-white shadow-[0_0_10px_white]"
          style={{ left: `${currentX}%` }}
        />
      </div>
      <button
        onClick={handleTap}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase transition-all active:scale-95"
      >
        TAP TO SECURE DROP
      </button>
    </div>
  );
}

export function PalletFlippingMatch({ onResult }: { onResult: (success: boolean) => void }) {
  const [bid, setBid] = useState(500);
  const { triggerSurge, triggerCascade } = useJuiceStore();

  const handleBid = () => {
    const value = Math.random() * 2000;
    const success = bid < value;
    if (success) triggerSurge(); else triggerCascade();
    onResult(success);
  };

  return (
    <div className="p-6 bg-slate-800 rounded-2xl text-center">
      <h3 className="text-lg font-black uppercase text-white mb-4">📦 PALLET FLIPPING: BLIND BID</h3>
      <div className="text-4xl mb-6">📦❓</div>
      <div className="mb-6">
        <label className="text-[10px] font-black text-slate-500 uppercase block mb-2">YOUR BID: ${bid}</label>
        <input
          type="range" min="100" max="1500" step="50"
          value={bid} onChange={(e) => setBid(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
        />
      </div>
      <button
        onClick={handleBid}
        className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-xl uppercase transition-all"
      >
        PLACE BID
      </button>
    </div>
  );
}
