import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { LineChart, Sparkles, TrendingUp, Info } from 'lucide-react';
import { EquityPoint } from '../types';
import { formatCurrency } from '../utils/calculations';

interface EquityCurveChartProps {
  equityPoints: EquityPoint[];
  startingBalance: number;
  maxDrawdownLimit: number;
}

export const EquityCurveChart: React.FC<EquityCurveChartProps> = ({
  equityPoints,
  startingBalance,
  maxDrawdownLimit,
}) => {
  const [viewMode, setViewMode] = useState<'balance' | 'pnl'>('balance');

  // Format data for chart
  const chartData = equityPoints.map((pt) => ({
    name: pt.index === 0 ? 'Start' : `T${pt.index}: ${pt.tradeName}`,
    balance: pt.balance,
    cumulativePnl: pt.cumulativePnl,
    peakBalance: pt.peakBalance,
    drawdownLine: pt.peakBalance - maxDrawdownLimit,
    drawdownAmount: pt.drawdown,
    tradePnl: pt.pnl,
    asset: pt.asset,
  }));

  const minBalance = Math.min(...chartData.map((d) => d.drawdownLine)) - 1000;
  const maxBalance = Math.max(...chartData.map((d) => d.peakBalance)) + 1000;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Feature Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Equity Curve & Peak-to-Trough Drawdown Depth
            </h2>
            <span className="text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded">
              Added Product Feature
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizing account trajectory against High Water Mark peak & maximum drawdown floor limit.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('balance')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'balance'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Balance ($)
          </button>
          <button
            onClick={() => setViewMode('pnl')}
            className={`px-3 py-1 rounded-lg font-medium transition-all ${
              viewMode === 'pnl'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cumulative P&L ($)
          </button>
        </div>
      </div>

      {/* Chart Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-3 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
          <span>Account Equity</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-amber-400 inline-block" />
          <span>Peak High Water Mark</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 border-t-2 border-dashed border-rose-500 inline-block" />
          <span>Max Drawdown Limit Floor</span>
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              domain={viewMode === 'balance' ? [minBalance, maxBalance] : ['auto', 'auto']}
              tickFormatter={(val) => (viewMode === 'balance' ? `$${(val / 1000).toFixed(0)}k` : `$${val}`)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-950 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs space-y-1 z-50">
                    <p className="font-bold text-white border-b border-slate-800 pb-1">{data.name}</p>
                    <div className="flex justify-between gap-4 text-slate-300">
                      <span>Account Balance:</span>
                      <strong className="font-mono text-emerald-400">{formatCurrency(data.balance)}</strong>
                    </div>
                    <div className="flex justify-between gap-4 text-slate-300">
                      <span>Trade Result:</span>
                      <strong className={`font-mono ${data.tradePnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {formatCurrency(data.tradePnl, true)}
                      </strong>
                    </div>
                    <div className="flex justify-between gap-4 text-slate-300">
                      <span>Drawdown from Peak:</span>
                      <strong className="font-mono text-amber-400">{formatCurrency(data.drawdownAmount)}</strong>
                    </div>
                    <div className="flex justify-between gap-4 text-slate-400 text-[11px] pt-1 border-t border-slate-800">
                      <span>Max Drawdown Floor:</span>
                      <span className="font-mono text-rose-400">{formatCurrency(data.drawdownLine)}</span>
                    </div>
                  </div>
                );
              }}
            />
            
            {/* Drawdown Limit Line */}
            <ReferenceLine
              y={viewMode === 'balance' ? startingBalance - maxDrawdownLimit : -maxDrawdownLimit}
              stroke="#ef4444"
              strokeDasharray="4 4"
              label={{
                value: 'BREACH LIMIT FLOOR',
                fill: '#ef4444',
                fontSize: 10,
                position: 'insideBottomRight',
              }}
            />

            {/* Starting Balance Line */}
            <ReferenceLine
              y={viewMode === 'balance' ? startingBalance : 0}
              stroke="#64748b"
              strokeDasharray="2 2"
            />

            {/* Main Area Curve */}
            <Area
              type="monotone"
              dataKey={viewMode === 'balance' ? 'balance' : 'cumulativePnl'}
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#equityGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Insight Footer */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
        <span>
          <strong>Why this matters:</strong> The curve highlights how close equity dips to the red breach floor. Staying well above the red line ensures the trader keeps their account active.
        </span>
      </div>
    </div>
  );
};
