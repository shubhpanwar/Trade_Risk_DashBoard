import React, { useState } from 'react';
import { X, Activity, AlertTriangle, ShieldCheck, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { RiskMetrics, AccountRules, Trade } from '../types';
import { calculateDashboardData, formatCurrency } from '../utils/calculations';

interface RiskSimulatorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTrades: Trade[];
  rules: AccountRules;
  onApplySimulatedTrade: (simulatedTrade: Trade) => void;
}

export const RiskSimulatorModal: React.FC<RiskSimulatorProps> = ({
  isOpen,
  onClose,
  currentTrades,
  rules,
  onApplySimulatedTrade,
}) => {
  const [simAsset, setSimAsset] = useState<string>('BTC');
  const [simDirection, setSimDirection] = useState<'Long' | 'Short'>('Short');
  const [simPnl, setSimPnl] = useState<number>(-2500);

  if (!isOpen) return null;

  // Create temporary trade array with simulated trade
  const simulatedTrade: Trade = {
    id: `sim-${Date.now()}`,
    asset: simAsset,
    type: simDirection,
    pnl: simPnl,
    timestamp: 'SIMULATED',
    dateStr: 'Pending Trade',
    notes: 'Simulated stress-test trade',
  };

  const currentResults = calculateDashboardData(currentTrades, rules);
  const simulatedResults = calculateDashboardData([...currentTrades, simulatedTrade], rules);

  const currRisk = currentResults.riskMetrics;
  const simRisk = simulatedResults.riskMetrics;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Trade Risk Stress Tester & Simulator</h3>
              <p className="text-xs text-slate-400">Test hypothetical trade outcomes before placing orders</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            1. Configure Hypothetical Pending Trade
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Asset</label>
              <select
                value={simAsset}
                onChange={(e) => setSimAsset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded px-3 py-2"
              >
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
                <option value="SOL">SOL</option>
                <option value="AVAX">AVAX</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Position Type</label>
              <select
                value={simDirection}
                onChange={(e) => setSimDirection(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white rounded px-3 py-2"
              >
                <option value="Long">Long</option>
                <option value="Short">Short</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Projected P&L ($)</label>
              <input
                type="number"
                step="100"
                value={simPnl}
                onChange={(e) => setSimPnl(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-800 text-xs text-white font-mono rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Quick preset sliders / buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-500 font-medium">Quick Sliders:</span>
            <button
              onClick={() => setSimPnl(-1000)}
              className="px-2.5 py-1 rounded bg-slate-900 text-rose-300 hover:bg-slate-800 border border-rose-500/30"
            >
              -$1,000 Loss
            </button>
            <button
              onClick={() => setSimPnl(-3500)}
              className="px-2.5 py-1 rounded bg-slate-900 text-rose-300 hover:bg-slate-800 border border-rose-500/30 font-bold"
            >
              -$3,500 Heavy Loss
            </button>
            <button
              onClick={() => setSimPnl(-5000)}
              className="px-2.5 py-1 rounded bg-slate-900 text-rose-400 hover:bg-slate-800 border border-rose-500/50 font-black"
            >
              -$5,000 Daily Limit Breach
            </button>
            <button
              onClick={() => setSimPnl(2500)}
              className="px-2.5 py-1 rounded bg-slate-900 text-emerald-300 hover:bg-slate-800 border border-emerald-500/30 font-bold"
            >
              +$2,500 Gain
            </button>
          </div>
        </div>

        {/* Comparison Result */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            2. Impact on Account Status & Risk Capacity
          </span>

          <div className="grid grid-cols-2 gap-4">
            
            {/* Before */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-500 block">Current Live Status</span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                  currRisk.riskLevel === 'Safe'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : currRisk.riskLevel === 'Approaching Limit'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {currRisk.riskLevel}
                </span>
              </div>
              <div className="text-xs space-y-1 font-mono text-slate-300 pt-1">
                <p>Balance: {formatCurrency(currRisk.currentBalance)}</p>
                <p>Rem. Drawdown: <span className="text-emerald-400">{formatCurrency(currRisk.remainingDrawdown)}</span></p>
                <p>Rem. Daily Loss: <span className="text-emerald-400">{formatCurrency(currRisk.remainingDailyLossLimit)}</span></p>
              </div>
            </div>

            {/* After Simulation */}
            <div className={`p-4 rounded-xl border space-y-2 ${
              simRisk.riskLevel === 'Safe'
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : simRisk.riskLevel === 'Approaching Limit'
                ? 'bg-amber-950/20 border-amber-500/40'
                : 'bg-rose-950/30 border-rose-500/50'
            }`}>
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Projected Post-Trade Status</span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-xs font-black ${
                  simRisk.riskLevel === 'Safe'
                    ? 'bg-emerald-500 text-slate-950'
                    : simRisk.riskLevel === 'Approaching Limit'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-rose-600 text-white animate-bounce'
                }`}>
                  {simRisk.riskLevel}
                </span>
              </div>
              <div className="text-xs space-y-1 font-mono text-slate-200 pt-1">
                <p>Balance: {formatCurrency(simRisk.currentBalance)}</p>
                <p>Rem. Drawdown: <span className={simRisk.remainingDrawdown < 3000 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{formatCurrency(simRisk.remainingDrawdown)}</span></p>
                <p>Rem. Daily Loss: <span className={simRisk.remainingDailyLossLimit < 1500 ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{formatCurrency(simRisk.remainingDailyLossLimit)}</span></p>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <p className="text-[11px] text-slate-500 max-w-xs">
            {simRisk.riskReason}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
            >
              Close Simulator
            </button>
            <button
              onClick={() => {
                onApplySimulatedTrade(simulatedTrade);
                onClose();
              }}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              Apply Trade to Live Dashboard
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
