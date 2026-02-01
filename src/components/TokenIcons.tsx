'use client';
import svgPaths from "./imports/svg-3s6ct43ata";
import { imgGroup } from "./imports/svg-yydc2";
import WEth from "./imports/WEth";

export function USDCIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 601 601">
        <g id="USDC">
          <path d={svgPaths.p2b039fc0} fill="#2775CA" id="Coin" />
          <g id="USD Coin">
            <path d={svgPaths.p124ed980} fill="white" />
            <path d={svgPaths.p33961080} fill="white" />
            <path d={svgPaths.p23553440} fill="white" />
          </g>
        </g>
      </svg>
    </div>
  );
}

export function AUSDIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 601 601">
        <g clipPath="url(#clip0_4_7565)" id="AUSD">
          <path d={svgPaths.p2b56b700} fill="#9A9350" id="Vector" />
          <path d={svgPaths.p25105a00} fill="white" id="Vector_2" />
          <path d={svgPaths.pa537a00} fill="white" id="Vector_3" />
          <path d={svgPaths.p18255600} fill="white" id="Vector_4" />
          <path d={svgPaths.p3b451700} fill="white" id="Vector_5" />
          <path d={svgPaths.p325bc300} fill="white" id="Vector_6" />
          <path d={svgPaths.p35cf5900} fill="white" id="Vector_7" />
        </g>
        <defs>
          <clipPath id="clip0_4_7565">
            <rect fill="white" height="600.476" width="600.476" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export function SAUSDIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 601 601">
        <g id="sAUSD">
          <circle cx="300.238" cy="300.238" fill="#4E6B45" id="Ellipse 4822" r="300.238" />
          <path d={svgPaths.p28f07e00} fill="#2D4D39" id="Vector" />
          <path d={svgPaths.p391c35f0} fill="#4E6B45" id="Vector_2" />
          <path d={svgPaths.p1b7a8c00} fill="white" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

export function WMONIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 601 601">
        <g id="wMON">
          <rect fill="#1C0450" height="600.457" rx="300.228" width="600.476" y="0.00234032" />
          <g id="Vector">
            <path d={svgPaths.p4c6ff80} fill="#1C0450" />
            <path d={svgPaths.p5c42c20} stroke="white" strokeOpacity="0.1" strokeWidth="9.0991" />
          </g>
          <path d={svgPaths.p3224d600} fill="white" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

export function AprMONIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 601 601">
        <g id="aprMON">
          <path d={svgPaths.p27dcc700} fill="url(#paint0_linear_4_7506)" id="Vector" />
          <path d={svgPaths.p38211800} id="Vector_2" stroke="white" strokeOpacity="0.3" strokeWidth="8.34028" />
          <path d={svgPaths.p13eda00} fill="white" id="Vector_3" />
          <path d={svgPaths.p349d7f00} fill="white" id="Vector_4" />
          <path d={svgPaths.p8b5ba00} fill="white" id="Vector_5" />
          <path d={svgPaths.p13a05600} fill="white" id="Vector_6" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_4_7506" x1="599.901" x2="2.79956" y1="0.598101" y2="597.701">
            <stop stopColor="#B94DFF" />
            <stop offset="0.22" stopColor="#A14DFF" />
            <stop offset="0.49" stopColor="#8C4DFF" />
            <stop offset="0.75" stopColor="#804DFF" />
            <stop offset="1" stopColor="#7C4DFF" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export function MuBONDIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 601 601">
        <g clipPath="url(#clip0_4_7531)" id="muBOND">
          <circle cx="300.25" cy="300.248" fill="#001C5C" id="Ellipse 4821" r="300.25" />
          <path d={svgPaths.p49ce880} fill="white" id="Vector" />
          <path d={svgPaths.p1c2f3da0} fill="white" id="Vector_2" />
        </g>
        <defs>
          <clipPath id="clip0_4_7531">
            <rect fill="white" height="600.5" width="600.5" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export function WETHIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <WEth />
    </div>
  );
}

export function WBTCIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 601 601">
        <g id="WBTC">
          <path clipRule="evenodd" d={svgPaths.p1868e800} fill="#423A4F" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p187ed780} fill="#EB9444" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p29b6cb00} fill="#FBFBFB" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p35905080} fill="#A9A6AE" fillRule="evenodd" id="Vector_4" />
          <path clipRule="evenodd" d={svgPaths.p4953500} fill="#8C8C94" fillRule="evenodd" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

export function SMONIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 601 601">
        <g clipPath="url(#clip0_4_7553)" id="sMON">
          <path d={svgPaths.pc2266f0} fill="url(#paint0_linear_4_7553)" id="Vector" />
          <path d={svgPaths.p514fe00} fill="url(#paint1_linear_4_7553)" id="Vector_2" />
        </g>
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint0_linear_4_7553" x1="300.25" x2="300.25" y1="2.80233" y2="601.751">
            <stop stopColor="#3D1F89" />
            <stop offset="1" stopColor="#16033D" />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" id="paint1_linear_4_7553" x1="300.253" x2="300.253" y1="116.65" y2="483.856">
            <stop stopColor="#836EF9" />
            <stop offset="1" stopColor="#18F3E6" />
          </linearGradient>
          <clipPath id="clip0_4_7553">
            <rect fill="white" height="600.5" width="600.5" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

export function EZETHIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <div className={className}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 601 601">
        <g id="ezETH">
          <path d={svgPaths.p2ce0da00} fill="#C4FF61" id="Vector" />
          <path d={svgPaths.p1a6d4f80} fill="black" fillOpacity="0.4" id="Vector_2" />
          <path d={svgPaths.p36e9ac00} fill="black" fillOpacity="0.4" id="Vector_3" />
          <path d={svgPaths.pd2a4300} fill="black" id="Vector_4" />
          <path d={svgPaths.p1c133200} fill="black" id="Vector_5" />
          <path d={svgPaths.p143e8000} fill="black" id="Vector_6" />
          <path d={svgPaths.pfc57800} fill="black" fillOpacity="0.4" id="Vector_7" />
        </g>
      </svg>
    </div>
  );
}