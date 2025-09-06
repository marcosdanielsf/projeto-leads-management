import React, { forwardRef, useState } from 'react';
import { LucideIcon, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'filled' | 'outlined';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  size?: InputSize;
  variant?: InputVariant;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>((
  {
    label,
    error,
    success,
    hint,
    size = 'md',
    variant = 'default',
    icon: Icon,
    iconPosition = 'left',
    fullWidth = true,
    loading = false,
    clearable = false,
    onClear,
    className,
    type = 'text',
    disabled,
    value,
    id,
    ...props
  },
  ref
) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const hasError = !!error;
  const hasSuccess = !!success && !hasError;
  const hasValue = value !== undefined && value !== '';
  
  const sizeClasses: Record<InputSize, string> = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-13 px-5 text-base',
  };
  
  const iconSizeClasses: Record<InputSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };
  
  const variantClasses: Record<InputVariant, string[]> = {
    default: [
      'bg-bg-tertiary border border-navy-700',
      'focus:border-neon-500 focus:bg-bg-secondary',
      'hover:border-navy-600',
    ],
    filled: [
      'bg-navy-800 border border-transparent',
      'focus:border-neon-500 focus:bg-navy-700',
      'hover:bg-navy-700',
    ],
    outlined: [
      'bg-transparent border-2 border-navy-600',
      'focus:border-neon-500',
      'hover:border-navy-500',
    ],
  };
  
  const getStateClasses = () => {
    if (hasError) {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500/20';
    }
    if (hasSuccess) {
      return 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20';
    }
    return '';
  };
  
  const inputClasses = cn(
    // Base styles
    'w-full rounded-xl transition-all duration-200',
    'text-text-primary placeholder:text-text-tertiary',
    'focus:outline-none focus:ring-2 focus:ring-neon-500/20',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Size
    sizeClasses[size],
    
    // Variant
    variantClasses[variant],
    
    // State
    getStateClasses(),
    
    // Icon padding
    Icon && iconPosition === 'left' ? 'pl-10' : '',
    (Icon && iconPosition === 'right') || isPassword || (clearable && hasValue) ? 'pr-10' : '',
    
    // Full width
    fullWidth ? 'w-full' : '',
    
    className
  );
  
  const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
  );
  
  const renderLeftIcon = () => {
    if (!Icon || iconPosition !== 'left') return null;
    
    return (
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary transition-colors duration-200">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Icon className={cn(iconSizeClasses[size], isFocused && 'text-neon-400')} />
        )}
      </div>
    );
  };
  
  const renderRightIcon = () => {
    const rightIcons = [];
    
    // Clear button
    if (clearable && hasValue && !disabled) {
      rightIcons.push(
        <button
          key="clear"
          type="button"
          onClick={onClear}
          className="text-text-tertiary hover:text-text-secondary transition-colors duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      );
    }
    
    // Password toggle
    if (isPassword) {
      const PasswordIcon = showPassword ? EyeOff : Eye;
      rightIcons.push(
        <button
          key="password"
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-text-tertiary hover:text-text-secondary transition-colors duration-200"
        >
          <PasswordIcon className={iconSizeClasses[size]} />
        </button>
      );
    }
    
    // Status icon
    if (hasError) {
      rightIcons.push(
        <AlertCircle key="error" className={cn(iconSizeClasses[size], 'text-red-500')} />
      );
    } else if (hasSuccess) {
      rightIcons.push(
        <CheckCircle key="success" className={cn(iconSizeClasses[size], 'text-emerald-500')} />
      );
    }
    
    // Regular right icon
    if (Icon && iconPosition === 'right' && !isPassword && !hasError && !hasSuccess) {
      rightIcons.push(
        <Icon key="icon" className={cn(iconSizeClasses[size], 'text-text-tertiary', isFocused && 'text-neon-400')} />
      );
    }
    
    if (rightIcons.length === 0) return null;
    
    return (
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
        {rightIcons}
      </div>
    );
  };
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId} 
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            hasError ? 'text-red-400' : hasSuccess ? 'text-emerald-400' : 'text-text-secondary'
          )}
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {renderLeftIcon()}
        
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={inputClasses}
          disabled={disabled || loading}
          value={value}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        
        {renderRightIcon()}
      </div>
      
      {(error || success || hint) && (
        <div className="space-y-1">
          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {error}
            </p>
          )}
          {success && !error && (
            <p className="text-sm text-emerald-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              {success}
            </p>
          )}
          {hint && !error && !success && (
            <p className="text-sm text-text-tertiary">
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;