import React from 'react';
import { cn } from '../../lib/utils';

interface PremiumCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'floating' | 'premium' | 'glass' | 'glass-dark' | 'glass-neon';
  className?: string;
  hover?: boolean;
  glow?: boolean;
  depth?: 1 | 2 | 3 | 4 | 5;
}

const PremiumCard: React.FC<PremiumCardProps> = ({
  children,
  variant = 'default',
  className,
  hover = false,
  glow = false,
  depth,
  ...props
}) => {
  const baseClasses = 'rounded-xl p-6 transition-all duration-300 ease-out';
  
  const variantClasses = {
    default: 'bg-white border border-neutral-200 shadow-card',
    elevated: 'bg-white border border-neutral-200 shadow-elevated',
    floating: 'bg-white border border-neutral-200 shadow-floating',
    premium: 'bg-white border border-neutral-200 shadow-premium',
    glass: 'glass text-white',
    'glass-dark': 'glass-dark text-white',
    'glass-neon': 'glass-neon text-white'
  };
  
  const hoverClasses = {
    default: 'hover:shadow-card-hover hover:-translate-y-1',
    elevated: 'hover:shadow-floating hover:-translate-y-2',
    floating: 'hover:shadow-premium hover:-translate-y-3',
    premium: 'hover:shadow-hero hover:-translate-y-4',
    glass: 'hover:bg-white/20 hover:border-white/30',
    'glass-dark': 'hover:bg-navy-800/90 hover:border-white/20',
    'glass-neon': 'hover:bg-neon-500/20 hover:border-neon-400/40'
  };
  
  const glowClasses = {
    default: 'hover:shadow-primary',
    elevated: 'hover:shadow-primary',
    floating: 'hover:shadow-primary',
    premium: 'hover:shadow-primary',
    glass: 'hover:shadow-neon',
    'glass-dark': 'hover:shadow-neon-lg',
    'glass-neon': 'hover:shadow-neon-xl'
  };
  
  const depthClass = depth ? `depth-${depth}` : '';
  
  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        hover && hoverClasses[variant],
        glow && glowClasses[variant],
        depthClass,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default PremiumCard;