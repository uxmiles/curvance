'use client';
interface HealthBarsIconProps {
  className?: string;
  healthPercentage: number;
}

export function HealthBarsIcon({ className, healthPercentage }: HealthBarsIconProps) {
  // 9 bars total (2 red, 2 orange, 2 yellow, 3 green)
  const totalBars = 9;
  const activeBars = Math.ceil((healthPercentage / 100) * totalBars);

  // Define which bars should be active based on percentage
  const getBarColor = (index: number): string => {
    if (index >= activeBars) {
      return '#4B5563'; // gray-600 for inactive bars
    }
    
    // Active bars follow the gradient: red -> orange -> yellow -> green
    if (index < 2) return '#EF4444'; // red
    if (index < 4) return '#F97316'; // orange
    if (index < 6) return '#EAB308'; // yellow
    return '#22C55E'; // green
  };

  return (
    <svg className={className} viewBox="0 0 51 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_287_745)">
        <path d="M3.79688 4.5C3.79688 3.67157 2.94692 3 1.89844 3C0.849959 3 0 3.67157 0 4.5V11.5C0 12.3284 0.849959 13 1.89844 13C2.94692 13 3.79688 12.3284 3.79688 11.5V4.5Z" fill={getBarColor(0)}/>
        <path d="M9.59375 4.5C9.59375 3.67157 8.74379 3 7.69531 3C6.64683 3 5.79688 3.67157 5.79688 4.5V11.5C5.79688 12.3284 6.64683 13 7.69531 13C8.74379 13 9.59375 12.3284 9.59375 11.5V4.5Z" fill={getBarColor(1)}/>
        <path d="M15.3906 4.5C15.3906 3.67157 14.5407 3 13.4922 3C12.4437 3 11.5938 3.67157 11.5938 4.5V11.5C11.5938 12.3284 12.4437 13 13.4922 13C14.5407 13 15.3906 12.3284 15.3906 11.5V4.5Z" fill={getBarColor(2)}/>
        <path d="M21.1875 4.5C21.1875 3.67157 20.3375 3 19.2891 3C18.2406 3 17.3906 3.67157 17.3906 4.5V11.5C17.3906 12.3284 18.2406 13 19.2891 13C20.3375 13 21.1875 12.3284 21.1875 11.5V4.5Z" fill={getBarColor(3)}/>
        <path d="M26.9844 4.5C26.9844 3.67157 26.1344 3 25.0859 3C24.0375 3 23.1875 3.67157 23.1875 4.5V11.5C23.1875 12.3284 24.0375 13 25.0859 13C26.1344 13 26.9844 12.3284 26.9844 11.5V4.5Z" fill={getBarColor(4)}/>
        <path d="M32.7812 4.5C32.7812 3.67157 31.9313 3 30.8828 3C29.8343 3 28.9844 3.67157 28.9844 4.5V11.5C28.9844 12.3284 29.8343 13 30.8828 13C31.9313 13 32.7812 12.3284 32.7812 11.5V4.5Z" fill={getBarColor(5)}/>
        <path d="M38.5781 4.5C38.5781 3.67157 37.7282 3 36.6797 3C35.6312 3 34.7812 3.67157 34.7812 4.5V11.5C34.7812 12.3284 35.6312 13 36.6797 13C37.7282 13 38.5781 12.3284 38.5781 11.5V4.5Z" fill={getBarColor(6)}/>
        <path d="M44.375 4.5C44.375 3.67157 43.525 3 42.4766 3C41.4281 3 40.5781 3.67157 40.5781 4.5V11.5C40.5781 12.3284 41.4281 13 42.4766 13C43.525 13 44.375 12.3284 44.375 11.5V4.5Z" fill={getBarColor(7)}/>
        <path d="M50.1719 4.5C50.1719 3.67157 49.3219 3 48.2734 3C47.225 3 46.375 3.67157 46.375 4.5V11.5C46.375 12.3284 47.225 13 48.2734 13C49.3219 13 50.1719 12.3284 50.1719 11.5V4.5Z" fill={getBarColor(8)}/>
      </g>
      <defs>
        <clipPath id="clip0_287_745">
          <rect width="50.1719" height="16" fill="white"/>
        </clipPath>
      </defs>
    </svg>
  );
}