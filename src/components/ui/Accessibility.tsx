import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

// Skip to content link
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const SkipLink: React.FC<SkipLinkProps> = ({ href, children, className }) => {
  return (
    <a
      href={href}
      className={cn(
        'sr-only focus:not-sr-only',
        'fixed top-4 left-4 z-50',
        'bg-neon-500 text-navy-900 px-4 py-2 rounded-lg',
        'font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-neon-400',
        className
      )}
    >
      {children}
    </a>
  );
};

// Screen reader only text
interface ScreenReaderOnlyProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

const ScreenReaderOnly: React.FC<ScreenReaderOnlyProps> = ({ children, className, id }) => {
  return (
    <span className={cn('sr-only', className)} id={id}>
      {children}
    </span>
  );
};

// Focus trap component
interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  restoreFocus?: boolean;
  className?: string;
}

const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  restoreFocus = true,
  className,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    if (!container) return;

    // Get all focusable elements
    const getFocusableElements = () => {
      return container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Focus the first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      
      // Restore focus to the previously focused element
      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [active, restoreFocus]);

  if (!active) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// Live region for announcements
interface LiveRegionProps {
  children: React.ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all' | 'additions text' | 'additions removals' | 'removals additions' | 'removals text' | 'text additions' | 'text removals';
  className?: string;
}

const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = false,
  relevant = 'additions text',
  className,
}) => {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={cn('sr-only', className)}
    >
      {children}
    </div>
  );
};

// Keyboard navigation helper
interface KeyboardNavigationProps {
  children: React.ReactNode;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  className?: string;
}

const KeyboardNavigation: React.FC<KeyboardNavigationProps> = ({
  children,
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  className,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'Escape':
        onEscape?.();
        break;
      case 'Enter':
        onEnter?.();
        break;
      case 'ArrowUp':
        e.preventDefault();
        onArrowUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        onArrowDown?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onArrowLeft?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        onArrowRight?.();
        break;
    }
  };

  return (
    <div onKeyDown={handleKeyDown} className={className}>
      {children}
    </div>
  );
};

// Focus indicator component
interface FocusIndicatorProps {
  children: React.ReactNode;
  visible?: boolean;
  className?: string;
}

const FocusIndicator: React.FC<FocusIndicatorProps> = ({
  children,
  visible = true,
  className,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isKeyboardUser, setIsKeyboardUser] = useState(false);

  useEffect(() => {
    const handleKeyDown = () => setIsKeyboardUser(true);
    const handleMouseDown = () => setIsKeyboardUser(false);

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={cn(
        'relative',
        visible && isFocused && isKeyboardUser && [
          'ring-2 ring-neon-500 ring-offset-2 ring-offset-bg-primary',
          'rounded-lg'
        ],
        className
      )}
    >
      {children}
    </div>
  );
};

// High contrast mode detector
const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
};

// Reduced motion detector
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Accessible button component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  leftIcon,
  rightIcon,
  disabled,
  className,
  ...props
}) => {
  const isDisabled = disabled || loading;

  const variantClasses = {
    primary: [
      'bg-neon-500 text-navy-900 hover:bg-neon-400',
      'focus:bg-neon-400 focus:ring-neon-500',
      'disabled:bg-navy-600 disabled:text-text-tertiary',
    ],
    secondary: [
      'bg-navy-700 text-text-primary border border-navy-600',
      'hover:bg-navy-600 hover:border-navy-500',
      'focus:bg-navy-600 focus:border-neon-500 focus:ring-neon-500',
      'disabled:bg-navy-800 disabled:border-navy-700 disabled:text-text-tertiary',
    ],
    ghost: [
      'bg-transparent text-text-primary',
      'hover:bg-navy-700/50',
      'focus:bg-navy-700/50 focus:ring-neon-500',
      'disabled:text-text-tertiary',
    ],
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs min-h-8',
    md: 'px-4 py-2 text-sm min-h-10',
    lg: 'px-6 py-3 text-base min-h-12',
  };

  return (
    <button
      className={cn(
        // Base styles
        'inline-flex items-center justify-center gap-2',
        'font-medium rounded-lg transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary',
        'disabled:cursor-not-allowed disabled:opacity-50',
        
        // Size
        sizeClasses[size],
        
        // Variant
        variantClasses[variant],
        
        className
      )}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-describedby={loading ? 'loading-description' : undefined}
      {...props}
    >
      {loading && (
        <>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <ScreenReaderOnly id="loading-description">
            {loadingText}
          </ScreenReaderOnly>
        </>
      )}
      
      {!loading && leftIcon && (
        <span className="w-4 h-4 flex-shrink-0">{leftIcon}</span>
      )}
      
      <span>{loading ? loadingText : children}</span>
      
      {!loading && rightIcon && (
        <span className="w-4 h-4 flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};

// Accessible form field
interface AccessibleFieldProps {
  children: React.ReactNode;
  label: string;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

const AccessibleField: React.FC<AccessibleFieldProps> = ({
  children,
  label,
  description,
  error,
  required = false,
  className,
}) => {
  const fieldId = React.useId();
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;

  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-text-primary"
      >
        {label}
        {required && (
          <span className="text-red-400 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      
      {description && (
        <p id={descriptionId} className="text-sm text-text-tertiary">
          {description}
        </p>
      )}
      
      <div>
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          'aria-describedby': [descriptionId, errorId].filter(Boolean).join(' ') || undefined,
          'aria-invalid': error ? 'true' : undefined,
          'aria-required': required,
        })}
      </div>
      
      {error && (
        <p id={errorId} className="text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export {
  SkipLink,
  ScreenReaderOnly,
  FocusTrap,
  LiveRegion,
  KeyboardNavigation,
  FocusIndicator,
  AccessibleButton,
  AccessibleField,
  useHighContrast,
  useReducedMotion,
};

export type {
  SkipLinkProps,
  ScreenReaderOnlyProps,
  FocusTrapProps,
  LiveRegionProps,
  KeyboardNavigationProps,
  FocusIndicatorProps,
  AccessibleButtonProps,
  AccessibleFieldProps,
};