import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameStats, TierHistoryEntry, PlayerStats } from '../store/types';
import { FLEX_ASSETS } from '../config/flexAssets';

interface StatsDashboardProps {
  stats: GameStats;
  flexAssets: PlayerStats['flexAssets'];
  onClose: () => void;
  monthsPlayed: number;
  deathBadge?: string | null;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats, flexAssets, onClose, monthsPlayed, deathBadge }) => {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const successRate = stats.totalHustles > 0
    ? Math.round((stats.successfulHustles / stats.totalHustles) * 100)
    : 0;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-900 flex justify-between items-center shrink-0">
          <h2 className="text-xl font-black uppercase tracking-tighter text-emerald-400">OPERATIONAL INTEL DASHBOARD</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 scrollbar-none">
          {/* Death Badge (if applicable) */}
          {deathBadge && (
            <section className="animate-in fade-in slide-in-from-top-4 duration-700">
              <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-4">POST-MORTEM STATUS</h3>
              <div className="bg-red-950/20 border-2 border-red-900/40 p-6 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-[9px] text-red-400 font-bold uppercase tracking-widest mb-1">Final Reputation</div>
                  <div className="text-3xl font-black text-white italic tracking-tighter uppercase">💀 {deathBadge}</div>
                </div>
                <div className="text-4xl grayscale opacity-50">⚰️</div>
              </div>
            </section>
          )}

          {/* Career Overview */}
          <section>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">CAREER OVERVIEW</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <StatCard label="Lifetime Earnings" value={`$${stats.lifetimeEarnings.toLocaleString()}`} color="text-emerald-400" />
              <StatCard label="Total Hustles" value={stats.totalHustles.toLocaleString()} />
              <StatCard label="Success Rate" value={`${successRate}%`} />
              <StatCard label="Highest Streak" value={stats.highestStreak.toString()} color="text-orange-400" />
              <StatCard label="Time Played" value={`${monthsPlayed} MO`} />
            </div>
          </section>

          {/* Tier Milestones */}
          <section>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">TIER MILESTONES</h3>
            <div className="flex flex-wrap gap-2">
              {Object.keys(stats.tierHistory).map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 rounded text-xs font-bold uppercase tracking-widest hover:border-emerald-500 hover:bg-slate-800 transition-all active:scale-95"
                >
                  {tier}
                </button>
              ))}
            </div>
          </section>

          {/* Flex Assets */}
          <section>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">FLEX ASSETS OWNED</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FLEX_ASSETS.map(asset => {
                const count = flexAssets[asset.id] || 0;
                return (
                  <StatCard
                    key={asset.id}
                    label={asset.name}
                    value={count.toString()}
                    color={count > 0 ? "text-orange-400" : "text-slate-500"}
                  />
                );
              })}
            </div>
          </section>

          {/* Crisis History */}
          <section>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">CRISIS HISTORY</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <StatCard label="Shadowbans" value={stats.crisisCounts.shadowbans.toString()} color={stats.crisisCounts.shadowbans > 0 ? "text-red-500" : "text-slate-500"} />
              <StatCard label="Blacklists" value={stats.crisisCounts.blacklists.toString()} color={stats.crisisCounts.blacklists > 0 ? "text-red-500" : "text-slate-500"} />
              <StatCard label="Strikes" value={stats.crisisCounts.strikes.toString()} color={stats.crisisCounts.strikes > 0 ? "text-red-500" : "text-slate-500"} />
              <StatCard label="Frozen" value={stats.crisisCounts.frozen.toString()} color={stats.crisisCounts.frozen > 0 ? "text-red-500" : "text-slate-500"} />
            </div>
          </section>

          {/* Achievements */}
          <section>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">ACHIEVEMENTS</h3>
            <div className="flex flex-wrap gap-2">
              {stats.unlockedAchievements.length > 0 ? (
                stats.unlockedAchievements.map(ach => (
                  <div key={ach} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                    🏆 {ach}
                  </div>
                ))
              ) : (
                <div className="text-[10px] text-slate-600 italic">No achievements unlocked yet...</div>
              )}
            </div>
          </section>
        </div>
      </motion.div>

      {/* Tier Detail Modal */}
      <AnimatePresence>
        {selectedTier && (
          <TierDetailModal
            tier={selectedTier}
            data={stats.tierHistory[selectedTier]}
            onClose={() => setSelectedTier(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard = ({ label, value, color = "text-white" }: { label: string; value: string; color?: string }) => (
  <div className="bg-slate-900/50 border border-slate-900 p-4 rounded-xl">
    <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</div>
    <div className={`text-lg font-black font-mono ${color}`}>{value}</div>
  </div>
);

const TierDetailModal = ({ tier, data, onClose }: { tier: string; data: TierHistoryEntry; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="fixed inset-0 z-[1100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-slate-950 border-2 border-emerald-500/50 rounded-2xl w-full max-w-lg max-h-[80vh] flex flex-col shadow-[0_0_50px_rgba(16,185,129,0.2)]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-900 flex justify-between items-center shrink-0">
          <div className="flex flex-col">
            <h2 className="text-xl font-black uppercase tracking-tighter text-emerald-400">TIER INTEL: {tier}</h2>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">REACHED AT MONTH {data.reachedAtMonth}</span>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 scrollbar-none">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-slate-900 rounded-lg">
              <div className="text-[8px] text-slate-500 font-bold mb-1 uppercase">CASH FLOW</div>
              <div className="text-sm font-black text-emerald-400 font-mono">${data.cashEarned.toLocaleString()}</div>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg">
              <div className="text-[8px] text-slate-500 font-bold mb-1 uppercase">CLOUT Δ</div>
              <div className="text-sm font-black text-blue-400 font-mono">+{data.cloutDelta}</div>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg">
              <div className="text-[8px] text-slate-500 font-bold mb-1 uppercase">AURA Δ</div>
              <div className="text-sm font-black text-purple-400 font-mono">+{data.auraDelta}</div>
            </div>
          </div>

          <section>
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">OPERATIONS EXECUTED</h3>
            <div className="bg-slate-900 rounded-xl divide-y divide-slate-800">
              {Object.entries(data.hustlesExecuted).length > 0 ? (
                Object.entries(data.hustlesExecuted).map(([id, count]) => (
                  <div key={id} className="p-3 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">{id}</span>
                    <span className="text-[10px] font-black text-emerald-400 font-mono">{count}X</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-[10px] text-slate-600 italic text-center">No operations recorded.</div>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">SYSTEM CRISES</h3>
            <div className="flex flex-wrap gap-2">
              {data.crises.length > 0 ? (
                data.crises.map((c, i) => (
                  <span key={i} className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[9px] font-black text-red-400 uppercase tracking-tighter">
                    {c}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-600 italic">No crises recorded.</span>
              )}
            </div>
          </section>

          <section>
            <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">FLEX ACQUISITIONS</h3>
            <div className="flex flex-wrap gap-2">
              {data.flexAssets.length > 0 ? (
                data.flexAssets.map((a, i) => (
                  <span key={i} className="px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-[9px] font-black text-orange-400 uppercase tracking-tighter">
                    {a}
                  </span>
                ))
              ) : (
                <span className="text-[10px] text-slate-600 italic">No assets acquired.</span>
              )}
            </div>
          </section>

          {data.milestone && (
            <div className="p-4 bg-emerald-500/5 border-l-4 border-emerald-500 rounded text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              KEY MILESTONE: {data.milestone}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
