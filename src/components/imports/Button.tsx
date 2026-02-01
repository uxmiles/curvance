import svgPaths from "./svg-dj6nno2alk";

function Svg() {
  return (
    <div className="relative size-[12px]" data-name="SVG">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="SVG">
          <path d={svgPaths.p24dbd100} id="Vector" stroke="var(--stroke-0, #9A9A9A)" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}

function Border() {
  return (
    <div className="content-stretch flex items-center justify-center p-px relative rounded-[32px] shrink-0 size-[32px]" data-name="Border">
      <div aria-hidden="true" className="absolute border border-[#2c2c2c] border-solid inset-0 pointer-events-none rounded-[32px]" />
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-[180deg]">
          <Svg />
        </div>
      </div>
    </div>
  );
}

export default function Button() {
  return (
    <div className="content-stretch flex flex-col items-end relative size-full" data-name="Button">
      <Border />
    </div>
  );
}