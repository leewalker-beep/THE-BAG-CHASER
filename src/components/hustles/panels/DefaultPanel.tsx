import { MASTER_HUSTLE_REGISTRY } from '../../../engine/hustleRegistry';
import type { PanelProps } from './types';

export function DefaultPanel({ hustleId, onBack, state, onExecute }: PanelProps) {
  const config = MASTER_HUSTLE_REGISTRY.find(h => h.id === hustleId);
  const currentLvl = state.pl.hustleLevels[hustleId] || 1;

  const getRankInfo = (id: string, lvl: number) => {
    if (id === 'drop') {
      if (lvl === 1) return { title: "Trunk Phase: Viral Ad Tester", nextCost: 4000 };
      if (lvl === 2) return { title: "Store Phase: Private Wholesaler", nextCost: 12000 };
      return { title: "Chain Phase: Global E-Com Empire", nextCost: null };
    }
    if (id === 'techFlip' || id === 'tech_flip') {
      if (lvl === 1) return { title: "Trunk Phase: Bedroom Repair Bench", nextCost: 2500 };
      if (lvl === 2) return { title: "Store Phase: Strip-Mall Kiosk", nextCost: 8500 };
      return { title: "Chain Phase: Automated Refurb Plant", nextCost: null };
    }
    if (id === 'vintage') {
      if (lvl === 1) return { title: "Trunk Phase: Thrift Rack Hunter", nextCost: 2000 };
      if (lvl === 2) return { title: "Store Phase: Consignment Boutique", nextCost: 7000 };
      return { title: "Chain Phase: The Luxury Grail Archive", nextCost: null };
    }
    return null;
  };

  const getHustleMetrics = (id: string) => {
    const { streetStats, startupStats } = state.pl;
    switch (id) {
      case 'cc': return `Subscribers: ${streetStats.ccSubs.toLocaleString()}`;
      case 'pod': return `Episodes: ${streetStats.podEpisodes}`;
      case 'audio': return `Active Tracks: ${state.pl.assetsOwned.masterTracks}`;
      case 'drip': return `Inventory: ${streetStats.dripStock}`;
      case 'meme': return `Active Tokens: ${streetStats.activeMemeTokens}`;
      case 'saas_mvp': return `Active Users: ${startupStats.saasUsers.toLocaleString()}`;
      case 'agency_scale': return `Agency Staff: ${startupStats.agencyStaff}`;
      case 'ecom_brand': return `Monthly Orders: ${startupStats.ecomOrders.toLocaleString()}`;
      default: return null;
    }
  };

  if (!config) return <div className="text-red-500">Hustle Config Not Found</div>;

  const metrics = getHustleMetrics(hustleId);
  const rankInfo = getRankInfo(hustleId, currentLvl);
  const isStartupHustle = config.tier === 'STARTUP';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-500 hover:text-white flex items-center gap-1 transition-colors">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
          {isStartupHustle ? 'Back to Startup Operations' : 'Back to Operations Panel'}
        </button>
        <div className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          OPERATIONAL MODE
        </div>
      </div>

      <div>
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">{config.name}</h2>
            <p className="text-xs text-slate-500 mt-1">{config.description}</p>
          </div>
          {rankInfo && (
            <div className="text-right">
              <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Operation Rank</div>
              <div className="text-xs font-bold text-white italic">Level {currentLvl}: {rankInfo.title}</div>
            </div>
          )}
        </div>
      </div>

      {metrics && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
           <div className="text-[10px] font-black text-emerald-500 uppercase mb-1 tracking-widest">Status Metrics</div>
           <div className="text-lg font-black text-white">{metrics}</div>
        </div>
      )}

      <div className="bg-black/50 border border-slate-800 rounded-xl p-4">
        <div className="text-[10px] font-black text-slate-600 uppercase mb-4 tracking-[0.2em]">Operating Controls</div>
        <div className="grid grid-cols-1 gap-4">
           <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-400">Operational Level</span>
              <span className="text-xs font-mono text-blue-400">LVL {currentLvl}</span>
           </div>
           <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-400">Yield Optimization</span>
              <span className="text-xs font-mono text-emerald-400">
                {hustleId === 'drop' && currentLvl === 1 && '1.0x (BASE)'}
                {hustleId === 'drop' && currentLvl === 2 && '1.8x (PRO)'}
                {hustleId === 'drop' && currentLvl === 3 && '3.5x (ELITE)'}
                {hustleId === 'techFlip' && currentLvl === 1 && '1.0x (BASE)'}
                {hustleId === 'techFlip' && currentLvl === 2 && '2.0x (PRO)'}
                {hustleId === 'techFlip' && currentLvl === 3 && '4.0x (ELITE)'}
                {hustleId === 'vintage' && currentLvl === 1 && '1.0x (BASE)'}
                {hustleId === 'vintage' && currentLvl === 2 && '2.2x (PRO)'}
                {hustleId === 'vintage' && currentLvl === 3 && 'AURA FOCUS'}
                {!['drop', 'techFlip', 'vintage'].includes(hustleId) && '1.0x (BASE)'}
              </span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400">Risk Mitigation</span>
              <span className="text-xs font-mono text-emerald-400 italic">
                {hustleId.startsWith('r_') ? 'SAFE HAVEN: 100% SUCCESS' : '0% (AUTO)'}
              </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rankInfo && (
          <button
            onClick={() => state.upgradeHustle(hustleId)}
            disabled={rankInfo.nextCost === null || state.pl.bag < rankInfo.nextCost}
            className="py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-20 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] border border-blue-400/30"
          >
            {rankInfo.nextCost === null
              ? "MAX RANK REACHED"
              : `UPGRADE OPERATION BUSINESS RANK ($${rankInfo.nextCost.toLocaleString()})`}
          </button>
        )}
        <button
          onClick={() => onExecute(hustleId)}
          className={`${rankInfo ? '' : 'md:col-span-2'} py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-emerald-900/20 active:scale-[0.98]`}
        >
          {hustleId === 'audio'
            ? (state.pl.streetStats.studioOwned ? 'Produce Master Track (-$500)' : `Establish ${config.name} (-$${config.upfrontCost.toLocaleString()})`)
            : `Execute ${config.name} for the Month`}
        </button>
      </div>
    </div>
  );
}
