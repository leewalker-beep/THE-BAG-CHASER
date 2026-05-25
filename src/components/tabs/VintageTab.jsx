import React from 'react';
import { useGame } from '../../GameEngine.jsx';
import { fMny } from '../../config.js';
import { LabShell, FlashBtn } from '../ui/Shared.jsx';

const vaultAssetsData = [
  { name: "Player-Sample Prototype Sneakers", cost: 500000, aura: 200 },
  { name: "Game-Worn World Championship Ring", cost: 1200000, aura: 500 },
  { name: "1-of-1 Concept Luxury Hyper-Watch", cost: 3000000, aura: 1500 },
];

export const VintageTab = () => {
  const {
    pl, collectiblePhase, vintageRevenueTracker, sneakerBackdoorPlug, vaultHoldings,
    rVintage, rVinCh, rSneakerDrop, rBuyConsignment, rBuyVault, rVaultAuction, rBuyVaultAsset, bAss, vinCh, setTab, karmaFlags, setKarmaFlags, executeChaosRoll
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
            <p className="text-[10px] text-slate-400 mt-1 italic">"Accumulate $2,500 gross revenue to unlock the Sneaker Underworld."</p>
            <div className="mt-3 bg-black/40 h-2 rounded-full overflow-hidden border border-slate-800">
              <div className="bg-green-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, (vintageRevenueTracker / 2500) * 100)}%` }}></div>
            </div>
            <div className="text-[9px] text-slate-400 mt-1 font-mono">${fMny(vintageRevenueTracker)} / $2,500 SECURED</div>
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
                Scale to Global Consignment Platform (-$1.5M)
              </button>
            </div>
          </div>
        </LabShell>
      </div>
    );
  }

  // ─── PHASE C: CONSIGNMENT PLATFORM (CORP/ELITE) ────────────────────────────
  if (collectiblePhase === 'CONSIGNMENT') {
    const transactionVolume = 100000 + (pl.clout * 1000);
    const feeMultiplier = (pl.clout / 100).toFixed(2);
    const passivePayout = 5000 * (pl.clout / 100);

    return (
      <LabShell hustleKey="vintage" t="GLOBAL CONSIGNMENT DASHBOARD" c="emerald" fontCls="font-tech" onHub={() => setTab('HUB')} tier={2}>
        <div className="flex flex-col gap-4 animate-fadeIn font-tech">
          <div className="bg-black/80 border border-emerald-500/40 p-5 rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.2)]">
            <h3 className="text-2xl font-black text-emerald-400 tracking-widest uppercase mb-1">Global Consignment Marketplace</h3>
            <div className="h-1 w-20 bg-emerald-500 mb-4"></div>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex justify-between items-end border-b border-emerald-900/50 pb-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Platform Transaction Volume</span>
                <span className="text-lg font-mono text-emerald-300 font-bold">${fMny(transactionVolume)}</span>
              </div>

              <div className="flex justify-between items-end border-b border-emerald-900/50 pb-2">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Global Clout Fee Multiplier</span>
                <span className="text-lg font-mono text-emerald-300 font-bold">x{feeMultiplier}</span>
              </div>

              <div className="flex justify-between items-end border-b border-emerald-500/30 pb-2 bg-emerald-950/20 px-2 rounded-t-lg">
                <span className="text-[10px] text-emerald-400 uppercase font-black">Current Passive Revenue</span>
                <span className="text-xl font-mono text-emerald-400 font-black">${fMny(passivePayout)} <span className="text-[10px]">/mo</span></span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-[2px] bg-emerald-900/50"></div>
              <div className="text-[9px] text-emerald-500/60 uppercase font-black tracking-widest">System Status: Automated</div>
              <div className="flex-1 h-[2px] bg-emerald-900/50"></div>
            </div>
          </div>

          <button
            onClick={rBuyVault}
            disabled={pl.bag < 5000000}
            className="w-full py-4 bg-emerald-600/10 border border-emerald-600/50 disabled:bg-slate-900 disabled:opacity-30 text-emerald-400 font-black rounded-xl hover:bg-emerald-600 hover:text-white transition-all text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(16,185,129,0.1)]"
          >
            Construct Physical Alternative Asset Vault (-$5M)
          </button>

          <div className="text-[9px] text-slate-500 italic text-center px-4">
            "The marketplace is now a self-sustaining corporate entity. Manual inventory sourcing has been deprecated in favor of automated platform fees."
          </div>
        </div>
      </LabShell>
    );
  }

  // ─── PHASE D: THE COLLECTIBLE VAULT (MOGUL/PRESIDENT) ─────────────────────
  if (collectiblePhase === 'VAULT') {
    return (
      <div className="transition-all duration-500 rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.4)] border-purple-500/60">
        <LabShell hustleKey="vintage" t="BLUE-CHIP PHYSICAL STORAGE VAULT" c="purple" fontCls="font-hype" onHub={() => setTab('HUB')} tier={4}>
          <div className="flex flex-col gap-4 animate-fadeIn">
            <div className="bg-black/80 border-2 border-yellow-500/50 p-5 rounded-2xl text-center shadow-[inset_0_0_20px_rgba(234,179,8,0.2)]">
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-yellow-500 to-purple-400 font-hype tracking-widest uppercase">The Sovereign Vault</h3>
              <p className="text-[10px] text-slate-300 mt-1 font-medium italic">"Physical artifacts of absolute economic dominance. 12% Annual Appreciation."</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {vaultAssetsData.map((asset, i) => {
                const owned = vaultHoldings.some(h => h.name === asset.name);
                return (
                  <button
                    key={i}
                    onClick={() => rBuyVaultAsset(asset)}
                    disabled={owned || pl.bag < asset.cost}
                    className={`p-4 bg-black/60 border ${owned ? 'border-green-500/50' : 'border-purple-500/30'} rounded-xl flex justify-between items-center transition-all group hover:border-yellow-500/50 disabled:opacity-50`}
                  >
                    <div className="text-left">
                      <div className={`font-bold text-xs ${owned ? 'text-green-400' : 'text-purple-400'} uppercase tracking-widest`}>{owned ? '✓ ' : ''}{asset.name}</div>
                      <div className="text-[9px] text-slate-400 mt-1">Grants +{asset.aura} Aura Upon Acquisition</div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-yellow-500 font-black text-sm">${fMny(asset.cost)}</span>
                      <span className="text-[8px] text-slate-500 uppercase font-bold">Secure Asset</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-900/80 border border-purple-500/40 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-purple-400 font-black uppercase tracking-widest">Vault Holdings</span>
                <span className="text-[10px] text-slate-500 font-mono">{vaultHoldings.length} RELICS</span>
              </div>
              <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                {vaultHoldings.length === 0 ? (
                  <div className="text-[10px] text-slate-600 italic text-center py-2">No physical assets secured in vault.</div>
                ) : (
                  vaultHoldings.map((h, idx) => (
                    <div key={idx} className="flex justify-between items-center border-b border-purple-900/30 pb-1">
                      <span className="text-[10px] text-slate-200">{h.name}</span>
                      <span className="text-[10px] text-yellow-500/80 font-mono">${fMny(h.cost)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <FlashBtn
              onClick={rVaultAuction}
              costStm={20}
              dis={pl.bag < 500000}
              label="ATTEND ELITE UNDERGROUND AUCTION (-$500K)"
              color="purple-600"
              txt="white"
            />
          </div>
        </LabShell>
      </div>
    );
  }

  return null;
};
