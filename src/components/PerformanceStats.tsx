import React from 'react';
import { Award, Trophy, TrendingDown, Target, Percent, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { PerformanceMetrics } from '../types';
import { formatCurrency } from '../utils/calculations';

interface PerformanceStatsProps {
  metrics: PerformanceMetrics;
}

export const PerformanceStatsCard: React.FC<PerformanceStatsProps> = ({ metrics }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-300">Trading Performance</h2>
              <p className="text-xs text-slate-500">Derived from trade execution history</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-slate-400">
            {metrics.totalTrades} Executed Trades
          </span>
        </div>

        {/* Win Rate Ring & Trade Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          
          {/* Win Rate Box */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col items-center justify-center text-center">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-indigo-400" />
              Win Rate
            </span>
            <p className="text-3xl font-black font-mono text-indigo-400 my-1">
              {metrics.winRate.toFixed(1)}%
            </p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${metrics.winRate}%` }}
              />
            </div>
          </div>

          {/* Winning Trades */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-emerald-500/20">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
              Winning Trades
            </span>
            <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
              {metrics.winningTradesCount} <span className="text-xs font-normal text-slate-500">trades</span>
            </p>
            <span className="text-[11px] text-slate-500 block mt-1">
              Avg Win: <strong className="text-emerald-400">{formatCurrency(metrics.averageWin)}</strong>
            </span>
          </div>

          {/* Losing Trades */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-rose-500/20">
            <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
              Losing Trades
            </span>
            <p className="text-2xl font-bold font-mono text-rose-400 mt-1">
              {metrics.losingTradesCount} <span className="text-xs font-normal text-slate-500">trades</span>
            </p>
            <span className="text-[11px] text-slate-500 block mt-1">
              Avg Loss: <strong className="text-rose-400">-{formatCurrency(metrics.averageLoss)}</strong>
            </span>
          </div>

        </div>

        {/* Largest Win / Largest Loss */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          
          {/* Largest Winning Trade */}
          <div className="bg-gradient-to-br from-slate-950 to-emerald-950/20 p-3.5 rounded-xl border border-emerald-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Largest Winning Trade
              </span>
              {metrics.largestWinningTrade && (
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {metrics.largestWinningTrade.asset} {metrics.largestWinningTrade.type}
                </span>
              )}
            </div>
            <p className="text-xl font-bold font-mono text-emerald-400 mt-2">
              {metrics.largestWinningTrade ? formatCurrency(metrics.largestWinningTrade.pnl, true) : '$0'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {metrics.largestWinningTrade?.notes || 'Highest single trade profit'}
            </p>
          </div>

          {/* Largest Losing Trade */}
          <div className="bg-gradient-to-br from-slate-950 to-rose-950/20 p-3.5 rounded-xl border border-rose-500/20">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                Largest Losing Trade
              </span>
              {metrics.largestLosingTrade && (
                <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  {metrics.largestLosingTrade.asset} {metrics.largestLosingTrade.type}
                </span>
              )}
            </div>
            <p className="text-xl font-bold font-mono text-rose-400 mt-2">
              {metrics.largestLosingTrade ? formatCurrency(metrics.largestLosingTrade.pnl) : '$0'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
              {metrics.largestLosingTrade?.notes || 'Largest single trade loss'}
            </p>
          </div>

        </div>
      </div>

      {/* Profit Factor & Risk-to-Reward Ratio */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1">
          <Target className="w-3.5 h-3.5 text-indigo-400" />
          Profit Factor (Avg Win / Loss):
        </span>
        <span className="font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
          {metrics.profitFactor.toFixed(2)} : 1
        </span>
      </div>
    </div>
  );
};
