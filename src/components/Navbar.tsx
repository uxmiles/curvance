'use client';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CurvanceLogo } from './CurvanceLogo';
import { HideBalanceIcon } from './HideBalanceIcon';
import Monad from './imports/Monad';

export function Navbar() {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 border-b border-white/5 px-3 md:px-10 py-4 backdrop-blur-xl bg-[#0a0a0a]/80 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-12">
          <CurvanceLogo />
          <nav className="hidden md:flex items-center gap-1">
            <button onClick={() => router.push('/')} className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all">Dashboard</button>
            <button onClick={() => router.push('/')} className="px-3 py-2 rounded-lg text-white bg-white/10 transition-all">Explore</button>
            <button className="px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all">Portfolio</button>
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <button className="hover:opacity-80 transition-opacity">
            <HideBalanceIcon className="w-11 h-11" />
          </button>
          <button className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl btn-lift glow-purple-hover">
            <div className="w-4 h-4 md:w-5 md:h-5">
              <Monad />
            </div>
            <span className="text-sm md:text-base">Monad</span>
            <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
          <button className="flex items-center gap-1.5 md:gap-2 px-2 md:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-200 border border-white/10 hover:border-white/20 shadow-lg hover:shadow-xl btn-lift glow-purple-hover">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-xs text-white font-medium">
              🦄
            </div>
            <span className="text-sm md:text-base">0xe3d...fb</span>
            <ChevronDown className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
