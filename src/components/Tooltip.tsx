'use client';
import { Info } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { useState } from 'react';

interface TooltipProps {
  content: React.ReactNode;
  children?: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          className="inline-flex items-center text-white/40 hover:text-white/60 transition-colors"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
        >
          {children || <Info className="w-3.5 h-3.5" />}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        side="top"
        className="w-64 p-3 bg-[#1a1a1a] border-white/10 shadow-2xl shadow-black/50"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="text-white/80 text-sm leading-relaxed">{content}</div>
      </PopoverContent>
    </Popover>
  );
}