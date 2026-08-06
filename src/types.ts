export interface Trade {
  id: string;
  asset: 'BTC' | 'ETH' | 'SOL' | 'AVAX' | 'NEAR' | string;
  type: 'Long' | 'Short';
  pnl: number;
  timestamp: string;
  dateStr: string;
  notes?: string;
}

export interface AccountRules {
  startingBalance: number;
  maxDrawdownLimit: number;
  dailyLossLimit: number;
}

export type RiskLevel = 'Safe' | 'Approaching Limit' | 'At Risk';

export interface RiskMetrics {
  currentBalance: number;
  totalPnl: number;
  pnlPercentage: number;
  peakBalance: number;
  currentDrawdown: number;
  maxDrawdownExperienced: number;
  remainingDrawdown: number;
  drawdownPercentageOfLimit: number;
  
  currentDayLoss: number;
  remainingDailyLossLimit: number;
  dailyLossPercentageOfLimit: number;
  
  riskLevel: RiskLevel;
  riskReason: string;
}

export interface PerformanceMetrics {
  totalTrades: number;
  winningTradesCount: number;
  losingTradesCount: number;
  winRate: number;
  largestWinningTrade: Trade | null;
  largestLosingTrade: Trade | null;
  averageWin: number;
  averageLoss: number;
  profitFactor: number; // Avg Win / Avg Loss magnitude
}

export interface AssetPerformance {
  asset: string;
  totalPnl: number;
  tradeCount: number;
  winRate: number;
}

export interface EquityPoint {
  index: number;
  tradeName: string;
  asset: string;
  pnl: number;
  cumulativePnl: number;
  balance: number;
  peakBalance: number;
  drawdown: number;
  drawdownLimitLine: number;
}
