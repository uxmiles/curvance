'use client';
import { Sparkles, ArrowUpRight, Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState } from 'react';

interface APYBreakdownProps {
  baseAPY: string;
  rewardsAPY?: string;
  performanceFee?: string;
  children: React.ReactNode;
}

export function APYBreakdown({ baseAPY, rewardsAPY = '1.2', performanceFee = '0', children }: APYBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const baseRate = parseFloat(baseAPY.replace('%', ''));
  const rewardsRate = parseFloat(rewardsAPY);
  const feeRate = parseFloat(performanceFee);
  const netAPY = baseRate + rewardsRate - feeRate;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        align="start" 
        side="top"
        className="w-64 p-3 bg-[#1a1a1a] border-white/10 shadow-2xl shadow-black/50"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="space-y-2.5">
          {/* Native APY */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="text-white/60 text-sm">Native APY</span>
            </div>
            <span className="text-white text-sm">{baseAPY}</span>
          </div>

          {/* Rewards APY */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-white/60 text-sm">Bytes</span>
              <ArrowUpRight className="w-3 h-3 text-white/40" />
            </div>
            <span className="text-violet-400 text-sm">+{rewardsAPY}%</span>
          </div>

          {/* Performance Fee */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-sm">$</span>
              <span className="text-white/60 text-sm">Performance Fee</span>
              <span className="text-white/30 text-xs">{performanceFee}%</span>
            </div>
            <span className="text-white/40 text-sm">0.00%</span>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-2" />

          {/* Net APY */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#5740CE]" />
              <span className="text-[#5740CE] font-medium text-sm">Net APY</span>
            </div>
            <span className="text-[#5740CE] font-medium text-sm">{netAPY.toFixed(2)}%</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}