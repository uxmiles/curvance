# Curvance UI/UX Corrections

Based on deep analysis of Curvance protocol documentation vs current implementation.

---

## 🔴 CRITICAL Issues

### 1. Health Factor Representation is Wrong
**File:** `src/components/MarketList.tsx`, `src/components/HealthBarsIcon.tsx`
**Current:** Shows `healthPercentage` as 0-100%
**Should Be:** Position Health is a **ratio**, not a percentage!

```
Position Health = Collateral Capacity at Margin Requirement / Debt
```

- Health > 1.5 = Safe (green)
- Health 1.0-1.5 = Caution (yellow/orange)  
- Health < 1.0 = Liquidation eligible (red)
- Health = 0 = No debt (infinite/safe)

**Fix Required:**
- Change `healthPercentage: number` to `healthFactor: number` 
- Display as ratio (e.g., "1.85" not "85%")
- Color coding: >1.5 green, 1.0-1.5 yellow, <1.0 red

### 2. Missing Dual Oracle Indicator
**File:** `src/components/MarketList.tsx`
**Current:** Shows single `OracleIcon` per market
**Should Be:** Curvance uses **Dual Oracle System** - each market has TWO oracles

**Fix Required:**
- Add `secondaryOracle` to Market interface
- Display both oracle icons with tooltip explaining dual-oracle protection
- Add circuit breaker status indicator (normal/paused/frozen)

### 3. Market Names Are Generic
**File:** `src/components/MarketList.tsx`
**Current:** "Market A", "Market B", etc.
**Should Be:** Thesis-driven market names that reflect asset categories

**Curvance Market Types:**
- "Stablecoin Market" (USDC, AUSD, sAUSD)
- "Bluechip Long" (WETH, WBTC)
- "LST/LRT Market" (wstETH, shMON, aprMON)
- "LP Token Market" (Velodrome LPs, Pendle LPs)

---

## 🟠 HIGH Priority Issues

### 4. APY Breakdown Missing CVE Rewards
**File:** `src/components/APYBreakdown.tsx`, tooltip in MarketList
**Current:** Shows Base APY + generic rewards
**Should Be:** Curvance-specific breakdown:

```
Base APY: X%
CVE Emissions: X%
Bytes Boost: X% (if applicable)
Partner Rewards: X%
─────────────────
Total APY: X%
```

**Fix Required:**
- Add `cveRewardsAPY` field
- Add `bytesBoost` field (veCVE holders get boost)
- Rename "CVE Rewards" to "Gauge Emissions"

### 5. Missing Soft/Hard Liquidation Visualization
**File:** `src/components/HealthBarsIcon.tsx`
**Current:** Simple gradient health bar
**Should Be:** Show the **liquidation zones**:

```
[=========|====|==]
   Safe   Soft Hard
```

- Zone 1 (Green): Above Soft Threshold (e.g., >120%)
- Zone 2 (Yellow): Between Soft & Hard (e.g., 110-120%)  
- Zone 3 (Red): Below Hard Threshold (e.g., <110%)

**Fix Required:**
- Add threshold markers to health bar
- Show soft liquidation zone vs hard liquidation zone
- Tooltip explaining lFactor and liquidation penalties

### 6. LTV vs Collateralization Ratio Confusion
**File:** `src/components/MarketDetails.tsx`
**Current:** Shows "LTV: 82%"
**Should Be:** Curvance terminology:

- **Collateralization Ratio**: Max borrow per $1 collateral
- **Soft Collateral Requirement**: e.g., 120% (trigger soft liquidation below)
- **Hard Collateral Requirement**: e.g., 110% (trigger hard liquidation below)

**Fix Required:**
- Rename "LTV" to "Max LTV" or "Collateralization Ratio"
- Add "Soft Threshold" and "Hard Threshold" to market details

### 7. Missing Collateral/Debt Caps Display
**File:** `src/components/MarketDetails.tsx`, `src/components/MarketList.tsx`
**Current:** Not shown
**Should Be:** Critical risk metric!

Each market has:
- **Collateral Cap**: Max amount usable as collateral
- **Debt Cap**: Max borrowable amount
- **Utilization**: Current vs cap

**Fix Required:**
- Add collateral cap progress bar
- Add debt cap progress bar
- Show "X% of cap used"

---

## 🟡 MEDIUM Priority Issues

### 8. Leverage UI Missing Position Preview
**File:** `src/components/DepositPanel.tsx` (leverage section)
**Current:** Simple leverage input
**Should Be:** Show **resulting position preview**:

```
Current Position:
  Collateral: $10,000
  Debt: $0
  Health Factor: ∞

After 3x Leverage:
  Collateral: $30,000
  Debt: $20,000
  Health Factor: 1.5
  Liquidation Price: $X
```

**Fix Required:**
- Add position preview component
- Show health factor change
- Show liquidation price
- Add slippage tolerance input

### 9. Missing veCVE Boost Indicator
**File:** Throughout
**Current:** No indicator for boosted positions
**Should Be:** Show if user has veCVE boost active

- Continuous Lock = 20% voting power boost + 2x fees
- Show boost multiplier on APY displays

### 10. Token Symbols Should Use Curvance Conventions
**Current:** Generic token names
**Should Be:** Curvance-specific:

- cTokens (e.g., cUSDC, cWETH) - receipt tokens for deposits
- BorrowableCTokens - for borrowable positions
- eTokens (Earn Tokens) mentioned in glossary

### 11. Missing 20-Minute Cooldown Notice
**File:** Withdrawal flows
**Current:** Not mentioned
**Should Be:** Curvance has a 20-minute cooldown on withdrawals

Add notice: "Withdrawals available after 20 min cooldown unless market is fully utilized"

---

## 🟢 LOW Priority / Polish

### 12. Missing Floppy Mascot
**Current:** No mascot
**Should Be:** Include Floppy, Curvance's official mascot
**Assets:** https://drive.google.com/drive/folders/1ALjXxuiFq2o3W7c5CndFOpyF7tIeP6Xa

### 13. Chain Selector Should Show Monad First
**Current:** Generic chain order
**Should Be:** Monad is primary chain, should be default/first

### 14. Missing "Continuous Lock" Toggle for veCVE
**File:** Future CVE staking UI
**Should Include:**
- Standard lock (12 months, decreasing power)
- Continuous lock toggle (stays at max, +20% boost)

### 15. Epoch Timer
**Should Add:** Show time until next biweekly epoch
- Voting period indicator
- State change freeze warning (12h before/after epoch)

---

## Data Model Updates Needed

### Market Interface
```typescript
interface Market {
  id: string;
  name: string;
  thesis: 'stablecoin' | 'bluechip' | 'lst' | 'lp'; // Market type
  tokenSymbol: string;
  
  // Dual Oracle System
  primaryOracle: { name: string; icon: Component };
  secondaryOracle: { name: string; icon: Component };
  oracleStatus: 'normal' | 'paused' | 'frozen';
  
  // Metrics
  totalDeposits: string;
  availableLiquidity: string;
  
  // Caps
  collateralCap: string;
  collateralCapUsed: number; // percentage
  debtCap: string;
  debtCapUsed: number; // percentage
  
  // APY Breakdown
  baseSupplyAPY: string;
  cveEmissionsAPY: string;
  partnerRewardsAPY: string;
  totalSupplyAPY: string;
  baseBorrowAPY: string;
  
  // Risk Parameters
  collateralizationRatio: number; // e.g., 0.825 for 82.5%
  softThreshold: number; // e.g., 1.20 for 120%
  hardThreshold: number; // e.g., 1.10 for 110%
  softLiquidationIncentive: number; // e.g., 0.04 for 4%
  hardLiquidationIncentive: number; // e.g., 0.06 for 6%
  
  maxLeverage: string;
}

interface UserPosition {
  marketId: string;
  collateralValue: number;
  debtValue: number;
  healthFactor: number; // ratio, not percentage!
  lFactor: number; // 0-1, liquidation factor
  isInSoftLiquidation: boolean;
  isInHardLiquidation: boolean;
}
```

---

---

## 🔵 NEW: Contract-Level Requirements

### 16. Oracle Status Indicator (from Error Codes)
**Current:** Not implemented
**Should Be:** Show circuit breaker status with clear UI states

```
Code 0 (NO_ERROR) → Green dot + "Normal"
Code 1 (CAUTION) → Yellow dot + "Limited" 
  - Show: "Borrows/redemptions paused"
Code 2 (BAD_SOURCE) → Red dot + "Frozen"
  - Show: "All operations paused"
```

### 17. 20-Minute Cooldown Timer
**Current:** Not implemented
**Should Be:** After deposit/borrow, show countdown

```
"Withdrawal available in 18:32"
```

**Must clarify:**
- Adding collateral: ALWAYS allowed
- Liquidation: ALWAYS allowed
- Only blocks: redemption & repayment

### 18. Minimum Loan Size Warning
**Current:** Not validated
**Should Be:** Validate $10-$100 minimum (chain-dependent)

Show error if:
- New loan < minimum
- Partial repay would leave < minimum

### 19. Market Pairing Display
**Current:** Shows individual tokens
**Should Be:** Markets are always 2-token pairs

```
Market: wETH ↔ USDC
  - wETH as collateral
  - USDC borrowable
```

**Rule:** Cannot borrow from cToken you're posting as collateral (same token)

### 20. Auction Priority Indicator
**Current:** Not shown
**Should Be:** Indicate liquidation auction status

```
"Auction Active" (10-50 bps priority)
"Traditional Only" (fallback mode)
```

---

## References

All corrections based on:
- https://docs.curvance.com/cve
- https://docs.curvance.com/cve/protocol-overview/liquidity-markets/liquidations
- https://docs.curvance.com/cve/protocol-overview/liquidity-markets/oracles
- https://docs.curvance.com/cve/developer-docs/lending-protocol
- https://docs.curvance.com/cve/miscellaneous/glossary
- Curvance Contracts README (architecture, markets, liquidations)
- Curvance Isolated Markets README (DLE, auction system, error codes)

See `CURVANCE-KNOWLEDGE.md` for full technical documentation.
See `skills/curvance-protocol/` for skill files.
