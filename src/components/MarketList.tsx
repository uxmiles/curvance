'use client';
import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, X, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { WBTCIcon, USDCIcon, WETHIcon, AUSDIcon, WMONIcon, AprMONIcon, SAUSDIcon } from './TokenIcons';
import { Oracle1Icon, Oracle2Icon, Oracle3Icon } from './OracleIcons';
import { HealthBarsIcon } from './HealthBarsIcon';
import { Tooltip } from './Tooltip';
import { DepositFilter } from './DepositFilter';

interface Market {
  id: string;
  name: string;
  tokenSymbol: string; // Added to identify which token this market uses
  oracleName: string; // Name of the oracle used
  TokenIcon: React.ComponentType<{ className?: string }>;
  OracleIcon: React.ComponentType<{ className?: string }>;
  tvl: string;
  totalDeposits: string;
  totalDepositsExact: string;
  availableLiquidity: string;
  availableLiquidityExact: string;
  supplyAPY: string;
  borrowAPY: string;
  maxLeverage: string;
  healthPercentage: number;
}

const mockMarkets: Market[] = [
  {
    id: '1',
    name: 'Market A',
    tokenSymbol: 'USDC',
    oracleName: 'Chainlink',
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
  },
  {
    id: '2',
    name: 'Market B',
    tokenSymbol: 'wETH',
    oracleName: 'Pyth',
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
  },
  {
    id: '3',
    name: 'Market C',
    tokenSymbol: 'wBTC',
    oracleName: 'Redstone',
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
  },
  {
    id: '4',
    name: 'Market D',
    tokenSymbol: 'AUSD',
    oracleName: 'Chainlink',
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
  },
  {
    id: '5',
    name: 'Market E',
    tokenSymbol: 'wMON',
    oracleName: 'Pyth',
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
  },
  {
    id: '6',
    name: 'Market F',
    tokenSymbol: 'aprMON',
    oracleName: 'Redstone',
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
  },
  {
    id: '7',
    name: 'Market G',
    tokenSymbol: 'sAUSD',
    oracleName: 'Chainlink',
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
    // Remove $, %, x and convert B/M to numbers
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
      // Toggle direction
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      // New column, default to descending
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

    // Add small delay to prevent immediate closure on open
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

  // Filter markets based on selected deposit assets AND wallet filter AND search term
  const filteredMarkets = mockMarkets.filter(market => {
    // First apply deposit asset filter
    let matchesDepositFilter = true;
    if (selectedDepositAssets.length > 0) {
      matchesDepositFilter = selectedDepositAssets.includes(market.tokenSymbol);
    }

    // Then apply wallet filter
    let matchesWalletFilter = true;
    if (walletFilter) {
      matchesWalletFilter = userWalletTokens.includes(market.tokenSymbol);
    }

    // Apply search filter
    let matchesSearchFilter = true;
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      matchesSearchFilter = 
        market.name.toLowerCase().includes(search) ||
        market.tokenSymbol.toLowerCase().includes(search) ||
        market.oracleName.toLowerCase().includes(search);
    }

    // Market must match all filters
    return matchesDepositFilter && matchesWalletFilter && matchesSearchFilter;
  });

  // Sort filtered markets
  const sortedMarkets = filteredMarkets.sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = parseValue(a[sortColumn]);
    const bValue = parseValue(b[sortColumn]);
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  console.log('Wallet filter active:', walletFilter);
  console.log('Selected assets:', selectedDepositAssets);
  console.log('Filtered markets:', filteredMarkets);

  return (
    <div className="max-w-[1400px] mx-auto px-3 md:px-10 py-6 md:py-12">
      {/* Stats Row */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-12 gap-8">
        {/* Total Deposits */}
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

        {/* Active Loans & Earnings */}
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
          {/* In Wallet Toggle */}
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

          {/* Deposit Filter - NEW COMPONENT */}
          <DepositFilter onSelectionChange={setSelectedDepositAssets} />

          {/* Advanced Filter */}
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white/60 hover:text-white transition-all text-sm whitespace-nowrap">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span>Advanced</span>
          </button>
        </div>

        {/* Search */}
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
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: '20%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '11%' }} />
              <col style={{ width: '23%' }} />
            </colgroup>
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-4 text-white/40 font-normal text-sm">
                  <div className="flex items-center gap-2">
                    <span>Markets</span>
                    <span className="text-white/30">{mockMarkets.length}</span>
                  </div>
                </th>
                <th className="text-left px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('totalDeposits')}
                  >
                    <span className="whitespace-nowrap">Total Deposits</span>
                    {sortColumn === 'totalDeposits' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
                <th className="text-left px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('availableLiquidity')}
                  >
                    <span className="whitespace-nowrap">Available Liq.</span>
                    {sortColumn === 'availableLiquidity' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
                <th className="text-left px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('supplyAPY')}
                  >
                    <span className="whitespace-nowrap">Supply APY</span>
                    {sortColumn === 'supplyAPY' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
                <th className="text-left px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('borrowAPY')}
                  >
                    <span className="whitespace-nowrap">Borrow APY</span>
                    {sortColumn === 'borrowAPY' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
                <th className="text-left px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center gap-1 hover:text-white transition-colors w-full"
                    onClick={() => handleSort('maxLeverage')}
                  >
                    <span className="whitespace-nowrap">Max Lev.</span>
                    {sortColumn === 'maxLeverage' && (
                      sortDirection === 'desc' ? <ArrowUp className="w-3.5 h-3.5 flex-shrink-0" /> : <ArrowDown className="w-3.5 h-3.5 flex-shrink-0" />
                    )}
                  </button>
                </th>
                <th className="text-left px-3 py-4 text-white/40 font-normal text-sm">
                  <button 
                    className="flex items-center gap-1 hover:text-white transition-colors w-full"
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
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-3">
                      <market.TokenIcon className="w-10 h-10 rounded-full flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-white text-sm font-medium whitespace-nowrap">{market.name}</span>
                          <Tooltip content={`The oracle used in this market is ${market.oracleName}.`}>
                            <div className="inline-flex flex-shrink-0">
                              <market.OracleIcon className="w-4 h-4" />
                            </div>
                          </Tooltip>
                        </div>
                        <div className="text-white/40 text-xs whitespace-nowrap">{market.tvl}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-5">
                    <Tooltip content={market.totalDepositsExact}>
                      <span className="text-white text-sm whitespace-nowrap cursor-help">
                        {market.totalDeposits}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-3 py-5">
                    <Tooltip content={market.availableLiquidityExact}>
                      <span className="text-white text-sm whitespace-nowrap cursor-help">
                        {market.availableLiquidity}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-3 py-5">
                    <Tooltip content={
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-white/60">Base APY:</span>
                          <span className="text-white">6.5%</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/60">CVE Rewards:</span>
                          <span className="text-green-400">3.2%</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/60">Bytes Boost:</span>
                          <span className="text-purple-400">1.2%</span>
                        </div>
                        <div className="border-t border-white/10 pt-1 mt-1 flex justify-between gap-4">
                          <span className="text-white font-medium">Total APY:</span>
                          <span className="text-green-400 font-medium">{market.supplyAPY}</span>
                        </div>
                      </div>
                    }>
                      <span className="text-green-400 text-sm font-medium whitespace-nowrap cursor-help">
                        {market.supplyAPY}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-3 py-5">
                    <Tooltip content={
                      <div className="space-y-1">
                        <div className="flex justify-between gap-4">
                          <span className="text-white/60">Base APY:</span>
                          <span className="text-white">3.2%</span>
                        </div>
                        <div className="flex justify-between gap-4">
                          <span className="text-white/60">CVE Rewards:</span>
                          <span className="text-green-400">1.4%</span>
                        </div>
                        <div className="border-t border-white/10 pt-1 mt-1 flex justify-between gap-4">
                          <span className="text-white font-medium">Total APY:</span>
                          <span className="text-orange-400 font-medium">{market.borrowAPY}</span>
                        </div>
                      </div>
                    }>
                      <span className="text-orange-400 text-sm font-medium whitespace-nowrap cursor-help">
                        {market.borrowAPY}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-3 py-5 text-white text-sm whitespace-nowrap">{market.maxLeverage}</td>
                  <td className="px-3 py-5">
                    <div className="flex items-center gap-2.5">
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