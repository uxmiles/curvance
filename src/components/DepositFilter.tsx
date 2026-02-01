'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { WBTCIcon, USDCIcon, WETHIcon, AUSDIcon, WMONIcon, AprMONIcon, SAUSDIcon } from './TokenIcons';

interface DepositFilterProps {
  onSelectionChange: (selected: string[]) => void;
}

export function DepositFilter({ onSelectionChange }: DepositFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

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
    asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAsset = (symbol: string) => {
    const newSelection = selectedAssets.includes(symbol)
      ? selectedAssets.filter(s => s !== symbol)
      : [...selectedAssets, symbol];
    
    setSelectedAssets(newSelection);
    onSelectionChange(newSelection);
  };

  const clearAll = () => {
    setSelectedAssets([]);
    onSelectionChange([]);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="flex items-center gap-2 relative" ref={containerRef}>
      <span className="text-white/40 text-sm">Deposit:</span>
      <button
        type="button"
        onClick={() => {
          console.log('Toggling dropdown, current state:', isOpen);
          setIsOpen(!isOpen);
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
          isOpen || selectedAssets.length > 0
            ? 'bg-[#5740CE]/20 border border-[#5740CE] text-white'
            : 'bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white'
        }`}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        <span className="font-medium">
          {selectedAssets.length > 0 ? `${selectedAssets.length} selected` : 'All'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div 
          className="fixed bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl w-80 overflow-hidden"
          style={{
            position: 'fixed',
            top: containerRef.current ? containerRef.current.getBoundingClientRect().bottom + 8 : 0,
            left: containerRef.current ? containerRef.current.getBoundingClientRect().left + 80 : 0,
            zIndex: 99999,
          }}
        >
          {/* Search */}
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search for deposit asset"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#5740CE]/50 transition-colors"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
            <div className="flex items-center gap-2">
              <button 
                onClick={clearAll}
                className="px-2 py-1 text-xs rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                All
              </button>
              <button className="px-2 py-1 text-xs rounded-md text-white/60 hover:bg-white/10 transition-colors">Eth</button>
              <button className="px-2 py-1 text-xs rounded-md text-white/60 hover:bg-white/10 transition-colors">Btc</button>
              <button className="px-2 py-1 text-xs rounded-md text-white/60 hover:bg-white/10 transition-colors">Stables</button>
            </div>
            <button
              onClick={clearAll}
              className="text-white/40 hover:text-white text-xs transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Asset List */}
          <div className="max-h-72 overflow-y-auto p-1">
            {filteredAssets.map((asset) => (
              <label
                key={asset.symbol}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={selectedAssets.includes(asset.symbol)}
                  onChange={() => toggleAsset(asset.symbol)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#5740CE] focus:ring-[#5740CE] focus:ring-offset-0 cursor-pointer"
                />
                <asset.Icon className="w-6 h-6 flex-shrink-0" />
                <span className="text-white text-sm">{asset.symbol}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
