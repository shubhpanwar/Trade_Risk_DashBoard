import React from 'react';
import { X, HelpCircle, Sparkles, BookOpen, CheckCircle2, Code2, ShieldAlert, Cpu } from 'lucide-react';

interface ReadmeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReadmeModal: React.FC<ReadmeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto relative text-slate-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Tradescape — Assignment Documentation & Q&A</h2>
              <p className="text-xs text-slate-400">Full Stack Developer Assignment Submission</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Section 1: What I Built & Product Decision */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            Product Decision & Additional Feature
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs leading-relaxed">
            <p className="font-semibold text-white text-sm">
              Added Feature: Cumulative Equity Curve with High Water Mark & Trade Risk Stress Tester
            </p>
            <p>
              <strong>What was added and why?</strong>
            </p>
            <p>
              Rather than providing static metrics alone, traders need visual feedback on their equity trajectory and proximity to account rules. I built a dual-component analytics suite:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>
                <strong>Cumulative Equity Curve & Drawdown Depth Chart:</strong> An interactive chart plotting account balance against the Peak High Water Mark and the absolute Max Drawdown Breach Floor ($10,000 below peak). This visually answers "How close was my worst dip to breaching the account?"
              </li>
              <li>
                <strong>Real-Time Stress Tester & Simulator:</strong> Allows traders to input hypothetical pending trades (e.g. -$3,500 stop loss) to preview instantaneous shifts in remaining drawdown and daily loss limit before placing orders on the market.
              </li>
              <li>
                <strong>Asset-Level Performance Breakdown:</strong> Calculates win rate and net return per crypto symbol (BTC, ETH, SOL) to help traders identify where their edge lies.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: Answers to Product Questions */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            Product Questions & Answers
          </div>

          {/* Q1 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">1</span>
              What is drawdown in trading?
            </h4>
            <p className="text-xs leading-relaxed text-slate-300 pl-7">
              <strong>Drawdown</strong> is the peak-to-trough decline in account balance during a specific trading period, expressed either in dollar terms or as a percentage. It measures the loss experienced from the highest equity high-water mark to a subsequent equity trough before a new peak is established.
              <br /><br />
              <em>Example:</em> If an account grows from $100,000 to $103,250 (Peak) and then drops to $100,750, the drawdown is <strong>$2,500</strong> ($103,250 - $100,750).
            </p>
          </div>

          {/* Q2 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">2</span>
              Why do you think a trader would care about their remaining drawdown rather than just their current P&L?
            </h4>
            <p className="text-xs leading-relaxed text-slate-300 pl-7">
              While P&L shows historical financial performance, <strong>remaining drawdown represents survival margin and risk capacity</strong>. In prop trading firm evaluations (like Tradescape), breaching the maximum drawdown or daily loss threshold results in <strong>immediate account disqualification</strong>, regardless of how profitable the account was overall.
              <br /><br />
              Traders care deeply about remaining drawdown because it dictates:
            </p>
            <ul className="list-disc pl-12 text-xs space-y-1 text-slate-300">
              <li><strong>Allowed Position Size:</strong> How much risk can be allocated to the next trade without risking account failure.</li>
              <li><strong>Risk Buffer:</strong> How many consecutive losses the account can sustain before hitting hard account rules.</li>
              <li><strong>Psychological Safety:</strong> Knowing whether they are trading from a position of safety or on the brink of termination.</li>
            </ul>
          </div>

          {/* Q3 */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">3</span>
              If you had another day to work on this dashboard, what would you improve?
            </h4>
            <div className="text-xs space-y-2 text-slate-300 pl-7">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Live WebSocket Connection & Un-realized P&L:</strong> Stream real-time mark-to-market prices for open trades to show tick-by-tick dynamic drawdown.
                </li>
                <li>
                  <strong>Position Sizing / Risk Calculator Widget:</strong> Automatically compute exact lot sizes based on entry, stop loss price, and remaining drawdown budget.
                </li>
                <li>
                  <strong>Trade Journaling & Emotion Tagging:</strong> Enable traders to tag mistake categories (e.g. FOMO, Over-leveraged) to pinpoint the psychological drivers behind drawdowns.
                </li>
                <li>
                  <strong>Daily Loss Timer Countdown:</strong> Add a reset timer showing hours/minutes until the daily loss limit resets for the next trading session.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical & Calculations Summary */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Derived Data Integrity
          </div>
          <p className="text-slate-400">
            All dashboard values (Current Balance $103,250, Total P&L +$3,250, Win Rate 60%, Largest Win +$2,000, Largest Loss -$450, Drawdown, Daily Loss) are dynamically derived in pure TypeScript functions inside <code className="text-emerald-400">src/utils/calculations.ts</code> directly from trade execution data.
          </p>
        </div>

        {/* Footer close */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};
