import React from 'react';

interface PrescyraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const PrescyraLogo: React.FC<PrescyraLogoProps> = ({ size = 'md', showText = false }) => {
  const sizes = {
    sm: { icon: 36, text: 'text-base' },
    md: { icon: 48, text: 'text-xl' },
    lg: { icon: 64, text: 'text-2xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Blue capsule - left, tilted */}
        <ellipse
          cx="32"
          cy="50"
          rx="26"
          ry="18"
          fill="url(#blueCapsule)"
          transform="rotate(-25, 32, 50)"
        />
        {/* Blue capsule highlight */}
        <ellipse
          cx="26"
          cy="44"
          rx="10"
          ry="6"
          fill="hsl(195, 90%, 70%)"
          opacity="0.5"
          transform="rotate(-25, 26, 44)"
        />
        
        {/* Green capsule - right, tilted opposite */}
        <ellipse
          cx="68"
          cy="52"
          rx="24"
          ry="16"
          fill="url(#greenCapsule)"
          transform="rotate(20, 68, 52)"
        />
        {/* Green capsule highlight */}
        <ellipse
          cx="64"
          cy="46"
          rx="9"
          ry="5"
          fill="hsl(155, 60%, 55%)"
          opacity="0.4"
          transform="rotate(20, 64, 46)"
        />
        
        {/* Plant stem */}
        <path
          d="M50 55 Q48 42 52 30"
          stroke="hsl(145, 55%, 40%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Left leaf */}
        <path
          d="M52 32 Q42 24 38 14 Q48 18 52 32"
          fill="hsl(145, 55%, 45%)"
        />
        
        {/* Right leaf */}
        <path
          d="M52 28 Q60 18 68 12 Q62 24 52 28"
          fill="hsl(150, 50%, 40%)"
        />
        
        {/* Small inner leaf */}
        <path
          d="M50 38 Q46 32 44 24 Q50 30 50 38"
          fill="hsl(140, 50%, 50%)"
        />
        
        {/* Water droplets */}
        <circle cx="30" cy="28" r="3" fill="hsl(195, 85%, 60%)" />
        <circle cx="24" cy="35" r="2" fill="hsl(195, 85%, 65%)" />
        <circle cx="36" cy="22" r="2" fill="hsl(195, 85%, 55%)" />
        <circle cx="22" cy="26" r="1.5" fill="hsl(195, 85%, 70%)" />
        
        <defs>
          <linearGradient id="blueCapsule" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(195, 80%, 55%)" />
            <stop offset="50%" stopColor="hsl(200, 75%, 50%)" />
            <stop offset="100%" stopColor="hsl(205, 70%, 45%)" />
          </linearGradient>
          <linearGradient id="greenCapsule" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(155, 55%, 50%)" />
            <stop offset="50%" stopColor="hsl(160, 50%, 45%)" />
            <stop offset="100%" stopColor="hsl(165, 45%, 40%)" />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <span className={`font-heading font-bold tracking-widest ${text} text-primary`}>
          PRESCYRA
        </span>
      )}
    </div>
  );
};

export default PrescyraLogo;
