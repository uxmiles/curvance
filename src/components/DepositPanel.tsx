'use client';
import { useState } from 'react';
import { ChevronDown, Sparkles, Check, Loader2 } from 'lucide-react';
import { USDCIcon } from './TokenIcons';

interface Market {
  CollateralIcon: React.ComponentType<{ className?: string }>;
  collateral: string;
  LoanIcon: React.ComponentType<{ className?: string }>;
  loan: string;
  supplyAPY: string;
  borrowAPY: string;
  collateralPrice: number;
  loanPrice: number;
}

interface DepositPanelProps {
  market: Market;
}

type ProcessingStep = 'idle' | 'plugin' | 'approval' | 'deposit' | 'successful' | 'completed';

export function DepositPanel({ market }: DepositPanelProps) {
  const [actionTab, setActionTab] = useState<'deposit' | 'borrow'>('deposit');
  const [amount, setAmount] = useState('');
  const [usdcInputAmount, setUsdcInputAmount] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [processingStep, setProcessingStep] = useState<ProcessingStep>('idle');
  const [lastEditedField, setLastEditedField] = useState<'collateral' | 'usdc'>('collateral');

  // USDC price (stablecoin) and balance
  const usdcPrice = 1.00;
  const usdcBalance = 1250.00;
  
  // Calculate maximum wETH that can be deposited based on USDC balance
  const maxCollateralAmount = (usdcBalance * usdcPrice) / market.collateralPrice;
  
  // Calculate USDC equivalent amount from collateral
  const calculateUSDCFromCollateral = (collateralAmount: string) => {
    if (!collateralAmount || collateralAmount === '') return '';
    const numAmount = parseFloat(collateralAmount);
    if (isNaN(numAmount)) return '';
    
    // Calculate: amount of collateral * price of collateral / USDC price
    const usdcAmount = (numAmount * market.collateralPrice) / usdcPrice;
    return usdcAmount.toFixed(2);
  };

  // Calculate collateral equivalent amount from USDC
  const calculateCollateralFromUSDC = (usdcAmount: string) => {
    if (!usdcAmount || usdcAmount === '') return '';
    const numAmount = parseFloat(usdcAmount);
    if (isNaN(numAmount)) return '';
    
    // Calculate: amount of USDC * USDC price / collateral price
    const collateralAmount = (numAmount * usdcPrice) / market.collateralPrice;
    return collateralAmount.toFixed(6);
  };

  // Get the displayed USDC amount based on last edited field
  const displayedUSDCAmount = lastEditedField === 'usdc' 
    ? usdcInputAmount 
    : calculateUSDCFromCollateral(amount);

  // Get the displayed collateral amount based on last edited field
  const displayedCollateralAmount = lastEditedField === 'collateral'
    ? amount
    : calculateCollateralFromUSDC(usdcInputAmount);
  
  // Check if user has insufficient funds
  const hasInsufficientFunds = parseFloat(displayedUSDCAmount || '0') > usdcBalance;

  // Handle MAX button click for USDC
  const handleMaxUSDC = () => {
    setUsdcInputAmount(usdcBalance.toFixed(2));
    setLastEditedField('usdc');
  };

  // Handle collateral input change
  const handleCollateralChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setLastEditedField('collateral');
    }
  };

  // Handle USDC input change
  const handleUSDCChange = (value: string) => {
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setUsdcInputAmount(value);
      setLastEditedField('usdc');
    }
  };

  // Handle deposit process
  const handleDeposit = async () => {
    const collateralValue = parseFloat(displayedCollateralAmount || '0');
    if (collateralValue === 0) return;

    // Step 1: Plugin
    setProcessingStep('plugin');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 2: Approval
    setProcessingStep('approval');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Step 3: Deposit
    setProcessingStep('deposit');
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Step 4: Successful
    setProcessingStep('successful');
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Step 5: Completed
    setProcessingStep('completed');
  };

  // Handle reset to go back to form
  const handleReset = () => {
    setProcessingStep('idle');
    setAmount('');
    setUsdcInputAmount('');
    setLeverage(1);
    setLastEditedField('collateral');
  };

  // Calculate health factor based on amount and leverage
  const calculateHealthFactor = () => {
    const numAmount = parseFloat(amount) || 0;
    
    // Base health factor starts at 100
    let healthFactor = 100;
    
    // Leverage impact: higher leverage = lower health factor
    // 1x leverage = no penalty (100%)
    // 12x leverage = maximum penalty (~20%)
    const leveragePenalty = ((leverage - 1) / (12 - 1)) * 80; // 0% to 80% penalty
    healthFactor -= leveragePenalty;
    
    // Amount deposited can improve health factor slightly (up to +10%)
    const amountBonus = Math.min(10, (numAmount / 100) * 10);
    healthFactor += amountBonus;
    
    // Clamp between 0 and 100
    return Math.max(0, Math.min(100, Math.round(healthFactor)));
  };

  const healthFactor = calculateHealthFactor();

  // Render processing view
  if (processingStep !== 'idle') {
    const steps = [
      { id: 1, label: 'Plugin', step: 'plugin' },
      { id: 2, label: 'Approval', step: 'approval' },
      { id: 3, label: 'Deposit', step: 'deposit' },
      { id: 4, label: 'Successful', step: 'successful' }
    ];

    const currentStepIndex = steps.findIndex(s => s.step === processingStep);
    const isCompleted = processingStep === 'completed';

    return (
      <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 min-h-[600px] flex flex-col items-center justify-center">
        {/* Large Icon */}
        <div className="mb-8">
          {isCompleted ? (
            <div className="w-20 h-20 rounded-full bg-gradient-to-b from-emerald-500/20 to-emerald-600/20 border-2 border-emerald-500 flex items-center justify-center">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#1A1A1A] border border-white/10 flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-white/60 animate-spin" />
            </div>
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="text-center mb-12">
          <h2 className="text-white text-2xl font-semibold mb-2">
            {isCompleted ? 'Transaction Completed' : 'Depositing Assets'}
          </h2>
          <p className="text-white/40 text-sm">
            {isCompleted 
              ? `${displayedCollateralAmount} ${market.collateral} deposit successful`
              : 'Confirming deposit on blockchain'
            }
          </p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center gap-3 mb-12">
          {steps.map((step, index) => {
            const isActive = currentStepIndex === index;
            const isDone = currentStepIndex > index || isCompleted;
            
            return (
              <div key={step.id} className="flex items-center gap-3">
                {/* Step Circle */}
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isDone || isCompleted
                      ? 'bg-gradient-to-b from-emerald-500 to-emerald-600 border-2 border-emerald-500'
                      : isActive
                      ? 'bg-[#1A1A1A] border-2 border-white/20'
                      : 'bg-[#1A1A1A] border border-white/10'
                  }`}>
                    {isDone || isCompleted ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : isActive ? (
                      <Loader2 className="w-5 h-5 text-white/60 animate-spin" />
                    ) : (
                      <span className="text-white/30 text-sm font-medium">{step.id}</span>
                    )}
                  </div>
                  <span className={`text-xs transition-colors ${
                    isDone || isCompleted ? 'text-emerald-500' : isActive ? 'text-white/60' : 'text-white/30'
                  }`}>
                    {step.label}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-6 h-0.5 mb-6 transition-colors ${
                    isDone || isCompleted ? 'bg-emerald-500' : 'bg-white/10'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons - Only show when completed */}
        {isCompleted && (
          <div className="flex items-center gap-3 w-full max-w-sm">
            <button className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors">
              View Transaction
            </button>
            <button 
              onClick={handleReset}
              className="flex-1 py-3 rounded-xl bg-gradient-to-b from-[#5740CE] to-[#8B5CF6] hover:from-[#6850DE] hover:to-[#9B6CF7] text-white font-medium transition-all shadow-lg shadow-purple-500/25"
            >
              View Position
            </button>
          </div>
        )}
      </div>
    );
  }

  // Calculate slider position - visual offset so 1x doesn't cover the input
  // Map 1x-12x to start at ~3% position instead of 0%
  const getLeveragePosition = () => {
    const visualOffset = 3; // Start at 3% instead of 0%
    const visualRange = 97; // Use 97% of the slider width (from 3% to 100%)
    return visualOffset + ((leverage - 1) / (12 - 1)) * visualRange;
  };

  const handleLeverageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLeverage(parseFloat(e.target.value));
  };

  const handleLeverageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ''); // Only numbers
    if (value === '') {
      setLeverage(1);
      return;
    }
    const numValue = parseInt(value);
    if (numValue >= 1 && numValue <= 12) {
      setLeverage(numValue);
    } else if (numValue > 12) {
      setLeverage(12);
    }
  };

  return (
    <div className="bg-transparent rounded-2xl">
      {/* Tabs with Settings */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 flex gap-1 bg-[#1A1A1A] rounded-xl p-1">
          <button
            onClick={() => setActionTab('deposit')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              actionTab === 'deposit'
                ? 'bg-[#2A2A2A] text-white'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            Deposit
          </button>
          <button
            onClick={() => setActionTab('borrow')}
            className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              actionTab === 'borrow'
                ? 'bg-[#2A2A2A] text-white'
                : 'text-white/40 hover:text-white/60'
            }`}
          >
            Borrow
          </button>
        </div>
        <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>

      {/* Collateral Token Card */}
      <div className="bg-[#1A1A1A] rounded-xl p-4 mb-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 flex-1">
            {actionTab === 'deposit' ? (
              <market.CollateralIcon className="w-8 h-8 rounded-full" />
            ) : (
              <market.LoanIcon className="w-8 h-8 rounded-full" />
            )}
            <div className="flex-1">
              <div className="text-white font-medium">
                {actionTab === 'deposit' ? market.collateral : market.loan}
              </div>
              <div className="text-white/40 text-xs">
                {actionTab === 'deposit' ? 'Supplying as Collateral' : 'Borrowing'}
              </div>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-white/40" />
        </div>

        <div className="mb-2">
          <input
            type="text"
            placeholder="0.00"
            value={displayedCollateralAmount}
            onChange={(e) => handleCollateralChange(e.target.value)}
            className="w-3/5 bg-transparent text-white text-3xl font-light placeholder:text-white/20 focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-white/40">
            ${displayedCollateralAmount ? (parseFloat(displayedCollateralAmount) * market.collateralPrice).toFixed(2) : '0.00'}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-white/40">
              0 {actionTab === 'deposit' ? market.collateral : market.loan}
            </span>
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <button
              onClick={() => setAmount('0')}
              className="px-2 py-0.5 bg-white/5 hover:bg-white/10 rounded text-white/60 hover:text-white transition-colors text-xs font-medium"
            >
              MAX
            </button>
          </div>
        </div>
      </div>

      {/* Pay With Card - Only show in deposit mode */}
      {actionTab === 'deposit' && (
        <div className={`rounded-xl p-4 mb-4 transition-colors ${
          hasInsufficientFunds ? 'bg-red-500/10 border border-red-500/20' : 'bg-[#1A1A1A]'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 flex-1">
              <USDCIcon className="w-6 h-6 rounded-full" />
              <div className="flex-1">
                <div className="text-white/60 text-xs">You pay in USDC</div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-white/40" />
          </div>

          <div className="mb-1">
            <input
              type="text"
              placeholder="0.00"
              value={displayedUSDCAmount}
              onChange={(e) => handleUSDCChange(e.target.value)}
              className={`w-3/5 bg-transparent text-xl font-light placeholder:text-white/20 focus:outline-none transition-colors ${
                hasInsufficientFunds ? 'text-red-400' : 'text-white'
              }`}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              onClick={handleMaxUSDC}
              className="text-white/40 hover:text-white/60 text-xs transition-colors"
            >
              Balance: {usdcBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC
            </button>
            
            {hasInsufficientFunds && (
              <span className="text-red-400 text-xs font-medium">
                Insufficient funds
              </span>
            )}
          </div>
        </div>
      )}

      {/* Leverage Slider */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <input
            type="text"
            value={`${leverage.toFixed(0)}x`}
            onChange={handleLeverageInputChange}
            className="w-[60px] px-4 py-2 bg-[#1A1A1A] rounded-lg text-white font-medium text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#5740CE]/50 cursor-text"
          />
          <div className="flex-1 relative h-10 flex items-center">
            {/* Invisible input range overlay - expanded hit area */}
            <input
              type="range"
              min="1"
              max="12"
              step="0.01"
              value={leverage}
              onChange={handleLeverageChange}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
              className="absolute inset-0 w-full h-full opacity-0 z-10"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            />
            
            {/* Track container */}
            <div className="relative w-full h-4">
              {/* Background track */}
              <div className="absolute inset-0 bg-[#1A1A1A] rounded-full" />
              
              {/* Active track (purple gradient or gray when 1x) */}
              <div 
                className={`absolute left-0 top-0 bottom-0 rounded-full transition-all duration-150 ease-out ${
                  leverage === 1 
                    ? 'bg-[#3A3A3A]' 
                    : 'bg-gradient-to-r from-[#7B68EE] via-[#8B7FEF] to-[#9B8FF0]'
                }`}
                style={{ width: `${getLeveragePosition()}%` }}
              />
              
              {/* Dots markers */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[33%] w-2 h-2 bg-[#2A2A2A] rounded-full pointer-events-none" />
              <div className="absolute top-1/2 -translate-y-1/2 left-[50%] w-2 h-2 bg-[#2A2A2A] rounded-full pointer-events-none" />
              <div className="absolute top-1/2 -translate-y-1/2 left-[66%] w-2 h-2 bg-[#2A2A2A] rounded-full pointer-events-none" />
              
              {/* Thumb - large circle with gradient/gray and glow */}
              <div 
                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 pointer-events-none transition-all duration-150 ease-out ${
                  isDragging ? 'scale-110' : 'scale-100'
                }`}
                style={{ left: `${getLeveragePosition()}%` }}
              >
                {/* Glow effect - only show when not at 1x, stronger when dragging */}
                {leverage > 1 && (
                  <div className={`absolute inset-0 bg-[#7B68EE] rounded-full blur-md transition-opacity duration-150 ${
                    isDragging ? 'opacity-80' : 'opacity-60'
                  }`} />
                )}
                {/* Main thumb */}
                <div className={`absolute inset-0 rounded-full border-2 shadow-lg transition-all duration-150 ease-out ${
                  leverage === 1
                    ? 'bg-[#4A4A4A] border-[#5A5A5A]'
                    : 'bg-gradient-to-br from-[#9B8FF0] to-[#7B68EE] border-[#B8ACF5]'
                } ${isDragging ? 'shadow-xl shadow-purple-500/30' : ''}`} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-white/50">
          <span>Max Leverage</span>
          <span>12x</span>
        </div>
      </div>

      {/* Market Info Container */}
      <div className="bg-[#1A1A1A] rounded-xl p-4 space-y-3 text-sm mb-4">
        <div className="flex items-center justify-between">
          <span className="text-white/50">Market</span>
          <span className="text-white">{market.collateral} | {market.loan}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-white/50">vAPY</span>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#5740CE]" />
            <span className="text-white">23.74%</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-white/50">Projected Daily Earnings</span>
          <span className="text-white">$0</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-white/50">Borrowing Eligibility</span>
          <div className="flex items-center -space-x-2">
            <market.CollateralIcon className="w-5 h-5 rounded-full border border-[#141414]" />
            <market.LoanIcon className="w-5 h-5 rounded-full border border-[#141414]" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-white/50">Position Health</span>
          <div className="flex items-center gap-2">
            {/* Position Health SVG Bars */}
            <svg width="64" height="16" viewBox="0 0 64 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              {[...Array(14)].map((_, i) => {
                const barThreshold = (i + 1) * (100 / 14); // Each bar represents ~7.14%
                const isActive = healthFactor >= barThreshold;
                
                // Color gradient: red → orange → yellow → green
                let color = 'rgba(255, 255, 255, 0.15)'; // Inactive gray
                
                if (isActive) {
                  if (i < 3) {
                    color = '#EF4444'; // Red
                  } else if (i < 6) {
                    color = '#F97316'; // Orange
                  } else if (i < 9) {
                    color = '#EAB308'; // Yellow
                  } else {
                    color = '#22C55E'; // Green
                  }
                }
                
                return (
                  <rect
                    key={i}
                    x={i * 4.5}
                    y="3"
                    width="3"
                    height="10"
                    rx="1.5"
                    fill={color}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>
            <span className="text-white w-12 text-right inline-block">{healthFactor}%</span>
          </div>
        </div>
      </div>

      {/* Deposit CTA Button */}
      <button 
        onClick={handleDeposit}
        disabled={parseFloat(displayedCollateralAmount || '0') === 0 || hasInsufficientFunds}
        className={`w-full py-4 rounded-2xl font-semibold transition-all duration-200 ${
          parseFloat(displayedCollateralAmount || '0') === 0 || hasInsufficientFunds
            ? 'bg-gradient-to-b from-white/5 to-white/5 text-white/30 cursor-not-allowed'
            : 'bg-gradient-to-b from-[#5740CE] to-[#8B5CF6] hover:from-[#6850DE] hover:to-[#9B6CF7] text-white shadow-lg shadow-purple-500/25'
        }`}
      >
        {hasInsufficientFunds ? 'Insufficient Funds' : 'Deposit'}
      </button>
    </div>
  );
}