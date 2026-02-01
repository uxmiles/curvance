'use client';
import { ChevronDown } from 'lucide-react';
import { CurvanceLogo } from './CurvanceLogo';
import { MarketList } from './MarketList';
import { HideBalanceIcon } from './HideBalanceIcon';
import Monad from './imports/Monad';
import { Navbar } from './Navbar';

export function MarketView() {
  return (
    <div className="min-h-screen flex flex-col font-['Work_Sans',sans-serif]">
      {/* Header */}
      <Navbar />

      {/* Main Content - Add padding-top to account for fixed navbar */}
      <main className="flex-1 pt-[73px]">
        <MarketList />
      </main>
    </div>
  );
}