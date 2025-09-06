import React from 'react';
import { cn } from '../../lib/utils';

type LoadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type LoadingVariant = 'spinner' | 'dots' | 'pulse' | 'bars' | 'ring';

interface LoadingProps {
  size?: LoadingSize;
  variant?: LoadingVariant;
  className?: string;
  color?: 'primary' | 'secondary' | 'neon' | 'white';
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  variant = 'spinner',
  className,
  color = 'primary',
  text,
  fullScreen = false,
}) => {
  const sizeClasses: Record<LoadingSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses: Record<string, string> = {
    primary: 'text-neon-500',
    secondary: 'text-text-secondary',
    neon: 'text-neon-400',
    white: 'text-white',
  };

  const textSizeClasses: Record<LoadingSize, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const renderSpinner = () => (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        colorClasses[color]
      )}
    />
  );

  const renderDots = () => (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-pulse',
            size === 'xs' ? 'w-1 h-1' : size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-4 h-4',
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s',
          }}
        />
      ))}
    </div>
  );

  const renderPulse = () => (
    <div
      className={cn(
        'rounded-full animate-ping',
        sizeClasses[size],
        colorClasses[color]
      )}
    />
  );

  const renderBars = () => (
    <div className="flex items-end space-x-1">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-current',
            size === 'xs' ? 'w-0.5 h-2' : size === 'sm' ? 'w-0.5 h-3' : size === 'md' ? 'w-1 h-4' : size === 'lg' ? 'w-1 h-6' : 'w-1.5 h-8',
            colorClasses[color]
          )}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '1.2s',
          }}
        />
      ))}
    </div>
  );

  const renderRing = () => (
    <div className="relative">
      <div
        className={cn(
          'animate-spin rounded-full border-4 border-current border-opacity-25',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      <div
        className={cn(
          'absolute top-0 left-0 animate-spin rounded-full border-4 border-transparent border-t-current',
          sizeClasses[size],
          colorClasses[color]
        )}
      />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      case 'bars':
        return renderBars();
      case 'ring':
        return renderRing();
      default:
        return renderSpinner();
    }
  };

  const content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center space-y-3',
        fullScreen && 'min-h-screen',
        className
      )}
    >
      {renderLoader()}
      {text && (
        <p
          className={cn(
            'font-medium animate-pulse',
            textSizeClasses[size],
            colorClasses[color]
          )}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-bg-primary/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};

// Skeleton Loading Component
interface SkeletonLoadingProps {
  lines?: number;
  className?: string;
  avatar?: boolean;
  button?: boolean;
}

const SkeletonLoading: React.FC<SkeletonLoadingProps> = ({
  lines = 3,
  className,
  avatar = false,
  button = false,
}) => {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      {avatar && (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-navy-700 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 bg-navy-700 rounded w-24" />
            <div className="h-3 bg-navy-700 rounded w-16" />
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 bg-navy-700 rounded',
              i === lines - 1 ? 'w-3/4' : 'w-full'
            )}
          />
        ))}
      </div>
      
      {button && (
        <div className="flex space-x-2">
          <div className="h-10 bg-navy-700 rounded w-20" />
          <div className="h-10 bg-navy-700 rounded w-16" />
        </div>
      )}
    </div>
  );
};

// Page Loading Component
interface PageLoadingProps {
  title?: string;
  subtitle?: string;
}

const PageLoading: React.FC<PageLoadingProps> = ({
  title = 'Loading...',
  subtitle,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-navy-700 rounded-full animate-spin border-t-neon-500" />
        
        {/* Inner ring */}
        <div className="absolute top-2 left-2 w-12 h-12 border-4 border-navy-600 rounded-full animate-spin border-t-neon-400 animate-reverse" />
        
        {/* Center dot */}
        <div className="absolute top-6 left-6 w-4 h-4 bg-neon-500 rounded-full animate-pulse" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {subtitle && (
          <p className="text-sm text-text-tertiary">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

// Inline Loading Component
interface InlineLoadingProps {
  text?: string;
  size?: LoadingSize;
}

const InlineLoading: React.FC<InlineLoadingProps> = ({
  text = 'Loading...',
  size = 'sm',
}) => {
  const sizeClasses: Record<LoadingSize, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent text-neon-500',
          sizeClasses[size]
        )}
      />
      <span className="text-sm text-text-secondary">{text}</span>
    </div>
  );
};

export { Loading, SkeletonLoading, PageLoading, InlineLoading };
export type { LoadingProps, SkeletonLoadingProps, PageLoadingProps, InlineLoadingProps };