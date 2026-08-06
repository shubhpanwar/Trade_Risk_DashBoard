import React from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, ShieldAlert, Calendar } from 'lucide-react';
import { RiskMetrics } from '../types';
import { formatCurrency, formatPercent } from '../utils/calculations';

interface AccountOverviewProps {
  metrics: RiskMetrics;
  startingBalance: number;
  maxDrawdownLimit: number;
  dailyLossLimit: number;
}

export const AccountOverviewCard: React.FC<AccountOverviewProps> = ({
  metrics,
  startingBalance,
  maxDrawdownLimit,
  dailyLossLimit,
}) => {
  const isProfitable = metrics.totalPnl >= 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-300">Account Summary</h2>
            <p className="text-xs text-slate-500">Evaluation Phase 1 • $100K Account</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Peak Balance</span>
          <p className="text-sm font-mono font-bold text-slate-200">{formatCurrency(metrics.peakBalance)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Starting Balance */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-slate-500" />
            Starting Balance
          </span>
          <p className="text-xl font-bold font-mono text-slate-200 mt-1">
            {formatCurrency(startingBalance)}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Baseline Evaluation</span>
        </div>

        {/* Current Balance */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-emerald-500/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Wallet className="w-3.5 h-3.5 text-emerald-400" />
            Current Balance
          </span>
          <p className="text-2xl font-black font-mono text-emerald-400 mt-1">
            {formatCurrency(metrics.currentBalance)}
          </p>
          <span className="text-[11px] text-emerald-500/80 mt-0.5 block font-medium">Derived from trade P&L</span>
        </div>

        {/* Total P&L */}
        <div className={`bg-slate-950/60 p-3.5 rounded-xl border ${isProfitable ? 'border-emerald-500/30' : 'border-rose-500/30'}`}>
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            {isProfitable ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
            )}
            Total Net P&L
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <p className={`text-xl font-bold font-mono ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatCurrency(metrics.totalPnl, true)}
            </p>
            <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isProfitable ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {formatPercent(metrics.pnlPercentage)}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Net Return on Account</span>
        </div>

        {/* Maximum Drawdown Limit */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            Max Drawdown Limit
          </span>
          <p className="text-xl font-bold font-mono text-slate-200 mt-1">
            {formatCurrency(maxDrawdownLimit)}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">10.0% Hard Breach Threshold</span>
        </div>

        {/* Daily Loss Limit */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            Daily Loss Limit
          </span>
          <p className="text-xl font-bold font-mono text-slate-200 mt-1">
            {formatCurrency(dailyLossLimit)}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">5.0% Daily Reset Threshold</span>
        </div>

      </div>
    </div>
  );
};
