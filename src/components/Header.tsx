import React, { useState, useEffect } from 'react';
import { ShieldCheck, TrendingUp, HelpCircle, Activity, RotateCcw, AlertTriangle, Layers } from 'lucide-react';
import { PRESET_SCENARIOS } from '../data/initialData';
import { Trade } from '../types';

interface HeaderProps {
  onSelectPreset: (presetKey: keyof typeof PRESET_SCENARIOS) => void;
  onOpenReadme: () => void;
  onOpenSimulator: () => void;
  onResetTrades: () => void;
  activePreset: string;
  tradeCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onOpenReadme,
  onOpenSimulator,
  onResetTrades,
  activePreset,
  tradeCount,
}) => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white">TRADESCAPE</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Evaluation Dashboard
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">Trader Risk & Performance Analytics</p>
          </div>
        </div>

        {/* Live Clock & Preset Scenarios */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-400 font-mono">{time || '12:00:00'} UTC</span>
          </div>

          {/* Quick Scenario Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400 px-2 font-medium">Scenario:</span>
            <button
              onClick={() => onSelectPreset('default')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                activePreset === 'default'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Default (Safe)
            </button>
            <button
              onClick={() => onSelectPreset('approachingLimit')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                activePreset === 'approachingLimit'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Approaching
            </button>
            <button
              onClick={() => onSelectPreset('atRisk')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                activePreset === 'atRisk'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              At Risk
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Simulator button */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 transition-all text-xs font-semibold cursor-pointer"
            title="Simulate a new trade or loss to stress test risk limits"
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Stress Test</span> Simulator
          </button>

          {/* Reset Trades button */}
          <button
            onClick={onResetTrades}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
            title="Reset to default 5 Tradescape assignment trades"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Assignment README / Q&A Modal Trigger */}
          <button
            onClick={onOpenReadme}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 transition-all text-xs font-semibold cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Product Q&A & README</span>
            <span className="sm:hidden">Q&A</span>
          </button>
        </div>

      </div>
    </header>
  );
};
