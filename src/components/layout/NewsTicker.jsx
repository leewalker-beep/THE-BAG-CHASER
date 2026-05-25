import React from 'react';
import { useGame } from '../../GameEngine.jsx';

export const NewsTicker = () => {
  const { news, fatalTragedyMessage, tickerAdvice } = useGame();

  return (
    <div className="ticker-wrap">
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
  );
};
