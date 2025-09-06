import React from 'react';
import { cn } from '../../lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circular' | 'rectangular' | 'text';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  lines?: number;
  style?: React.CSSProperties;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'default',
  width,
  height,
  animation = 'pulse',
  lines = 1,
}) => {
  const baseClasses = [
    'bg-gradient-to-r from-navy-800 via-navy-700 to-navy-800',
    'bg-[length:200%_100%]',
  ];

  const variantClasses = {
    default: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    text: 'rounded-sm h-4',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? height : undefined),
    height: height || (variant === 'text' ? '1rem' : undefined),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              animationClasses[animation],
              index === lines - 1 ? 'w-3/4' : 'w-full',
              className
            )}
            style={{
              height: height || '1rem',
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={style}
    />
  );
};

// Componentes pré-configurados para casos comuns
const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 bg-bg-secondary rounded-xl border border-navy-700', className)}>
    <div className="flex items-center space-x-4 mb-4">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="space-y-2 flex-1">
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="40%" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} className="mb-4" />
    <div className="flex justify-between items-center">
      <Skeleton variant="rectangular" width={80} height={32} className="rounded-lg" />
      <Skeleton variant="rectangular" width={100} height={32} className="rounded-lg" />
    </div>
  </div>
);

const SkeletonTable: React.FC<{ rows?: number; columns?: number; className?: string }> = ({ 
  rows = 5, 
  columns = 4, 
  className 
}) => (
  <div className={cn('space-y-3', className)}>
    {/* Header */}
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={`header-${index}`} variant="text" height={20} />
      ))}
    </div>
    
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div 
        key={`row-${rowIndex}`} 
        className="grid gap-4" 
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {Array.from({ length: columns }).map((_, colIndex) => (
          <Skeleton 
            key={`cell-${rowIndex}-${colIndex}`} 
            variant="text" 
            height={16}
            animation="pulse"
            style={{ animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s` }}
          />
        ))}
      </div>
    ))}
  </div>
);

const SkeletonChart: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('p-6 bg-bg-secondary rounded-xl border border-navy-700', className)}>
    <div className="flex justify-between items-center mb-6">
      <Skeleton variant="text" width={150} height={24} />
      <Skeleton variant="rectangular" width={100} height={32} className="rounded-lg" />
    </div>
    
    <div className="h-64 flex items-end justify-between space-x-2">
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          width={20}
          height={Math.random() * 200 + 50}
          className="rounded-t-sm"
          animation="wave"
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
    
    <div className="mt-4 flex justify-center space-x-6">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center space-x-2">
          <Skeleton variant="circular" width={12} height={12} />
          <Skeleton variant="text" width={60} />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
export { Skeleton, SkeletonCard, SkeletonTable, SkeletonChart, type SkeletonProps };