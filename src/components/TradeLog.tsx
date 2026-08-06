import React, { useState } from 'react';
import { ListFilter, Plus, Trash2, ArrowUpRight, ArrowDownRight, Search, RotateCcw } from 'lucide-react';
import { Trade } from '../types';
import { formatCurrency } from '../utils/calculations';

interface TradeLogProps {
  trades: Trade[];
  onAddTrade: (trade: Omit<Trade, 'id' | 'timestamp' | 'dateStr'>) => void;
  onDeleteTrade: (id: string) => void;
  onResetTrades: () => void;
}

export const TradeLogTable: React.FC<TradeLogProps> = ({
  trades,
  onAddTrade,
  onDeleteTrade,
  onResetTrades,
}) => {
  const [filterAsset, setFilterAsset] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<'ALL' | 'WIN' | 'LOSS'>('ALL');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  // New trade form state
  const [newAsset, setNewAsset] = useState<string>('BTC');
  const [newDirection, setNewDirection] = useState<'Long' | 'Short'>('Long');
  const [newPnl, setNewPnl] = useState<string>('');
  const [newNotes, setNewNotes] = useState<string>('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pnlVal = parseFloat(newPnl);
    if (isNaN(pnlVal)) return;

    onAddTrade({
      asset: newAsset,
      type: newDirection,
      pnl: pnlVal,
      notes: newNotes || 'Manual trade entry',
    });

    setNewPnl('');
    setNewNotes('');
    setShowAddForm(false);
  };

  // Filter trades
  const filteredTrades = trades.filter((t) => {
    if (filterAsset !== 'ALL' && t.asset !== filterAsset) return false;
    if (filterType === 'WIN' && t.pnl <= 0) return false;
    if (filterType === 'LOSS' && t.pnl >= 0) return false;
    return true;
  });

  const uniqueAssets = Array.from(new Set(trades.map((t) => t.asset)));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
      
      {/* Table Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-300 flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-emerald-400" />
            Trade History Log
          </h2>
          <p className="text-xs text-slate-500">Live derived data feed of completed executions</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Asset filter */}
          <select
            value={filterAsset}
            onChange={(e) => setFilterAsset(e.target.value)}
            className="bg-slate-950 text-slate-300 text-xs rounded-lg border border-slate-800 px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Assets</option>
            {uniqueAssets.map((asset) => (
              <option key={asset} value={asset}>
                {asset}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-slate-950 text-slate-300 text-xs rounded-lg border border-slate-800 px-3 py-1.5 focus:outline-none focus:border-emerald-500"
          >
            <option value="ALL">All Outcomes</option>
            <option value="WIN">Winning Trades</option>
            <option value="LOSS">Losing Trades</option>
          </select>

          {/* Add Trade toggle */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Trade</span>
          </button>
        </div>
      </div>

      {/* Add Trade Form Drawer */}
      {showAddForm && (
        <form onSubmit={handleFormSubmit} className="bg-slate-950 border border-slate-800 p-4 rounded-xl mb-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-white uppercase">Record New Trade Execution</span>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-500 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Asset</label>
              <select
                value={newAsset}
                onChange={(e) => setNewAsset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="SOL">SOL</option>
                <option value="AVAX">AVAX</option>
                <option value="NEAR">NEAR</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Direction</label>
              <select
                value={newDirection}
                onChange={(e) => setNewDirection(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              >
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Profit / Loss ($)</label>
              <input
                type="number"
                placeholder="e.g. 1500 or -800"
                value={newPnl}
                onChange={(e) => setNewPnl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Execution Notes</label>
              <input
                type="text"
                placeholder="Optional strategy note"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-1.5 rounded-lg hover:bg-emerald-400 transition-all cursor-pointer"
            >
              Save & Recalculate Dashboard
            </button>
          </div>
        </form>
      )}

      {/* Trades Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-2.5 px-3">Trade #</th>
              <th className="py-2.5 px-3">Asset</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3 text-right">P&L ($)</th>
              <th className="py-2.5 px-3">Strategy Notes</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {filteredTrades.map((t, idx) => {
              const isWin = t.pnl > 0;
              return (
                <tr key={t.id} className="hover:bg-slate-950/50 transition-colors group">
                  <td className="py-3 px-3 text-slate-400 font-sans font-medium">#{idx + 1}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {t.asset}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded text-[11px] ${
                        t.type === 'Long'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      {t.type === 'Long' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{t.dateStr || t.timestamp}</td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-bold font-mono text-sm ${
                        isWin ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatCurrency(t.pnl, true)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 font-sans max-w-xs truncate">
                    {t.notes || '-'}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={() => onDeleteTrade(t.id)}
                      className="text-slate-600 hover:text-rose-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="Delete trade"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}

            {filteredTrades.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                  No trades found matching current filter criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer controls */}
      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <span>Showing {filteredTrades.length} of {trades.length} trades</span>
        <button
          onClick={onResetTrades}
          className="flex items-center gap-1 text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset to default dataset</span>
        </button>
      </div>

    </div>
  );
};
