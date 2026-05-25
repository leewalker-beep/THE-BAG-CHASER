import React, { useState } from 'react';
import { useGame } from '../../GameEngine.jsx';

const VictorySpeechTab = () => {
  const { setTab, setMod } = useGame();
  const [step, setStep] = useState(0);

  const speechSteps = [
    {
      text: "Citizens of this great nation. Tonight, the hustle has reached its ultimate conclusion.",
      options: ["WE LOCKED IN.", "THIS IS FOR THE GRINDERS."]
    },
    {
      text: "From flipping tech in basements to the halls of power, we have proven that the bag is obtainable for all.",
      options: ["NO HANDOUTS.", "ONLY MOTION."]
    },
    {
      text: "As your President, I promise to deregulate the markets and ensure the grind never stops.",
      options: ["GLAZING IS OVER.", "STAY BLESSED."]
    }
  ];

  const handleNext = () => {
    if (step < speechSteps.length - 1) {
      setStep(step + 1);
    } else {
      setMod({ s: false });
      setTab('HUB');
    }
  };

  return (
    <div className="flex flex-col gap-8 items-center justify-center p-12 bg-washington min-h-[600px] rounded-3xl border-4 border-yellow-500 shadow-[0_0_100px_rgba(245,158,11,0.5)] text-center animate-fadeIn">
      <div className="text-6xl mb-4 animate-bounce">🇺🇸</div>
      <h1 className="text-5xl font-black text-white font-gov uppercase tracking-[0.2em] drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
        Inaugural Address
      </h1>

      <div className="max-w-2xl bg-black/60 p-8 rounded-2xl border-2 border-white/20 backdrop-blur-md">
        <p className="text-2xl font-gov text-white leading-relaxed italic mb-8">
          "{speechSteps[step].text}"
        </p>

        <div className="grid grid-cols-2 gap-4">
          {speechSteps[step].options.map((opt, i) => (
            <button
              key={i}
              onClick={handleNext}
              className="py-4 bg-white text-black font-black tracking-widest rounded-xl hover:bg-yellow-400 transition-all active:scale-95 uppercase text-xs"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        {speechSteps.map((_, i) => (
          <div key={i} className={`h-2 w-12 rounded-full ${i === step ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/20'}`} />
        ))}
      </div>
    </div>
  );
};

export default VictorySpeechTab;
