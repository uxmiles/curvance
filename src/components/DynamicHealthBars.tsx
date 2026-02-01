'use client';
interface DynamicHealthBarsProps {
  percentage: number;
  className?: string;
}

export function DynamicHealthBars({ percentage, className }: DynamicHealthBarsProps) {
  // 9 bars total
  const totalBars = 9;
  const activeBars = Math.round((percentage / 100) * totalBars);

  // Define colors for each bar position (left to right: red -> orange -> yellow -> green)
  const barColors = [
    '#EF4444', // red - bar 1
    '#EF4444', // red - bar 2
    '#F97316', // orange - bar 3
    '#F97316', // orange - bar 4
    '#EAB308', // yellow - bar 5
    '#EAB308', // yellow - bar 6
    '#22C55E', // green - bar 7
    '#22C55E', // green - bar 8
    '#22C55E', // green - bar 9
  ];

  const bars = Array.from({ length: totalBars }, (_, index) => ({
    id: index,
    color: index < activeBars ? barColors[index] : '#374151', // gray-700 for inactive
    x: index * 5.797, // spacing between bars
  }));

  return (
    <svg className={className} viewBox="0 0 51 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_health_bars)">
        {bars.map((bar) => (
          <path
            key={bar.id}
            d={`M${bar.x + 3.797} 4.5C${bar.x + 3.797} 3.67157 ${bar.x + 2.947} 3 ${bar.x + 1.898} 3C${bar.x + 0.85} 3 ${bar.x} 3.67157 ${bar.x} 4.5V11.5C${bar.x} 12.3284 ${bar.x + 0.85} 13 ${bar.x + 1.898} 13C${bar.x + 2.947} 13 ${bar.x + 3.797} 12.3284 ${bar.x + 3.797} 11.5V4.5Z`}
            fill={bar.color}
          />
        ))}
      </g>
      <defs>
        <clipPath id="clip0_health_bars">
          <rect width="50.1719" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}
