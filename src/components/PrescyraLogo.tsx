import React from 'react';
import prescyraLogo from '@/assets/prescyra-logo.jpeg';

interface PrescyraLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const PrescyraLogo: React.FC<PrescyraLogoProps> = ({ size = 'md' }) => {
  const sizes = {
    sm: { height: 'h-10' },
    md: { height: 'h-14' },
    lg: { height: 'h-20' },
  };

  const { height } = sizes[size];

  return (
    <img
      src={prescyraLogo}
      alt="Prescyra Logo"
      className={`${height} w-auto object-contain`}
    />
  );
};

export default PrescyraLogo;
