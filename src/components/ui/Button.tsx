import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon | React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  glow?: boolean;
  tooltip?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((
  {
    children,
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconPosition = 'left',
    loading = false,
    fullWidth = false,
    glow = false,
    tooltip,
    className,
    disabled,
    ...props
  },
  ref
) => {
  const baseClasses = [
    // Base styles
    'relative inline-flex items-center justify-center',
    'font-semibold rounded-xl transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'transform hover:scale-[1.02] active:scale-[0.98]',
    'overflow-hidden group select-none',
    
    // Full width
    fullWidth ? 'w-full' : '',
    
    // Glow effect
    glow ? 'animate-glow' : '',
  ];
  
  const variantClasses: Record<ButtonVariant, string[]> = {
    primary: [
      'bg-gradient-to-r from-neon-500 to-primary-500',
      'text-white border border-neon-500/50',
      'hover:from-neon-400 hover:to-primary-400',
      'hover:border-neon-400 hover:shadow-neon',
      'focus:ring-neon-500/50',
      'active:from-neon-600 active:to-primary-600',
    ],
    secondary: [
      'bg-bg-tertiary text-text-primary border border-navy-700',
      'hover:bg-bg-accent hover:border-neon-500/50',
      'hover:text-neon-400 hover:shadow-md',
      'focus:ring-navy-500/50',
      'active:bg-navy-800',
    ],
    outline: [
      'bg-transparent text-neon-400 border-2 border-neon-500/50',
      'hover:bg-neon-500/10 hover:border-neon-400',
      'hover:text-neon-300 hover:shadow-neon/50',
      'focus:ring-neon-500/50',
      'active:bg-neon-500/20',
    ],
    ghost: [
      'bg-transparent text-text-secondary border border-transparent',
      'hover:bg-neon-500/10 hover:text-text-primary',
      'hover:border-neon-500/30',
      'focus:ring-neon-500/30',
      'active:bg-neon-500/20',
    ],
    danger: [
      'bg-gradient-to-r from-red-500 to-red-600',
      'text-white border border-red-500/50',
      'hover:from-red-400 hover:to-red-500',
      'hover:border-red-400 hover:shadow-lg',
      'focus:ring-red-500/50',
      'active:from-red-600 active:to-red-700',
    ],
    success: [
      'bg-gradient-to-r from-emerald-500 to-emerald-600',
      'text-white border border-emerald-500/50',
      'hover:from-emerald-400 hover:to-emerald-500',
      'hover:border-emerald-400 hover:shadow-lg',
      'focus:ring-emerald-500/50',
      'active:from-emerald-600 active:to-emerald-700',
    ],
  };
  
  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-3 py-2 text-sm gap-1.5 min-h-[36px]',
    md: 'px-4 py-2.5 text-sm gap-2 min-h-[44px]',
    lg: 'px-6 py-3 text-base gap-2.5 min-h-[48px]',
    xl: 'px-8 py-4 text-lg gap-3 min-h-[56px]',
  };
  
  const iconSizeClasses: Record<ButtonSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };
  
  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
  );

  const renderIcon = (position: 'left' | 'right') => {
    if (loading || !Icon || iconPosition !== position) return null;
    
    if (typeof Icon === 'function') {
      const IconComponent = Icon as LucideIcon;
      return (
        <IconComponent 
          className={cn(
            iconSizeClasses[size],
            'transition-transform duration-200 group-hover:scale-110'
          )} 
        />
      );
    }
    
    return (
      <span className={cn(
        iconSizeClasses[size],
        'transition-transform duration-200 group-hover:scale-110 flex items-center justify-center'
      )}>
        {Icon}
      </span>
    );
  };

  const ButtonContent = () => (
    <>
      {/* Shimmer effect overlay */}
      <div className="absolute inset-0 -top-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 group-hover:animate-shimmer" />
      
      {/* Content */}
      <div className="relative flex items-center justify-center gap-2">
        {loading && <LoadingSpinner />}
        {renderIcon('left')}
        {children && (
          <span className="transition-all duration-200">
            {children}
          </span>
        )}
        {renderIcon('right')}
      </div>
    </>
  );

  const button = (
    <button
      ref={ref}
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      disabled={disabled || loading}
      title={tooltip}
      {...props}
    >
      <ButtonContent />
    </button>
  );

  return button;
});

Button.displayName = 'Button';

export default Button;
export { Button, type ButtonProps };