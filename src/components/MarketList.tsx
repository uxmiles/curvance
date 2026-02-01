'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WBTCIcon, USDCIcon, WETHIcon, AUSDIcon, WMONIcon, AprMONIcon, SAUSDIcon } from './TokenIcons';
import { Oracle1Icon, Oracle2Icon, Oracle3Icon } from './OracleIcons';
import { HealthBarsIcon } from './HealthBarsIcon';
import { Tooltip } from './Tooltip';
import { DepositFilter } from './DepositFilter';
import { HoverCard } from './HoverCard';
import { 
  MarketAssetsHover, 
  DepositsBreakdownHover, 
  LiquidityBreakdownHover, 
  DepositAPYHover,
  BorrowAPYHover,
  OracleHover,
} from './MarketHovers';

interface AssetBreakdown {
  symbol: string;
  amount: string;
  value: string;
  percentage: number;
}

interface LiquidityAsset {
  symbol: string;
  available: string;
  total: string;
  utilizationRate: number;
}

// APY for each depositable asset in the market
interface AssetAPY {
  symbol: string;
  baseAPY: string;
  rewardAPY?: string;
  rewardToken?: string;
  totalAPY: string;
}

// Borrow direction: deposit A → borrow B
interface BorrowDirection {
  collateral: string;
  borrow: string;
  borrowAPY: string;
  baseAPY: string;
  rewardAPY?: string;
  rewardToken?: string;
}

interface MarketAsset {
  symbol: string;
  name: string;
  type: 'collateral' | 'borrow';
  value?: string;
}

interface Market {
  id: string;
  name: string;
  assets: [string, string]; // The two assets in the market pair
  tokenSymbol: string;
  oracleName: string;
  oracles: { symbol: string; oracle: string }[];
  TokenIcon: React.ComponentType<{ className?: string }>;
  OracleIcon: React.ComponentType<{ className?: string }>;
  tvl: string;
  totalDeposits: string;
  totalDepositsExact: string;
  availableLiquidity: string;
  availableLiquidityExact: string;
  supplyAPY: string; // Best/headline rate shown in table
  borrowAPY: string; // Best/headline rate shown in table
  maxLeverage: string;
  healthPercentage: number;
  // Breakdown data
  collateralAssets: MarketAsset[];
  borrowAssets: MarketAsset[];
  totalCollateral: string;
  totalBorrowed: string;
  utilization: number;
  depositBreakdown: AssetBreakdown[];
  liquidityBreakdown: LiquidityAsset[];
  // NEW: APY for each asset in the market
  depositAPYs: AssetAPY[];
  borrowDirections: BorrowDirection[];
  depositTrend?: {
    value: string;
    percentage: string;
    isPositive: boolean;
  };
}

const mockMarkets: Market[] = [
  {
    id: '1',
    name: 'USDC/wETH',
    assets: ['USDC', 'wETH'],
    tokenSymbol: 'USDC',
    oracleName: 'Chainlink',
    oracles: [
      { symbol: 'USDC', oracle: 'Chainlink' },
      { symbol: 'wETH', oracle: 'Chainlink' },
    ],
    TokenIcon: USDCIcon,
    OracleIcon: Oracle1Icon,
    tvl: '$2.44B',
    totalDeposits: '$1.82B',
    totalDepositsExact: '$1,820,555,222.44',
    availableLiquidity: '$1.24B',
    availableLiquidityExact: '$1,240,887,432.18',
    supplyAPY: '10.9%',
    borrowAPY: '4.6%',
    maxLeverage: '20x',
    healthPercentage: 95,
    collateralAssets: [
      { symbol: 'USDC', name: 'USD Coin', type: 'collateral', value: '$1.2B' },
      { symbol: 'wETH', name: 'Wrapped Ether', type: 'collateral', value: '$620M' },
    ],
    borrowAssets: [
      { symbol: 'USDC', name: 'USD Coin', type: 'borrow', value: '$308M' },
      { symbol: 'wETH', name: 'Wrapped Ether', type: 'borrow', value: '$272M' },
    ],
    totalCollateral: '$1.82B',
    totalBorrowed: '$580M',
    utilization: 32,
    depositBreakdown: [
      { symbol: 'USDC', amount: '1.2B USDC', value: '$1.2B', percentage: 66 },
      { symbol: 'wETH', amount: '186K wETH', value: '$620M', percentage: 34 },
    ],
    liquidityBreakdown: [
      { symbol: 'USDC', available: '$892M', total: '$1.2B', utilizationRate: 26 },
      { symbol: 'wETH', available: '$348M', total: '$620M', utilizationRate: 44 },
    ],
    depositAPYs: [
      { symbol: 'USDC', baseAPY: '6.5%', rewardAPY: '4.4%', rewardToken: 'aprMON', totalAPY: '10.9%' },
      { symbol: 'wETH', baseAPY: '4.2%', rewardAPY: '3.1%', rewardToken: 'aprMON', totalAPY: '7.3%' },
    ],
    borrowDirections: [
      { collateral: 'USDC', borrow: 'wETH', borrowAPY: '4.6%', baseAPY: '5.8%', rewardAPY: '1.2%', rewardToken: 'aprMON' },
      { collateral: 'wETH', borrow: 'USDC', borrowAPY: '3.2%', baseAPY: '4.0%', rewardAPY: '0.8%', rewardToken: 'aprMON' },
    ],
    depositTrend: { value: '$12.4M', percentage: '+2.3%', isPositive: true },
  },
  {
    id: '2',
    name: 'wETH/USDC',
    assets: ['wETH', 'USDC'],
    tokenSymbol: 'wETH',
    oracleName: 'Pyth',
    oracles: [
      { symbol: 'wETH', oracle: 'Pyth' },
      { symbol: 'USDC', oracle: 'Chainlink' },
    ],
    TokenIcon: WETHIcon,
    OracleIcon: Oracle2Icon,
    tvl: '$2.44B',
    totalDeposits: '$1.65B',
    totalDepositsExact: '$1,650,234,891.67',
    availableLiquidity: '$892M',
    availableLiquidityExact: '$892,145,332.89',
    supplyAPY: '10.9%',
    borrowAPY: '4.6%',
    maxLeverage: '12x',
    healthPercentage: 88,
    collateralAssets: [
      { symbol: 'wETH', name: 'Wrapped Ether', type: 'collateral', value: '$1.1B' },
      { symbol: 'USDC', name: 'USD Coin', type: 'collateral', value: '$550M' },
    ],
    borrowAssets: [
      { symbol: 'wETH', name: 'Wrapped Ether', type: 'borrow', value: '$412M' },
      { symbol: 'USDC', name: 'USD Coin', type: 'borrow', value: '$346M' },
    ],
    totalCollateral: '$1.65B',
    totalBorrowed: '$758M',
    utilization: 46,
    depositBreakdown: [
      { symbol: 'wETH', amount: '330K wETH', value: '$1.1B', percentage: 67 },
      { symbol: 'USDC', amount: '550M USDC', value: '$550M', percentage: 33 },
    ],
    liquidityBreakdown: [
      { symbol: 'wETH', available: '$612M', total: '$1.1B', utilizationRate: 44 },
      { symbol: 'USDC', available: '$280M', total: '$550M', utilizationRate: 49 },
    ],
    depositAPYs: [
      { symbol: 'wETH', baseAPY: '7.2%', rewardAPY: '3.7%', rewardToken: 'aprMON', totalAPY: '10.9%' },
      { symbol: 'USDC', baseAPY: '5.1%', rewardAPY: '2.8%', rewardToken: 'aprMON', totalAPY: '7.9%' },
    ],
    borrowDirections: [
      { collateral: 'wETH', borrow: 'USDC', borrowAPY: '4.6%', baseAPY: '5.6%', rewardAPY: '1.0%', rewardToken: 'aprMON' },
      { collateral: 'USDC', borrow: 'wETH', borrowAPY: '5.8%', baseAPY: '6.8%', rewardAPY: '1.0%', rewardToken: 'aprMON' },
    ],
    depositTrend: { value: '$8.2M', percentage: '+1.8%', isPositive: true },
  },
  {
    id: '3',
    name: 'wBTC/USDC',
    assets: ['wBTC', 'USDC'],
    tokenSymbol: 'wBTC',
    oracleName: 'Redstone',
    oracles: [
      { symbol: 'wBTC', oracle: 'Redstone' },
      { symbol: 'USDC', oracle: 'Redstone' },
    ],
    TokenIcon: WBTCIcon,
    OracleIcon: Oracle3Icon,
    tvl: '$2.44B',
    totalDeposits: '$1.44B',
    totalDepositsExact: '$1,440,678,345.23',
    availableLiquidity: '$756M',
    availableLiquidityExact: '$756,234,567.91',
    supplyAPY: '10.9%',
    borrowAPY: '4.6%',
    maxLeverage: '10x',
    healthPercentage: 92,
    collateralAssets: [
      { symbol: 'wBTC', name: 'Wrapped Bitcoin', type: 'collateral', value: '$980M' },
      { symbol: 'USDC', name: 'USD Coin', type: 'collateral', value: '$460M' },
    ],
    borrowAssets: [
      { symbol: 'wBTC', name: 'Wrapped Bitcoin', type: 'borrow', value: '$245M' },
      { symbol: 'USDC', name: 'USD Coin', type: 'borrow', value: '$199M' },
    ],
    totalCollateral: '$1.44B',
    totalBorrowed: '$444M',
    utilization: 31,
    depositBreakdown: [
      { symbol: 'wBTC', amount: '9.8K wBTC', value: '$980M', percentage: 68 },
      { symbol: 'USDC', amount: '460M USDC', value: '$460M', percentage: 32 },
    ],
    liquidityBreakdown: [
      { symbol: 'wBTC', available: '$520M', total: '$980M', utilizationRate: 47 },
      { symbol: 'USDC', available: '$236M', total: '$460M', utilizationRate: 49 },
    ],
    depositAPYs: [
      { symbol: 'wBTC', baseAPY: '5.8%', rewardAPY: '5.1%', rewardToken: 'aprMON', totalAPY: '10.9%' },
      { symbol: 'USDC', baseAPY: '4.8%', rewardAPY: '2.4%', rewardToken: 'aprMON', totalAPY: '7.2%' },
    ],
    borrowDirections: [
      { collateral: 'wBTC', borrow: 'USDC', borrowAPY: '4.6%', baseAPY: '5.4%', rewardAPY: '0.8%', rewardToken: 'aprMON' },
      { collateral: 'USDC', borrow: 'wBTC', borrowAPY: '6.2%', baseAPY: '7.4%', rewardAPY: '1.2%', rewardToken: 'aprMON' },
    ],
    depositTrend: { value: '$5.6M', percentage: '-0.8%', isPositive: false },
  },
  {
    id: '4',
    name: 'AUSD/wMON',
    assets: ['AUSD', 'wMON'],
    tokenSymbol: 'AUSD',
    oracleName: 'Chainlink',
    oracles: [
      { symbol: 'AUSD', oracle: 'Chainlink' },
      { symbol: 'wMON', oracle: 'Chainlink' },
    ],
    TokenIcon: AUSDIcon,
    OracleIcon: Oracle1Icon,
    tvl: '$1.82B',
    totalDeposits: '$1.12B',
    totalDepositsExact: '$1,120,987,654.32',
    availableLiquidity: '$684M',
    availableLiquidityExact: '$684,567,890.12',
    supplyAPY: '8.4%',
    borrowAPY: '3.9%',
    maxLeverage: '18x',
    healthPercentage: 100,
    collateralAssets: [
      { symbol: 'AUSD', name: 'Agora USD', type: 'collateral', value: '$780M' },
      { symbol: 'wMON', name: 'Wrapped Monad', type: 'collateral', value: '$340M' },
    ],
    borrowAssets: [
      { symbol: 'AUSD', name: 'Agora USD', type: 'borrow', value: '$156M' },
      { symbol: 'wMON', name: 'Wrapped Monad', type: 'borrow', value: '$112M' },
    ],
    totalCollateral: '$1.12B',
    totalBorrowed: '$268M',
    utilization: 24,
    depositBreakdown: [
      { symbol: 'AUSD', amount: '780M AUSD', value: '$780M', percentage: 70 },
      { symbol: 'wMON', amount: '12M wMON', value: '$340M', percentage: 30 },
    ],
    liquidityBreakdown: [
      { symbol: 'AUSD', available: '$512M', total: '$780M', utilizationRate: 34 },
      { symbol: 'wMON', available: '$172M', total: '$340M', utilizationRate: 49 },
    ],
    depositAPYs: [
      { symbol: 'AUSD', baseAPY: '4.2%', rewardAPY: '4.2%', rewardToken: 'AUSD', totalAPY: '8.4%' },
      { symbol: 'wMON', baseAPY: '6.8%', rewardAPY: '4.5%', rewardToken: 'aprMON', totalAPY: '11.3%' },
    ],
    borrowDirections: [
      { collateral: 'AUSD', borrow: 'wMON', borrowAPY: '5.2%', baseAPY: '6.2%', rewardAPY: '1.0%', rewardToken: 'aprMON' },
      { collateral: 'wMON', borrow: 'AUSD', borrowAPY: '3.9%', baseAPY: '4.9%', rewardAPY: '1.0%', rewardToken: 'AUSD' },
    ],
    depositTrend: { value: '$18.9M', percentage: '+4.2%', isPositive: true },
  },
  {
    id: '5',
    name: 'wMON/USDC',
    assets: ['wMON', 'USDC'],
    tokenSymbol: 'wMON',
    oracleName: 'Pyth',
    oracles: [
      { symbol: 'wMON', oracle: 'Pyth' },
      { symbol: 'USDC', oracle: 'Chainlink' },
    ],
    TokenIcon: WMONIcon,
    OracleIcon: Oracle2Icon,
    tvl: '$1.55B',
    totalDeposits: '$892M',
    totalDepositsExact: '$892,456,789.01',
    availableLiquidity: '$523M',
    availableLiquidityExact: '$523,678,901.23',
    supplyAPY: '12.3%',
    borrowAPY: '5.2%',
    maxLeverage: '8x',
    healthPercentage: 76,
    collateralAssets: [
      { symbol: 'wMON', name: 'Wrapped Monad', type: 'collateral', value: '$620M' },
      { symbol: 'USDC', name: 'USD Coin', type: 'collateral', value: '$272M' },
    ],
    borrowAssets: [
      { symbol: 'wMON', name: 'Wrapped Monad', type: 'borrow', value: '$186M' },
      { symbol: 'USDC', name: 'USD Coin', type: 'borrow', value: '$78M' },
    ],
    totalCollateral: '$892M',
    totalBorrowed: '$264M',
    utilization: 30,
    depositBreakdown: [
      { symbol: 'wMON', amount: '22M wMON', value: '$620M', percentage: 70 },
      { symbol: 'USDC', amount: '272M USDC', value: '$272M', percentage: 30 },
    ],
    liquidityBreakdown: [
      { symbol: 'wMON', available: '$380M', total: '$620M', utilizationRate: 39 },
      { symbol: 'USDC', available: '$143M', total: '$272M', utilizationRate: 47 },
    ],
    depositAPYs: [
      { symbol: 'wMON', baseAPY: '8.1%', rewardAPY: '4.2%', rewardToken: 'aprMON', totalAPY: '12.3%' },
      { symbol: 'USDC', baseAPY: '5.4%', rewardAPY: '2.8%', rewardToken: 'aprMON', totalAPY: '8.2%' },
    ],
    borrowDirections: [
      { collateral: 'wMON', borrow: 'USDC', borrowAPY: '5.2%', baseAPY: '6.4%', rewardAPY: '1.2%', rewardToken: 'aprMON' },
      { collateral: 'USDC', borrow: 'wMON', borrowAPY: '7.8%', baseAPY: '9.0%', rewardAPY: '1.2%', rewardToken: 'aprMON' },
    ],
    depositTrend: { value: '$6.8M', percentage: '+3.1%', isPositive: true },
  },
  {
    id: '6',
    name: 'aprMON/USDC',
    assets: ['aprMON', 'USDC'],
    tokenSymbol: 'aprMON',
    oracleName: 'Redstone',
    oracles: [
      { symbol: 'aprMON', oracle: 'Redstone' },
      { symbol: 'USDC', oracle: 'Chainlink' },
    ],
    TokenIcon: AprMONIcon,
    OracleIcon: Oracle3Icon,
    tvl: '$980M',
    totalDeposits: '$634M',
    totalDepositsExact: '$634,123,456.78',
    availableLiquidity: '$412M',
    availableLiquidityExact: '$412,345,678.90',
    supplyAPY: '9.7%',
    borrowAPY: '4.1%',
    maxLeverage: '6x',
    healthPercentage: 82,
    collateralAssets: [
      { symbol: 'aprMON', name: 'Apriori Monad', type: 'collateral', value: '$420M' },
      { symbol: 'USDC', name: 'USD Coin', type: 'collateral', value: '$214M' },
    ],
    borrowAssets: [
      { symbol: 'aprMON', name: 'Apriori Monad', type: 'borrow', value: '$134M' },
      { symbol: 'USDC', name: 'USD Coin', type: 'borrow', value: '$86M' },
    ],
    totalCollateral: '$634M',
    totalBorrowed: '$220M',
    utilization: 35,
    depositBreakdown: [
      { symbol: 'aprMON', amount: '15M aprMON', value: '$420M', percentage: 66 },
      { symbol: 'USDC', amount: '214M USDC', value: '$214M', percentage: 34 },
    ],
    liquidityBreakdown: [
      { symbol: 'aprMON', available: '$285M', total: '$420M', utilizationRate: 32 },
      { symbol: 'USDC', available: '$127M', total: '$214M', utilizationRate: 41 },
    ],
    depositAPYs: [
      { symbol: 'aprMON', baseAPY: '5.5%', rewardAPY: '4.2%', rewardToken: 'aprMON', totalAPY: '9.7%' },
      { symbol: 'USDC', baseAPY: '4.8%', rewardAPY: '2.6%', rewardToken: 'aprMON', totalAPY: '7.4%' },
    ],
    borrowDirections: [
      { collateral: 'aprMON', borrow: 'USDC', borrowAPY: '4.1%', baseAPY: '5.0%', rewardAPY: '0.9%', rewardToken: 'aprMON' },
      { collateral: 'USDC', borrow: 'aprMON', borrowAPY: '6.5%', baseAPY: '7.4%', rewardAPY: '0.9%', rewardToken: 'aprMON' },
    ],
  },
  {
    id: '7',
    name: 'sAUSD/wETH',
    assets: ['sAUSD', 'wETH'],
    tokenSymbol: 'sAUSD',
    oracleName: 'Chainlink',
    oracles: [
      { symbol: 'sAUSD', oracle: 'Chainlink' },
      { symbol: 'wETH', oracle: 'Pyth' },
    ],
    TokenIcon: SAUSDIcon,
    OracleIcon: Oracle1Icon,
    tvl: '$672M',
    totalDeposits: '$445M',
    totalDepositsExact: '$445,678,901.23',
    availableLiquidity: '$278M',
    availableLiquidityExact: '$278,901,234.56',
    supplyAPY: '15.2%',
    borrowAPY: '6.8%',
    maxLeverage: '15x',
    healthPercentage: 98,
    collateralAssets: [
      { symbol: 'sAUSD', name: 'Staked AUSD', type: 'collateral', value: '$312M' },
      { symbol: 'wETH', name: 'Wrapped Ether', type: 'collateral', value: '$133M' },
    ],
    borrowAssets: [
      { symbol: 'sAUSD', name: 'Staked AUSD', type: 'borrow', value: '$127M' },
      { symbol: 'wETH', name: 'Wrapped Ether', type: 'borrow', value: '$91M' },
    ],
    totalCollateral: '$445M',
    totalBorrowed: '$218M',
    utilization: 49,
    depositBreakdown: [
      { symbol: 'sAUSD', amount: '312M sAUSD', value: '$312M', percentage: 70 },
      { symbol: 'wETH', amount: '40K wETH', value: '$133M', percentage: 30 },
    ],
    liquidityBreakdown: [
      { symbol: 'sAUSD', available: '$198M', total: '$312M', utilizationRate: 37 },
      { symbol: 'wETH', available: '$80M', total: '$133M', utilizationRate: 40 },
    ],
    depositAPYs: [
      { symbol: 'sAUSD', baseAPY: '9.8%', rewardAPY: '5.4%', rewardToken: 'sAUSD', totalAPY: '15.2%' },
      { symbol: 'wETH', baseAPY: '5.2%', rewardAPY: '3.6%', rewardToken: 'sAUSD', totalAPY: '8.8%' },
    ],
    borrowDirections: [
      { collateral: 'sAUSD', borrow: 'wETH', borrowAPY: '6.8%', baseAPY: '8.4%', rewardAPY: '1.6%', rewardToken: 'sAUSD' },
      { collateral: 'wETH', borrow: 'sAUSD', borrowAPY: '4.2%', baseAPY: '5.8%', rewardAPY: '1.6%', rewardToken: 'sAUSD' },
    ],
    depositTrend: { value: '$22.1M', percentage: '+5.8%', isPositive: true },
  },
];

export function MarketList() {
  const router = useRouter();
  const [walletFilter, setWalletFilter] = useState(false);
  const [isDepositFilterOpen, setIsDepositFilterOpen] = useState(false);
  const [depositFilterSearch, setDepositFilterSearch] = useState('');
  const [selectedDepositAssets, setSelectedDepositAssets] = useState<string[]>([]);
  const [sortColumn, setSortColumn] = useState<'totalDeposits' | 'availableLiquidity' | 'supplyAPY' | 'borrowAPY' | 'maxLeverage' | 'healthPercentage' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const depositFilterRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleRowClick = (marketId: string) => {
    router.push(`/market/${marketId}`);
  };

  // Simulated user wallet - tokens the user has
  const userWalletTokens = ['USDC', 'wETH', 'wMON', 'AUSD'];

  // Parse value for sorting
  const parseValue = (value: string | number): number => {
    if (typeof value === 'number') return value;
    const cleaned = value.replace(/[$%x]/g, '');
    if (cleaned.includes('B')) {
      return parseFloat(cleaned.replace('B', '')) * 1000000000;
    } else if (cleaned.includes('M')) {
      return parseFloat(cleaned.replace('M', '')) * 1000000;
    }
    return parseFloat(cleaned);
  };

  // Handle column sort
  const handleSort = (column: typeof sortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (depositFilterRef.current && !depositFilterRef.current.contains(event.target as Node)) {
        setIsDepositFilterOpen(false);
      }
    };

    const timeoutId = setTimeout(() => {
      if (isDepositFilterOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDepositFilterOpen]);

  // Keyboard shortcut for search (⌘+1 or Ctrl+1)
  useEffect(() => {
    const handleKeyboardShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === '1') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => {
      document.removeEventListener('keydown', handleKeyboardShortcut);
    };
  }, []);

  // Get unique assets from markets
  const availableAssets = [
    { symbol: 'USDC', Icon: USDCIcon },
    { symbol: 'wETH', Icon: WETHIcon },
    { symbol: 'wBTC', Icon: WBTCIcon },
    { symbol: 'AUSD', Icon: AUSDIcon },
    { symbol: 'wMON', Icon: WMONIcon },
    { symbol: 'aprMON', Icon: AprMONIcon },
    { symbol: 'sAUSD', Icon: SAUSDIcon },
  ];

  const filteredAssets = availableAssets.filter(asset =>
    asset.symbol.toLowerCase().includes(depositFilterSearch.toLowerCase())
  );

  const toggleAssetSelection = (symbol: string) => {
    setSelectedDepositAssets(prev =>
      prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  const clearFilters = () => {
    setSelectedDepositAssets([]);
  };

  // Filter markets
  const filteredMarkets = mockMarkets.filter(market => {
    let matchesDepositFilter = true;
    if (selectedDepositAssets.length > 0) {
      matchesDepositFilter = selectedDepositAssets.includes(market.tokenSymbol);
    }

    let matchesWalletFilter = true;
    if (walletFilter) {
      matchesWalletFilter = userWalletTokens.includes(market.tokenSymbol);
    }

    let matchesSearchFilter = true;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      matchesSearchFilter = 
        market.name.toLowerCase().includes(search) ||
        market.tokenSymbol.toLowerCase().includes(search) ||
        market.oracleName.toLowerCase().includes(search);
    }

    return matchesDepositFilter && matchesWalletFilter && matchesSearchFilter;
  });

  // Sort filtered markets
  const sortedMarkets = filteredMarkets.sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = parseValue(a[sortColumn]);
    const bValue = parseValue(b[sortColumn]);
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-10 md:pr-16 py-6 md:py-12">
      {/* Stats Row */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12 gap-8">
        <div>
          <div className="text-white/40 text-sm mb-3">Total Deposits</div>
          <div className="flex items-baseline gap-3 mb-3">
            <span className="text-4xl md:text-5xl text-white font-medium">$23,245,345</span>
            <span className="text-white/40 text-lg md:text-xl">USD</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm font-medium">$156.22 (+4.50%)</span>
            <span className="text-white/30 text-sm">this month</span>
          </div>
        </div>

        <div className="flex items-center gap-12 md:gap-16">
          <div>
            <div className="text-white/40 text-sm mb-3">Active Loans</div>
            <div className="text-white text-xl md:text-2xl font-medium">$123.43M</div>
          </div>
          <div>
            <div className="text-white/40 text-sm mb-3">Earnings</div>
            <div className="text-white text-xl md:text-2xl font-medium">$12.3B</div>
          </div>
        </div>
      </div>

      {/* Top Picks */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-white/40 text-sm">Top Picks</span>
          <button className="p-1 text-white/40 hover:text-white hover:bg-white/5 rounded transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { token: WBTCIcon, name: 'BTC', apy: '10% APY', available: '20.7M' },
            { token: USDCIcon, name: 'USDC', apy: '8.5% APY', available: '45.2M' },
            { token: WETHIcon, name: 'ETH', apy: '12.3% APY', available: '15.8M' },
            { token: AUSDIcon, name: 'AUSD', apy: '9.7% APY', available: '32.4M' },
          ].map((item, i) => (
            <div key={i} className="bg-white/[0.03] hover:bg-white/[0.05] border border-white/10 hover:border-white/20 rounded-xl p-4 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <item.token className="w-10 h-10" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white text-sm font-medium whitespace-nowrap">Deposit {item.name}</span>
                    <span className="px-1.5 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-green-400 text-[10px] font-medium whitespace-nowrap">
                      {item.apy}
                    </span>
                  </div>
                  <div className="text-white/40 text-xs whitespace-nowrap">only {item.available} available</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-6 overflow-x-auto">
          <div className="flex items-center gap-3">
            <span className="text-white/40 text-sm whitespace-nowrap">In Wallet:</span>
            <button 
              onClick={() => setWalletFilter(!walletFilter)}
              className={`w-10 h-5 rounded-full relative transition-colors ${
                walletFilter ? 'bg-[#5740CE]' : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                walletFilter ? 'translate-x-5' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>

          <DepositFilter onSelectionChange={setSelectedDepositAssets} />

          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white transition-all text-sm whitespace-nowrap">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Advanced</span>
          </button>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 pr-16 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#5740CE]/50 transition-colors"
            ref={searchInputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">⌘1</span>
        </div>
      </div>

      {/* Markets Table */}
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <colgroup>
              <col className="w-full" />
              <col className="w-auto" />
              <col className="w-auto" />
              <col className="w-auto" />
              <col className="w-auto" />
              <col className="w-auto" />
              <col className="w-auto" />
            </colgroup>
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-4 text-white/40 font-normal text-sm">
                  <div className="flex items-center gap-2">
                    <span>Markets</span>
                    <span className="text-white/30">{mockMarkets.length}</span>
                  </div>
                </th>
                <th className="text-center px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center justify-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('totalDeposits')}
                  >
                    <span className="whitespace-nowrap">Total Deposits</span>
                    {sortColumn === 'totalDeposits' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
                <th className="text-center px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center justify-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('availableLiquidity')}
                  >
                    <span className="whitespace-nowrap">Available Liq.</span>
                    {sortColumn === 'availableLiquidity' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
                <th className="text-center px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center justify-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('supplyAPY')}
                  >
                    <span className="whitespace-nowrap">Deposit APY</span>
                    {sortColumn === 'supplyAPY' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
                <th className="text-center px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center justify-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('borrowAPY')}
                  >
                    <span className="whitespace-nowrap">Borrow APY</span>
                    {sortColumn === 'borrowAPY' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
                <th className="text-center px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center justify-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('maxLeverage')}
                  >
                    <span className="whitespace-nowrap">Max Lev.</span>
                    {sortColumn === 'maxLeverage' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
                <th className="text-center px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center justify-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('healthPercentage')}
                  >
                    <span className="whitespace-nowrap">Your Health</span>
                    {sortColumn === 'healthPercentage' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMarkets.map((market) => (
                <tr 
                  key={market.id}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] transition-all cursor-pointer group"
                  onClick={() => handleRowClick(market.id)}
                >
                  {/* Market Name with Hover */}
                  <td className="px-4 py-5">
                    <HoverCard
                      content={
                        <MarketAssetsHover
                          marketName={market.name}
                          collateralAssets={market.collateralAssets}
                          borrowAssets={market.borrowAssets}
                          oracleName={market.oracleName}
                          totalCollateral={market.totalCollateral}
                          totalBorrowed={market.totalBorrowed}
                          utilization={market.utilization}
                        />
                      }
                      align="left"
                      width={220}
                    >
                      <div 
                        className="flex items-center gap-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <market.TokenIcon className="w-10 h-10 rounded-full flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-white text-sm font-medium whitespace-nowrap">{market.name}</span>
                            <div 
                              className="inline-flex flex-shrink-0"
                              onMouseEnter={(e) => e.stopPropagation()}
                              onMouseLeave={(e) => e.stopPropagation()}
                            >
                              <HoverCard
                                content={<OracleHover oracles={market.oracles} />}
                                width={180}
                              >
                                <div className="cursor-help">
                                  <market.OracleIcon className="w-4 h-4" />
                                </div>
                              </HoverCard>
                            </div>
                          </div>
                          <div className="text-white/40 text-xs whitespace-nowrap">{market.tvl}</div>
                        </div>
                      </div>
                    </HoverCard>
                  </td>

                  {/* Total Deposits with Breakdown Hover */}
                  <td className="px-3 py-5 text-center">
                    <HoverCard
                      content={
                        <DepositsBreakdownHover
                          totalDeposits={market.totalDeposits}
                          totalDepositsExact={market.totalDepositsExact}
                          assets={market.depositBreakdown}
                          trend={market.depositTrend}
                        />
                      }
                      width={240}
                    >
                      <span 
                        className="text-white text-sm whitespace-nowrap cursor-help hover:text-white/80 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {market.totalDeposits}
                      </span>
                    </HoverCard>
                  </td>

                  {/* Available Liquidity with Breakdown Hover */}
                  <td className="px-3 py-5 text-center">
                    <HoverCard
                      content={
                        <LiquidityBreakdownHover
                          totalLiquidity={market.availableLiquidity}
                          totalLiquidityExact={market.availableLiquidityExact}
                          assets={market.liquidityBreakdown}
                        />
                      }
                      width={240}
                    >
                      <span 
                        className="text-white text-sm whitespace-nowrap cursor-help hover:text-white/80 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {market.availableLiquidity}
                      </span>
                    </HoverCard>
                  </td>

                  {/* Supply APY - Shows APY for both assets */}
                  <td className="px-3 py-5 text-center">
                    <HoverCard
                      content={<DepositAPYHover assets={market.depositAPYs} />}
                      width={240}
                    >
                      <span 
                        className="text-emerald-400 text-sm font-medium whitespace-nowrap cursor-help hover:text-emerald-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {market.supplyAPY}
                      </span>
                    </HoverCard>
                  </td>

                  {/* Borrow APY - Shows both directions */}
                  <td className="px-3 py-5 text-center">
                    <HoverCard
                      content={<BorrowAPYHover directions={market.borrowDirections} />}
                      width={260}
                    >
                      <span 
                        className="text-orange-400 text-sm font-medium whitespace-nowrap cursor-help hover:text-orange-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {market.borrowAPY}
                      </span>
                    </HoverCard>
                  </td>

                  <td className="px-3 py-5 text-center text-white text-sm whitespace-nowrap">{market.maxLeverage}</td>
                  
                  <td className="px-3 py-5">
                    <div className="flex items-center justify-center gap-2.5">
                      <HealthBarsIcon className="w-[51px] h-4 flex-shrink-0" healthPercentage={market.healthPercentage} />
                      <span className="text-white text-sm whitespace-nowrap">{market.healthPercentage}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
