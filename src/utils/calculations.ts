import { Trade, AccountRules, RiskMetrics, PerformanceMetrics, AssetPerformance, EquityPoint } from '../types';

export function calculateDashboardData(trades: Trade[], rules: AccountRules) {
  const { startingBalance, maxDrawdownLimit, dailyLossLimit } = rules;

  // 1. Total P&L and Balance
  const totalPnl = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const currentBalance = startingBalance + totalPnl;
  const pnlPercentage = (totalPnl / startingBalance) * 100;

  // 2. Trade performance stats
  const totalTrades = trades.length;
  const winningTrades = trades.filter((t) => t.pnl > 0);
  const losingTrades = trades.filter((t) => t.pnl < 0);
  
  const winningTradesCount = winningTrades.length;
  const losingTradesCount = losingTrades.length;
  
  const winRate = totalTrades > 0 ? (winningTradesCount / totalTrades) * 100 : 0;

  // Largest Win & Loss
  let largestWinningTrade: Trade | null = null;
  let largestLosingTrade: Trade | null = null;

  if (winningTrades.length > 0) {
    largestWinningTrade = winningTrades.reduce((max, t) => (t.pnl > max.pnl ? t : max), winningTrades[0]);
  }

  if (losingTrades.length > 0) {
    largestLosingTrade = losingTrades.reduce((min, t) => (t.pnl < min.pnl ? t : min), losingTrades[0]);
  }

  // Averages
  const totalWinAmount = winningTrades.reduce((sum, t) => sum + t.pnl, 0);
  const totalLossAmount = losingTrades.reduce((sum, t) => sum + Math.abs(t.pnl), 0);

  const averageWin = winningTradesCount > 0 ? totalWinAmount / winningTradesCount : 0;
  const averageLoss = losingTradesCount > 0 ? totalLossAmount / losingTradesCount : 0;
  const profitFactor = averageLoss > 0 ? averageWin / averageLoss : averageWin > 0 ? 99 : 0;

  // 3. Equity Curve & Drawdown calculations
  let runningBalance = startingBalance;
  let peakBalance = startingBalance;
  let maxDrawdownExperienced = 0;

  const equityPoints: EquityPoint[] = [
    {
      index: 0,
      tradeName: 'Start',
      asset: 'Initial',
      pnl: 0,
      cumulativePnl: 0,
      balance: startingBalance,
      peakBalance: startingBalance,
      drawdown: 0,
      drawdownLimitLine: startingBalance - maxDrawdownLimit,
    },
  ];

  trades.forEach((trade, idx) => {
    runningBalance += trade.pnl;
    if (runningBalance > peakBalance) {
      peakBalance = runningBalance;
    }
    const drawdown = peakBalance - runningBalance;
    if (drawdown > maxDrawdownExperienced) {
      maxDrawdownExperienced = drawdown;
    }

    equityPoints.push({
      index: idx + 1,
      tradeName: `${trade.asset} ${trade.type}`,
      asset: trade.asset,
      pnl: trade.pnl,
      cumulativePnl: runningBalance - startingBalance,
      balance: runningBalance,
      peakBalance,
      drawdown,
      drawdownLimitLine: peakBalance - maxDrawdownLimit,
    });
  });

  const currentDrawdown = peakBalance - currentBalance;
  const remainingDrawdown = Math.max(0, maxDrawdownLimit - currentDrawdown);
  const drawdownPercentageOfLimit = Math.min(100, (currentDrawdown / maxDrawdownLimit) * 100);

  // 4. Daily Loss calculation
  // Sum of negative trades in current trading session
  const currentDayLoss = losingTrades.reduce((sum, t) => sum + Math.abs(t.pnl), 0);
  const remainingDailyLossLimit = Math.max(0, dailyLossLimit - currentDayLoss);
  const dailyLossPercentageOfLimit = Math.min(100, (currentDayLoss / dailyLossLimit) * 100);

  // 5. Risk Status Classification
  let riskLevel: 'Safe' | 'Approaching Limit' | 'At Risk' = 'Safe';
  let riskReason = 'Account parameters are healthy and well within risk thresholds.';

  if (currentDrawdown >= maxDrawdownLimit || currentDayLoss >= dailyLossLimit) {
    riskLevel = 'At Risk';
    riskReason = 'CRITICAL: Account rule limit has been breached or is at 100% capacity.';
  } else if (drawdownPercentageOfLimit >= 70 || dailyLossPercentageOfLimit >= 70) {
    riskLevel = 'At Risk';
    riskReason = 'HIGH RISK: Drawdown or daily loss limit is above 70% threshold. Capital preservation required.';
  } else if (drawdownPercentageOfLimit >= 40 || dailyLossPercentageOfLimit >= 40) {
    riskLevel = 'Approaching Limit';
    riskReason = 'WARNING: Drawdown or daily loss is approaching limits (40%-70% capacity utilized).';
  }

  const riskMetrics: RiskMetrics = {
    currentBalance,
    totalPnl,
    pnlPercentage,
    peakBalance,
    currentDrawdown,
    maxDrawdownExperienced,
    remainingDrawdown,
    drawdownPercentageOfLimit,
    currentDayLoss,
    remainingDailyLossLimit,
    dailyLossPercentageOfLimit,
    riskLevel,
    riskReason,
  };

  const performanceMetrics: PerformanceMetrics = {
    totalTrades,
    winningTradesCount,
    losingTradesCount,
    winRate,
    largestWinningTrade,
    largestLosingTrade,
    averageWin,
    averageLoss,
    profitFactor,
  };

  // 6. Asset breakdown
  const assetMap: Record<string, { totalPnl: number; count: number; wins: number }> = {};
  trades.forEach((t) => {
    if (!assetMap[t.asset]) {
      assetMap[t.asset] = { totalPnl: 0, count: 0, wins: 0 };
    }
    assetMap[t.asset].totalPnl += t.pnl;
    assetMap[t.asset].count += 1;
    if (t.pnl > 0) assetMap[t.asset].wins += 1;
  });

  const assetPerformance: AssetPerformance[] = Object.keys(assetMap).map((asset) => ({
    asset,
    totalPnl: assetMap[asset].totalPnl,
    tradeCount: assetMap[asset].count,
    winRate: (assetMap[asset].wins / assetMap[asset].count) * 100,
  }));

  return {
    riskMetrics,
    performanceMetrics,
    assetPerformance,
    equityPoints,
  };
}

export function formatCurrency(amount: number, includeSign = false): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  if (amount < 0) {
    return `-${formatted}`;
  }
  if (amount > 0 && includeSign) {
    return `+${formatted}`;
  }
  return formatted;
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
