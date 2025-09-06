import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';

interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  hideDelay?: number;
  disabled?: boolean;
  variant?: 'default' | 'dark' | 'light' | 'error' | 'warning' | 'success';
  size?: 'sm' | 'md' | 'lg';
  arrow?: boolean;
  interactive?: boolean;
  maxWidth?: number;
  offset?: number;
  className?: string;
  contentClassName?: string;
  trigger?: 'hover' | 'click' | 'focus' | 'manual';
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay = 300,
  hideDelay = 100,
  disabled = false,
  variant = 'default',
  size = 'md',
  arrow = true,
  interactive = false,
  maxWidth = 320,
  offset = 8,
  className,
  contentClassName,
  trigger = 'hover',
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [actualPlacement, setActualPlacement] = useState(placement);
  const triggerRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const hideTimeoutRef = useRef<NodeJS.Timeout>();

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  // Handle open state changes
  const handleOpenChange = (newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  // Show tooltip with delay
  const showTooltip = () => {
    if (disabled) return;
    
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = undefined;
    }

    if (delay > 0) {
      timeoutRef.current = setTimeout(() => {
        handleOpenChange(true);
      }, delay);
    } else {
      handleOpenChange(true);
    }
  };

  // Hide tooltip with delay
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }

    if (hideDelay > 0) {
      hideTimeoutRef.current = setTimeout(() => {
        handleOpenChange(false);
      }, hideDelay);
    } else {
      handleOpenChange(false);
    }
  };

  // Calculate tooltip position
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = 0;
    let y = 0;
    let finalPlacement = placement;

    // Calculate base position
    switch (placement.split('-')[0]) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + offset;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
    }

    // Handle placement modifiers
    if (placement.includes('-start')) {
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        x = triggerRect.left;
      } else {
        y = triggerRect.top;
      }
    } else if (placement.includes('-end')) {
      if (placement.startsWith('top') || placement.startsWith('bottom')) {
        x = triggerRect.right - tooltipRect.width;
      } else {
        y = triggerRect.bottom - tooltipRect.height;
      }
    }

    // Flip if outside viewport
    if (x < 0) {
      if (placement.startsWith('left')) {
        finalPlacement = placement.replace('left', 'right') as TooltipPlacement;
        x = triggerRect.right + offset;
      } else {
        x = 8;
      }
    } else if (x + tooltipRect.width > viewport.width) {
      if (placement.startsWith('right')) {
        finalPlacement = placement.replace('right', 'left') as TooltipPlacement;
        x = triggerRect.left - tooltipRect.width - offset;
      } else {
        x = viewport.width - tooltipRect.width - 8;
      }
    }

    if (y < 0) {
      if (placement.startsWith('top')) {
        finalPlacement = placement.replace('top', 'bottom') as TooltipPlacement;
        y = triggerRect.bottom + offset;
      } else {
        y = 8;
      }
    } else if (y + tooltipRect.height > viewport.height) {
      if (placement.startsWith('bottom')) {
        finalPlacement = placement.replace('bottom', 'top') as TooltipPlacement;
        y = triggerRect.top - tooltipRect.height - offset;
      } else {
        y = viewport.height - tooltipRect.height - 8;
      }
    }

    setPosition({ x, y });
    setActualPlacement(finalPlacement);
  }, [placement, offset]);

  // Update position when tooltip opens
  useEffect(() => {
    if (isOpen) {
      calculatePosition();
      
      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll, true);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll, true);
      };
    }
  }, [isOpen, content, calculatePosition]);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

  // Event handlers
  const handleMouseEnter = () => {
    if (trigger === 'hover') showTooltip();
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') hideTooltip();
  };

  const handleFocus = () => {
    if (trigger === 'focus') showTooltip();
  };

  const handleBlur = () => {
    if (trigger === 'focus') hideTooltip();
  };

  const handleClick = () => {
    if (trigger === 'click') {
      handleOpenChange(!isOpen);
    }
  };

  // Clone children with event handlers
  const triggerElement = React.cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      triggerRef.current = node;
    },
    onMouseEnter: (e: React.MouseEvent) => {
      if (children.props && typeof children.props === 'object' && 'onMouseEnter' in children.props) {
        const originalHandler = children.props.onMouseEnter as (e: React.MouseEvent) => void;
        originalHandler?.(e);
      }
      handleMouseEnter();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      if (children.props && typeof children.props === 'object' && 'onMouseLeave' in children.props) {
        const originalHandler = children.props.onMouseLeave as (e: React.MouseEvent) => void;
        originalHandler?.(e);
      }
      handleMouseLeave();
    },
    onFocus: (e: React.FocusEvent) => {
      if (children.props && typeof children.props === 'object' && 'onFocus' in children.props) {
        const originalHandler = children.props.onFocus as (e: React.FocusEvent) => void;
        originalHandler?.(e);
      }
      handleFocus();
    },
    onBlur: (e: React.FocusEvent) => {
      if (children.props && typeof children.props === 'object' && 'onBlur' in children.props) {
        const originalHandler = children.props.onBlur as (e: React.FocusEvent) => void;
        originalHandler?.(e);
      }
      handleBlur();
    },
    onClick: (e: React.MouseEvent) => {
      if (children.props && typeof children.props === 'object' && 'onClick' in children.props) {
        const originalHandler = children.props.onClick as (e: React.MouseEvent) => void;
        originalHandler?.(e);
      }
      handleClick();
    },
  });

  // Variant classes
  const variantClasses = {
    default: 'bg-bg-secondary border border-navy-700 text-text-primary',
    dark: 'bg-navy-900 border border-navy-800 text-white',
    light: 'bg-white border border-gray-200 text-gray-900 shadow-lg',
    error: 'bg-red-900 border border-red-800 text-red-100',
    warning: 'bg-yellow-900 border border-yellow-800 text-yellow-100',
    success: 'bg-green-900 border border-green-800 text-green-100',
  };

  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base',
  };

  // Arrow classes
  const getArrowClasses = () => {
    const base = 'absolute w-2 h-2 rotate-45';
    const variantArrow = {
      default: 'bg-bg-secondary border-navy-700',
      dark: 'bg-navy-900 border-navy-800',
      light: 'bg-white border-gray-200',
      error: 'bg-red-900 border-red-800',
      warning: 'bg-yellow-900 border-yellow-800',
      success: 'bg-green-900 border-green-800',
    };

    const position = actualPlacement.split('-')[0];
    const positionClasses = {
      top: 'bottom-0 translate-y-1/2 border-r border-b',
      bottom: 'top-0 -translate-y-1/2 border-l border-t',
      left: 'right-0 translate-x-1/2 border-t border-r',
      right: 'left-0 -translate-x-1/2 border-b border-l',
    };

    return cn(base, variantArrow[variant], positionClasses[position as keyof typeof positionClasses]);
  };

  const tooltipContent = isOpen && (
    <div
      ref={tooltipRef}
      className={cn(
        'fixed z-50 rounded-lg shadow-premium backdrop-blur-sm',
        'animate-in fade-in-0 zoom-in-95 duration-200',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        variantClasses[variant],
        sizeClasses[size],
        contentClassName
      )}
      style={{
        left: position.x,
        top: position.y,
        maxWidth,
      }}
      onMouseEnter={interactive ? () => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = undefined;
        }
      } : undefined}
      onMouseLeave={interactive ? hideTooltip : undefined}
      role="tooltip"
      data-state={isOpen ? 'open' : 'closed'}
    >
      {content}
      
      {arrow && (
        <div
          className={getArrowClasses()}
          style={{
            left: actualPlacement.includes('left') || actualPlacement.includes('right') 
              ? undefined 
              : '50%',
            top: actualPlacement.includes('top') || actualPlacement.includes('bottom') 
              ? undefined 
              : '50%',
            transform: actualPlacement.includes('left') || actualPlacement.includes('right')
              ? 'translateY(-50%) rotate(45deg)'
              : 'translateX(-50%) rotate(45deg)',
          }}
        />
      )}
    </div>
  );

  return (
    <>
      <div className={className}>
        {triggerElement}
      </div>
      {typeof document !== 'undefined' && createPortal(tooltipContent, document.body)}
    </>
  );
};

export { Tooltip };
export type { TooltipProps, TooltipPlacement };