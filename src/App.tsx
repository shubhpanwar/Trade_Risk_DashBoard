import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { AccountOverviewCard } from './components/AccountOverviewCard';
import { RiskIndicatorCard } from './components/RiskIndicatorCard';
import { PerformanceStatsCard } from './components/PerformanceStats';
import { EquityCurveChart } from './components/EquityCurveChart';
import { AssetBreakdownCard } from './components/AssetBreakdownCard';
import { TradeLogTable } from './components/TradeLog';
import { RiskSimulatorModal } from './components/RiskSimulatorModal';
import { ReadmeModal } from './components/ReadmeModal';

import { INITIAL_RULES, DEFAULT_TRADES, PRESET_SCENARIOS } from './data/initialData';
import { Trade, AccountRules } from './types';
import { calculateDashboardData } from './utils/calculations';
import { AlertOctagon, HelpCircle, Activity } from 'lucide-react';

export default function App() {
  const [rules, setRules] = useState<AccountRules>(INITIAL_RULES);
  const [trades, setTrades] = useState<Trade[]>(DEFAULT_TRADES);
  const [activePreset, setActivePreset] = useState<string>('default');

  // Modals state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState<boolean>(false);
  const [isReadmeOpen, setIsReadmeOpen] = useState<boolean>(false);

  // Derived dashboard data calculation
  const dashboardData = useMemo(() => {
    return calculateDashboardData(trades, rules);
  }, [trades, rules]);

  const { riskMetrics, performanceMetrics, assetPerformance, equityPoints } = dashboardData;

  // Preset scenarios handler
  const handleSelectPreset = (presetKey: keyof typeof PRESET_SCENARIOS) => {
    setActivePreset(presetKey);
    setTrades(PRESET_SCENARIOS[presetKey].trades);
  };

  // Add trade handler
  const handleAddTrade = (newTradeData: Omit<Trade, 'id' | 'timestamp' | 'dateStr'>) => {
    const newTrade: Trade = {
      ...newTradeData,
      id: `trade-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      dateStr: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    };
    setTrades((prev) => [...prev, newTrade]);
    setActivePreset('custom');
  };

  // Delete trade handler
  const handleDeleteTrade = (id: string) => {
    setTrades((prev) => prev.filter((t) => t.id !== id));
    setActivePreset('custom');
  };

  // Reset handler
  const handleResetTrades = () => {
    setTrades(DEFAULT_TRADES);
    setActivePreset('default');
  };

  // Apply simulated trade
  const handleApplySimulatedTrade = (simTrade: Trade) => {
    setTrades((prev) => [...prev, simTrade]);
    setActivePreset('custom');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        onOpenReadme={() => setIsReadmeOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onResetTrades={handleResetTrades}
        activePreset={activePreset}
        tradeCount={trades.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Warning Alert Banner (Only when Approaching Limit or At Risk) */}
        {riskMetrics.riskLevel !== 'Safe' && (
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-4 shadow-lg ${
            riskMetrics.riskLevel === 'At Risk'
              ? 'bg-rose-950/40 border-rose-500/50 text-rose-200'
              : 'bg-amber-950/40 border-amber-500/50 text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <AlertOctagon className="w-6 h-6 shrink-0 animate-bounce" />
              <div>
                <h3 className="font-bold text-sm uppercase tracking-wider">
                  Account Rule Risk Warning: {riskMetrics.riskLevel}
                </h3>
                <p className="text-xs opacity-90">{riskMetrics.riskReason}</p>
              </div>
            </div>
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold whitespace-nowrap hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Open Simulator
            </button>
          </div>
        )}

        {/* 1. Account Summary Metrics Cards */}
        <AccountOverviewCard
          metrics={riskMetrics}
          startingBalance={rules.startingBalance}
          maxDrawdownLimit={rules.maxDrawdownLimit}
          dailyLossLimit={rules.dailyLossLimit}
        />

        {/* 2. THE IMPORTANT PART: Am I in danger of violating my account rules? */}
        <RiskIndicatorCard
          metrics={riskMetrics}
          maxDrawdownLimit={rules.maxDrawdownLimit}
          dailyLossLimit={rules.dailyLossLimit}
        />

        {/* 3. Added Feature: Equity Curve & Drawdown Depth Visualizer */}
        <EquityCurveChart
          equityPoints={equityPoints}
          startingBalance={rules.startingBalance}
          maxDrawdownLimit={rules.maxDrawdownLimit}
        />

        {/* 4. Trading Performance Stats & Asset Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceStatsCard metrics={performanceMetrics} />
          <AssetBreakdownCard assets={assetPerformance} />
        </div>

        {/* 5. Trade History Log */}
        <TradeLogTable
          trades={trades}
          onAddTrade={handleAddTrade}
          onDeleteTrade={handleDeleteTrade}
          onResetTrades={handleResetTrades}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">TRADESCAPE</span>
            <span>• Evaluation Trader Risk Dashboard</span>
          </div>
          <button
            onClick={() => setIsReadmeOpen(true)}
            className="text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Read Submission Documentation & Q&A</span>
          </button>
        </div>
      </footer>

      {/* Modals */}
      <RiskSimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        currentTrades={trades}
        rules={rules}
        onApplySimulatedTrade={handleApplySimulatedTrade}
      />

      <ReadmeModal
        isOpen={isReadmeOpen}
        onClose={() => setIsReadmeOpen(false)}
      />

    </div>
  );
}
