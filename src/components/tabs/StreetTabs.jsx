import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { useGameStore } from '../../gameStore.js';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn, UpgBtn, Toggles, Stepper, LockedTierScreen } from '../ui/Shared.jsx';

export const CcTab = () => {
  const { pl, up, cc, setCc, dUp, rCc, setTab } = useGame();
  return (
    <LabShell t="CREATOR LAB" c="emerald" fontCls="font-tech" onHub={() => setTab('HUB')} tier={1}>
      {!up.ccAge
        ? <UpgBtn onClk={() => dUp('ccAge', 1000000, 'Agency launched. 🤝')} cost={1000000} title="TALENT AGENCY" pB={pl.bag} />
        : <UpgBtn onClk={() => dUp('ccNet', 20000000, 'Network Launched! 📺')} cost={20000000} title="STREAMING NETWORK" unl={up.ccNet} reqC={150} pB={pl.bag} pC={pl.clout} />
      }
      <div className="flex bg-slate-800 p-1 rounded-xl mb-2">
        <button onClick={() => setCc(c => ({ ...c, m: 'solo' }))} className={`flex-1 p-3 rounded font-bold text-sm ${cc.m === 'solo' ? 'bg-emerald-600 text-white' : 'text-slate-300 drop-shadow-sm'}`}>SOLO</button>
        <button onClick={() => { if (pl.bag >= 100000 && pl.clout >= 50) setCc(c => ({ ...c, m: 'house' })); }} className={`flex-1 p-3 rounded font-bold text-sm ${cc.m === 'house' ? 'bg-emerald-600 text-white' : pl.bag >= 100000 && pl.clout >= 50 ? 'text-slate-300 drop-shadow-sm' : 'text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>{pl.bag >= 100000 && pl.clout >= 50 ? 'HOUSE' : '🔒 ($100K/50C)'}</button>
      </div>
      {cc.m === 'house' ? <>
        <Toggles opts={['Drama', 'Gaming', 'Lifestyle']} active={cc.v} setVal={v => setCc(s => ({ ...s, v }))} color="emerald-600" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          <FlashBtn onClick={() => rCc('feu')} dis={pl.bag < 25000} label="FEUD ($25K)" color="emerald-600" txt="white" />
          <FlashBtn onClick={() => rCc('mch')} dis={pl.bag < 25000} label="COLLAB ($25K)" />
        </div>
        {up.ccAge && !up.ccNet && <FlashBtn onClick={() => rCc('meg')} label="MEGA-DEAL ($0)" color="purple" txt="white" />}
        {up.ccNet && <FlashBtn onClick={() => rCc('net')} label="COLLECT SUBS ($0)" color="yellow-600" txt="white" />}
      </> : <>
        <Toggles opts={['Brainrot', 'Finance', 'IRL']} active={cc.n} setVal={v => setCc(s => ({ ...s, n: v }))} color="emerald-600" />
        <FlashBtn onClick={() => rCc('sol')} dis={pl.bag < 500} label="STREAM - $500" />
      </>}
    </LabShell>
  );
};

export const PodTab = () => {
  const { pl, up, pod, setPod, dUp, rPod, setTab } = useGame();
  const recCost = React.useMemo(() => (up.podCmp ? 0 : pod.q) + (pod.g === 1 ? 10000 : pod.g === 2 ? 50000 : pod.g === 3 ? 100000 : 250000), [up.podCmp, pod.q, pod.g]);
  return (
    <LabShell t="PODCAST NET" c="pink" onHub={() => setTab('HUB')} tier={1}>
      <UpgBtn onClk={() => dUp('podCmp', 500000, 'Compound Built. 🎙️')} cost={500000} title="BUILD COMPOUND" unl={up.podCmp} pB={pl.bag} />
      <div className="flex gap-1 w-full">
        <button onClick={() => setPod(s => ({ ...s, g: 1 }))} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 1 ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 drop-shadow-sm'}`}>Z-List</button>
        <button onClick={() => { if (pl.clout >= 50) setPod(s => ({ ...s, g: 2 })); }} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 2 ? 'bg-pink-600 text-white' : pl.clout >= 50 ? 'bg-slate-800 text-slate-300 drop-shadow-sm' : 'bg-slate-900 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>{pl.clout >= 50 ? 'Drama' : '🔒(50C)'}</button>
        <button onClick={() => { if (pl.clout >= 100) setPod(s => ({ ...s, g: 3 })); }} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 3 ? 'bg-pink-600 text-white' : pl.clout >= 100 ? 'bg-slate-800 text-slate-300 drop-shadow-sm' : 'bg-slate-900 text-slate-300 drop-shadow-sm cursor-not-allowed'}`}>{pl.clout >= 100 ? 'A-List' : '🔒(100C)'}</button>
        {up.podCmp && <button onClick={() => setPod(s => ({ ...s, g: 4 }))} className={`flex-1 p-3 text-[10px] font-bold rounded ${pod.g === 4 ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-300 drop-shadow-sm'}`}>Billionaire</button>}
      </div>
      {!up.podCmp && <Stepper val={pod.q} setVal={v => setPod(s => ({ ...s, q: v }))} min={10000} max={100000} step={10000} label="Studio Rental" />}
      <FlashBtn onClick={rPod} dis={pl.bag < recCost} label={`RECORD - $${fMny(recCost)}`} />
    </LabShell>
  );
};

export const BoxTab = () => {
  const { pl, up, box, setBox, dUp, rBox, setTab, fightIntensity, boxingFatigue, isBreakdownActive } = useGame();
  const fightActive = useGameStore(state => state.fightActive);
  const fightCost = React.useMemo(() => (up.boxBrd ? 0 : box.b) + (up.boxLg ? 0 : (box.v === 1 ? 10000 : box.v === 2 ? 250000 : 2000000)), [up.boxBrd, box.b, up.boxLg, box.v]);
  return (
    <LabShell t="FIGHT PROMOTER" c="orange" onHub={() => setTab('HUB')} tier={1}>
      {fightIntensity > 70 && (
        <div className="fixed inset-0 pointer-events-none z-[10003] bg-red-600/40 animate-pulse" />
      )}
      {isBreakdownActive && (
        <div className="fixed inset-0 pointer-events-none z-[10004] backdrop-grayscale backdrop-blur-[2px] bg-black/20" />
      )}
      <div
        className={`fixed inset-0 z-[10002] bg-red-600/30 backdrop-blur-sm flex items-center justify-center pointer-events-none overflow-hidden transition-opacity duration-300 ${fightActive ? 'opacity-100' : 'opacity-0'}`}
      >
        <div
          className="absolute left-0 top-1/2 text-8xl md:text-9xl transition-all duration-300 ease-out"
          style={{
            transform: fightActive ? 'translate(20vw, -50%)' : 'translate(-100%, -50%)',
            opacity: fightActive ? 1 : 0
          }}
        >🥊</div>
        <div
          className="absolute right-0 top-1/2 text-8xl md:text-9xl transition-all duration-300 ease-out"
          style={{
            transform: fightActive ? 'translate(-20vw, -50%) scaleX(-1)' : 'translate(100%, -50%) scaleX(-1)',
            opacity: fightActive ? 1 : 0
          }}
        >🥊</div>
      </div>
      {!up.boxLg
        ? <UpgBtn onClk={() => dUp('boxLg', 2000000, 'League Founded. 🥊')} cost={2000000} title="FOUND LEAGUE" pB={pl.bag} />
        : <UpgBtn onClk={() => dUp('boxBrd', 15000000, 'Network Deal! 📺')} cost={15000000} title="BROADCAST DEAL" unl={up.boxBrd} reqC={125} pB={pl.bag} pC={pl.clout} />
      }
      {!up.boxLg && <Toggles opts={['Basement', 'Arena', 'Stadium']} active={box.v} setVal={v => setBox(s => ({ ...s, v }))} color="orange-600" />}
      <Toggles opts={up.boxLg ? ['Scrap', 'MMAvYT', 'Pro', 'Super'] : ['Scrap', 'MMAvYT', 'Pro']} active={box.t} setVal={v => setBox(s => ({ ...s, t: v }))} color="orange-600" />
      {!up.boxBrd && <Stepper val={box.b} setVal={v => setBox(s => ({ ...s, b: v }))} min={box.t === 4 ? 10000000 : 50004} max={box.t === 4 ? 50000000 : 5000000} step={50000} label="Promo Budget" />}
      <Toggles opts={['Respectful', 'Script Brawl']} active={box.p} setVal={v => setBox(s => ({ ...s, p: v }))} color="orange-600" />
      <div className="relative flex items-center justify-center gap-4">
        <span className="text-4xl transition-transform duration-200" style={{ transform: `scale(${1 + fightIntensity / 100})` }}>🥊</span>
        <FlashBtn onClick={rBox} dis={pl.bag < fightCost} label={up.boxBrd ? 'HOST NETWORK FIGHT ($0)' : `HOST - $${fMny(fightCost)}`} />
        <span className="text-4xl transition-transform duration-200" style={{ transform: `scale(${1 + fightIntensity / 100})` }}>🥊</span>
      </div>
    </LabShell>
  );
};

const VUMeter = ({ isActive }) => {
  const [levels, setLevels] = React.useState([0, 0]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        setLevels([95 + Math.random() * 5, 95 + Math.random() * 5]);
      } else {
        setLevels(prev => [
          Math.max(10, Math.min(70, prev[0] + (Math.random() - 0.5) * 20)),
          Math.max(10, Math.min(70, prev[1] + (Math.random() - 0.5) * 20))
        ]);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="flex gap-1 h-full bg-black/40 p-1 rounded border border-zinc-800">
      {[0, 1].map(i => (
        <div key={i} className="relative w-1.5 h-full bg-zinc-900 rounded-full overflow-hidden">
          <div
            className={`absolute bottom-0 w-full transition-all duration-100 ${isActive ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-gradient-to-t from-green-500 via-yellow-500 to-red-500'}`}
            style={{ height: `${levels[i]}%` }}
          />
        </div>
      ))}
    </div>
  );
};

const CustomFader = ({ val = 0, setVal, label, colorCls }) => {
  const trackRef = React.useRef(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const updateVal = (clientY) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, 1 - (clientY - rect.top) / rect.height));
    setVal(Math.round(pos * 100));
  };

  const onMouseDown = (e) => { setIsDragging(true); updateVal(e.clientY); };
  const onTouchStart = (e) => { setIsDragging(true); updateVal(e.touches[0].clientY); };

  React.useEffect(() => {
    const onMouseMove = (e) => { if (isDragging) updateVal(e.clientY); };
    const onTouchMove = (e) => { if (isDragging) updateVal(e.touches[0].clientY); };
    const onEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  return (
    <div className="flex flex-col items-center gap-2 select-none group/fader">
      <div className="text-[8px] font-black text-zinc-500 uppercase">{label}</div>
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        className="relative w-8 h-32 bg-zinc-950 rounded-md border border-zinc-800 shadow-inner cursor-pointer flex justify-center"
      >
        <div className="absolute w-1 h-28 bg-black rounded-full top-2 shadow-[inset_0_1px_3px_rgba(255,255,255,0.1)]" />

        {/* Tooltip */}
        <div
          className={`absolute -top-8 bg-zinc-800 border border-zinc-700 text-[10px] px-2 py-1 rounded-md text-white font-black whitespace-nowrap z-50 transition-opacity duration-200 pointer-events-none ${isDragging ? 'opacity-100' : 'opacity-0 group-hover/fader:opacity-100'}`}
        >
          {(val || 0)}% / {Math.floor(((val || 0)/100) * 12)} dB
        </div>

        <div
          className="absolute w-6 h-4 bg-zinc-400 rounded border-y border-zinc-500 shadow-lg z-10 flex flex-col items-center justify-center gap-0.5"
          style={{ bottom: `calc(${(val || 0)}% - 8px)`, transition: isDragging ? 'none' : 'bottom 0.1s ease-out' }}
        >
          <div className="w-4 h-[1px] bg-zinc-600" />
          <div className="w-4 h-[1px] bg-zinc-600" />
          <div className="w-4 h-[1px] bg-zinc-600" />
        </div>
        <div className="absolute inset-y-2 left-0 w-1 flex flex-col justify-between items-end pr-0.5 pointer-events-none">
          {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-[1px] bg-zinc-800" />)}
        </div>
      </div>
      <div className={`text-[10px] font-mono ${colorCls}`}>{(val || 0)}%</div>
    </div>
  );
};

export const AudioTab = () => {
  const { pl, setPl, audioTracks, sampleStrike, rAudioRelease, rAudioSettle, setTab, audioUpgrades, setAudioUpgrades, talentScouters, setTalentScouters, holwoodSyncActive, setHollywoodSyncActive, audioPromo, setAudioPromo, audioStyle, setAudioStyle } = useGame();
  const audioHitActive = useGameStore(state => state.audioHitActive);
  const locked = pl.bag < 100000 || pl.clout < 30;

  const buyUpgrade = (key, cost) => {
    if (pl.bag >= cost && !audioUpgrades[key]) {
      setPl(p => ({ ...p, bag: p.bag - cost }));
      setAudioUpgrades(prev => ({ ...prev, [key]: true }));
    }
  };

  const hireScouter = () => {
    if (pl.bag >= 50000) {
      setPl(p => ({ ...p, bag: p.bag - 50000 }));
      setTalentScouters(prev => prev + 1);
    }
  };

  const toggleHollywood = () => {
    if (pl.bag >= 250000 && !holwoodSyncActive) {
      setPl(p => ({ ...p, bag: p.bag - 250000 }));
      setHollywoodSyncActive(true);
    }
  };

  if (locked) return <LockedTierScreen section={1} />;

  return (
    <LabShell t="INDIE AUDIO SYNDICATE" c="orange" fontCls="font-hype" onHub={() => setTab('HUB')} tier={1}>
      {/* Floating Notes Layer */}
      {audioHitActive && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl animate-note"
              style={{
                left: `${10 + Math.random() * 80}%`,
                bottom: '20%',
                animationDelay: `${i * 0.1}s`
              }}
            >
              {['🎵', '🎶', '✨', '🎸', '🎹'][i % 5]}
            </div>
          ))}
        </div>
      )}

      {/* Catalog Display */}
      <div className={`bg-black/60 p-4 rounded-xl border text-center mb-4 transition-all duration-500 ${sampleStrike ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)] animate-pulse' : 'border-zinc-800'}`}>
        <div className="text-[10px] text-zinc-500 font-black uppercase tracking-tighter">Streaming Catalog</div>
        <div className={`text-3xl font-black ${sampleStrike ? 'text-red-500' : 'text-orange-500'} font-mono`}>{audioTracks} TRACKS</div>
        <div className="text-[9px] text-zinc-400 mt-1 font-bold">
          {sampleStrike ? "COPYRIGHT FREEZE: 0% PAYOUT" : `Passive: +$${fMny(audioTracks * 400 * (holwoodSyncActive ? 2 : 1))}/mo`}
        </div>
      </div>

      {/* Mixing Deck Grid */}
      <div className="grid grid-cols-4 gap-2 bg-zinc-900 p-4 rounded-xl border border-zinc-800 mb-4 shadow-inner">
        <CustomFader val={audioPromo} setVal={setAudioPromo} label="Promo" colorCls="text-orange-500" />
        <CustomFader val={audioStyle} setVal={setAudioStyle} label="Style" colorCls="text-blue-500" />

        {/* Channel 3 & 4: Knobs & Toggles */}
        <div className="col-span-2 flex flex-col gap-2">
          <div className="bg-black/40 p-2 rounded border border-zinc-800 flex justify-between items-center">
            <div className="text-[8px] font-black text-zinc-500 uppercase">Scouters</div>
            <div className="text-sm font-black text-white">{talentScouters}</div>
          </div>
          <div className={`bg-black/40 p-2 rounded border border-zinc-800 flex justify-between items-center ${holwoodSyncActive ? 'border-green-500/50' : ''}`}>
            <div className="text-[8px] font-black text-zinc-500 uppercase">Sync</div>
            <div className={`text-[8px] font-black ${holwoodSyncActive ? 'text-green-400' : 'text-zinc-600'}`}>{holwoodSyncActive ? 'ACTIVE' : 'OFF'}</div>
          </div>

          <div className="mt-auto grid grid-cols-1 gap-1">
            {!audioUpgrades.mixingSuite && (
              <button onClick={() => buyUpgrade('mixingSuite', 15000)} disabled={pl.bag < 15000} className="py-1 bg-zinc-800 text-[7px] font-black uppercase text-zinc-400 border border-zinc-700 rounded hover:bg-zinc-700 disabled:opacity-30 transition-all">Mix Suite $15k</button>
            )}
            {!audioUpgrades.analogConsole && audioUpgrades.mixingSuite && (
              <button onClick={() => buyUpgrade('analogConsole', 25000)} disabled={pl.bag < 25000} className="py-1 bg-zinc-800 text-[7px] font-black uppercase text-zinc-400 border border-zinc-700 rounded hover:bg-zinc-700 disabled:opacity-30 transition-all">Analog $25k</button>
            )}
          </div>
        </div>
      </div>

      {/* Logic Toggles & Scouter Hire */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button onClick={hireScouter} disabled={pl.bag < 50000} className="py-2 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[9px] font-black uppercase rounded hover:bg-zinc-700 disabled:opacity-50 transition-all">
          + Hire Scouter ($50k)
        </button>
        {!holwoodSyncActive && audioTracks >= 50 && (
          <button onClick={toggleHollywood} disabled={pl.bag < 250000} className="py-2 bg-orange-900/20 border border-orange-500/50 text-orange-400 text-[9px] font-black uppercase rounded hover:bg-orange-800/40 disabled:opacity-50 transition-all">
            Hollywood Sync ($250k)
          </button>
        )}
      </div>

      {sampleStrike && (
        <div className="ui-crisis p-3 flex flex-col gap-2 mb-4 border-red-600 shadow-lg">
          <h4 className="text-red-500 font-black text-center text-[10px] uppercase tracking-widest">🚨 COPYRIGHT STRIKE</h4>
          <FlashBtn
            onClick={rAudioSettle}
            dis={pl.bag < 5000}
            label="SETTLE $5,000"
            color="red-700"
            txt="white"
          />
        </div>
      )}

      {/* Master Section */}
      <div className="flex gap-2 h-16 mb-2">
        <div className="flex-1 relative">
          <button
            onClick={rAudioRelease}
            disabled={pl.bag < (1000 + (1000 * (audioPromo/100))) || pl.mentalHealth < 15}
            className={`w-full h-full rounded-xl font-black text-lg tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3
              ${pl.bag < (1000 + (1000 * (audioPromo/100))) || pl.mentalHealth < 15
                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                : 'bg-red-900 border-2 border-red-600 text-red-100 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:bg-red-800 rec-button-pulse'
              }`}
          >
            <div className={`w-3 h-3 rounded-full ${pl.bag < (1000 + (1000 * (audioPromo/100))) || pl.mentalHealth < 15 ? 'bg-zinc-700' : 'bg-red-500 animate-pulse'}`} />
            REC SINGLE
          </button>
        </div>
        <div className="w-12">
          <VUMeter isActive={audioHitActive} />
        </div>
      </div>

      <p className="text-[8px] text-zinc-500 font-bold text-center mt-3 uppercase tracking-widest">
        "Studio Session Cost: ${fMny(1000 + (1000 * (audioPromo/100)))} | 15 Energy"
      </p>
    </LabShell>
  );
};
