'use client';

import { WBTCIcon, USDCIcon, WETHIcon, AUSDIcon, WMONIcon, AprMONIcon, SAUSDIcon } from './TokenIcons';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

/**
 * HOVER CARD DESIGN SYSTEM
 * ========================
 * Padding: p-4 (16px)
 * Section gap: space-y-3 (16px)
 * Row gap: space-y-3 (12px)
 * 
 * Typography:
 * - Label: text-xs text-white/40 (12px)
 * - Main value: text-base font-medium text-white (16px)
 * - Asset name: text-sm font-medium text-white (14px)
 * - Secondary value: text-sm text-white/60 (14px)
 * - Tertiary: text-xs text-white/40 (12px)
 * 
 * Icons:
 * - Asset row: w-5 h-5 (20px)
 * - Small/inline: w-4 h-4 (16px)
 */

// Token icon mapping
const TOKEN_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  USDC: USDCIcon,
  wETH: WETHIcon,
  wBTC: WBTCIcon,
  AUSD: AUSDIcon,
  wMON: WMONIcon,
  aprMON: AprMONIcon,
  sAUSD: SAUSDIcon,
};

function TokenIcon({ symbol, className = "w-5 h-5" }: { symbol: string; className?: string }) {
  const Icon = TOKEN_ICONS[symbol];
  return Icon ? <Icon className={className} /> : null;
}

// ============================================
// MARKET ASSETS HOVER
// ============================================
interface MarketAsset {
  symbol: string;
  name: string;
  type: 'collateral' | 'borrow';
  value?: string;
}

interface MarketAssetsHoverProps {
  marketName: string;
  collateralAssets: MarketAsset[];
  borrowAssets: MarketAsset[];
  oracleName: string;
  totalCollateral?: string;
  totalBorrowed?: string;
  utilization?: number;
}

export function MarketAssetsHover({ 
  collateralAssets, 
  borrowAssets,
  totalCollateral,
  totalBorrowed,
  utilization,
}: MarketAssetsHoverProps) {
  return (
    <div className="p-3">
      {/* Collateral */}
      <div className="pb-3 border-b border-white/[0.08]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/40">Collateral</span>
          {totalCollateral && (
            <span className="text-xs text-white/60 tabular-nums">{totalCollateral}</span>
          )}
        </div>
        <div className="space-y-2">
          {collateralAssets.map((asset) => (
            <div key={asset.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TokenIcon symbol={asset.symbol} />
                <span className="text-xs font-medium text-white">{asset.symbol}</span>
              </div>
              {asset.value && (
                <span className="text-xs text-white/60 tabular-nums">{asset.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Borrow */}
      <div className="pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">Borrowed</span>
            {utilization !== undefined && (
              <span className="text-[10px] text-orange-400/80">{utilization}% util</span>
            )}
          </div>
          {totalBorrowed && (
            <span className="text-xs text-white/60 tabular-nums">{totalBorrowed}</span>
          )}
        </div>
        <div className="space-y-2">
          {borrowAssets.map((asset) => (
            <div key={asset.symbol} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TokenIcon symbol={asset.symbol} />
                <span className="text-xs font-medium text-white">{asset.symbol}</span>
              </div>
              {asset.value && (
                <span className="text-xs text-white/60 tabular-nums">{asset.value}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// ORACLE HOVER (for oracle icon tooltip)
// ============================================
interface OracleAsset {
  symbol: string;
  oracle: string;
}

interface OracleHoverProps {
  oracles: OracleAsset[];
}

export function OracleHover({ oracles }: OracleHoverProps) {
  // Check if all oracles are the same
  const allSame = oracles.every(o => o.oracle === oracles[0]?.oracle);
  
  return (
    <div className="p-3">
      <p className="text-xs text-white/40 mb-2">Price Feeds</p>
      {allSame ? (
        // Single oracle for all assets
        <p className="text-sm font-medium text-white">{oracles[0]?.oracle}</p>
      ) : (
        // Different oracles per asset
        <div className="space-y-1.5">
          {oracles.map((item) => (
            <div key={item.symbol} className="flex items-center justify-between gap-4">
              <span className="text-xs text-white/60">{item.symbol}</span>
              <span className="text-xs font-medium text-white">{item.oracle}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-[10px] text-white/30 mt-2">Provides real-time asset prices</p>
    </div>
  );
}

// ============================================
// DEPOSITS BREAKDOWN HOVER
// ============================================
interface AssetBreakdown {
  symbol: string;
  amount: string;
  value: string;
  percentage: number;
}

interface DepositsBreakdownHoverProps {
  totalDeposits: string;
  totalDepositsExact: string;
  assets: AssetBreakdown[];
  trend?: {
    value: string;
    percentage: string;
    isPositive: boolean;
  };
}

export function DepositsBreakdownHover({ 
  totalDepositsExact, 
  assets, 
}: DepositsBreakdownHoverProps) {
  return (
    <div className="p-3">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <p className="text-xs text-white/40 mb-0.5">Total Deposits</p>
        <p className="text-sm font-medium text-white tabular-nums">
          {totalDepositsExact}
        </p>
      </div>

      {/* Breakdown */}
      <div className="pt-3 space-y-3">
        {assets.map((asset) => (
          <div key={asset.symbol}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TokenIcon symbol={asset.symbol} />
                <span className="text-xs font-medium text-white">{asset.symbol}</span>
                <span className="text-[10px] text-white/40">{asset.percentage}%</span>
              </div>
              <span className="text-xs text-white/60 tabular-nums">{asset.value}</span>
            </div>
            <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full transition-all"
                style={{ width: `${asset.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// LIQUIDITY BREAKDOWN HOVER
// ============================================
interface LiquidityAsset {
  symbol: string;
  available: string;
  total: string;
  utilizationRate: number;
}

interface LiquidityBreakdownHoverProps {
  totalLiquidity: string;
  totalLiquidityExact: string;
  assets: LiquidityAsset[];
}

export function LiquidityBreakdownHover({ 
  totalLiquidityExact, 
  assets 
}: LiquidityBreakdownHoverProps) {
  const getBarColor = (rate: number) => {
    if (rate < 50) return 'bg-emerald-500';
    if (rate < 75) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-3">
      {/* Header */}
      <div className="pb-3 border-b border-white/[0.08]">
        <p className="text-xs text-white/40 mb-0.5">Available Liquidity</p>
        <p className="text-sm font-medium text-white tabular-nums">
          {totalLiquidityExact}
        </p>
      </div>

      {/* Breakdown */}
      <div className="pt-3 space-y-3">
        {assets.map((asset) => {
          const available = 100 - asset.utilizationRate;
          return (
            <div key={asset.symbol}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TokenIcon symbol={asset.symbol} />
                  <span className="text-xs font-medium text-white">{asset.symbol}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white/60 tabular-nums">{asset.available}</span>
                  <span className="text-[10px] text-white/40">{available}%</span>
                </div>
              </div>
              <div className="h-1 bg-white/[0.08] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${getBarColor(asset.utilizationRate)}`}
                  style={{ width: `${available}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// DEPOSIT APY HOVER - Shows both assets
// ============================================
interface AssetAPY {
  symbol: string;
  baseAPY: string;
  rewardAPY?: string;
  rewardToken?: string;
  totalAPY: string;
}

interface DepositAPYHoverProps {
  assets: AssetAPY[];
}

export function DepositAPYHover({ assets }: DepositAPYHoverProps) {
  return (
    <div className="p-3">
      <p className="text-xs text-white/40 mb-3">Deposit APY by asset</p>
      
      <div className="space-y-3">
        {assets.map((asset, idx) => (
          <div key={asset.symbol}>
            {idx > 0 && <div className="border-t border-white/[0.08] mb-3" />}
            
            {/* Asset header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TokenIcon symbol={asset.symbol} />
                <span className="text-sm font-medium text-white">{asset.symbol}</span>
              </div>
              <span className="text-sm font-semibold text-emerald-400 tabular-nums">
                {asset.totalAPY}
              </span>
            </div>
            
            {/* Breakdown */}
            <div className="space-y-1.5 pl-7">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Base Rate</span>
                <span className="text-xs text-white/60 tabular-nums">{asset.baseAPY}</span>
              </div>
              {asset.rewardAPY && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {asset.rewardToken && <TokenIcon symbol={asset.rewardToken} className="w-3.5 h-3.5" />}
                    <span className="text-xs text-white/40">Rewards</span>
                  </div>
                  <span className="text-xs text-emerald-400 tabular-nums">+{asset.rewardAPY}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// BORROW APY HOVER - Shows both directions
// ============================================
interface BorrowDirection {
  collateral: string;
  borrow: string;
  borrowAPY: string;
  baseAPY: string;
  rewardAPY?: string;
  rewardToken?: string;
}

interface BorrowAPYHoverProps {
  directions: BorrowDirection[];
}

export function BorrowAPYHover({ directions }: BorrowAPYHoverProps) {
  return (
    <div className="p-3">
      <p className="text-xs text-white/40 mb-3">Borrow APY by direction</p>
      
      <div className="space-y-3">
        {directions.map((dir, idx) => (
          <div key={`${dir.collateral}-${dir.borrow}`}>
            {idx > 0 && <div className="border-t border-white/[0.08] mb-3" />}
            
            {/* Direction header: Deposit A → Borrow B */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <TokenIcon symbol={dir.collateral} />
                <ArrowRight className="w-3 h-3 text-white/30" />
                <TokenIcon symbol={dir.borrow} />
                <span className="text-xs text-white/40 ml-0.5">borrow</span>
              </div>
              <span className="text-sm font-semibold text-orange-400 tabular-nums">
                {dir.borrowAPY}
              </span>
            </div>
            
            {/* Breakdown */}
            <div className="space-y-1.5 pl-7">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Base Rate</span>
                <span className="text-xs text-white/60 tabular-nums">{dir.baseAPY}</span>
              </div>
              {dir.rewardAPY && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {dir.rewardToken && <TokenIcon symbol={dir.rewardToken} className="w-3.5 h-3.5" />}
                    <span className="text-xs text-white/40">Rewards</span>
                  </div>
                  <span className="text-xs text-emerald-400 tabular-nums">-{dir.rewardAPY}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Keep old component for backwards compatibility but mark as deprecated
/** @deprecated Use DepositAPYHover or BorrowAPYHover instead */
export function APYBreakdownHover({ 
  assetSymbol, 
  totalAPY, 
  sources, 
  isSupply 
}: {
  assetSymbol: string;
  totalAPY: string;
  sources: { label: string; value: string; type: string; tokenSymbol?: string }[];
  isSupply: boolean;
}) {
  // Convert to new format
  const asset: AssetAPY = {
    symbol: assetSymbol,
    baseAPY: sources.find(s => s.type === 'native')?.value || '0%',
    rewardAPY: sources.find(s => s.type === 'reward')?.value,
    rewardToken: sources.find(s => s.type === 'reward')?.tokenSymbol,
    totalAPY,
  };
  
  if (isSupply) {
    return <DepositAPYHover assets={[asset]} />;
  }
  
  return (
    <BorrowAPYHover 
      directions={[{
        collateral: 'Collateral',
        borrow: assetSymbol,
        borrowAPY: totalAPY,
        baseAPY: asset.baseAPY,
        rewardAPY: asset.rewardAPY,
        rewardToken: asset.rewardToken,
      }]} 
    />
  );
}
