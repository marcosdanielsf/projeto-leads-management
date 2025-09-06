import React from 'react';
import { cn } from '../../lib/utils';

interface PremiumLoaderProps {
  variant?: 'spinner' | 'pulse' | 'wave' | 'dots' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'neon' | 'white';
  overlay?: boolean;
  message?: string;
  className?: string;
}

const PremiumLoader: React.FC<PremiumLoaderProps> = ({
  variant = 'brand',
  size = 'md',
  color = 'neon',
  overlay = false,
  message,
  className
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colorClasses = {
    primary: 'text-primary-500',
    secondary: 'text-secondary-500',
    neon: 'text-neon-500',
    white: 'text-white'
  };

  const SpinnerLoader = () => (
    <div className={cn(
      'animate-spin rounded-full border-2 border-current border-t-transparent',
      sizeClasses[size],
      colorClasses[color]
    )} />
  );

  const PulseLoader = () => (
    <div className={cn(
      'animate-pulse rounded-full bg-current',
      sizeClasses[size],
      colorClasses[color]
    )} />
  );

  const WaveLoader = () => (
    <div className="flex items-center space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-current animate-bounce',
            size === 'sm' && 'w-2 h-2',
            size === 'md' && 'w-3 h-3',
            size === 'lg' && 'w-4 h-4',
            size === 'xl' && 'w-6 h-6',
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s'
          }}
        />
      ))}
    </div>
  );

  const DotsLoader = () => (
    <div className="flex items-center space-x-2">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full bg-current animate-pulse',
            size === 'sm' && 'w-1 h-1',
            size === 'md' && 'w-2 h-2',
            size === 'lg' && 'w-3 h-3',
            size === 'xl' && 'w-4 h-4',
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  );

  const BrandLoader = () => (
    <div className="relative flex items-center justify-center">
      {/* Outer ring with neon glow */}
      <div className={cn(
        'absolute animate-spin rounded-full border-2 border-transparent',
        'border-t-neon-500 border-r-neon-500',
        'shadow-neon',
        sizeClasses[size]
      )} />
      
      {/* Inner ring */}
      <div className={cn(
        'absolute animate-spin rounded-full border border-transparent',
        'border-t-primary-500 border-l-primary-500',
        'opacity-60',
        size === 'sm' && 'w-3 h-3',
        size === 'md' && 'w-6 h-6',
        size === 'lg' && 'w-9 h-9',
        size === 'xl' && 'w-12 h-12'
      )}
      style={{
        animationDirection: 'reverse',
        animationDuration: '1.5s'
      }} />
      
      {/* Center dot with pulse */}
      <div className={cn(
        'rounded-full bg-neon-500 animate-pulse shadow-neon',
        size === 'sm' && 'w-1 h-1',
        size === 'md' && 'w-2 h-2',
        size === 'lg' && 'w-3 h-3',
        size === 'xl' && 'w-4 h-4'
      )} />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return <SpinnerLoader />;
      case 'pulse':
        return <PulseLoader />;
      case 'wave':
        return <WaveLoader />;
      case 'dots':
        return <DotsLoader />;
      case 'brand':
        return <BrandLoader />;
      default:
        return <BrandLoader />;
    }
  };

  const content = (
    <div className={cn(
      'flex flex-col items-center justify-center gap-4',
      className
    )}>
      {renderLoader()}
      {message && (
        <p className={cn(
          'text-sm font-medium animate-pulse',
          colorClasses[color]
        )}>
          {message}
        </p>
      )}
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Glassmorphism backdrop */}
        <div className="absolute inset-0 glass-dark" />
        
        {/* Content */}
        <div className="relative z-10">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default PremiumLoader;