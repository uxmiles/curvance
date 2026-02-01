'use client';
import svgPaths from "./imports/svg-4fao85brgk";

export function CurvanceLogo() {
  return (
    <div className="flex items-center gap-2 group cursor-pointer">
      <div className="h-6 w-[22.26px] transition-all duration-300 group-hover:scale-110 group-hover:rotate-[5deg]">
        <svg className="block size-full drop-shadow-lg group-hover:drop-shadow-[0_0_8px_rgba(87,64,206,0.6)] transition-all duration-300" fill="none" preserveAspectRatio="none" viewBox="0 0 23 24">
          <path d={svgPaths.p3baff080} fill="#5740CE" />
          <path d={svgPaths.p20963200} fill="#FAF9F0" />
          <path d={svgPaths.pa11600} fill="#C8C6D2" />
          <path d={svgPaths.p1ab6a400} fill="#5740CE" />
        </svg>
      </div>
      <div className="h-[16.49px] w-[101.51px] transition-all duration-300 group-hover:translate-x-1">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 102 17">
          <path d={svgPaths.p2b54ca80} fill="#FAF9F0" className="transition-all duration-300 group-hover:fill-[#5740CE]" />
          <path d={svgPaths.p1bd837c0} fill="#FAF9F0" className="transition-all duration-300 group-hover:fill-[#5740CE]" style={{ transitionDelay: '50ms' }} />
          <path d={svgPaths.p2aa77480} fill="#FAF9F0" className="transition-all duration-300 group-hover:fill-[#5740CE]" style={{ transitionDelay: '100ms' }} />
        </svg>
      </div>
    </div>
  );
}