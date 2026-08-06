import React from 'react';
import { Layers, Coins, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { AssetPerformance } from '../types';
import { formatCurrency } from '../utils/calculations';

interface AssetBreakdownProps {
  assets: AssetPerformance[];
}

export const AssetBreakdownCard: React.FC<AssetBreakdownProps> = ({ assets }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-300">Performance by Asset</h2>
            <p className="text-xs text-slate-500">Net P&L and win rate grouped by asset</p>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-mono">{assets.length} Active Cryptos</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {assets.map((item) => {
          const isProfitable = item.totalPnl >= 0;
          return (
            <div
              key={item.asset}
              className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-extrabold text-white text-base flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal-400 inline-block" />
                  {item.asset}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {item.tradeCount} {item.tradeCount === 1 ? 'Trade' : 'Trades'}
                </span>
              </div>

              <div className="my-1">
                <span className="text-[11px] text-slate-500">Asset Net P&L</span>
                <p className={`text-xl font-bold font-mono ${isProfitable ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {formatCurrency(item.totalPnl, true)}
                </p>
              </div>

              {/* Win rate progress */}
              <div className="mt-2 pt-2 border-t border-slate-900">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span>Win Rate</span>
                  <span className="font-mono font-bold text-slate-300">{item.winRate.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-teal-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${item.winRate}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
