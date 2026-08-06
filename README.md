# Tradescape — Trader Risk Dashboard

Full Stack Developer Assignment Submission

## Overview
This repository contains a **Trader Risk Dashboard** built for Tradescape. The dashboard empowers traders undergoing account evaluations to immediately monitor their performance against account rules, track equity growth, and evaluate risk capacity before executing trades.

---

## 🚀 How to Run the Project

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd tradescape-trader-risk-dashboard
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📊 Account Metrics & Derived Calculations

All metrics on the dashboard are **100% derived dynamically** from the underlying trade dataset:

- **Starting Balance:** `$100,000`
- **Current Balance:** `$103,250` (Starting Balance + Total Net P&L)
- **Total Net P&L:** `+$3,250` (+3.25%)
- **Winning Trades Count:** `3` (BTC Long +$1,200, BTC Short +$800, ETH Long +$2,000)
- **Losing Trades Count:** `2` (ETH Short -$450, SOL Long -$300)
- **Win Rate:** `60.0%` (3 / 5 winning trades)
- **Largest Winning Trade:** `+$2,000` (ETH Long)
- **Largest Losing Trade:** `-$450` (ETH Short)
- **Average Win / Average Loss:** `+$1,333.33` / `-$375.00` (Profit Factor: `3.56 : 1`)
- **Current Drawdown:** `$0` (At Peak High-Water Mark `$103,250`)
- **Remaining Drawdown:** `$10,000` (Max Drawdown Limit `$10,000` - Current Drawdown `$0`)
- **Current Day's Realized Loss:** `$750` (-$450 ETH Short + -$300 SOL Long)
- **Remaining Daily Loss Buffer:** `$4,250` (Daily Loss Limit `$5,000` - Current Day Loss `$750`)
- **Account Health Status:** **`Safe`** (Green Shield Indicator)

---

## 💡 Product Decision (Additional Feature)

### What was added and why?
**Feature:** *Interactive Cumulative Equity Curve & High Water Mark Chart + Trade Risk Stress Tester & Simulator*

#### Why this was added:
Static metrics only tell a partial story. Traders need visual clarity on their equity trajectory relative to the **Max Drawdown Breach Floor** ($10,000 below peak) and the ability to test risk scenarios before executing orders.

1. **Cumulative Equity Curve Chart:** Plots account balance step-by-step against the Peak High Water Mark and the absolute Max Drawdown Breach Floor ($10,000 below peak). This visually answers "How close was my worst dip to breaching the account?"
2. **Trade Risk Stress Tester & Simulator:** Allows traders to slide or enter hypothetical trade profits/losses (e.g. -$3,500) to see instantaneous real-time shifts in remaining drawdown, daily loss buffer, and account safety status (`Safe` -> `Approaching Limit` -> `At Risk`) before placing orders on the market.
3. **Asset-Level Performance Analytics:** Groups P&L and win rate by crypto token (BTC, ETH, SOL) to reveal asset-specific trading edge.

---

## ❓ Product Questions & Answers

### 1. What is drawdown in trading?
**Answer:**
Drawdown is the peak-to-trough decline in account balance during a specific trading period, expressed either in dollar terms or as a percentage. It measures the total equity loss experienced from the highest equity high-water mark to a subsequent low before a new peak is established.

*Example:* If an account grows from $100,000 to $103,250 (Peak) and then drops to $100,750, the drawdown experienced from the peak is **$2,500** ($103,250 - $100,750).

---

### 2. Why do you think a trader would care about their remaining drawdown rather than just their current P&L?
**Answer:**
While overall P&L shows historical financial performance, **remaining drawdown represents the trader's survival margin and risk capacity**.

In prop trading firm evaluations (like Tradescape), breaching the maximum drawdown or daily loss threshold results in **immediate account disqualification**, regardless of how profitable the account was historically.

Traders care deeply about remaining drawdown because it dictates:
- **Allowed Position Sizing:** How much capital/leverage can be allocated to upcoming trades without risking account termination.
- **Risk Buffer:** How many consecutive losses the account can sustain before breaching account rules.
- **Psychological Peace of Mind:** Knowing whether they are trading from a position of relative safety or on the brink of failure.

---

### 3. If you had another day to work on this dashboard, what would you improve?
**Answer:**
1. **Live WebSocket Price Feeds & Un-realized P&L:** Stream real-time mark-to-market prices for open positions to display tick-by-tick dynamic drawdown in real-time.
2. **Automated Position Sizing Calculator Widget:** Automatically compute recommended lot sizes based on entry, stop-loss price, and remaining drawdown budget (e.g. "To stay within 2% risk of remaining drawdown, max position size is 0.45 BTC").
3. **Trade Journaling & Mistake Tagging:** Allow traders to tag trade mistake categories (e.g., FOMO, revenge trading, over-leveraged) to analyze the psychological drivers behind equity drawdowns.
4. **Daily Loss Reset Timer:** Add a countdown clock showing exact hours/minutes until the daily loss limit resets for the next trading session.

---

## 📁 Technical Architecture
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Icons:** Lucide React
- **State & Logic:** Modular pure TypeScript calculations (`src/utils/calculations.ts`)
