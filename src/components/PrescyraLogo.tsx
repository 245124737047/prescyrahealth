import React from 'react';

interface PrescyraLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const PrescyraLogo: React.FC<PrescyraLogoProps> = ({ size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 32, text: 'text-lg' },
    md: { icon: 44, text: 'text-2xl' },
    lg: { icon: 56, text: 'text-3xl' },
  };

  const { icon, text } = sizes[size];

  return (
    <div className="flex items-center gap-3">
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Left capsule half - blue/cyan, tilted right */}
        <path
          d="M12 42C8 38 8 32 12 28L22 18C26 14 32 14 36 18L26 28C22 32 22 38 26 42L16 52C12 48 8 46 12 42Z"
          fill="url(#blueGradient)"
          transform="rotate(5, 24, 35)"
        />
        
        {/* Right capsule half - green/teal, tilted left */}
        <path
          d="M52 42C56 38 56 32 52 28L42 18C38 14 32 14 28 18L38 28C42 32 42 38 38 42L48 52C52 48 56 46 52 42Z"
          fill="url(#greenGradient)"
          transform="rotate(-5, 40, 35)"
        />
        
        {/* Center plant sprout */}
        <g transform="translate(32, 38)">
          {/* Curved stem */}
          <path
            d="M0 8C0 4 -1 0 0 -4"
            stroke="url(#stemGradient)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left leaf */}
          <ellipse
            cx="-5"
            cy="-2"
            rx="4"
            ry="2.5"
            fill="url(#leafGradient)"
            transform="rotate(-30, -5, -2)"
          />
          {/* Right leaf */}
          <ellipse
            cx="5"
            cy="-2"
            rx="4"
            ry="2.5"
            fill="url(#leafGradient)"
            transform="rotate(30, 5, -2)"
          />
          {/* Water droplets */}
          <circle cx="-7" cy="2" r="1.5" fill="hsl(195, 85%, 65%)" opacity="0.7" />
          <circle cx="8" cy="4" r="1" fill="hsl(195, 85%, 65%)" opacity="0.5" />
        </g>
        
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(195, 85%, 55%)" />
            <stop offset="100%" stopColor="hsl(210, 80%, 50%)" />
          </linearGradient>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(168, 60%, 45%)" />
            <stop offset="100%" stopColor="hsl(155, 55%, 40%)" />
          </linearGradient>
          <linearGradient id="stemGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="hsl(155, 55%, 40%)" />
            <stop offset="100%" stopColor="hsl(140, 50%, 50%)" />
          </linearGradient>
          <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(145, 55%, 50%)" />
            <stop offset="100%" stopColor="hsl(160, 50%, 42%)" />
          </linearGradient>
        </defs>
      </svg>
      
      {showText && (
        <span className={`font-heading font-bold tracking-wide ${text} bg-gradient-to-r from-cyan-500 to-teal-500 bg-clip-text text-transparent`}>
          PRESCYRA
        </span>
      )}
    </div>
  );
};

export default PrescyraLogo;
