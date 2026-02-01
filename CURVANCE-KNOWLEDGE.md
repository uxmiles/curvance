# Curvance Protocol - Deep Technical Knowledge

> **Tagline:** "Click Less, Earn More" — For capital that works, not capital that waits.

## Core Protocol Overview

Curvance is a **modular multi-chain money market** optimized for capital efficiency. It's designed to process risk faster than traditional lending protocols, enabling safely higher leverage while maintaining protocol security.

### Key Differentiators
1. **Dynamic Liquidation Engine (DLE)** — Gradual soft→hard liquidation instead of single-point
2. **Dual Oracle System** — Two independent price sources with circuit breakers
3. **MEV Capture via OEV** — Auction-based liquidations that capture value for protocol
4. **One-Click Leverage** — Simplified looping without complex manual actions
5. **Productive Collateral** — Deposited assets continue earning yield
6. **Thesis-Driven Markets** — Isolated market managers by asset category

---

## Market Architecture

### Market Managers (Isolated Markets)
Each Market Manager focuses on a specific financial thesis:
- Interest-bearing stablecoins (sDAI, sUSDe, sAUSD)
- Bluechip long exposure (WETH, WBTC)
- Volatile LP tokens (DEX LPs, perp LPs)
- LSTs/LRTs (wstETH, shMON, aprMON)

**Why isolation matters:** A volatility event in one market doesn't propagate to others. Systemic risk is contained within boundaries.

### Curvance Tokens (cTokens)
When users deposit assets, they receive **cTokens** representing their share:
- Can serve as **Collateral** — secure borrowing positions
- Can serve as **Borrowable Assets** — underlying can be borrowed
- Exchange rate appreciates over time as interest accrues
- `isBorrowable()` determines if a cToken can be borrowed

### Collateral & Debt Caps
**Collateral Caps:**
- Limit how much of an asset can be used as collateral
- Based on on-chain liquidity across pairs
- Set by Curvance Collective (DAO-elected risk group)
- Example: If $10M liquidity with 80% USDY / 20% USDC, cap = 40% of $2M USDC = $800K

**Debt Caps:**
- Limit total borrowable amount per asset
- Sized for stressed unwind scenarios
- New borrows revert at cap; repayments/liquidations always allowed

---

## Liquidation System (CRITICAL FOR UI)

### Position Health
```
Position Health = Collateral Capacity at Margin Requirement / Debt
```

- **Position Health ≥ 1:** Safe (sufficiently collateralized)
- **Position Health < 1:** Liquidation eligible
- **Recommended:** Maintain above 1.5 during volatility

### Dynamic Liquidation Engine

Unlike single-point liquidations, Curvance uses a **linear scale**:

| Threshold | Behavior |
|-----------|----------|
| Above Soft (>1) | Safe, no liquidation |
| Between Soft & Hard | Partial liquidation, scaled penalty |
| Below Hard | Full liquidation, max penalty |
| Below Collateral Value | Bad debt socialization |

**Liquidation Factor (lFactor):**
- 0% = soft liquidation only
- 100% = full hard liquidation
- Blends between for intermediate states

**Key Parameters (per-asset configurable):**
- `Collateralization Ratio` — max borrow per $1 collateral
- `Soft Collateral Requirement` — e.g., 120%
- `Hard Collateral Requirement` — e.g., 110%
- `Soft Liquidation Incentive` — e.g., 4%
- `Hard Liquidation Incentive` — e.g., 6%
- `Liquidation Fee` — protocol fee from collateral
- `Base Close Factor` — % of debt that can be closed (e.g., 20%)

**Example Calculation:**
```
Tony: $1,000 ETH collateral, $900 debt
Soft = 120%, Hard = 110%

Soft capacity = 1000/1.20 = $833.33 < $900 (below soft)
Hard capacity = 1000/1.10 = $909 > $900 (above hard)

lFactor = (900 - 833.33) / (909 - 833.33) = 88%
Close amount = 20% + (100% - 20%) × 88% = 90.4%
Penalty = 4% + (6% - 4%) × 88% = 5.76%
```

### Health Bars UI
The health visualization should show:
- Green zone: Position Health > 1.5 (safe)
- Yellow zone: 1.0 < Position Health < 1.5 (caution)
- Orange zone: Position Health approaching 1.0 (warning)
- Red zone: Position Health < 1.0 (liquidation risk)

---

## Dual Oracle System

### How It Works
- Every collateral asset requires **2 independent oracle sources**
- Sources: Chainlink, Redstone, Pyth, API3, Chronicle, Chainsight
- Exception: Assets like wstETH (redeemable for stETH) may use single oracle

### Circuit Breaker Protection
**Abnormal Divergence (moderate):**
- New debt creation halted
- Redemptions halted
- Liquidations still allowed

**Extreme Divergence:**
- ALL operations halted (debt, redemptions, liquidations)
- Until prices converge

### Price Selection
For **borrowing calculations:** Use LOWER price (conservative collateral value)
For **liquidation calculations:** Use HIGHER price (protect lenders)

### Heartbeat & Price Guards
- **Heartbeat checks:** Stale feeds excluded
- **Static bands:** For stable/pegged assets
- **Dynamic bands:** Ceiling increases gradually (for yield-bearing assets)
  - Example: sAUSD floor $0.995, ceiling starts ~$1.00 and inches up daily with yield

---

## Tokenomics

### CVE Token
- **Total Supply:** 420M
- **Primary Use:** Governance, emissions voting, fee sharing

### veCVE (Vote-Escrowed CVE)
- Lock CVE for 12 months → receive veCVE
- Voting power decreases linearly as lock matures
- **Continuous Lock Mode:** Keeps at max duration, 20% voting boost, 2x fees

### Voting Power Uses
1. **DAO Governance:** Vote on proposals
2. **Gauge Emissions:** Direct CVE rewards to markets (biweekly)
3. **Fee Distribution:** Pro-rata share of protocol fees (paid in USDC)

### Bimodal Emissions Boost
When claiming unclaimed CVE rewards, users can:
- Claim normally, OR
- Lock immediately as veCVE for bonus (e.g., 20% more)

---

## One-Click Leverage System

### Supported Asset Types
- Simple ERC20 tokens
- Pendle LP tokens
- Pendle PT (Principal) tokens
- Velodrome/Aerodrome LP tokens
- Liquid Staking Tokens (stETH, shMON)
- ERC4626 Yield Vaults (sFRAX, sUSDe, sUSDS)

### Leverage Flow
1. **Deposit:** User deposits assets → receives cTokens
2. **Borrow:** System borrows against collateral
3. **Swap:** Borrowed assets swapped to more collateral
4. **Deposit Again:** New collateral deposited
5. **Loop complete:** Position leveraged

### Key Functions
- `leverage()` — Leverage existing position
- `depositAndLeverage()` — Deposit + leverage in one tx
- `leverageFor()` — Leverage for another user (requires delegation)

### Slippage Protection
- User specifies max acceptable slippage
- System monitors pre/post position value
- Reverts if loss exceeds threshold

---

## Multichain Architecture (Wormhole)

### Cross-Chain Features
- **Gauge Voting:** Vote for any pool on any chain regardless of lock location
- **Fee Distribution:** Receive fees from ALL chains to ANY chain
- **Lock Migration:** Move veCVE between chains anytime
- **Gasless Voting:** Via Snapshot (biweekly epochs)

### Epoch Mechanics
- veCVE state changes frozen 12 hours before/after epoch
- Prevents vote double-spending
- Rewards distributed after epoch concludes

### CCTP Integration
Circle's Cross-Chain Transfer Protocol for USDC fee distribution:
- Zero slippage value transfer
- Burn on source chain → attestation → mint on destination

---

## UI/UX Design Guidelines

### Critical UI Elements

1. **Health Factor Display**
   - Most important metric for users
   - Show numerical value + visual bar/indicator
   - Color-coded zones (green → yellow → orange → red)
   - Real-time updates as prices change

2. **Position Overview**
   - Total Deposits (USD value)
   - Collateral Posted (what's securing loans)
   - Total Borrowed (debt amount)
   - Available to Borrow (remaining capacity)
   - Net APY (supply - borrow rates + rewards)

3. **Market Cards**
   - Token icon + name
   - Oracle indicator (show which oracles)
   - TVL / Total Deposits
   - Available Liquidity
   - Supply APY (with breakdown: base + rewards + boost)
   - Borrow APY
   - Max Leverage
   - Your Health (if position exists)

4. **APY Breakdown Tooltip**
   - Base APY
   - CVE Rewards APY
   - Partner/Protocol Rewards
   - Bytes Boost (if applicable)
   - Total APY

5. **One-Click Actions**
   - Deposit → Collateralize → Borrow (simplified flow)
   - Leverage slider (show resulting health factor)
   - Deleverage (emergency exit)

6. **Risk Warnings**
   - Liquidation proximity alerts
   - Price volatility warnings
   - Oracle status indicators

### Mascot: Floppy
- Curvance's official mascot
- Should appear in UI for branding
- Assets: https://drive.google.com/drive/folders/1ALjXxuiFq2o3W7c5CndFOpyF7tIeP6Xa

### Design Philosophy
- **"Click Less, Earn More"** — Minimize user actions
- Complex mechanics should be hidden under simple UI
- Two interfaces planned: Advanced + Simplified
- Target: Experienced DeFi users initially, broader audience later

---

## Technical Terms Quick Reference

| Term | Definition |
|------|------------|
| cToken | Curvance token representing deposit share |
| veCVE | Vote-escrowed CVE with governance power |
| lFactor | Liquidation factor (0-100% soft→hard) |
| cFactor | Close factor (% debt closeable) |
| Position Health | Collateral capacity / debt ratio |
| Soft Liquidation | Partial liquidation, small penalty |
| Hard Liquidation | Full liquidation, max penalty |
| OEV | Optimal Extractable Value (MEV capture) |
| DLE | Dynamic Liquidation Engine |
| Gauge | Emissions distribution mechanism |
| Epoch | Biweekly voting/reward period |

---

## Supported Chains
- **Mainnet:** Monad (primary), Ethereum, Arbitrum, Base, Optimism, Polygon zkEVM, Blast
- **Testnets:** Monad Testnet, Ethereum Sepolia, Arbitrum Sepolia

## Oracle Partners
- Chainlink (Price Feeds + Data Streams)
- Redstone (Classic + Core)
- Pyth
- API3
- Chronicle
- Chainsight

## Integration Partners
- Pendle Finance
- Velodrome/Aerodrome
- Convex
- Aura Finance
- Balancer
- Frax
- Alchemix
- Swell Network
- Lybra Finance
- TangibleDAO (RWA)

---

## Contract-Level Technical Details

### Oracle Error Codes (CRITICAL FOR UI)
```
Code 0 (NO_ERROR):
  - Both oracles working, small delta
  - ALL operations allowed (green indicator)

Code 1 (CAUTION):
  - One oracle issue OR moderate delta
  - NEW BORROWS, REPAYMENTS, REDEMPTIONS PAUSED
  - Liquidations still allowed (yellow/orange indicator)

Code 2 (BAD_SOURCE):
  - All oracles failed OR large delta
  - ALL OPERATIONS PAUSED including liquidations (red indicator)
```

### Pessimistic Pricing
Curvance ALWAYS favors lenders:
- **Collateral valuation**: Use LOWER of two oracle prices
- **Debt valuation**: Use HIGHER of two oracle prices

### 20-Minute Cooldown
When user collateralizes or borrows:
- **Blocked**: Redemption of collateral, repayment of debt
- **NOT blocked**: Adding more collateral, liquidations
- **Purpose**: Minimize toxic orderflow impact

### Minimum Loan Size
- Range: $10-$100 (WAD dollars)
- Typically $10 on L2s
- Full repayments always allowed

### Market Design Constraints
- Each market = exactly 2 tokens
- 1-2 can be borrowable (not zero)
- Listed via `listTokens()` - immutable after
- Cannot borrow from cToken you have as collateral

### Auction-Based Liquidations
- 10-50 bps priority over traditional (AUCTION_BUFFER)
- 300ms auction duration
- Built with Fastlane Labs Atlas Execution Environment
- Up to 10 sequential liquidations per tx

### Unsupported Asset Types
- Rebasing tokens
- ERC777 (transfer hooks)
- Dual-entry point tokens
- Decimals <6 or >24
- Supply >10T or <1000
- Fee-on-transfer tokens

---

## Reference

Full skill documentation: `skills/curvance-protocol/`
- `SKILL.md` - Quick reference
- `protocol-overview.md` - Complete protocol guide
- `contracts-reference.md` - Smart contract structure
- `isolated-markets.md` - Market design and DLE details
