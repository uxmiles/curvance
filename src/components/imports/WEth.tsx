import svgPaths from "./svg-ahg2fgn8qo";
import { imgGroup } from "./svg-xxr78";

function Group() {
  return (
    <div className="absolute inset-[22.78%_24.66%_24.98%_23.32%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3.941px_-3.938px] mask-size-[320.267px_320.267px]" data-name="Group" style={{ maskImage: `url('${imgGroup}')` }}>
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 313 314">
        <g id="Group">
          <path d={svgPaths.p19b44780} fill="var(--fill-0, black)" id="Vector" />
          <path d={svgPaths.p319ad500} fill="var(--fill-0, black)" id="Vector_2" />
          <path d={svgPaths.p28c8e80} fill="var(--fill-0, #EC1C79)" id="Vector_3" />
          <path d={svgPaths.p234d7a00} fill="var(--fill-0, black)" id="Vector_4" />
          <path d={svgPaths.p33fb1d70} fill="var(--fill-0, white)" id="Vector_5" />
          <path clipRule="evenodd" d={svgPaths.peb68ef0} fill="var(--fill-0, black)" fillRule="evenodd" id="Vector_6" />
          <path d={svgPaths.pd833d00} fill="var(--fill-0, black)" id="Vector_7" />
          <path d={svgPaths.p11953680} fill="var(--fill-0, black)" id="Vector_8" />
        </g>
      </svg>
    </div>
  );
}

function ClipPathGroup() {
  return (
    <div className="absolute contents inset-[22.12%_24%_24.54%_22.67%]" data-name="Clip path group">
      <Group />
    </div>
  );
}

export default function WEth() {
  return (
    <div className="relative size-full" data-name="wETH">
      <div className="absolute inset-[4.79%_4.54%_4.82%_5.06%]" data-name="Vector">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 543 543">
          <path d={svgPaths.p2f2ae480} fill="var(--fill-0, #151313)" id="Vector" />
        </svg>
      </div>
      <div className="absolute inset-[0.79%_0.54%_0.82%_1.06%]" data-name="Vector (Stroke)">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 591 591">
          <path d={svgPaths.p35f07ec0} fill="var(--fill-0, #B01A5D)" id="Vector (Stroke)" />
        </svg>
      </div>
      <ClipPathGroup />
    </div>
  );
}