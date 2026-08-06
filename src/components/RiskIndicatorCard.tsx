import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, Info, ArrowDownRight, Activity, Zap } from 'lucide-react';
import { RiskMetrics } from '../types';
import { formatCurrency } from '../utils/calculations';

interface RiskIndicatorProps {
  metrics: RiskMetrics;
  maxDrawdownLimit: number;
  dailyLossLimit: number;
}

export const RiskIndicatorCard: React.FC<RiskIndicatorProps> = ({
  metrics,
  maxDrawdownLimit,
  dailyLossLimit,
}) => {
  // Determine status color styling & badges
  let statusBadge = {
    bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    glow: 'shadow-emerald-500/20',
    icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
    label: 'Safe',
    subtext: 'Your account is in good standing with ample risk buffer.',
    accentColor: 'emerald',
  };

  if (metrics.riskLevel === 'Approaching Limit') {
    statusBadge = {
      bg: 'bg-amber-500/10 border-amber-500/40 text-amber-400',
      glow: 'shadow-amber-500/20',
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      label: 'Approaching Limit',
      subtext: 'Caution: You have consumed a significant portion of daily or total drawdown.',
      accentColor: 'amber',
    };
  } else if (metrics.riskLevel === 'At Risk') {
    statusBadge = {
      bg: 'bg-rose-500/15 border-rose-500/50 text-rose-400 animate-pulse',
      glow: 'shadow-rose-500/30',
      icon: <AlertOctagon className="w-5 h-5 text-rose-400" />,
      label: 'At Risk',
      subtext: 'CRITICAL: Account rules are heavily strained or close to breach limit!',
      accentColor: 'rose',
    };
  }

  // Calculate percentages for progress bars
  const drawdownUsedPercent = metrics.drawdownPercentageOfLimit;
  const dailyLossUsedPercent = metrics.dailyLossPercentageOfLimit;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
      {/* Background ambient glow based on risk */}
      <div
        className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 ${
          metrics.riskLevel === 'Safe'
            ? 'bg-emerald-500'
            : metrics.riskLevel === 'Approaching Limit'
            ? 'bg-amber-500'
            : 'bg-rose-600'
        }`}
      />

      {/* Header section with question headline and Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Rule Engine</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span className="text-xs text-slate-500 font-mono">Real-time Check</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-0.5">
            Am I in danger of violating my account rules?
          </h2>
        </div>

        {/* Dynamic Status Badge */}
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border font-bold text-sm shadow-lg transition-all ${statusBadge.bg} ${statusBadge.glow}`}>
          {statusBadge.icon}
          <div className="flex flex-col">
            <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider">Account Status</span>
            <span className="text-base leading-tight font-black">{statusBadge.label}</span>
          </div>
        </div>
      </div>

      {/* Status Reason Banner */}
      <div className={`mt-4 p-3 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
        metrics.riskLevel === 'Safe'
          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
          : metrics.riskLevel === 'Approaching Limit'
          ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
      }`}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <span>{metrics.riskReason}</span>
          <span className="block text-[11px] opacity-80 mt-0.5">
            Rule Parameters: Max Drawdown ${formatCurrency(maxDrawdownLimit)} • Daily Loss Limit ${formatCurrency(dailyLossLimit)}
          </span>
        </div>
      </div>

      {/* Grid of the 2 primary Risk Indicators: Drawdown & Daily Loss */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
        
        {/* 1. MAXIMUM DRAWDOWN INDICATOR */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                <ArrowDownRight className="w-4 h-4 text-slate-400" />
                Maximum Drawdown
              </span>
              <span className="text-xs font-mono text-slate-400">
                Limit: {formatCurrency(maxDrawdownLimit)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-3 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Current Drawdown</span>
                <p className={`text-xl font-black font-mono mt-0.5 ${metrics.currentDrawdown > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {formatCurrency(metrics.currentDrawdown)}
                </p>
                <span className="text-[10px] text-slate-500">From peak ({formatCurrency(metrics.peakBalance)})</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Remaining Drawdown</span>
                <p className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                  {formatCurrency(metrics.remainingDrawdown)}
                </p>
                <span className="text-[10px] text-emerald-500/90 font-medium">Safe buffer capacity</span>
              </div>
            </div>
          </div>

          {/* Progress Bar for Max Drawdown */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Used: {drawdownUsedPercent.toFixed(1)}%</span>
              <span>
                {metrics.remainingDrawdown > 0
                  ? `${formatCurrency(metrics.remainingDrawdown)} left`
                  : 'BREACHED'}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  drawdownUsedPercent >= 70
                    ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                    : drawdownUsedPercent >= 40
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.max(3, drawdownUsedPercent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* 2. DAILY LOSS LIMIT INDICATOR */}
        <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wide">
                <Activity className="w-4 h-4 text-slate-400" />
                Current Day's Loss
              </span>
              <span className="text-xs font-mono text-slate-400">
                Daily Limit: {formatCurrency(dailyLossLimit)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 my-3 pt-1">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Current Day's Loss</span>
                <p className={`text-xl font-black font-mono mt-0.5 ${metrics.currentDayLoss > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {formatCurrency(metrics.currentDayLoss)}
                </p>
                <span className="text-[10px] text-slate-500">Realized losses today</span>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Remaining Daily Loss</span>
                <p className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                  {formatCurrency(metrics.remainingDailyLossLimit)}
                </p>
                <span className="text-[10px] text-emerald-500/90 font-medium">Daily loss room left</span>
              </div>
            </div>
          </div>

          {/* Progress Bar for Daily Loss */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
              <span>Used: {dailyLossUsedPercent.toFixed(1)}%</span>
              <span>
                {metrics.remainingDailyLossLimit > 0
                  ? `${formatCurrency(metrics.remainingDailyLossLimit)} left`
                  : 'BREACHED'}
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  dailyLossUsedPercent >= 70
                    ? 'bg-rose-500 shadow-sm shadow-rose-500/50'
                    : dailyLossUsedPercent >= 40
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
                style={{ width: `${Math.max(3, dailyLossUsedPercent)}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Quick Trader Action Tip */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-medium text-slate-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Recommended Risk Advice:
        </span>
        <span className="font-mono text-slate-300">
          Max risk per trade limit: <strong className="text-emerald-400">${Math.round(metrics.remainingDailyLossLimit * 0.3).toLocaleString()}</strong> (30% of daily buffer)
        </span>
      </div>
    </div>
  );
};
