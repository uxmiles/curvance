'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wallet, Unplug, ChevronRight, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

const isDev = process.env.NODE_ENV === 'development';

// Mock market data for navigation
const markets = [
  { id: '1', name: 'Market A' },
  { id: '2', name: 'Market B' },
  { id: '3', name: 'Market C' },
  { id: '4', name: 'Market D' },
  { id: '5', name: 'Market E' },
  { id: '6', name: 'Market F' },
  { id: '7', name: 'Market G' },
];

interface DevToolbarProps {
  isConnected?: boolean;
  onConnectionChange?: (connected: boolean) => void;
}

export function DevToolbar({ isConnected = false, onConnectionChange }: DevToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [connected, setConnected] = useState(isConnected);
  const router = useRouter();

  if (!isDev) return null;

  const handleToggleConnection = () => {
    const newState = !connected;
    setConnected(newState);
    onConnectionChange?.(newState);
  };

  const handleNavigateToMarket = (marketId: string) => {
    router.push(`/market/${marketId}`);
    setIsOpen(false);
  };

  const handleNavigateHome = () => {
    router.push('/');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end font-sans">
      {/* Expanded Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className="mb-3 bg-[#0a0a0a] rounded-xl shadow-2xl overflow-hidden min-w-[220px] border border-[#333] origin-bottom-right text-[#ccc]"
            style={{ colorScheme: 'dark' }}
          >
            {/* Header */}
            <div className="px-3 py-2 border-b flex items-center gap-2" style={{ borderColor: '#333' }}>
              <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: '#666' }}>Dev Tools</span>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {/* Wallet Connection Toggle */}
              <button
                onClick={handleToggleConnection}
                className="w-full flex items-center justify-between px-3 py-2 text-[13px] hover:bg-[#1a1a1a] transition-colors"
                style={{ color: '#ccc' }}
              >
                <div className="flex items-center gap-2.5">
                  {connected ? (
                    <Wallet className="size-3.5" style={{ opacity: 0.6 }} />
                  ) : (
                    <Unplug className="size-3.5" style={{ opacity: 0.6 }} />
                  )}
                  <span>Wallet</span>
                </div>
                <div className="flex items-center gap-2">
                  <span 
                    className="text-[11px] px-1.5 py-0.5 rounded font-medium"
                    style={{ 
                      backgroundColor: connected ? '#10b98120' : '#ef444420',
                      color: connected ? '#10b981' : '#ef4444'
                    }}
                  >
                    {connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </button>

              {/* Divider */}
              <div className="my-1 border-t" style={{ borderColor: '#333' }} />

              {/* Navigate Home */}
              <button
                onClick={handleNavigateHome}
                className="w-full flex items-center justify-between px-3 py-2 text-[13px] hover:bg-[#1a1a1a] transition-colors"
                style={{ color: '#ccc' }}
              >
                <div className="flex items-center gap-2.5">
                  <ExternalLink className="size-3.5" style={{ opacity: 0.6 }} />
                  <span>Go to Home</span>
                </div>
                <ChevronRight className="size-3.5" style={{ opacity: 0.3 }} />
              </button>

              {/* Divider */}
              <div className="my-1 border-t" style={{ borderColor: '#333' }} />

              {/* Market Navigation Label */}
              <div className="px-3 py-1.5">
                <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: '#666' }}>Navigate to Market</span>
              </div>

              {/* Market Links */}
              {markets.map((market) => (
                <button
                  key={market.id}
                  onClick={() => handleNavigateToMarket(market.id)}
                  className="w-full flex items-center justify-between px-3 py-2 text-[13px] hover:bg-[#1a1a1a] transition-colors"
                  style={{ color: '#ccc' }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="size-3.5 flex items-center justify-center text-[10px] rounded bg-white/10" style={{ opacity: 0.6 }}>
                      {market.id}
                    </span>
                    <span>{market.name}</span>
                  </div>
                  <ChevronRight className="size-3.5" style={{ opacity: 0.3 }} />
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-3 py-2 border-t flex flex-col gap-1" style={{ borderColor: '#333' }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: '#666' }}>Environment</span>
                <span className="text-[11px] font-medium" style={{ color: '#10b981' }}>Development</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: '#666' }}>Wallet</span>
                <span 
                  className="text-[11px] font-medium" 
                  style={{ color: connected ? '#10b981' : '#ef4444' }}
                >
                  {connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="flex items-center justify-center size-10 bg-[#0a0a0a] hover:bg-[#1a1a1a] rounded-full shadow-lg border border-[#333] transition-colors"
      >
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none"
          className="text-[#ccc]"
        >
          <path 
            d="M12 2L2 7L12 12L22 7L12 2Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M2 17L12 22L22 17" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          <path 
            d="M2 12L12 17L22 12" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </motion.button>
    </div>
  );
}
