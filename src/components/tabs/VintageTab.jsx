import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn } from '../ui/Shared.jsx';

export const VintageTab = () => {
  const {
    pl, collectiblePhase, vintageRevenueTracker, sneakerBackdoorPlug, vaultHoldings,
    rVintage, rVinCh, rSneakerDrop, rBuyConsignment, rBuyVault, rVaultAuction, bAss, vinCh, setTab, karmaFlags, setKarmaFlags, executeChaosRoll
  } = useGame();

  // Street Tier visual spike styling
  const streetTierGlow = "shadow-[0_0_20px_rgba(249,115,22,0.4)] border-orange-500/60";

  // ─── PHASE A: VINTAGE RESELLING (MUD) ──────────────────────────────────────
  if (collectiblePhase === 'VINTAGE') {
    return (
      <LabShell hustleKey="vintage" t="VINTAGE RESELLING" c="amber" fontCls="font-hype" onHub={() => setTab('HUB')} tier={0}>
        <div className="flex items-center justify-between bg-black/40 p-3 rounded-xl border border-slate-800 mb-4">
          <div className="text-[10px] font-black text-slate-300 drop-shadow-sm uppercase tracking-widest">SELL BOOTLEGS (RISK)</div>
          <button
            onClick={() => setKarmaFlags(f => ({ ...f, soldBootleg: !f.soldBootleg }))}
            className={`w-12 h-6 rounded-full transition-all relative ${karmaFlags.soldBootleg ? 'bg-red-600' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${karmaFlags.soldBootleg ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>

        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="bg-slate-900 border border-green-500/30 p-4 rounded-2xl text-center">
            <h3 className="text-xl font-black text-green-400 font-hype tracking-widest">THRIFT BIN DIPPING</h3>
            <p className="text-[10px] text-slate-400 mt-1 italic">"Accumulate $10,000 gross revenue to unlock the Sneaker Underworld."</p>
            <div className="mt-3 bg-black/40 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, (vintageRevenueTracker / 10000) * 100)}%` }}></div>
            </div>
            <div className="text-[9px] text-slate-400 mt-1 font-mono">${fMny(vintageRevenueTracker)} / $10,000 SECURED</div>
          </div>

          {vinCh === 'bootleg' ? (
            <div className="bg-red-900/40 border-2 border-red-500 p-4 rounded-xl flex flex-col gap-3 animate-pulse">
              <h4 className="text-red-400 font-black text-center uppercase text-sm">⚠️ BOOTLEG SPOTTED!</h4>
              <p className="text-[10px] text-slate-300 drop-shadow-sm text-center italic">The "Grail" you found is a high-quality replica.</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => rVinCh('burn')} className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg text-[10px] font-bold uppercase transition-all">Burn It Legally (+$0, +1 Aura)</button>
                <button onClick={() => rVinCh('pass')} className="bg-red-600 hover:bg-red-500 text-white p-2 rounded-lg text-[10px] font-bold uppercase transition-all">Pass It Off (+$150, -10 Aura)</button>
              </div>
            </div>
          ) : (
            <FlashBtn
              onClick={() => executeChaosRoll('VINTAGE', rVintage)}
              costStm={10}
              dis={pl.bag < 50}
              label="HIT THE GOODWILL BINS (-$50)"
              color="green-600"
              txt="white"
            />
          )}
        </div>
      </LabShell>
    );
  }

  // ─── PHASE B: SNEAKER DROPS (STREET) ──────────────────────────────────
  if (collectiblePhase === 'SNEAKER') {
    return (
      <div className={`transition-all duration-500 rounded-2xl ${streetTierGlow}`}>
        <LabShell hustleKey="vintage" t="SNEAKER DROP HUB" c="orange" fontCls="font-hype" onHub={() => setTab('HUB')} tier={1}>
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="bg-black/60 border border-orange-500/40 p-4 rounded-2xl text-center shadow-inner">
              <h3 className="text-2xl font-black text-orange-500 font-hype tracking-widest drop-shadow-md">SNEAKER DROP HUB</h3>
              <p className="text-[10px] text-slate-300 mt-1 italic font-medium">"High stakes, high heat. One pair can change the motion."</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <FlashBtn
                onClick={rSneakerDrop}
                costStm={15}
                dis={pl.bag < 300}
                label="COPPING THE NEXT DROP (-$300, -15 MH)"
                color="orange-600"
                txt="white"
              />

              {!sneakerBackdoorPlug ? (
                <button
                  onClick={() => bAss('sneakerBackdoorPlug', 5000, 'Backdoor Store Plug')}
                  disabled={pl.bag < 5000}
                  className="p-4 bg-slate-900/80 border border-orange-500/30 rounded-xl flex justify-between items-center hover:border-yellow-500 transition-all group disabled:opacity-50"
                >
                  <div className="text-left">
                    <div className="font-bold text-xs text-yellow-500 uppercase tracking-widest group-hover:text-yellow-400 transition-colors">Bribe the Backdoor Plug</div>
                    <div className="text-[9px] text-slate-400 mt-1">Guarantees 100% success rate on all drops.</div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-yellow-500 font-black text-sm">$5,000</span>
                    <span className="text-[8px] text-slate-500 uppercase font-bold tracking-tighter">Instant Buy</span>
                  </div>
                </button>
              ) : (
                <div className="p-3 bg-green-900/20 border border-green-500/50 rounded-xl text-center">
                  <div className="text-[10px] font-black text-green-400 uppercase tracking-widest">✓ BACKDOOR PLUG SECURED</div>
                  <div className="text-[8px] text-slate-400">All drops are guaranteed success.</div>
                </div>
              )}
            </div>

            <div className="mt-2 pt-4 border-t border-slate-800">
               <button
                onClick={rBuyConsignment}
                disabled={pl.bag < 1500000}
                className="w-full py-3 bg-orange-600/20 border border-orange-600/50 text-orange-500 font-black rounded-xl hover:bg-orange-600 hover:text-white disabled:bg-slate-800 disabled:opacity-40 disabled:text-slate-500 transition-all text-xs tracking-widest uppercase shadow-lg"
              >
                Scale to Consignment Platform (-$1.5M)
              </button>
            </div>
          </div>
        </LabShell>
      </div>
    );
  }

  // ─── PHASE C: CONSIGNMENT PLATFORM (CORP/ELITE) ────────────────────────────
  if (collectiblePhase === 'CONSIGNMENT') {
    return (
      <LabShell hustleKey="vintage" t="CONSIGNMENT EMPIRE" c="cyan" fontCls="font-hype" onHub={() => setTab('HUB')} tier={2}>
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="bg-slate-900 border border-cyan-500/30 p-4 rounded-2xl text-center">
            <h3 className="text-xl font-black text-cyan-400 font-hype tracking-widest">HYPE CONSIGNMENT NETWORK</h3>
            <p className="text-[10px] text-slate-400 mt-1">Your platform collects a passive fee on all local street-culture trading volume.</p>
            <div className="mt-2 text-xs font-bold text-green-400 uppercase tracking-tighter animate-pulse">Generating passive income via clout multipliers</div>
          </div>

          <button
            onClick={rBuyVault}
            disabled={pl.bag < 5000000}
            className="w-full py-4 bg-cyan-600 disabled:bg-slate-800 disabled:opacity-40 text-white font-black rounded-xl hover:bg-cyan-500 transition-all text-xs tracking-widest uppercase"
          >
            BUILD PRIVATE BLUE-CHIP VAULT (-$5M)
          </button>
        </div>
      </LabShell>
    );
  }

  // ─── PHASE D: THE COLLECTIBLE VAULT (MOGUL/PRESIDENT) ─────────────────────
  if (collectiblePhase === 'VAULT') {
    return (
      <LabShell hustleKey="vintage" t="COLLECTIBLE VAULT" c="purple" fontCls="font-hype" onHub={() => setTab('HUB')} tier={4}>
        <div className="flex flex-col gap-4 animate-fadeIn">
          <div className="bg-slate-900 border border-purple-500/30 p-4 rounded-2xl text-center">
            <h3 className="text-xl font-black text-purple-400 font-hype tracking-widest">BLUE-CHIP VAULT</h3>
            <p className="text-[10px] text-slate-400 mt-1">Holding legendary historical assets. Vault values appreciate by 12% annually.</p>
          </div>

          <FlashBtn
            onClick={rVaultAuction}
            costStm={15}
            dis={pl.bag < 500000}
            label="ATTEND SOTHEBY'S AUCTION (-$500K)"
            color="purple-600"
            txt="white"
          />

          <div className="bg-black/40 p-4 rounded-xl border border-slate-800 text-left text-xs">
            <div className="text-purple-400 font-black mb-2 uppercase tracking-wider flex justify-between">
              <span>📦 Vault Inventory</span>
              <span>{vaultHoldings.length} ITEMS</span>
            </div>
            {vaultHoldings.length === 0 ? (
              <span className="text-slate-500 italic">Vault empty. Source high-end relics at top auctions.</span>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {vaultHoldings.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-slate-800/50 pb-1 last:border-0">
                    <span className="text-slate-200">{item.name}</span>
                    <span className="text-purple-300 font-mono">${fMny(item.cost)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </LabShell>
    );
  }

  return null;
};
