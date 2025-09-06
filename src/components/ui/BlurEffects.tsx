import React from 'react';
import { cn } from '../../lib/utils';

interface BlurBackdropProps {
  children: React.ReactNode;
  variant?: 'light' | 'medium' | 'heavy' | 'glass';
  className?: string;
}

export const BlurBackdrop: React.FC<BlurBackdropProps> = ({
  children,
  variant = 'medium',
  className
}) => {
  const blurVariants = {
    light: 'backdrop-blur-sm',
    medium: 'backdrop-blur-md',
    heavy: 'backdrop-blur-lg',
    glass: 'backdrop-blur-xl'
  };

  return (
    <div className={cn(
      'relative',
      blurVariants[variant],
      className
    )}>
      {children}
    </div>
  );
};

interface NoiseOverlayProps {
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

export const NoiseOverlay: React.FC<NoiseOverlayProps> = ({
  intensity = 'subtle',
  className
}) => {
  const intensityStyles = {
    subtle: 'opacity-[0.03]',
    medium: 'opacity-[0.05]',
    strong: 'opacity-[0.08]'
  };

  return (
    <div 
      className={cn(
        'absolute inset-0 pointer-events-none',
        'bg-[url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")]',
        intensityStyles[intensity],
        className
      )}
    />
  );
};

interface TextureCardProps {
  children: React.ReactNode;
  texture?: 'noise' | 'grain' | 'paper' | 'fabric';
  className?: string;
}

export const TextureCard: React.FC<TextureCardProps> = ({
  children,
  texture = 'noise',
  className
}) => {
  const texturePatterns = {
    noise: 'bg-[url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.4\'/%3E%3C/svg%3E")]',
    grain: 'bg-[url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'grain\'%3E%3CfeTurbulence type=\'turbulence\' baseFrequency=\'0.02\' numOctaves=\'3\' result=\'noise\' seed=\'1\'/%3E%3CfeColorMatrix in=\'noise\' type=\'saturate\' values=\'0\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23grain)\' opacity=\'0.25\'/%3E%3C/svg%3E")]',
    paper: 'bg-[url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'paper\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.04\' numOctaves=\'5\' result=\'noise\' seed=\'2\'/%3E%3CfeDisplacementMap in=\'SourceGraphic\' in2=\'noise\' scale=\'1\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23paper)\' fill=\'%23f8f9fa\' opacity=\'0.1\'/%3E%3C/svg%3E")]',
    fabric: 'bg-[url("data:image/svg+xml,%3Csvg viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' stroke=\'%23000\' stroke-width=\'0.5\' opacity=\'0.1\'%3E%3Cpath d=\'M0 0l60 60M0 60L60 0\'/%3E%3C/g%3E%3C/svg%3E")]'
  };

  return (
    <div className={cn(
      'relative overflow-hidden',
      className
    )}>
      <div className={cn(
        'absolute inset-0 pointer-events-none mix-blend-overlay',
        texturePatterns[texture]
      )} />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

interface DepthLayerProps {
  children: React.ReactNode;
  depth?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export const DepthLayer: React.FC<DepthLayerProps> = ({
  children,
  depth = 1,
  className
}) => {
  const depthStyles = {
    1: 'transform translate-z-0 shadow-sm',
    2: 'transform translate-z-4 shadow-md',
    3: 'transform translate-z-8 shadow-lg',
    4: 'transform translate-z-12 shadow-xl',
    5: 'transform translate-z-16 shadow-2xl'
  };

  return (
    <div className={cn(
      'relative transition-all duration-300',
      depthStyles[depth],
      'hover:scale-[1.02] hover:shadow-premium',
      className
    )}>
      {children}
    </div>
  );
};

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: 'slow' | 'medium' | 'fast';
  className?: string;
}

export const ParallaxContainer: React.FC<ParallaxContainerProps> = ({
  children,
  speed = 'medium',
  className
}) => {
  const [scrollY, setScrollY] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const speedMultiplier = {
    slow: 0.2,
    medium: 0.5,
    fast: 0.8
  };

  return (
    <div 
      className={cn('relative', className)}
      style={{
        transform: `translateY(${scrollY * speedMultiplier[speed]}px)`
      }}
    >
      {children}
    </div>
  );
};

// Componente de demonstração que combina todos os efeitos
interface PremiumSectionProps {
  children: React.ReactNode;
  variant?: 'hero' | 'card' | 'modal' | 'sidebar';
  className?: string;
}

export const PremiumSection: React.FC<PremiumSectionProps> = ({
  children,
  variant = 'card',
  className
}) => {
  const variantStyles = {
    hero: {
      container: 'min-h-screen relative overflow-hidden',
      background: 'bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20',
      blur: 'medium' as const,
      texture: 'noise' as const,
      depth: 3 as const
    },
    card: {
      container: 'rounded-xl border border-white/10 overflow-hidden',
      background: 'bg-white/5',
      blur: 'light' as const,
      texture: 'grain' as const,
      depth: 2 as const
    },
    modal: {
      container: 'rounded-2xl border border-white/20 overflow-hidden',
      background: 'bg-black/20',
      blur: 'heavy' as const,
      texture: 'paper' as const,
      depth: 4 as const
    },
    sidebar: {
      container: 'h-full border-r border-white/10 overflow-hidden',
      background: 'bg-gray-900/30',
      blur: 'glass' as const,
      texture: 'fabric' as const,
      depth: 1 as const
    }
  };

  const config = variantStyles[variant];

  return (
    <DepthLayer depth={config.depth} className={className}>
      <BlurBackdrop variant={config.blur}>
        <TextureCard texture={config.texture}>
          <div className={cn(
            config.container,
            config.background
          )}>
            <NoiseOverlay intensity="subtle" />
            {children}
          </div>
        </TextureCard>
      </BlurBackdrop>
    </DepthLayer>
  );
};

export default {
  BlurBackdrop,
  NoiseOverlay,
  TextureCard,
  DepthLayer,
  ParallaxContainer,
  PremiumSection
};