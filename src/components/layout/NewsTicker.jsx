import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { MARKETS } from '../../config.js';

export const NewsTicker = () => {
  const { news, fatalTragedyMessage, tickerAdvice, mkt } = useGame();

  return (
    <div className="ticker-wrap flex flex-col h-auto">
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-1 flex items-center justify-between w-full">
        <div className="text-[10px] text-slate-400 font-black tracking-widest uppercase">📡 REAL WORLD MONITOR</div>
        <div className="flex items-center gap-3">
          <div className={`text-[10px] font-black ${mkt === 1 ? 'text-green-400' : mkt === 2 ? 'text-red-400' : mkt === 3 ? 'text-purple-400' : 'text-white'}`}>
            {MARKETS[mkt]?.n || 'NORMAL'}
          </div>
          <div className="text-[9px] text-slate-500 font-medium italic truncate max-w-[200px]">
            {MARKETS[mkt]?.desc}
          </div>
        </div>
      </div>
      <div className="h-8 flex items-center overflow-hidden">
        <div className={`ticker ${fatalTragedyMessage ? 'ticker-paused' : ''}`}>
          {tickerAdvice && (
            <span className="mx-12 text-yellow-400 font-black animate-pulse bg-yellow-400/10 px-4 py-1 rounded-lg border border-yellow-400/30">
              {tickerAdvice}
            </span>
          )}
          {news?.map((n, i) => <span key={i} className="mx-12" dangerouslySetInnerHTML={{ __html: n }} />)}
          <span className="mx-12 text-slate-300 drop-shadow-sm">/// END FEED ///</span>
        </div>
      </div>
    </div>
  );
};
