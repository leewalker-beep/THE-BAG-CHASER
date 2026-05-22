import React from 'react';
import { useGame } from '../../GameEngine.jsx';

export const NewsTicker = () => {
  const { news, fatalTragedyMessage } = useGame();

  return (
    <div className="ticker-wrap">
      <div className={`ticker ${fatalTragedyMessage ? 'ticker-paused' : ''}`}>
        {news?.map((n, i) => <span key={i} className="mx-12" dangerouslySetInnerHTML={{ __html: n }} />)}
        <span className="mx-12 text-slate-300 drop-shadow-sm">/// END FEED ///</span>
      </div>
    </div>
  );
};
