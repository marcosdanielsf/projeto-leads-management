import React from 'react';
import { cn } from '../../lib/utils';

interface BrandGradientProps {
  variant?: 'primary' | 'secondary' | 'neon' | 'hero' | 'subtle' | 'accent';
  direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl';
  opacity?: 'light' | 'medium' | 'strong';
  overlay?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const BrandGradient: React.FC<BrandGradientProps> = ({
  variant = 'primary',
  direction = 'to-br',
  opacity = 'medium',
  overlay = false,
  className,
  children
}) => {
  const gradientVariants = {
    primary: {
      light: `bg-gradient-${direction} from-primary-500/10 via-primary-400/5 to-transparent`,
      medium: `bg-gradient-${direction} from-primary-500/15 via-primary-400/8 to-transparent`,
      strong: `bg-gradient-${direction} from-primary-500/25 via-primary-400/15 to-primary-300/5`
    },
    secondary: {
      light: `bg-gradient-${direction} from-secondary-500/10 via-secondary-400/5 to-transparent`,
      medium: `bg-gradient-${direction} from-secondary-500/15 via-secondary-400/8 to-transparent`,
      strong: `bg-gradient-${direction} from-secondary-500/25 via-secondary-400/15 to-secondary-300/5`
    },
    neon: {
      light: `bg-gradient-${direction} from-neon-500/10 via-neon-400/5 to-transparent`,
      medium: `bg-gradient-${direction} from-neon-500/15 via-neon-400/8 to-transparent`,
      strong: `bg-gradient-${direction} from-neon-500/25 via-neon-400/15 to-neon-300/5`
    },
    hero: {
      light: `bg-gradient-${direction} from-navy-900/80 via-navy-800/60 to-navy-700/40`,
      medium: `bg-gradient-${direction} from-navy-950/90 via-navy-900/70 to-navy-800/50`,
      strong: `bg-gradient-${direction} from-navy-950 via-navy-900/90 to-navy-800/70`
    },
    subtle: {
      light: `bg-gradient-${direction} from-white/5 via-white/2 to-transparent`,
      medium: `bg-gradient-${direction} from-white/10 via-white/5 to-transparent`,
      strong: `bg-gradient-${direction} from-white/20 via-white/10 to-white/2`
    },
    accent: {
      light: `bg-gradient-${direction} from-neon-500/10 via-primary-500/5 to-secondary-500/5`,
      medium: `bg-gradient-${direction} from-neon-500/15 via-primary-500/10 to-secondary-500/8`,
      strong: `bg-gradient-${direction} from-neon-500/25 via-primary-500/15 to-secondary-500/12`
    }
  };

  const gradientClass = gradientVariants[variant][opacity];

  if (overlay) {
    return (
      <div className={cn('relative', className)}>
        {children}
        <div className={cn(
          'absolute inset-0 pointer-events-none',
          gradientClass
        )} />
      </div>
    );
  }

  return (
    <div className={cn(
      gradientClass,
      className
    )}>
      {children}
    </div>
  );
};

// Componente para texturas e padrões de ruído
interface NoiseTextureProps {
  intensity?: 'light' | 'medium' | 'strong';
  pattern?: 'noise' | 'grain' | 'dots' | 'lines';
  className?: string;
  children?: React.ReactNode;
}

const NoiseTexture: React.FC<NoiseTextureProps> = ({
  intensity = 'light',
  pattern = 'noise',
  className,
  children
}) => {
  const intensityClasses = {
    light: 'opacity-[0.02]',
    medium: 'opacity-[0.04]',
    strong: 'opacity-[0.08]'
  };

  const patternStyles = {
    noise: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    },
    grain: {
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='1' result='noise' seed='1'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.4'/%3E%3C/svg%3E")`,
    },
    dots: {
      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
      backgroundSize: '20px 20px'
    },
    lines: {
      backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }
  };

  return (
    <div className={cn('relative', className)}>
      {children}
      <div 
        className={cn(
          'absolute inset-0 pointer-events-none',
          intensityClasses[intensity]
        )}
        style={patternStyles[pattern]}
      />
    </div>
  );
};

// Componente para divisores elegantes
interface ElegantDividerProps {
  variant?: 'gradient' | 'neon' | 'subtle' | 'brand';
  orientation?: 'horizontal' | 'vertical';
  thickness?: 'thin' | 'medium' | 'thick';
  className?: string;
}

const ElegantDivider: React.FC<ElegantDividerProps> = ({
  variant = 'gradient',
  orientation = 'horizontal',
  thickness = 'thin',
  className
}) => {
  const thicknessClasses = {
    horizontal: {
      thin: 'h-px',
      medium: 'h-0.5',
      thick: 'h-1'
    },
    vertical: {
      thin: 'w-px',
      medium: 'w-0.5',
      thick: 'w-1'
    }
  };

  const variantClasses = {
    gradient: orientation === 'horizontal' 
      ? 'bg-gradient-to-r from-transparent via-neutral-300 to-transparent'
      : 'bg-gradient-to-b from-transparent via-neutral-300 to-transparent',
    neon: orientation === 'horizontal'
      ? 'bg-gradient-to-r from-transparent via-neon-500 to-transparent shadow-neon'
      : 'bg-gradient-to-b from-transparent via-neon-500 to-transparent shadow-neon',
    subtle: orientation === 'horizontal'
      ? 'bg-gradient-to-r from-transparent via-white/20 to-transparent'
      : 'bg-gradient-to-b from-transparent via-white/20 to-transparent',
    brand: orientation === 'horizontal'
      ? 'bg-gradient-to-r from-primary-500/0 via-primary-500/50 via-neon-500/50 to-secondary-500/0'
      : 'bg-gradient-to-b from-primary-500/0 via-primary-500/50 via-neon-500/50 to-secondary-500/0'
  };

  return (
    <div className={cn(
      thicknessClasses[orientation][thickness],
      variantClasses[variant],
      orientation === 'horizontal' ? 'w-full' : 'h-full',
      className
    )} />
  );
};

export { BrandGradient, NoiseTexture, ElegantDivider };
export default BrandGradient;