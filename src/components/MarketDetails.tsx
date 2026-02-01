'use client';
import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, TrendingUp, Info, Sparkles, Users, Activity, Target, Shield, ChevronDown, ArrowUpRight, ArrowDownRight, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CurvanceLogo } from './CurvanceLogo';
import { HideBalanceIcon } from './HideBalanceIcon';
import { USDCIcon, AUSDIcon, SAUSDIcon, WMONIcon, AprMONIcon, MuBONDIcon, WETHIcon, WBTCIcon, SMONIcon, EZETHIcon } from './TokenIcons';
import { Tooltip } from './Tooltip';
import { APYBreakdown } from './APYBreakdown';
import { DepositPanel } from './DepositPanel';
import { Navbar } from './Navbar';
import Monad from './imports/Monad';

interface Market {
  id: string;
  CollateralIcon: React.ComponentType<{ className?: string }>;
  collateral: string;
  LoanIcon: React.ComponentType<{ className?: string }>;
  loan: string;
  totalMarketSize: string;
  liquidity: string;
  borrowAPY: string;
  supplyAPY: string;
  utilization: string;
  ltv: string;
  starred?: boolean;
  collateralPrice: number;
  loanPrice: number;
  collateralBalance: number;
  loanBalance: number;
  bidirectional: boolean;
  boostMultiplier?: number;
}

interface WalletToken {
  symbol: string;
  name: string;
  Icon: React.ComponentType<{ className?: string }>;
  balance: number;
  price: number;
}

// Wallet tokens available for zapping
const walletTokens: WalletToken[] = [
  { symbol: 'wETH', name: 'Wrapped Ether', Icon: WETHIcon, balance: 2.4567, price: 3245.80 },
  { symbol: 'USDC', name: 'USD Coin', Icon: USDCIcon, balance: 1250.00, price: 1.00 },
  { symbol: 'wBTC', name: 'Wrapped Bitcoin', Icon: WBTCIcon, balance: 0.0523, price: 42150.25 },
  { symbol: 'wMON', name: 'Wrapped Monad', Icon: WMONIcon, balance: 725.30, price: 1.42 },
  { symbol: 'aprMON', name: 'Apriori Monad', Icon: AprMONIcon, balance: 850.25, price: 1.85 },
  { symbol: 'sMON', name: 'Kintsu Staked Monad', Icon: SMONIcon, balance: 650.75, price: 1.52 },
  { symbol: 'AUSD', name: 'Agora USD', Icon: AUSDIcon, balance: 2100.00, price: 1.01 },
  { symbol: 'sAUSD', name: 'Staked AUSD', Icon: SAUSDIcon, balance: 1500.00, price: 1.03 },
  { symbol: 'muBOND', name: 'Mu Bond', Icon: MuBONDIcon, balance: 1250.00, price: 1.12 },
  { symbol: 'ezETH', name: 'Renzo Etherium', Icon: EZETHIcon, balance: 1.8234, price: 3312.45 },
];

const markets: Market[] = [
  {
    id: '1',
    CollateralIcon: WETHIcon,
    collateral: 'wETH',
    LoanIcon: USDCIcon,
    loan: 'USDC',
    totalMarketSize: '$155.7M',
    liquidity: '$110.5M',
    borrowAPY: '3.2%',
    supplyAPY: '20%',
    utilization: '71%',
    ltv: '82%',
    collateralPrice: 3245.80,
    loanPrice: 1.00,
    collateralBalance: 2.4567,
    loanBalance: 1250.00,
    bidirectional: true,
  },
  {
    id: '2',
    CollateralIcon: WBTCIcon,
    collateral: 'wBTC',
    LoanIcon: USDCIcon,
    loan: 'USDC',
    totalMarketSize: '$118M',
    liquidity: '$85.3M',
    borrowAPY: '2.8%',
    supplyAPY: '11%',
    utilization: '28%',
    ltv: '80%',
    collateralPrice: 42150.25,
    loanPrice: 1.00,
    collateralBalance: 0.0523,
    loanBalance: 1250.00,
    bidirectional: true,
  },
  {
    id: '3',
    CollateralIcon: AprMONIcon,
    collateral: 'aprMON',
    LoanIcon: WMONIcon,
    loan: 'wMON',
    totalMarketSize: '$60.5M',
    liquidity: '$42.1M',
    borrowAPY: '4.1%',
    supplyAPY: '6.5%',
    utilization: '30%',
    ltv: '75%',
    collateralPrice: 1.85,
    loanPrice: 1.42,
    collateralBalance: 850.25,
    loanBalance: 425.50,
    bidirectional: true,
    boostMultiplier: 2.5,
  },
  {
    id: '4',
    CollateralIcon: SMONIcon,
    collateral: 'sMON',
    LoanIcon: AUSDIcon,
    loan: 'AUSD',
    totalMarketSize: '$44.7M',
    liquidity: '$31.8M',
    borrowAPY: '3.5%',
    supplyAPY: '5.2%',
    utilization: '29%',
    ltv: '70%',
    collateralPrice: 1.52,
    loanPrice: 1.01,
    collateralBalance: 650.75,
    loanBalance: 980.00,
    bidirectional: true,
  },
  {
    id: '5',
    CollateralIcon: EZETHIcon,
    collateral: 'ezETH',
    LoanIcon: WETHIcon,
    loan: 'wETH',
    totalMarketSize: '$96M',
    liquidity: '$67.4M',
    borrowAPY: '15.2%',
    supplyAPY: '20%',
    utilization: '30%',
    ltv: '85%',
    collateralPrice: 3312.45,
    loanPrice: 3245.80,
    collateralBalance: 1.8234,
    loanBalance: 0.5432,
    bidirectional: true,
  },
  {
    id: '6',
    CollateralIcon: MuBONDIcon,
    collateral: 'muBOND',
    LoanIcon: AUSDIcon,
    loan: 'AUSD',
    totalMarketSize: '$80.3M',
    liquidity: '$58.2M',
    borrowAPY: '12.8%',
    supplyAPY: '19.01%',
    utilization: '27%',
    ltv: '72%',
    collateralPrice: 1.12,
    loanPrice: 1.01,
    collateralBalance: 1250.00,
    loanBalance: 980.00,
    bidirectional: false,
    boostMultiplier: 1.5,
  },
  {
    id: '7',
    CollateralIcon: WMONIcon,
    collateral: 'wMON',
    LoanIcon: USDCIcon,
    loan: 'USDC',
    totalMarketSize: '$55.4M',
    liquidity: '$39.6M',
    borrowAPY: '2.4%',
    supplyAPY: '11%',
    utilization: '29%',
    ltv: '68%',
    collateralPrice: 1.42,
    loanPrice: 1.00,
    collateralBalance: 725.30,
    loanBalance: 1250.00,
    bidirectional: true,
  },
  {
    id: '8',
    CollateralIcon: SAUSDIcon,
    collateral: 'sAUSD',
    LoanIcon: AUSDIcon,
    loan: 'AUSD',
    totalMarketSize: '$30M',
    liquidity: '$21.7M',
    borrowAPY: '2.1%',
    supplyAPY: '3.4%',
    utilization: '28%',
    ltv: '90%',
    collateralPrice: 1.03,
    loanPrice: 1.01,
    collateralBalance: 1500.00,
    loanBalance: 980.00,
    bidirectional: true,
  },
  {
    id: '9',
    CollateralIcon: AUSDIcon,
    collateral: 'AUSD',
    LoanIcon: USDCIcon,
    loan: 'USDC',
    totalMarketSize: '$131.3M',
    liquidity: '$92.4M',
    borrowAPY: '1.8%',
    supplyAPY: '11%',
    utilization: '30%',
    ltv: '95%',
    collateralPrice: 1.01,
    loanPrice: 1.00,
    collateralBalance: 2100.00,
    loanBalance: 1250.00,
    bidirectional: true,
  },
  {
    id: '10',
    CollateralIcon: WETHIcon,
    collateral: 'wETH',
    LoanIcon: AUSDIcon,
    loan: 'AUSD',
    totalMarketSize: '$147M',
    liquidity: '$105.8M',
    borrowAPY: '2.9%',
    supplyAPY: '20%',
    utilization: '28%',
    ltv: '80%',
    collateralPrice: 3245.80,
    loanPrice: 1.01,
    collateralBalance: 2.4567,
    loanBalance: 980.00,
    bidirectional: true,
  },
  {
    id: '11',
    CollateralIcon: AprMONIcon,
    collateral: 'aprMON',
    LoanIcon: USDCIcon,
    loan: 'USDC',
    totalMarketSize: '$68M',
    liquidity: '$48.3M',
    borrowAPY: '2.3%',
    supplyAPY: '11%',
    utilization: '29%',
    ltv: '70%',
    collateralPrice: 1.85,
    loanPrice: 1.00,
    collateralBalance: 850.25,
    loanBalance: 1250.00,
    bidirectional: true,
  },
  {
    id: '12',
    CollateralIcon: MuBONDIcon,
    collateral: 'muBOND',
    LoanIcon: WMONIcon,
    loan: 'wMON',
    totalMarketSize: '$51.4M',
    liquidity: '$36.9M',
    borrowAPY: '3.7%',
    supplyAPY: '5.5%',
    utilization: '28%',
    ltv: '65%',
    collateralPrice: 1.12,
    loanPrice: 1.42,
    collateralBalance: 1250.00,
    loanBalance: 425.50,
    bidirectional: true,
  },
];

// Mock data for charts (in a real app, this would come from an API)
const generateMockChartData = (points: number = 30) => {
  const data = [];
  let value = 100000;
  for (let i = 0; i < points; i++) {
    value = value + (Math.random() - 0.48) * 5000;
    data.push({
      time: Date.now() - (points - i) * 86400000,
      value: value
    });
  }
  return data;
};

export function MarketDetails() {
  const { marketId } = useParams<{ marketId: string }>();
  const router = useRouter();
  const [actionTab, setActionTab] = useState<'deposit' | 'borrow'>('deposit');
  const [selectedAsset, setSelectedAsset] = useState<'collateral' | 'loan'>('collateral');
  const [amount, setAmount] = useState('');
  
  // Earnings Simulator State
  const [simulatorDeposit, setSimulatorDeposit] = useState('10000');
  const [simulatorTimeframe, setSimulatorTimeframe] = useState<'day' | 'month' | 'year'>('year');
  const [simulatorLeverage, setSimulatorLeverage] = useState(5);
  const [graphHoverIndex, setGraphHoverIndex] = useState<number | null>(null);
  const [simulatorAsset, setSimulatorAsset] = useState<'collateral' | 'loan'>('collateral');
  const [showSimulatorAssetDropdown, setShowSimulatorAssetDropdown] = useState(false);
  
  const market = markets.find(m => m.id === marketId);
  
  if (!market) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center font-['Work_Sans',sans-serif]">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Market not found</h1>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-[#5740CE] hover:bg-[#6850DE] text-white rounded-xl transition-colors"
          >
            Back to Markets
          </button>
        </div>
      </div>
    );
  }

  const depositData = generateMockChartData(30);
  const borrowData = generateMockChartData(30);

  // Calculate stats
  const utilizationRate = market.utilization;
  const totalBorrowed = (parseFloat(market.totalMarketSize.replace(/[$M]/g, '')) * (parseFloat(market.utilization.replace('%', '')) / 100)).toFixed(1);

  // Get current selected token info
  const getCurrentToken = () => {
    return selectedAsset === 'collateral' 
      ? { symbol: market.collateral, Icon: market.CollateralIcon, balance: market.collateralBalance, price: market.collateralPrice }
      : { symbol: market.loan, Icon: market.LoanIcon, balance: market.loanBalance, price: market.loanPrice };
  };

  const currentToken = getCurrentToken();

  // Get simulator asset info
  const getSimulatorAsset = () => {
    return simulatorAsset === 'collateral' 
      ? { symbol: market.collateral, Icon: market.CollateralIcon, apy: market.supplyAPY }
      : { symbol: market.loan, Icon: market.LoanIcon, apy: market.supplyAPY };
  };

  const simulatorAssetInfo = getSimulatorAsset();

  // Get available tokens for deposit/borrow based on tab and market type
  const getAvailableTokens = () => {
    if (actionTab === 'deposit') {
      // For deposit, always show both tokens (users can deposit either asset)
      return [
        { symbol: market.collateral, Icon: market.CollateralIcon, balance: market.collateralBalance, price: market.collateralPrice, type: 'collateral' as const },
        { symbol: market.loan, Icon: market.LoanIcon, balance: market.loanBalance, price: market.loanPrice, type: 'loan' as const }
      ];
    } else {
      // For borrow, only loan asset can be borrowed
      return [
        { symbol: market.loan, Icon: market.LoanIcon, balance: market.loanBalance, price: market.loanPrice, type: 'loan' as const }
      ];
    }
  };

  const availableTokens = getAvailableTokens();

  return (
    <div className="min-h-screen flex flex-col font-['Work_Sans',sans-serif]">
      {/* Header - Same as MarketView */}
      <Navbar />

      {/* Main Content - Add padding-top to account for fixed navbar */}
      <main className="flex-1 px-3 md:px-6 py-4 md:py-8 pt-[89px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 lg:gap-8">
            {/* Left Side - Market Details */}
            <div className="space-y-6">
              {/* Market Header */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-6 relative">
                {/* Top Navigation Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  {/* Back Button */}
                  <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/60 hover:text-white transition-all duration-200 group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span className="text-sm">Back</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => {
                      // Fallback method for copying to clipboard
                      const url = window.location.href;
                      const textarea = document.createElement('textarea');
                      textarea.value = url;
                      textarea.style.position = 'fixed';
                      textarea.style.opacity = '0';
                      document.body.appendChild(textarea);
                      textarea.select();
                      try {
                        document.execCommand('copy');
                      } catch (err) {
                        console.error('Failed to copy:', err);
                      }
                      document.body.removeChild(textarea);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white/60 hover:text-white transition-all duration-200 group"
                  >
                    <Share2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>

                {/* BOOST Badge - Below Nav Bar */}
                {market.boostMultiplier && (
                  <div className="absolute top-16 right-4">
                    <div className="relative inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-amber-400/25 via-orange-500/25 to-amber-600/25 border border-amber-400/40 shadow-[0_0_12px_rgba(251,191,36,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-sm overflow-hidden">
                      <div 
                        className="absolute inset-0 bg-[length:200%_100%]" 
                        style={{
                          backgroundImage: 'linear-gradient(90deg, transparent 0%, transparent 45%, rgba(255,255,255,0.12) 50%, transparent 55%, transparent 100%)',
                          animation: 'shimmer 5s linear infinite'
                        }}
                      />
                      <market.CollateralIcon className="w-4 h-4 relative z-10" />
                      <span className="text-amber-300 font-semibold text-sm whitespace-nowrap tracking-wide relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {market.boostMultiplier}x BOOST
                      </span>
                      <div className="absolute inset-0 rounded-lg bg-amber-400/20 blur-md animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Market Info - Below Nav Bar, Aligned Left */}
                <div className="pt-8 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="flex items-center -space-x-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border-2 border-[#0a0a0a] relative z-10">
                          <market.CollateralIcon className="w-7 h-7" />
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center border-2 border-[#0a0a0a]">
                          <market.LoanIcon className="w-7 h-7" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-2xl text-white">{market.collateral}</h1>
                        {market.bidirectional ? (
                          <svg className="w-5 h-5 text-white/40" viewBox="0 0 20 20" fill="none">
                            <path d="M2 10H18M2 10L6 6M2 10L6 14M18 10L14 6M18 10L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-white/40" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8H13M13 8L10 5M13 8L10 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                        <h1 className="text-2xl text-white/60">{market.loan}</h1>
                      </div>
                      <p className="text-white/40">
                        {walletTokens.find(t => t.symbol === market.collateral)?.name} / {walletTokens.find(t => t.symbol === market.loan)?.name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <div className="bg-white/[0.02] rounded-xl p-3 md:p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-white/40 text-xs md:text-sm mb-2">
                      <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>Total Deposits</span>
                    </div>
                    <div className="text-xl md:text-2xl text-white">{market.totalMarketSize}</div>
                  </div>
                  
                  <div className="bg-white/[0.02] rounded-xl p-3 md:p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-white/40 text-xs md:text-sm mb-2">
                      <Activity className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>Available Liquidity</span>
                    </div>
                    <div className="text-xl md:text-2xl text-white">{market.liquidity}</div>
                  </div>
                  
                  <div className="bg-white/[0.02] rounded-xl p-3 md:p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-white/40 text-xs md:text-sm mb-2">
                      <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>Supply APY</span>
                    </div>
                    <div className="text-xl md:text-2xl text-green-400">{market.supplyAPY}</div>
                  </div>
                  
                  <div className="bg-white/[0.02] rounded-xl p-3 md:p-4 border border-white/5">
                    <div className="flex items-center gap-2 text-white/40 text-xs md:text-sm mb-2">
                      <Shield className="w-3.5 h-3.5 md:w-4 md:h-4" />
                      <span>Max LTV</span>
                    </div>
                    <div className="text-xl md:text-2xl text-white">{market.ltv}</div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Total Deposits Chart */}
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white">Total Deposits</h3>
                    <div className="text-sm">
                      <span className="text-green-400">+$5M</span>
                      <span className="text-white/40"> in the last 7 days</span>
                    </div>
                  </div>
                  <div className="text-3xl text-white mb-2">{market.totalMarketSize}</div>
                  
                  {/* Asset Breakdown */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <market.CollateralIcon className="w-4 h-4" />
                      <span className="text-white/60 text-sm">{market.collateral}:</span>
                      <span className="text-white text-sm">$78.8M</span>
                    </div>
                    <div className="text-white/20">•</div>
                    <div className="flex items-center gap-1.5">
                      <market.LoanIcon className="w-4 h-4" />
                      <span className="text-white/60 text-sm">{market.loan}:</span>
                      <span className="text-white text-sm">$76.9M</span>
                    </div>
                  </div>
                  
                  {/* Chart with grid */}
                  <div className="relative">
                    {/* Horizontal grid lines with inline labels */}
                    <div className="relative h-48 mb-2">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-white/20 text-[10px] leading-none">{Math.max(...depositData.map(d => d.value))}M</span>
                          <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="w-full h-px bg-white/5" />
                        <div className="w-full h-px bg-white/5" />
                      </div>
                      
                      {/* Bars */}
                      <div className="relative h-full flex items-end gap-1">
                        {depositData.map((point, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-[#5740CE] to-[#5740CE]/40 rounded-t group relative"
                            style={{ 
                              height: `${(point.value / Math.max(...depositData.map(d => d.value))) * 100}%`,
                              opacity: 0.5 + (i / depositData.length) * 0.5
                            }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0a0a0a] border border-white/10 px-2 py-1 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              <div className="font-semibold">${point.value}M</div>
                              <div className="text-white/50 text-[10px]">Day {i + 1}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Time labels */}
                    <div className="flex justify-between text-white/30 text-xs px-1">
                      <span>30d ago</span>
                      <span>15d</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>

                {/* Total Borrowed Chart */}
                <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white">Total Borrowed</h3>
                    <div className="flex items-center gap-1 text-green-400 text-sm">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>+$1.7M in the last 7 days</span>
                    </div>
                  </div>
                  <div className="text-3xl text-white mb-2">${totalBorrowed}M</div>
                  
                  {/* Asset Breakdown */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-1.5">
                      <market.CollateralIcon className="w-4 h-4" />
                      <span className="text-white/60 text-sm">{market.collateral}:</span>
                      <span className="text-white text-sm">$12.4M</span>
                    </div>
                    <div className="text-white/20">•</div>
                    <div className="flex items-center gap-1.5">
                      <market.LoanIcon className="w-4 h-4" />
                      <span className="text-white/60 text-sm">{market.loan}:</span>
                      <span className="text-white text-sm">$32.4M</span>
                    </div>
                  </div>
                  
                  {/* Chart with grid */}
                  <div className="relative">
                    {/* Horizontal grid lines with inline labels */}
                    <div className="relative h-48 mb-2">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-white/20 text-[10px] leading-none">{Math.max(...borrowData.map(d => d.value))}M</span>
                          <div className="flex-1 h-px bg-white/5" />
                        </div>
                        <div className="w-full h-px bg-white/5" />
                        <div className="w-full h-px bg-white/5" />
                      </div>
                      
                      {/* Bars */}
                      <div className="relative h-full flex items-end gap-1">
                        {borrowData.map((point, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-emerald-500 to-emerald-500/40 rounded-t group relative"
                            style={{ 
                              height: `${(point.value / Math.max(...borrowData.map(d => d.value))) * 100}%`,
                              opacity: 0.5 + (i / borrowData.length) * 0.5
                            }}
                          >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0a0a0a] border border-white/10 px-2 py-1 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              <div className="font-semibold">${point.value}M</div>
                              <div className="text-white/50 text-[10px]">Day {i + 1}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Time labels */}
                    <div className="flex justify-between text-white/30 text-xs px-1">
                      <span>30d ago</span>
                      <span>15d</span>
                      <span>Today</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Earnings Simulator */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-white">Earnings Simulator</h3>
                </div>

                {/* Simplified Inputs */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Deposit Amount */}
                  <div>
                    <label className="text-white/50 text-xs mb-2 block">I want to deposit</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">$</span>
                      <input
                        type="text"
                        placeholder="10000"
                        value={simulatorDeposit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9.]/g, '');
                          setSimulatorDeposit(val);
                        }}
                        onFocus={(e) => e.target.select()}
                        onClick={(e) => e.currentTarget.select()}
                        className="w-full pl-7 pr-32 py-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 rounded-xl text-white text-lg placeholder:text-white/20 focus:outline-none focus:border-[#5740CE]/50 focus:bg-white/[0.05] transition-all duration-200"
                      />
                      
                      {/* Token Selector inside input */}
                      <button 
                        onClick={() => setShowSimulatorAssetDropdown(!showSimulatorAssetDropdown)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-3 py-1.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 rounded-lg transition-all"
                      >
                        <simulatorAssetInfo.Icon className="w-5 h-5" />
                        <div className="flex flex-col items-start">
                          <span className="text-white text-sm leading-none">{simulatorAssetInfo.symbol}</span>
                          <span className="text-emerald-400 text-xs leading-none mt-0.5">{simulatorAssetInfo.apy}</span>
                        </div>
                        <ChevronDown className="w-3.5 h-3.5 text-white/40" />
                      </button>

                      {/* Dropdown */}
                      {showSimulatorAssetDropdown && (
                        <div className="absolute top-[calc(100%+0.5rem)] right-2 w-48 bg-[#0f0f0f] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                          {/* Collateral Option */}
                          <button
                            onClick={() => {
                              setSimulatorAsset('collateral');
                              setShowSimulatorAssetDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-all ${
                              simulatorAsset === 'collateral' ? 'bg-white/[0.03]' : ''
                            }`}
                          >
                            <market.CollateralIcon className="w-6 h-6" />
                            <div className="flex flex-col items-start flex-1">
                              <span className="text-white text-sm">{market.collateral}</span>
                              <span className="text-emerald-400 text-xs">{market.supplyAPY}</span>
                            </div>
                            {simulatorAsset === 'collateral' && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#5740CE]" />
                            )}
                          </button>

                          {/* Loan Option */}
                          <button
                            onClick={() => {
                              setSimulatorAsset('loan');
                              setShowSimulatorAssetDropdown(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-all ${
                              simulatorAsset === 'loan' ? 'bg-white/[0.03]' : ''
                            }`}
                          >
                            <market.LoanIcon className="w-6 h-6" />
                            <div className="flex flex-col items-start flex-1">
                              <span className="text-white text-sm">{market.loan}</span>
                              <span className="text-emerald-400 text-xs">{market.supplyAPY}</span>
                            </div>
                            {simulatorAsset === 'loan' && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#5740CE]" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Leverage */}
                  <div>
                    <label className="text-white/50 text-xs mb-2 block">Leverage</label>
                    <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        step="0.5"
                        value={simulatorLeverage}
                        onChange={(e) => setSimulatorLeverage(parseFloat(e.target.value))}
                        className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #5740CE 0%, #5740CE ${((simulatorLeverage - 1) / 9) * 100}%, rgba(255,255,255,0.1) ${((simulatorLeverage - 1) / 9) * 100}%, rgba(255,255,255,0.1) 100%)`
                        }}
                      />
                      <span className="text-white font-medium w-10 text-right">{simulatorLeverage}x</span>
                    </div>
                  </div>
                </div>

                {/* Earnings Results */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {(() => {
                    const deposit = parseFloat(simulatorDeposit) || 0;
                    const apy = parseFloat(market.supplyAPY.replace('%', '')) / 100;
                    const timeMultiplier = simulatorTimeframe === 'day' ? 1/365 : simulatorTimeframe === 'month' ? 1/12 : 1;
                    const timeframeLabel = simulatorTimeframe === 'day' ? 'day' : simulatorTimeframe === 'month' ? 'month' : 'year';
                    
                    // Normal earnings: deposit * apy * timeMultiplier
                    const normalEarnings = deposit * apy * timeMultiplier;
                    
                    // Leveraged earnings: deposit * apy * timeMultiplier * leverage
                    const leveragedEarnings = deposit * apy * timeMultiplier * simulatorLeverage;
                    
                    return (
                      <>
                        {/* Main Earnings Display */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-all group">
                          <div className="text-white/50 text-xs mb-1.5">You'll earn per {timeframeLabel}</div>
                          <div className="flex items-baseline gap-2 mb-0.5 relative group/input">
                            <span className="text-emerald-400 text-lg">$</span>
                            <input
                              type="text"
                              value={normalEarnings.toFixed(2)}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                                const factor = apy * timeMultiplier;
                                if (factor > 0) {
                                  const requiredDeposit = val / factor;
                                  setSimulatorDeposit(requiredDeposit.toFixed(2));
                                }
                              }}
                              onFocus={(e) => e.target.select()}
                              onClick={(e) => e.currentTarget.select()}
                              placeholder="0.00"
                              className="text-3xl font-semibold text-emerald-400 bg-transparent hover:bg-white/[0.03] focus:bg-white/[0.05] border-b-2 border-transparent hover:border-emerald-400/20 focus:border-emerald-400/50 focus:outline-none w-full cursor-text transition-all duration-200 px-1 pb-0.5 rounded-sm"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-white/30 text-xs">without leverage</div>
                            
                            {/* Secondary Deposit Button */}
                            <button
                              onClick={() => {
                                setActionTab('deposit');
                                setAmount(simulatorDeposit);
                                // Scroll to deposit panel on mobile
                                if (window.innerWidth < 1024) {
                                  document.querySelector('.lg\\:sticky')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className="px-4 py-1.5 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-400/30 text-white/80 hover:text-emerald-400 rounded-lg text-xs transition-all duration-200"
                            >
                              Deposit
                            </button>
                          </div>
                        </div>

                        {/* Leveraged Earnings */}
                        <div className="bg-gradient-to-br from-[#5740CE]/10 to-[#5740CE]/5 border border-[#5740CE]/30 rounded-2xl p-4 hover:border-[#5740CE]/50 transition-all group">
                          <div className="text-white/50 text-xs mb-1.5">With {simulatorLeverage}x leverage</div>
                          <div className="flex items-baseline gap-2 mb-0.5 relative group/input">
                            <span className="text-[#5740CE] text-lg">$</span>
                            <input
                              type="text"
                              value={leveragedEarnings.toFixed(2)}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
                                const factor = apy * timeMultiplier * simulatorLeverage;
                                if (factor > 0) {
                                  const requiredDeposit = val / factor;
                                  setSimulatorDeposit(requiredDeposit.toFixed(2));
                                }
                              }}
                              onFocus={(e) => e.target.select()}
                              onClick={(e) => e.currentTarget.select()}
                              placeholder="0.00"
                              className="text-3xl font-semibold text-[#5740CE] bg-transparent hover:bg-white/[0.03] focus:bg-white/[0.05] border-b-2 border-transparent hover:border-[#5740CE]/30 focus:border-[#5740CE]/60 focus:outline-none w-full cursor-text transition-all duration-200 px-1 pb-0.5 rounded-sm"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-[#5740CE]/60 text-xs">higher risk</div>
                            
                            {/* Primary Deposit Button */}
                            <button
                              onClick={() => {
                                setActionTab('deposit');
                                setAmount(simulatorDeposit);
                                // Scroll to deposit panel on mobile
                                if (window.innerWidth < 1024) {
                                  document.querySelector('.lg\\:sticky')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className="px-4 py-1.5 bg-gradient-to-r from-[#5740CE] to-[#6850DE] hover:from-[#6850DE] hover:to-[#7960EE] text-white rounded-lg text-xs font-medium transition-all duration-200 shadow-[0_4px_12px_rgba(87,64,206,0.3)] hover:shadow-[0_6px_16px_rgba(87,64,206,0.5)] transform hover:scale-[1.02]"
                            >
                              Deposit
                            </button>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>

                {/* Graph */}
                <div className="bg-white/[0.02] rounded-xl p-5 mb-6 border border-white/5">
                  {/* Timeframe Selector in Graph */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/40 text-xs">Projected Earnings</span>
                    <div className="flex gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
                      <button
                        onClick={() => setSimulatorTimeframe('day')}
                        className={`px-3 py-1 rounded text-xs transition-all ${
                          simulatorTimeframe === 'day'
                            ? 'bg-[#5740CE] text-white'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Daily
                      </button>
                      <button
                        onClick={() => setSimulatorTimeframe('month')}
                        className={`px-3 py-1 rounded text-xs transition-all ${
                          simulatorTimeframe === 'month'
                            ? 'bg-[#5740CE] text-white'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Monthly
                      </button>
                      <button
                        onClick={() => setSimulatorTimeframe('year')}
                        className={`px-3 py-1 rounded-[7px] text-xs transition-all ${
                          simulatorTimeframe === 'year'
                            ? 'bg-[#5740CE] text-white'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        Yearly
                      </button>
                    </div>
                  </div>
                  
                  <div 
                    className="h-48 relative cursor-crosshair"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const percentX = x / rect.width;
                      const index = Math.round(percentX * 20); // 20 periods
                      setGraphHoverIndex(Math.max(0, Math.min(20, index)));
                    }}
                    onMouseLeave={() => setGraphHoverIndex(null)}
                  >
                    {(() => {
                      const deposit = parseFloat(simulatorDeposit) || 0;
                      const apy = parseFloat(market.supplyAPY.replace('%', '')) / 100;
                      
                      const periods = 20;
                      const timeMultiplier = simulatorTimeframe === 'day' ? 1/365 : simulatorTimeframe === 'month' ? 1/12 : 1;
                      
                      // Calculate total earnings for the selected timeframe
                      // No leverage: earnings = deposit * apy * timeMultiplier
                      // With leverage: earnings = deposit * apy * timeMultiplier * leverage
                      const totalNormalEarnings = deposit * apy * timeMultiplier;
                      const totalLeveragedEarnings = deposit * apy * timeMultiplier * simulatorLeverage;
                      
                      // Generate data points for normal (no leverage) - linear progression of earnings
                      const normalData = [];
                      for (let i = 0; i <= periods; i++) {
                        const progressRatio = i / periods;
                        const earnings = totalNormalEarnings * progressRatio;
                        normalData.push({ time: i, earnings });
                      }
                      
                      // Generate data points for leveraged position - linear progression
                      const leveragedData = [];
                      for (let i = 0; i <= periods; i++) {
                        const progressRatio = i / periods;
                        const earnings = totalLeveragedEarnings * progressRatio;
                        leveragedData.push({ time: i, earnings });
                      }
                      
                      // Fix maxEarnings to be based only on normal earnings multiplied by max possible leverage (10x)
                      // This keeps the "without leverage" line visually fixed while the leveraged line grows
                      const maxEarnings = Math.max(totalNormalEarnings * 10.5, 1);
                      
                      // Create SVG path for normal line (starts from $0 earnings)
                      const normalPath = normalData.map((point, i) => {
                        const x = (i / periods) * 100;
                        const y = 100 - (point.earnings / maxEarnings) * 100;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ');
                      
                      // Create SVG path for leveraged line (starts from $0, goes higher)
                      const leveragedPath = leveragedData.map((point, i) => {
                        const x = (i / periods) * 100;
                        const y = 100 - (point.earnings / maxEarnings) * 100;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      }).join(' ');
                      
                      // Time labels based on timeframe
                      const currentYear = 2025;
                      const currentMonth = 12; // December
                      let startLabel = '';
                      let endLabel = '';
                      
                      if (simulatorTimeframe === 'year') {
                        startLabel = `Dec ${currentYear}`;
                        endLabel = `Dec ${currentYear + 1}`;
                      } else if (simulatorTimeframe === 'month') {
                        startLabel = 'Today';
                        endLabel = currentMonth === 12 ? 'Jan' : new Date(2025, currentMonth, 1).toLocaleDateString('en-US', { month: 'short' });
                      } else {
                        startLabel = 'Today';
                        endLabel = 'Tomorrow';
                      }
                      
                      return (
                        <>
                          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <defs>
                              <linearGradient id="normalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                              </linearGradient>
                              <linearGradient id="leveragedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#5740CE" stopOpacity="0.15" />
                                <stop offset="100%" stopColor="#5740CE" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            
                            {/* Normal earnings area */}
                            <path
                              d={`${normalPath} L 100 100 L 0 100 Z`}
                              fill="url(#normalGradient)"
                            />
                            
                            {/* Normal earnings line */}
                            <path
                              d={normalPath}
                              stroke="#10B981"
                              strokeWidth="0.8"
                              fill="none"
                              strokeDasharray="2,2"
                            />
                            
                            {/* Leveraged earnings area */}
                            <path
                              d={`${leveragedPath} L 100 100 L 0 100 Z`}
                              fill="url(#leveragedGradient)"
                            />
                            
                            {/* Leveraged earnings line */}
                            <path
                              d={leveragedPath}
                              stroke="#5740CE"
                              strokeWidth="1.2"
                              fill="none"
                            />
                          </svg>
                          
                          {/* X-axis (Time) Labels - Bottom */}
                          <div className="absolute bottom-0 left-0 text-xs text-white/40 translate-y-5">
                            {startLabel}
                          </div>
                          <div className="absolute bottom-0 right-0 text-xs text-white/40 translate-y-5">
                            {endLabel}
                          </div>
                          
                          {/* Y-axis (Earnings/Dollars) Labels - Left side */}
                          <div className="absolute bottom-0 left-0 text-xs text-white/40 -translate-x-8">
                            $0
                          </div>
                          <div className="absolute top-1/2 left-0 text-xs text-white/40 -translate-x-10 -translate-y-1/2">
                            ${maxEarnings > 2000 ? `${(maxEarnings / 2000).toFixed(0)}k` : (maxEarnings / 2).toFixed(0)}
                          </div>
                          <div className="absolute top-0 left-0 text-xs text-white/40 -translate-x-10">
                            ${maxEarnings > 1000 ? `${(maxEarnings / 1000).toFixed(1)}k` : maxEarnings.toFixed(0)}
                          </div>
                          
                          {/* Legend - Top right */}
                          <div className="absolute top-2 right-2 space-y-1">
                            <div className="flex items-center gap-1.5 text-xs">
                              <div className="w-3 h-px border-t border-dashed border-emerald-500" />
                              <span className="text-white/50">Without Leverage</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs">
                              <div className="w-3 h-0.5 bg-[#5740CE] rounded" />
                              <span className="text-white/50">With Leverage</span>
                            </div>
                          </div>
                          
                          {/* Hover Indicator */}
                          {graphHoverIndex !== null && (() => {
                            const hoverX = (graphHoverIndex / periods) * 100;
                            const normalHoverEarnings = normalData[graphHoverIndex]?.earnings || 0;
                            const leveragedHoverEarnings = leveragedData[graphHoverIndex]?.earnings || 0;
                            const normalHoverY = 100 - (normalHoverEarnings / maxEarnings) * 100;
                            const leveragedHoverY = 100 - (leveragedHoverEarnings / maxEarnings) * 100;
                            
                            return (
                              <>
                                {/* Vertical line */}
                                <div 
                                  className="absolute top-0 bottom-0 w-px bg-white/20"
                                  style={{ left: `${hoverX}%` }}
                                />
                                
                                {/* Dot on normal line */}
                                <div 
                                  className="absolute w-2 h-2 rounded-full bg-emerald-500 border-2 border-white/20 -translate-x-1 -translate-y-1"
                                  style={{ left: `${hoverX}%`, top: `${normalHoverY}%` }}
                                />
                                
                                {/* Dot on leveraged line */}
                                <div 
                                  className="absolute w-2 h-2 rounded-full bg-[#5740CE] border-2 border-white/20 -translate-x-1 -translate-y-1"
                                  style={{ left: `${hoverX}%`, top: `${leveragedHoverY}%` }}
                                />
                                
                                {/* Tooltip - positioned intelligently */}
                                <div 
                                  className="absolute bg-[#1A1A1A] border border-white/10 rounded-lg p-3 shadow-xl z-10 pointer-events-none"
                                  style={{ 
                                    left: hoverX > 50 ? 'auto' : `${hoverX}%`,
                                    right: hoverX > 50 ? `${100 - hoverX}%` : 'auto',
                                    top: '10%',
                                    transform: hoverX > 50 ? 'translateX(calc(-100% - 8px))' : 'translateX(8px)'
                                  }}
                                >
                                  <div className="space-y-2 min-w-[140px]">
                                    <div>
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <div className="w-2 h-px border-t border-dashed border-emerald-500" />
                                        <span className="text-emerald-500 text-xs">No Leverage</span>
                                      </div>
                                      <div className="text-white font-semibold">
                                        ${normalHoverEarnings.toFixed(2)}
                                      </div>
                                    </div>
                                    <div className="border-t border-white/10 pt-2">
                                      <div className="flex items-center gap-1.5 mb-1">
                                        <div className="w-2 h-0.5 bg-[#5740CE] rounded" />
                                        <span className="text-[#5740CE] text-xs">{simulatorLeverage}x Leverage</span>
                                      </div>
                                      <div className="text-white font-semibold">
                                        ${leveragedHoverEarnings.toFixed(2)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                        </>
                      );
                    })()}
                  </div>
                </div>

              </div>

              {/* Market Information */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl text-white mb-6">Market Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Collateral Asset (e.g., wETH) */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                      <market.CollateralIcon className="w-6 h-6" />
                      <h4 className="text-lg text-white">{market.collateral}</h4>
                    </div>
                    
                    {/* Supply Stats */}
                    <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-3">
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white/70 font-medium">Supply</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">APY</span>
                          <APYBreakdown baseAPY={market.supplyAPY}>
                            <div className="flex items-center gap-1.5">
                              <span className="text-green-400 text-sm">{market.supplyAPY}</span>
                              <Sparkles className="w-3 h-3 text-green-400" />
                            </div>
                          </APYBreakdown>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Total Supplied</span>
                          <span className="text-white text-sm">$78.8M</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Supply Cap</span>
                          <span className="text-white text-sm">Unlimited</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Collateral Factor</span>
                          <span className="text-white text-sm">{market.ltv}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Borrow Stats */}
                    <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-3">
                        <ArrowDownRight className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-white/70 font-medium">Borrow</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">APY</span>
                          <span className="text-orange-400 text-sm">16.8%</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Total Borrowed</span>
                          <span className="text-white text-sm">$12.4M</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Borrow Cap</span>
                          <span className="text-white text-sm">Unlimited</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Utilization</span>
                          <span className="text-white text-sm">15.7%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Oracle Price */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-white/50 text-sm">Oracle Price</span>
                      <span className="text-white font-medium">${market.collateralPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Loan Asset (e.g., USDC) */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                      <market.LoanIcon className="w-6 h-6" />
                      <h4 className="text-lg text-white">{market.loan}</h4>
                    </div>
                    
                    {/* Supply Stats */}
                    <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-3">
                        <ArrowUpRight className="w-4 h-4 text-green-400" />
                        <span className="text-sm text-white/70 font-medium">Supply</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">APY</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-green-400 text-sm">2.8%</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Total Supplied</span>
                          <span className="text-white text-sm">$76.9M</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Supply Cap</span>
                          <span className="text-white text-sm">Unlimited</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Collateral Factor</span>
                          <span className="text-white text-sm">85%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Borrow Stats */}
                    <div className="bg-white/[0.02] rounded-lg p-4 border border-white/5">
                      <div className="flex items-center gap-1.5 mb-3">
                        <ArrowDownRight className="w-4 h-4 text-orange-400" />
                        <span className="text-sm text-white/70 font-medium">Borrow</span>
                      </div>
                      
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">APY</span>
                          <span className="text-orange-400 text-sm">{market.borrowAPY}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Total Borrowed</span>
                          <span className="text-white text-sm">$32.4M</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Borrow Cap</span>
                          <span className="text-white text-sm">Unlimited</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/50 text-sm">Utilization</span>
                          <span className="text-white text-sm">{utilizationRate}%</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Oracle Price */}
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-white/50 text-sm">Oracle Price</span>
                      <span className="text-white font-medium">${market.loanPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interest Rate Model */}
              <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6">
                <h3 className="text-xl text-white mb-6">Interest Rate Model</h3>
                
                <div className="h-64 relative">
                  {/* Simple visualization */}
                  <div className="absolute inset-0 flex items-end">
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="rateGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#5740CE" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#5740CE" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 180 Q 100 160 200 100 Q 300 40 400 20 L 400 200 L 0 200 Z"
                        fill="url(#rateGradient)"
                      />
                      <path
                        d="M 0 180 Q 100 160 200 100 Q 300 40 400 20"
                        stroke="#5740CE"
                        strokeWidth="2"
                        fill="none"
                      />
                    </svg>
                  </div>
                  
                  {/* Axes */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
                  <div className="absolute bottom-0 left-0 top-0 w-px bg-white/10" />
                  
                  {/* Labels */}
                  <div className="absolute bottom-0 left-0 -translate-y-6 text-xs text-white/40">0%</div>
                  <div className="absolute bottom-0 right-0 -translate-y-6 text-xs text-white/40">100%</div>
                  <div className="absolute bottom-0 left-0 -translate-x-1 text-xs text-white/40">0%</div>
                  <div className="absolute top-0 left-0 -translate-x-1 text-xs text-white/40">20%</div>
                  
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-white/60">
                    Utilization Rate
                  </div>
                  <div className="absolute top-1/2 -left-8 -translate-y-1/2 -rotate-90 text-sm text-white/60">
                    Interest Rate
                  </div>
                </div>
                
                <div className="mt-12 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-white/40 mb-1">Base Rate</div>
                    <div className="text-white">0.0%</div>
                  </div>
                  <div>
                    <div className="text-white/40 mb-1">Optimal Utilization</div>
                    <div className="text-white">80%</div>
                  </div>
                  <div>
                    <div className="text-white/40 mb-1">Max Rate</div>
                    <div className="text-white">150%</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Action Panel */}
            <div className="lg:sticky lg:top-24 self-start">
              <DepositPanel market={market} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}