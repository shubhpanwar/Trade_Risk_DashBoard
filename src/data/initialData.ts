import { Trade, AccountRules } from '../types';

export const INITIAL_RULES: AccountRules = {
  startingBalance: 100000,
  maxDrawdownLimit: 10000,
  dailyLossLimit: 5000,
};

export const DEFAULT_TRADES: Trade[] = [
  {
    id: 'trade-1',
    asset: 'BTC',
    type: 'Long',
    pnl: 1200,
    timestamp: '2026-08-04 09:15',
    dateStr: 'Aug 4, 09:15',
    notes: 'Breakout long above $64,200 key resistance',
  },
  {
    id: 'trade-2',
    asset: 'ETH',
    type: 'Short',
    pnl: -450,
    timestamp: '2026-08-04 11:30',
    dateStr: 'Aug 4, 11:30',
    notes: 'Rejection at $3,450 VWAP upper band',
  },
  {
    id: 'trade-3',
    asset: 'BTC',
    type: 'Short',
    pnl: 800,
    timestamp: '2026-08-04 13:45',
    dateStr: 'Aug 4, 13:45',
    notes: 'Scalp short off 4H Liquidity Sweep',
  },
  {
    id: 'trade-4',
    asset: 'SOL',
    type: 'Long',
    pnl: -300,
    timestamp: '2026-08-04 15:10',
    dateStr: 'Aug 4, 15:10',
    notes: 'Stopped out during BTC flush',
  },
  {
    id: 'trade-5',
    asset: 'ETH',
    type: 'Long',
    pnl: 2000,
    timestamp: '2026-08-04 17:00',
    dateStr: 'Aug 4, 17:00',
    notes: 'Strong continuation off 15m order block',
  },
];

// Preset trade sets for quick evaluator scenario testing
export const PRESET_SCENARIOS = {
  default: {
    name: 'Tradescape Assignment Baseline (Safe)',
    description: 'The standard 5 trades from the assignment ($103,250 balance, $3,250 P&L).',
    trades: DEFAULT_TRADES,
  },
  approachingLimit: {
    name: 'Approaching Limit Scenario',
    description: 'Simulates $3,800 loss today putting daily loss capacity at 76%.',
    trades: [
      ...DEFAULT_TRADES,
      {
        id: 'trade-6-warn',
        asset: 'SOL',
        type: 'Long',
        pnl: -3050,
        timestamp: '2026-08-04 18:30',
        dateStr: 'Aug 4, 18:30',
        notes: 'Simulated high-volatility drawdown trade',
      },
    ],
  },
  atRisk: {
    name: 'High Risk / Near Breach Scenario',
    description: 'Simulates a severe -$7,800 series of losses triggering At Risk warning status.',
    trades: [
      {
        id: 'tr-r1',
        asset: 'BTC',
        type: 'Long',
        pnl: 1000,
        timestamp: '2026-08-04 09:00',
        dateStr: 'Aug 4, 09:00',
      },
      {
        id: 'tr-r2',
        asset: 'ETH',
        type: 'Short',
        pnl: -4200,
        timestamp: '2026-08-04 12:00',
        dateStr: 'Aug 4, 12:00',
      },
      {
        id: 'tr-r3',
        asset: 'SOL',
        type: 'Long',
        pnl: -3600,
        timestamp: '2026-08-04 15:00',
        dateStr: 'Aug 4, 15:00',
      },
    ],
  },
};
