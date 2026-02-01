# Curvance Competitive & UI Research

> Research compiled for UI/UX design decisions with Curvance's technical constraints in mind.

---

## Direct Competitors

### 1. Aave (Market Leader)

**URL:** https://app.aave.com

**Key Metrics:**
- Health Factor formula: `(Total Collateral × Weighted Avg Liquidation Threshold) / Total Borrow`
- Health Factor < 1 = liquidation risk
- 50% close factor at HF > 0.95, 100% at HF ≤ 0.95

**UI Patterns:**
- Clean dashboard with portfolio overview
- Health Factor prominently displayed with color coding
- Separate Supply/Borrow sections
- Detailed position management
- "E-Mode" for correlated assets (higher LTV)

**What Curvance Does Better:**
- Dynamic Liquidation Engine (soft→hard gradual)
- MEV capture through auctions
- Dual oracle system with circuit breakers
- 20-minute cooldown for manipulation protection

**Design Takeaways:**
- Health Factor is THE key metric - make it unmissable
- Show liquidation threshold clearly
- Color-coded risk zones work well

---

### 2. Morpho Blue

**URL:** https://app.morpho.org

**Key Differentiators:**
- Isolated markets (single collateral + loan asset per market)
- Immutable market parameters
- Peer-to-peer matching for better rates
- 100% capital utilization when matched

**UI Patterns:**
- Clean, minimal interface
- Market-centric view (each market is distinct)
- Focus on rates (supply/borrow APY prominent)
- Curators create and manage markets

**Relevance to Curvance:**
- Curvance also uses isolated markets (2 tokens per market)
- Both have thesis-driven approach
- Morpho's minimal UI is a good reference for simplicity

**Design Takeaways:**
- Market isolation should be visually clear
- Show market parameters prominently
- Rate comparison is key UX element

---

### 3. Jupiter (jup.ag)

**URL:** https://jup.ag

**Key Features:**
- DEX aggregator on Solana
- "Ultra Swap" - fastest execution
- DCA (Dollar Cost Averaging)
- Limit orders
- Perps trading

**UI Patterns:**
- Simple swap interface (token pair selection)
- Route visualization showing path
- Real-time price updates
- Mobile-first design
- "Zero configuration" philosophy

**Relevance to Curvance:**
- One-click operations philosophy aligns
- Jupiter's mobile wallet app is excellent reference
- Clean token selector pattern

**Design Takeaways:**
- Token selector should be fast and searchable
- Show route/path for complex operations
- Price impact clearly visible before swap

---

### 4. Kamino Finance

**URL:** https://kamino.finance

**Key Features:**
- "Multiply" vaults (leveraged positions)
- E-Mode for LST/SOL pairs (up to 10x leverage)
- Automated position management
- Flash loans for one-click leverage

**UI Patterns:**
- Leverage slider with position preview
- Net APY calculation shown clearly
- Liquidation risk indicator
- Position breakdown (Collateral/Debt/LTV)

**Multiply Flow Example:**
```
Input: 1000 SOL, 8x multiplier
Result:
- Total Exposure: 8000 SOL
- Total Debt: 7000 SOL  
- LTV: 87.5%
- Net APY: 14%
```

**Relevance to Curvance:**
- Very similar to Curvance's one-click leverage
- E-Mode similar to Curvance's correlated market handling
- Position preview pattern is essential

**Design Takeaways:**
- MUST show position preview before leverage
- Calculate and display Net APY
- LTV slider with resulting health factor
- Clear liquidation price indication

---

### 5. Pendle Finance

**URL:** https://app.pendle.finance

**Key Features:**
- Yield tokenization (PT + YT)
- PT = Principal Token (fixed yield at maturity)
- YT = Yield Token (variable yield stream)
- AMM for PT/YT trading

**UI Patterns:**
- Maturity date prominently displayed
- "Implied APY" vs "Underlying APY" comparison
- Dashboard for claiming yields
- Calculator for strategy estimation

**Relevance to Curvance:**
- Curvance supports Pendle LP/PT as collateral
- Complex yield products need clear explanations
- Maturity concepts similar to veCVE lock periods

**Design Takeaways:**
- Time-based products need countdown/maturity displays
- APY breakdown is essential (base + rewards)
- Provide calculators for complex strategies

---

## Indirect Competitors

### 6. Stargate Finance

**URL:** https://stargate.finance

**Key Features:**
- Cross-chain bridge (LayerZero)
- Native USDC/USDT bridging
- Instant Guaranteed Finality
- 80+ chains supported

**UI Patterns:**
- Source → Destination chain selector
- Asset amount input
- Fee breakdown (gas + protocol)
- Transaction progress tracker

**Relevance to Curvance:**
- Curvance uses cross-chain via Wormhole plugins
- Bridge UX patterns applicable
- Chain selection UI reference

**Design Takeaways:**
- Chain selector should show logos + names
- Estimated time + fees before confirmation
- Progress stepper for multi-step operations

---

### 7. Uniswap

**URL:** https://app.uniswap.org

**Key Features:**
- Premier DEX interface
- Token swap with best routing
- Liquidity provision
- V4 hooks for customization

**UI Patterns (Ethereum.org DEX Best Practices):**
- Token on right side (current standard)
- Balance shown near token selector
- Fiat equivalent always visible
- Price impact shown in brackets
- Button doubles as contextual help/error

**Key UI Elements:**
```
┌─────────────────────────────┐
│ Balance: 1.5 ETH            │
│ [___1.0___] [ETH ▼]         │
│ ≈ $3,245.80                 │
├─────────────────────────────┤
│            ⇅                │
├─────────────────────────────┤
│ Balance: 0 USDC             │
│ [__3,200__] [USDC ▼]        │
│ ≈ $3,200.00 (-1.4%)         │
└─────────────────────────────┘
     [ Swap ]  or  
     [ Connect Wallet ]
```

**Uniswap UX Improvements (2023):**
- Faster quotes (sub-second)
- Auto-detect Fee-on-Transfer tokens
- Swap protection (private mempool)
- Refreshed design: high-contrast + legible type

**Design Takeaways:**
- Token on RIGHT is current standard
- Show fiat equivalent ALWAYS
- Button = contextual help (error states)
- Price impact near output amount
- Approve + Swap in single flow

---

## UI Inspiration (Web2)

### 8. Kraken Pro

**URL:** https://pro.kraken.com

**Key Features:**
- Professional trading interface
- Spot, margin, derivatives, staking
- Unified portfolio view
- Dark mode default

**UI Patterns:**
- Dense information display for pro users
- Customizable layout panels
- Real-time data feeds
- Consolidated portfolio tracking

**What They Do Well:**
- Dark theme executed perfectly
- Numbers are the focus (data-dense)
- Clear typography hierarchy
- Staking integrated seamlessly

**Design Takeaways:**
- Pro interfaces can show more data
- Dark mode is essential for trading
- Portfolio overview consolidates complexity
- Staking rewards should be easily visible

---

### 9. Robinhood

**URL:** https://robinhood.com

**Won Apple Design Award (2015) & Google Material Design Award (2016)**

**Core Design Philosophy:**
1. **User-Centric**: Friendly, not intimidating
2. **Simplicity**: No clutter, clear user flows
3. **Clear Communication**: Only useful notifications

**UI Patterns:**
- Large, tappable cards for onboarding
- Data visualization (charts/graphs)
- Minimal cognitive load
- Functional animations
- Micro-interactions for delight

**Key Principles:**
```
"Present the most relevant information 
as clearly as possible to enable 
informed decisions."
```

**Trading App Best Practices (from analysis):**
1. **Intuitiveness**: Learn once, use everywhere
2. **Gamification**: Subtle, not overwhelming
3. **Functional Animation**: Guide users, reduce load
4. **Micro-interactions**: Delight on actions
5. **Data Visualization**: Charts > raw numbers
6. **Accessibility**: Font size, contrast, assistive tech

**Design Takeaways:**
- Simplicity wins for mass adoption
- Notifications should be informational only
- Charts make complex data digestible
- Animation guides, doesn't distract
- WCAG accessibility standards

---

## DEX Design Best Practices (Ethereum.org)

### Basic Anatomy
1. **Main Form** (token inputs)
2. **Button** (action + contextual help)
3. **Details Panel** (expandable/collapsible)

### Key Info to Include
- Wallet balance
- Max button
- Fiat equivalent
- Price impact
- Slippage tolerance
- Minimum received
- Gas estimate
- Order routing (optional)

### Button Behavior
- **NO separate Approve button**
- Show progress: "tx 1 of 2 - approving"
- Button = error state + actionable fix
  - "Connect Wallet" → clicks to connect
  - "Switch to Ethereum" → clicks to switch
  - "Insufficient Balance" → disabled

### Token Position
- **Current standard: Token on RIGHT**
- Fiat equivalent below
- Balance near token selector
- Price impact in brackets

---

## Design Recommendations for Curvance

### Must-Have Elements

1. **Health Factor Display**
   - Large, prominent (not hidden)
   - Color zones: Green (>1.5), Yellow (1-1.5), Red (<1)
   - Show as RATIO not percentage
   - Soft/Hard liquidation zone indicators

2. **Dual Oracle Status**
   - Two oracle icons per market
   - Status indicator: Normal/Caution/Frozen
   - Tooltip explaining circuit breaker

3. **Position Preview (Leverage)**
   ```
   Before:            After 3x:
   Collateral: $10K   Collateral: $30K
   Debt: $0           Debt: $20K
   Health: ∞          Health: 1.5
                      Liq Price: $X
   ```

4. **APY Breakdown**
   - Base APY
   - CVE Emissions
   - Bytes Boost (veCVE)
   - Partner Rewards
   - = Total APY

5. **Collateral/Debt Caps**
   - Progress bars showing utilization
   - "X% of cap used"

### Design Style Recommendations

| Element | Recommendation | Reference |
|---------|----------------|-----------|
| Theme | Dark mode default | Kraken Pro |
| Token selector | Right side, searchable | Uniswap |
| Numbers | High contrast, legible | Kraken |
| Charts | For health factor visualization | Robinhood |
| Animations | Functional, guide user | Robinhood |
| Button | Contextual error states | Uniswap |
| Complexity | Hideable details panel | Ethereum.org |

### Mobile-First Patterns (Jupiter Reference)
- Bottom sheet for actions
- Large touch targets (44px min)
- Token selector as modal
- Swipe gestures for navigation

---

## Technical Constraints Reminder

When implementing any design, remember Curvance's unique constraints:

1. **20-minute cooldown** after deposit/borrow
2. **Oracle error codes** (0/1/2) affect available actions
3. **Markets are 2-token pairs** (immutable after creation)
4. **Health Factor is a RATIO** (1.5, not 150%)
5. **Soft→Hard liquidation** is gradual (lFactor)
6. **Auction-based liquidations** have priority

---

## Resources

### Figma Kits
- [DEX Wireframes Kit](https://www.figma.com/community/file/1393606680816807382/dex-wireframes-kit) (Ethereum.org)
- [Crypto Token Swap UI](https://www.figma.com/community/file/1336382060107185852/crypto-token-swap-ui)

### Documentation
- [Aave V3 Docs](https://aave.com/docs/aave-v3/overview)
- [Kamino Multiply Docs](https://docs.kamino.finance/products/multiply/how-it-works)
- [Pendle Docs](https://docs.pendle.finance)
- [Uniswap Blog - UX Improvements](https://blog.uniswap.org/uniswap-swap-ux-improvements)

### Mobbin (UI Patterns)
- Search "Robinhood" for fintech patterns
- Search "Kraken" for crypto trading
- Filter by iOS/Android for mobile patterns
