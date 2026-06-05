import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CampaignState {
  phase: 'PARTY' | 'MATE' | 'TRAIL' | 'OCTOBER' | 'ELECTION' | 'RESULT';
  party: 'LIBERTY' | 'UNITY' | 'PROGRESS' | null;
  runningMate: string | null;
  fundraising: number;
  polling: number;
  momentum: number;
  turnout: number;
  round: number;
  usedPACs: string[];
  endorsements: string[];
}

interface CampaignTrailProps {
  onComplete: (multiplier: number) => void;
}

const PARTIES = [
  { id: 'LIBERTY', name: 'Liberty', color: 'bg-red-600', text: 'Free market, low taxes', base: 30, states: ['FL', 'TX', 'AZ'] },
  { id: 'UNITY', name: 'Unity', color: 'bg-blue-600', text: 'Moderate, bipartisan', base: 25, states: ['PA', 'MI', 'OH'] },
  { id: 'PROGRESS', name: 'Progress', color: 'bg-emerald-600', text: 'Social justice, green energy', base: 20, states: ['CA', 'NY', 'WA'] },
];

const MATES = [
  { id: 'EXEC', name: 'Business Exec', bonus: '+10% Fundraising', risk: '-5% Working Class', effect: { fund: 1.1, poll: 0.95 } },
  { id: 'SENATOR', name: 'Senator', bonus: '+15% Establishment', risk: '-10% Anti-Establishment', effect: { poll: 1.05, momentum: 5 } },
  { id: 'POPULIST', name: 'Populist Figure', bonus: '+20% Working Class', risk: '-15% Establishment', effect: { poll: 1.1, momentum: -5 } },
  { id: 'CELEBRITY', name: 'Celebrity', bonus: '+25% Media Coverage', risk: '-20% Seriousness', effect: { momentum: 15, poll: 0.9 } },
  { id: 'HERO', name: 'War Hero', bonus: '+15% National Security', risk: '-10% Anti-War', effect: { poll: 1.05, aura: 10 } },
];

const STATES = [
  { id: 'FL', name: 'Florida', ev: 30, base: 45 },
  { id: 'TX', name: 'Texas', ev: 40, base: 48 },
  { id: 'AZ', name: 'Arizona', ev: 11, base: 49 },
  { id: 'PA', name: 'Pennsylvania', ev: 19, base: 50 },
  { id: 'MI', name: 'Michigan', ev: 15, base: 50 },
  { id: 'OH', name: 'Ohio', ev: 17, base: 48 },
  { id: 'CA', name: 'California', ev: 54, base: 65 },
  { id: 'NY', name: 'New York', ev: 28, base: 60 },
  { id: 'WA', name: 'Washington', ev: 12, base: 55 },
  { id: 'GA', name: 'Georgia', ev: 16, base: 49 },
  { id: 'WI', name: 'Wisconsin', ev: 10, base: 50 },
  { id: 'NC', name: 'North Carolina', ev: 16, base: 48 },
];

export function CampaignTrail({ onComplete }: CampaignTrailProps) {
  const [state, setState] = useState<CampaignState>({
    phase: 'PARTY',
    party: null,
    runningMate: null,
    fundraising: 50000000,
    polling: 40,
    momentum: 0,
    turnout: 50,
    round: 1,
    usedPACs: [],
    endorsements: [],
  });

  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [electionResults, setElectionResults] = useState<any[]>([]);
  const [totalEV, setTotalEV] = useState(0);

  const checkLoss = () => {
    if (state.fundraising <= 0) return 0.1; // Out of funds
    if (state.polling < 15) return 0.2; // Polling collapse
    if (state.momentum < -40) return 0.3; // Momentum crash
    return null;
  };

  const handleLoss = (multiplier: number) => {
    onComplete(multiplier);
  };

  const nextRound = () => {
    const loss = checkLoss();
    if (loss) return handleLoss(loss);

    if (state.round === 5) {
      triggerOctoberSurprise();
    } else if (state.round >= 6) {
      setState(s => ({ ...s, phase: 'ELECTION' }));
    } else {
      setState(s => ({ ...s, round: s.round + 1, phase: 'TRAIL' }));
    }
  };

  const triggerEvent = () => {
    const rand = Math.random();
    let event = null;
    if (rand < 0.3) {
      event = {
        title: 'National Debate',
        text: 'The cameras are rolling. What is your stance?',
        options: [
          { label: 'Populist Stance', effect: { poll: 2, momentum: 10, fund: -2000000 } },
          { label: 'Establishment Stance', effect: { poll: 1, fund: 5000000 } },
          { label: 'Radical Stance', effect: { poll: -2, momentum: 20, aura: 20 } },
        ]
      };
    } else if (rand < 0.5) {
      event = {
        title: 'Campaign Scandal',
        text: 'Old business partner talks to the press.',
        options: [
          { label: 'Bury it (-$5M)', effect: { fund: -5000000, momentum: -5 } },
          { label: 'Ignore it', effect: { momentum: -15, poll: -3 } },
        ]
      };
    } else if (rand < 0.75) {
      event = {
        title: 'Endorsement Opp',
        text: 'Unions want to back you for a price.',
        options: [
          { label: 'Accept Support', effect: { poll: 3, endorsements: ['Unions'], fund: -1000000 } },
          { label: 'Decline', effect: { aura: 5 } },
        ]
      };
    } else {
      event = {
        title: 'Attack Ad',
        text: 'Opponent runs a smear campaign.',
        options: [
          { label: 'Counter-Ad (-$3M)', effect: { fund: -3000000, poll: 1 } },
          { label: 'Take the hit', effect: { poll: -5, momentum: -5 } },
        ]
      };
    }
    setCurrentEvent(event);
  };

  const triggerOctoberSurprise = () => {
    const rand = Math.random();
    let surprise = null;
    if (rand < 0.25) {
      surprise = { title: 'Opponent Scandal', text: 'Your opponent is caught in a leaked video.', effect: { poll: 10, momentum: 20 } };
    } else if (rand < 0.5) {
      surprise = { title: 'Leaked Tape', text: 'A recording of you speaking privately is leaked.', effect: { poll: -10, momentum: -20 } };
    } else if (rand < 0.75) {
      surprise = { title: 'Economic Report', text: 'Major economic report is released. Markets are booming.', effect: { poll: 10 } };
    } else {
      surprise = { title: 'Mate Crisis', text: 'Your running mate is approached by the other party.', effect: { momentum: -15 } };
    }
    setCurrentEvent({ ...surprise, isOctober: true });
    setState(s => ({ ...s, phase: 'OCTOBER' }));
  };

  const handleEventOption = (opt: any) => {
    const e = opt.effect;
    setState(s => ({
      ...s,
      polling: Math.min(100, Math.max(0, s.polling + (e.poll || 0))),
      momentum: Math.min(50, Math.max(-50, s.momentum + (e.momentum || 0))),
      fundraising: s.fundraising + (e.fund || 0),
      endorsements: e.endorsements ? [...s.endorsements, ...e.endorsements] : s.endorsements,
    }));
    setCurrentEvent(null);
    if (state.phase !== 'OCTOBER') nextRound();
    else setState(s => ({ ...s, phase: 'TRAIL', round: 6 }));
  };

  const startElection = async () => {
    let ev = 0;
    const results = [];
    for (const s of STATES) {
      let winProb = s.base / 100;
      winProb += (state.polling - 40) / 100;
      winProb += (state.momentum / 200);
      if (state.party === 'LIBERTY' && ['FL', 'TX', 'AZ'].includes(s.id)) winProb += 0.1;
      if (state.party === 'UNITY' && ['PA', 'MI', 'OH'].includes(s.id)) winProb += 0.1;
      if (state.party === 'PROGRESS' && ['CA', 'NY', 'WA'].includes(s.id)) winProb += 0.1;

      const won = Math.random() < winProb;
      if (won) ev += s.ev;
      results.push({ ...s, won });
      setElectionResults([...results]);
      setTotalEV(ev);
      await new Promise(r => setTimeout(r, 400));
    }
    setState(s => ({ ...s, phase: 'RESULT' }));
  };

  useEffect(() => {
    if (state.phase === 'ELECTION') {
      startElection();
    }
  }, [state.phase]);

  return (
    <div className="flex flex-col h-[500px] bg-slate-950 text-white font-mono p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
         <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
      </div>

      <AnimatePresence mode="wait">
        {state.phase === 'PARTY' && (
          <motion.div key="party" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-center">
            <h2 className="text-2xl font-black italic tracking-tighter text-emerald-500 uppercase">Step 1: Choose Your Party</h2>
            <div className="grid grid-cols-1 gap-3">
              {PARTIES.map(p => (
                <button key={p.id} onClick={() => setState(s => ({ ...s, party: p.id as any, phase: 'MATE' }))} className={`${p.color} p-4 rounded-xl hover:scale-105 transition-transform text-left border-2 border-white/10`}>
                  <div className="text-lg font-black">{p.name}</div>
                  <div className="text-[10px] opacity-80 uppercase font-bold">{p.text}</div>
                  <div className="text-[9px] mt-1 italic">Key States: {p.states.join(', ')}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {state.phase === 'MATE' && (
          <motion.div key="mate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6 text-center">
            <h2 className="text-2xl font-black italic tracking-tighter text-blue-500 uppercase">Step 2: Choose Running Mate</h2>
            <div className="grid grid-cols-1 gap-3 h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {MATES.map(m => (
                <button key={m.id} onClick={() => setState(s => ({ ...s, runningMate: m.id, phase: 'TRAIL' }))} className="bg-slate-900 p-4 rounded-xl hover:bg-slate-800 text-left border border-slate-800">
                  <div className="text-lg font-black text-white">{m.name}</div>
                  <div className="flex justify-between text-[10px] mt-1">
                    <span className="text-emerald-400 font-bold uppercase">{m.bonus}</span>
                    <span className="text-rose-500 font-bold uppercase">{m.risk}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {state.phase === 'TRAIL' && (
          <motion.div key="trail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="flex justify-between items-start">
               <div>
                 <div className="text-[10px] font-black text-slate-500 uppercase">Round {state.round} / 6</div>
                 <div className="text-xl font-black italic text-emerald-400">THE CAMPAIGN TRAIL</div>
               </div>
               <div className="text-right">
                  <div className="text-[10px] font-black text-slate-500 uppercase">Fundraising</div>
                  <div className="text-sm font-black text-emerald-500">${(state.fundraising / 1000000).toFixed(1)}M</div>
               </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
               <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                  <div className="text-[9px] text-slate-500 uppercase">Polling</div>
                  <div className="text-lg font-black text-blue-400">{state.polling}%</div>
               </div>
               <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                  <div className="text-[9px] text-slate-500 uppercase">Momentum</div>
                  <div className={`text-lg font-black ${state.momentum >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{state.momentum > 0 ? '+' : ''}{state.momentum}</div>
               </div>
               <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-center">
                  <div className="text-[9px] text-slate-500 uppercase">Turnout</div>
                  <div className="text-lg font-black text-purple-400">{state.turnout}%</div>
               </div>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 flex-1 flex flex-col items-center justify-center gap-4 text-center">
               {currentEvent ? (
                 <div className="space-y-4">
                    <div className="text-rose-500 font-black uppercase tracking-widest text-[10px]">{currentEvent.title}</div>
                    <p className="text-sm italic text-slate-300">"{currentEvent.text}"</p>
                    <div className="flex flex-col gap-2">
                       {currentEvent.options.map((o: any, i: number) => (
                         <button key={i} onClick={() => handleEventOption(o)} className="px-4 py-2 bg-slate-800 hover:bg-emerald-600 hover:text-black transition-all rounded-lg text-xs font-bold uppercase">
                           {o.label}
                         </button>
                       ))}
                    </div>
                 </div>
               ) : (
                 <button onClick={triggerEvent} className="w-full py-8 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-[0.2em] rounded-xl transition-all shadow-lg shadow-emerald-900/40">
                    Visit Swing States
                 </button>
               )}
            </div>
          </motion.div>
        )}

        {state.phase === 'OCTOBER' && (
          <motion.div key="october" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-full text-center space-y-6">
             <div className="text-rose-600 text-4xl font-black italic tracking-tighter uppercase animate-pulse">OCTOBER SURPRISE</div>
             <div className="bg-slate-900 p-6 rounded-3xl border-2 border-rose-600/30 space-y-4 max-w-sm">
                <div className="text-lg font-black text-white uppercase">{currentEvent?.title}</div>
                <p className="text-sm text-slate-300 italic">"{currentEvent?.text}"</p>
                <button onClick={() => handleEventOption({ effect: currentEvent?.effect })} className="w-full py-3 bg-white text-black font-black uppercase tracking-widest rounded-lg">
                   CONTINUE
                </button>
             </div>
          </motion.div>
        )}

        {state.phase === 'ELECTION' && (
          <motion.div key="election" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
             <div className="text-center">
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Live Results</div>
                <div className="text-4xl font-black italic tracking-tighter text-white">ELECTION NIGHT</div>
             </div>

             <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div className="text-center">
                   <div className="text-[10px] font-black text-blue-500 uppercase">You</div>
                   <div className="text-3xl font-black text-white">{totalEV}</div>
                </div>
                <div className="h-2 flex-1 mx-4 bg-slate-800 rounded-full overflow-hidden flex">
                   <div className="h-full bg-blue-600 transition-all duration-500" style={{ width: `${(totalEV / 538) * 100}%` }} />
                   <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${((538 - totalEV) / 538) * 100}%` }} />
                </div>
                <div className="text-center">
                   <div className="text-[10px] font-black text-red-500 uppercase">OPP</div>
                   <div className="text-3xl font-black text-white">{538 - totalEV}</div>
                </div>
             </div>

             <div className="grid grid-cols-4 gap-2 h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {electionResults.map(r => (
                  <div key={r.id} className={`p-2 rounded border ${r.won ? 'bg-blue-600/20 border-blue-500' : 'bg-red-600/20 border-red-500'} text-center`}>
                    <div className="text-[10px] font-black">{r.id}</div>
                    <div className="text-[9px] opacity-80">{r.ev} EV</div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}

        {state.phase === 'RESULT' && (
          <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center space-y-8">
             {totalEV >= 270 ? (
               <>
                 <div className="space-y-2">
                    <div className="text-emerald-500 text-6xl font-black italic tracking-tighter uppercase">VICTORY</div>
                    <div className="text-white text-xl font-black tracking-widest uppercase">270 ELECTORAL VOTES REACHED</div>
                 </div>
                 <p className="text-slate-400 text-sm max-w-xs uppercase font-bold tracking-widest leading-relaxed">
                   The people have spoken. You are the President of the United States. The levers of global power are now in your hands.
                 </p>
                 <button onClick={() => onComplete(1.5)} className="px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-black font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-emerald-900/40 transition-all active:scale-95">
                   TAKE THE OATH
                 </button>
               </>
             ) : (
               <>
                 <div className="space-y-2">
                    <div className="text-rose-600 text-6xl font-black italic tracking-tighter uppercase">DEFEAT</div>
                    <div className="text-white text-xl font-black tracking-widest uppercase">CONCESSION SPEECH REQUIRED</div>
                 </div>
                 <p className="text-slate-400 text-sm max-w-xs uppercase font-bold tracking-widest leading-relaxed">
                   You fell short of the 270 threshold. Your campaign is over. The establishment has closed its doors.
                 </p>
                 <button onClick={() => onComplete(0.2)} className="px-12 py-5 bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl shadow-rose-900/40 transition-all active:scale-95">
                   EXIT STAGE LEFT
                 </button>
               </>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
