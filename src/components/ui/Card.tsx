import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

type CardVariant = 'default' | 'glass' | 'elevated' | 'outlined' | 'gradient';
type CardSize = 'sm' | 'md' | 'lg' | 'xl';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  size?: CardSize;
  hover?: boolean;
  glow?: boolean;
  interactive?: boolean;
  loading?: boolean;
}

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

// CardContentProps removed - using React.HTMLAttributes<HTMLDivElement> directly

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between';
}

const Card = forwardRef<HTMLDivElement, CardProps>((
  {
    className,
    variant = 'default',
    size = 'md',
    hover = false,
    glow = false,
    interactive = false,
    loading = false,
    children,
    ...props
  },
  ref
) => {
  const sizeClasses: Record<CardSize, string> = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const variantClasses: Record<CardVariant, string> = {
    default: 'bg-bg-secondary border border-navy-700',
    glass: 'bg-navy-900/30 backdrop-blur-xl border border-navy-600/50',
    elevated: 'bg-bg-secondary border border-navy-700 shadow-premium',
    outlined: 'bg-transparent border-2 border-navy-600',
    gradient: 'bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-600',
  };

  const cardClasses = cn(
    // Base styles
    'rounded-2xl transition-all duration-300 ease-out',
    'relative overflow-hidden',
    
    // Size
    sizeClasses[size],
    
    // Variant
    variantClasses[variant],
    
    // Interactive states
    interactive && [
      'cursor-pointer',
      'hover:scale-[1.02] hover:shadow-neon',
      'active:scale-[0.98]',
      'focus:outline-none focus:ring-2 focus:ring-neon-500/50',
    ],
    
    // Hover effect
    hover && 'hover:border-neon-500/50 hover:shadow-lg',
    
    // Glow effect
    glow && 'shadow-neon',
    
    // Loading state
    loading && 'animate-pulse',
    
    className
  );

  return (
    <div
      ref={ref}
      className={cardClasses}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {/* Shimmer effect for interactive cards */}
      {interactive && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-500/10 to-transparent -skew-x-12 animate-shimmer" />
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
});

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>((
  { className, title, subtitle, icon: Icon, action, children, ...props },
  ref
) => {
  return (
    <div
      ref={ref}
      className={cn('flex items-start justify-between mb-6', className)}
      {...props}
    >
      <div className="flex items-start space-x-3">
        {Icon && (
          <div className="flex-shrink-0">
            <Icon className="w-5 h-5 text-neon-400 mt-0.5" />
          </div>
        )}
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-text-primary">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-text-tertiary">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </div>
      {action && (
        <div className="ml-4 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
});

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((
  { className, ...props },
  ref
) => {
  return (
    <div
      ref={ref}
      className={cn('text-text-secondary', className)}
      {...props}
    />
  );
});

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>((
  { className, align = 'right', ...props },
  ref
) => {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center mt-6 pt-4 border-t border-navy-700',
        alignClasses[align],
        className
      )}
      {...props}
    />
  );
});

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardContent, CardFooter };
export type { CardProps, CardHeaderProps, CardFooterProps };