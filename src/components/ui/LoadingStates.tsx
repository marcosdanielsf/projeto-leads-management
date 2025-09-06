import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

// Base skeleton component
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn(
        'bg-gradient-to-r from-navy-700 via-navy-600 to-navy-700 bg-[length:200%_100%]',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
      aria-hidden="true"
    />
  );
};

// Text skeleton with multiple lines
interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lastLineWidth?: string;
}

const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className,
  lastLineWidth = '60%',
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height={16}
          width={index === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
};

// Avatar skeleton
interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeClasses[size], className)}
    />
  );
};

// Card skeleton
interface SkeletonCardProps {
  showAvatar?: boolean;
  showImage?: boolean;
  lines?: number;
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({
  showAvatar = false,
  showImage = false,
  lines = 3,
  className,
}) => {
  return (
    <div className={cn('p-6 space-y-4', className)}>
      {showImage && (
        <Skeleton variant="rounded" height={200} className="w-full" />
      )}
      
      <div className="space-y-3">
        {showAvatar && (
          <div className="flex items-center space-x-3">
            <SkeletonAvatar size="md" />
            <div className="space-y-2 flex-1">
              <Skeleton variant="text" height={16} width="40%" />
              <Skeleton variant="text" height={14} width="60%" />
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Skeleton variant="text" height={20} width="80%" />
          <SkeletonText lines={lines} lastLineWidth="70%" />
        </div>
        
        <div className="flex space-x-2 pt-2">
          <Skeleton variant="rounded" height={32} width={80} />
          <Skeleton variant="rounded" height={32} width={60} />
        </div>
      </div>
    </div>
  );
};

// Table skeleton
interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  className?: string;
}

const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      {showHeader && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton key={index} variant="text" height={16} width="60%" />
          ))}
        </div>
      )}
      
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                variant="text"
                height={14}
                width={`${Math.random() * 40 + 60}%`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

// Loading spinner component
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'white';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'primary',
  className,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const variantClasses = {
    primary: 'text-neon-500',
    secondary: 'text-text-secondary',
    white: 'text-white',
  };

  return (
    <Loader2
      className={cn(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-hidden="true"
    />
  );
};

// Loading overlay component
interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
  backdrop?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  visible,
  message,
  backdrop = true,
  className,
  children,
}) => {
  if (!visible) return children ? <>{children}</> : null;

  return (
    <div className={cn('relative', className)}>
      {children}
      
      <div
        className={cn(
          'absolute inset-0 flex items-center justify-center z-50',
          backdrop && 'bg-navy-900/80 backdrop-blur-sm'
        )}
        aria-live="polite"
        aria-busy="true"
      >
        <div className="flex flex-col items-center space-y-3 p-6">
          <LoadingSpinner size="lg" variant="primary" />
          
          {message && (
            <p className="text-text-secondary text-sm font-medium">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Inline loading component
interface InlineLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const InlineLoading: React.FC<InlineLoadingProps> = ({
  message = 'Loading...',
  size = 'md',
  className,
}) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <LoadingSpinner size={size} variant="primary" />
      <span className="text-text-secondary text-sm font-medium">
        {message}
      </span>
    </div>
  );
};

// Progress loading component
interface ProgressLoadingProps {
  progress: number;
  message?: string;
  showPercentage?: boolean;
  className?: string;
}

const ProgressLoading: React.FC<ProgressLoadingProps> = ({
  progress,
  message,
  showPercentage = true,
  className,
}) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn('space-y-3', className)}>
      {(message || showPercentage) && (
        <div className="flex justify-between items-center">
          {message && (
            <span className="text-text-secondary text-sm font-medium">
              {message}
            </span>
          )}
          
          {showPercentage && (
            <span className="text-text-tertiary text-sm">
              {Math.round(clampedProgress)}%
            </span>
          )}
        </div>
      )}
      
      <div className="w-full bg-navy-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-neon-500 to-neon-400 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

// Refresh button component
interface RefreshButtonProps {
  onRefresh: () => void;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'outline' | 'solid';
  className?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onRefresh,
  loading = false,
  size = 'md',
  variant = 'ghost',
  className,
}) => {
  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantClasses = {
    ghost: 'hover:bg-navy-700 text-text-secondary hover:text-text-primary',
    outline: 'border border-navy-600 hover:bg-navy-700 text-text-secondary hover:text-text-primary',
    solid: 'bg-neon-500 hover:bg-neon-600 text-navy-900',
  };

  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className={cn(
        'rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-neon-500/20',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label="Refresh"
    >
      <RefreshCw
        className={cn(
          iconSizeClasses[size],
          loading && 'animate-spin'
        )}
      />
    </button>
  );
};

export {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonTable,
  LoadingSpinner,
  LoadingOverlay,
  InlineLoading,
  ProgressLoading,
  RefreshButton,
};

export type {
  SkeletonProps,
  SkeletonTextProps,
  SkeletonAvatarProps,
  SkeletonCardProps,
  SkeletonTableProps,
  LoadingSpinnerProps,
  LoadingOverlayProps,
  InlineLoadingProps,
  ProgressLoadingProps,
  RefreshButtonProps,
};