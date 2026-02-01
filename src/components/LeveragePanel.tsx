'use client';
import { TrendingUp, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { Tooltip } from './Tooltip';
import { useState } from 'react';

interface LeveragePanelProps {
  position: {
    initialDeposit: number;
    totalCollateral: number;
    totalBorrowed: number;
    actualLeverage: number;
    liquidationPrice: number;
    healthFactor: number;
    netAPY: number;
    loops: number;
    totalDebt: number;
  };
  collateralSymbol: string;
  loanSymbol: string;
  collateralPrice: number;
  maxLeverage: number;
}

export function LeveragePanel({
  position,
  collateralSymbol,
  loanSymbol,
  collateralPrice,
  maxLeverage,
}: LeveragePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get risk level based on health factor
  const getRiskLevel = (healthFactor: number) => {
    if (healthFactor > 1.5) return { label: 'Safe', color: 'text-green-400', bgColor: 'bg-green-400/20', borderColor: 'border-green-400/50' };
    if (healthFactor > 1.2) return { label: 'Moderate', color: 'text-yellow-400', bgColor: 'bg-yellow-400/20', borderColor: 'border-yellow-400/50' };
    return { label: 'Risky', color: 'text-red-400', bgColor: 'bg-red-400/20', borderColor: 'border-red-400/50' };
  };

  const riskLevel = getRiskLevel(position.healthFactor);

  return (
    <div className="space-y-3 p-4 bg-white/[0.02] rounded-xl border border-white/5">
      {/* Key Metrics - Always Visible */}
      <div className="space-y-3">
        {/* Net APY */}
        <div className="flex items-center justify-between">
          <Tooltip content="Net APY after accounting for borrow costs. Your actual yield on the leveraged position.">
            <span className="text-white/50 text-sm cursor-help">Net APY</span>
          </Tooltip>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-green-400" />
            <span className="text-green-400 font-medium">{(position.netAPY * 100).toFixed(2)}%</span>
          </div>
        </div>

        {/* Projected Earnings */}
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm">Projected monthly</span>
          <span className="text-white">${((position.totalCollateral * collateralPrice * position.netAPY) / 12).toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-white/50 text-sm">Projected yearly</span>
          <span className="text-white">${(position.totalCollateral * collateralPrice * position.netAPY).toFixed(2)}</span>
        </div>

        <div className="border-t border-white/5 pt-3 space-y-2">
          {/* Health Factor */}
          <div className="flex items-center justify-between">
            <Tooltip content="Health factor indicates how far you are from liquidation. Higher is safer. Below 1.0 means liquidation.">
              <span className="text-white/50 text-sm cursor-help">Health Factor</span>
            </Tooltip>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${riskLevel.bgColor} border ${riskLevel.borderColor}`}>
              <span className={`${riskLevel.color} font-medium text-sm`}>{position.healthFactor.toFixed(2)}</span>
              <span className={`${riskLevel.color} text-xs`}>{riskLevel.label}</span>
            </div>
          </div>
          
          {/* Liquidation Price */}
          <div className="flex items-center justify-between">
            <Tooltip content={`If ${collateralSymbol} price falls to this level, your position will be liquidated to repay the debt`}>
              <span className="text-white/50 text-sm cursor-help">Liquidation Price</span>
            </Tooltip>
            <div className="flex items-center gap-1.5">
              <span className="text-white text-sm">${position.liquidationPrice.toFixed(2)}</span>
              <span className="text-red-400 text-xs">
                ({(((position.liquidationPrice - collateralPrice) / collateralPrice) * 100).toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Position Details */}
      <div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full py-2 px-2 -mx-2 hover:bg-white/[0.02] rounded-lg transition-colors"
        >
          <span className="text-white/50 text-xs tracking-wide">Position Details</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-white/40" />
          ) : (
            <ChevronDown className="w-4 h-4 text-white/40" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-2 space-y-2 pt-2 border-t border-white/5">
            {/* Leverage Info */}
            <div className="flex items-center justify-between">
              <span className="text-white/50 text-xs">Leverage</span>
              <div className="flex items-center gap-1.5">
                <span className="text-[#5740CE] font-medium text-xs">{position.actualLeverage.toFixed(2)}x</span>
                <span className="text-white/40 text-[10px]">/ {maxLeverage.toFixed(1)}x max</span>
              </div>
            </div>

            {/* Loops */}
            <div className="flex items-center justify-between">
              <Tooltip content="Number of recursive borrow-deposit loops executed to achieve target leverage">
                <span className="text-white/50 text-xs cursor-help">Loops</span>
              </Tooltip>
              <span className="text-white/70 text-xs">{position.loops} iterations</span>
            </div>

            {/* Initial Deposit */}
            <div className="flex items-center justify-between">
              <Tooltip content="The amount you are depositing to start this leveraged position">
                <span className="text-white/50 text-xs cursor-help">Initial Deposit</span>
              </Tooltip>
              <span className="text-white text-xs">{position.initialDeposit.toFixed(4)} {collateralSymbol}</span>
            </div>
            
            {/* Total Position */}
            <div className="flex items-center justify-between">
              <Tooltip content="Total collateral after leverage looping. This is your full exposure to the asset.">
                <span className="text-white/50 text-xs cursor-help">Total Position</span>
              </Tooltip>
              <span className="text-green-400 font-medium text-xs">{position.totalCollateral.toFixed(4)} {collateralSymbol}</span>
            </div>
            
            {/* Total Borrowed */}
            <div className="flex items-center justify-between">
              <Tooltip content="Total amount borrowed across all loops. This is your debt that needs to be repaid.">
                <span className="text-white/50 text-xs cursor-help">Total Borrowed</span>
              </Tooltip>
              <span className="text-orange-400 text-xs">{position.totalBorrowed.toFixed(4)} {loanSymbol}</span>
            </div>
            
            {/* Total Debt Value */}
            <div className="flex items-center justify-between">
              <Tooltip content="Total debt value in USD">
                <span className="text-white/50 text-xs cursor-help">Total Debt</span>
              </Tooltip>
              <span className="text-orange-400 text-xs">${position.totalDebt.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Warning Banner */}
      {position.healthFactor < 1.2 && (
        <div className="p-2.5 bg-red-400/10 border border-red-400/30 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-red-400/90">
            <strong>High Risk:</strong> Close to liquidation. Price drops may result in loss of collateral.
          </div>
        </div>
      )}

      {position.healthFactor >= 1.2 && position.healthFactor < 1.5 && (
        <div className="p-2.5 bg-yellow-400/10 border border-yellow-400/30 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-yellow-400/90">
            <strong>Moderate Risk:</strong> Monitor price movements to avoid liquidation.
          </div>
        </div>
      )}
    </div>
  );
}