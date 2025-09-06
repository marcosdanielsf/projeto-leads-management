import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface BrandLoaderProps {
  variant?: 'orbit' | 'pulse-wave' | 'morphing' | 'particle' | 'liquid' | 'geometric';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'neon' | 'rainbow';
  speed?: 'slow' | 'normal' | 'fast';
  message?: string;
  progress?: number;
  className?: string;
}

export const BrandLoader: React.FC<BrandLoaderProps> = ({
  variant = 'orbit',
  size = 'md',
  color = 'primary',
  speed = 'normal',
  message,
  progress,
  className
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, speed === 'fast' ? 500 : speed === 'slow' ? 2000 : 1000);

    return () => clearInterval(interval);
  }, [speed]);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const speedClasses = {
    slow: 'animate-[spin_3s_linear_infinite]',
    normal: 'animate-[spin_2s_linear_infinite]',
    fast: 'animate-[spin_1s_linear_infinite]'
  };

  const colorClasses = {
    primary: 'from-blue-500 via-purple-500 to-pink-500',
    secondary: 'from-gray-400 via-gray-600 to-gray-800',
    neon: 'from-neon-400 via-neon-500 to-neon-600',
    rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500'
  };

  const renderLoader = () => {
    switch (variant) {
      case 'orbit':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            {/* Central core */}
            <div className={cn(
              'absolute inset-0 rounded-full',
              'bg-gradient-to-r', colorClasses[color],
              'opacity-20 animate-pulse'
            )} />
            
            {/* Orbiting particles */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'absolute w-2 h-2 rounded-full',
                  'bg-gradient-to-r', colorClasses[color],
                  speedClasses[speed]
                )}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateY(-${size === 'xl' ? '40px' : size === 'lg' ? '30px' : size === 'md' ? '20px' : '15px'})`,
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        );

      case 'pulse-wave':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'absolute inset-0 rounded-full border-2',
                  'border-gradient-to-r', colorClasses[color],
                  'animate-ping'
                )}
                style={{
                  animationDelay: `${i * 0.3}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
            <div className={cn(
              'absolute inset-2 rounded-full',
              'bg-gradient-to-r', colorClasses[color],
              'animate-pulse'
            )} />
          </div>
        );

      case 'morphing':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            <div className={cn(
              'w-full h-full',
              'bg-gradient-to-r', colorClasses[color],
              'transition-all duration-1000 ease-in-out',
              animationPhase === 0 ? 'rounded-full' :
              animationPhase === 1 ? 'rounded-lg rotate-45' :
              animationPhase === 2 ? 'rounded-none rotate-90' :
              'rounded-full rotate-180'
            )} />
          </div>
        );

      case 'particle':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'absolute w-1 h-1 rounded-full',
                  'bg-gradient-to-r', colorClasses[color],
                  'animate-bounce'
                )}
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${size === 'xl' ? '35px' : size === 'lg' ? '25px' : size === 'md' ? '18px' : '12px'})`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
          </div>
        );

      case 'liquid':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            <div className={cn(
              'w-full h-full rounded-full overflow-hidden',
              'bg-gradient-to-r', colorClasses[color],
              'relative'
            )}>
              <div className={cn(
                'absolute inset-0',
                'bg-gradient-to-t from-transparent via-white/20 to-transparent',
                'animate-[wave_2s_ease-in-out_infinite]'
              )} />
            </div>
          </div>
        );

      case 'geometric':
        return (
          <div className={cn('relative', sizeClasses[size])}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={cn(
                  'absolute inset-0',
                  'border-2 border-transparent',
                  'bg-gradient-to-r', colorClasses[color],
                  'bg-clip-padding',
                  speedClasses[speed]
                )}
                style={{
                  clipPath: i === 0 ? 'polygon(50% 0%, 0% 100%, 100% 100%)' :
                           i === 1 ? 'polygon(0% 0%, 100% 0%, 50% 100%)' :
                           'polygon(0% 50%, 50% 0%, 100% 50%, 50% 100%)',
                  animationDelay: `${i * 0.2}s`
                }}
              />
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {renderLoader()}
      
      {progress !== undefined && (
        <div className="w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full transition-all duration-300 ease-out',
              'bg-gradient-to-r', colorClasses[color]
            )}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
      
      {message && (
        <p className="text-sm text-white/80 text-center max-w-xs">
          {message}
        </p>
      )}
    </div>
  );
};

// Componente de carregamento de página completa
interface FullPageLoaderProps {
  variant?: BrandLoaderProps['variant'];
  message?: string;
  progress?: number;
  logo?: React.ReactNode;
  className?: string;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  variant = 'orbit',
  message = 'Carregando...',
  progress,
  logo,
  className
}) => {
  return (
    <div className={cn(
      'fixed inset-0 z-50',
      'bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900',
      'flex items-center justify-center',
      'backdrop-blur-sm',
      className
    )}>
      <div className="text-center space-y-8">
        {logo && (
          <div className="flex justify-center mb-8">
            {logo}
          </div>
        )}
        
        <BrandLoader
          variant={variant}
          size="xl"
          color="neon"
          message={message}
          progress={progress}
        />
        
        <div className="space-y-2">
          <div className="flex justify-center space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2 h-2 rounded-full bg-neon-500',
                  'animate-bounce'
                )}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
          
          {progress !== undefined && (
            <p className="text-neon-400 text-sm font-medium">
              {Math.round(progress)}%
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Hook para simular carregamento com progresso
export const useLoadingProgress = (duration: number = 3000) => {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (100 / (duration / 100));
        if (next >= 100) {
          setIsLoading(false);
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  const reset = () => {
    setProgress(0);
    setIsLoading(true);
  };

  return { progress, isLoading, reset };
};

// Componente de carregamento inline
interface InlineLoaderProps {
  variant?: 'dots' | 'bars' | 'spinner' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'neon';
  className?: string;
}

export const InlineLoader: React.FC<InlineLoaderProps> = ({
  variant = 'dots',
  size = 'md',
  color = 'primary',
  className
}) => {
  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const colorClasses = {
    primary: 'bg-blue-500',
    secondary: 'bg-gray-500',
    neon: 'bg-neon-500'
  };

  const renderInlineLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'rounded-full',
                  sizeClasses[size],
                  colorClasses[color],
                  'animate-bounce'
                )}
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        );

      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-1 bg-current animate-pulse',
                  size === 'sm' ? 'h-2' : size === 'md' ? 'h-4' : 'h-6',
                  colorClasses[color]
                )}
                style={{ 
                  animationDelay: `${i * 0.15}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        );

      case 'spinner':
        return (
          <div className={cn(
            'rounded-full border-2 border-current border-t-transparent animate-spin',
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8',
            colorClasses[color]
          )} />
        );

      case 'pulse':
        return (
          <div className={cn(
            'rounded-full animate-pulse',
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8',
            colorClasses[color]
          )} />
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('inline-flex items-center', className)}>
      {renderInlineLoader()}
    </div>
  );
};

export default {
  BrandLoader,
  FullPageLoader,
  InlineLoader,
  useLoadingProgress
};