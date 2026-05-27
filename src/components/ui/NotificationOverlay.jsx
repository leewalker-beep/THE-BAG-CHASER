import React from 'react';
import { useGame } from '../../GameEngine.jsx';

export const NotificationOverlay = () => {
  const { activeNotification, closeNotification, alias } = useGame();

  if (!activeNotification) return null;

  const { header, text, template } = activeNotification;
  const shareText = template?.replace('[PlayerName]', alias || 'ANON') || '';

  const handleShare = () => {
    alert(`RECEIPT EXPORTED:\n\n"${shareText}"\n\n(Copied to clipboard in your head)`);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[400] flex items-center justify-center p-4 backdrop-blur-md animate-fadeIn select-none">
      <div className="max-w-md w-full bg-slate-900 border-4 border-blue-500 rounded-3xl p-8 text-center shadow-[0_0_100px_rgba(59,130,246,0.5)]">
        <div className="text-6xl mb-6 animate-pulse">📡</div>
        <h2 className="text-3xl font-black text-blue-400 mb-4 tracking-tighter font-hype uppercase">
          {header}
        </h2>
        <div className="h-0.5 w-full bg-blue-500/30 my-6"></div>
        <p className="text-white text-lg font-bold leading-relaxed mb-8 italic">
          "{text?.replace('[PlayerName]', alias || 'The Chaser')}"
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={closeNotification}
            className="w-full py-4 bg-blue-600 text-white font-black tracking-widest text-xl rounded-2xl hover:bg-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all active:scale-95 duration-100"
          >
            DEAL WITH IT
          </button>

          <button
            onClick={handleShare}
            className="w-full py-3 bg-slate-800 text-slate-300 font-black tracking-widest text-xs rounded-xl hover:bg-slate-700 transition-all active:scale-95 duration-100 uppercase"
          >
            Export the Receipts
          </button>
        </div>
      </div>
    </div>
  );
};
