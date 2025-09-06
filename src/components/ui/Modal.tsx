import React, { forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type ModalVariant = 'default' | 'glass' | 'dark';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  size?: ModalSize;
  variant?: ModalVariant;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  className?: string;
  overlayClassName?: string;
  preventScroll?: boolean;
  animate?: boolean;
}

const Modal = forwardRef<HTMLDivElement, ModalProps>((
  {
    isOpen,
    onClose,
    children,
    size = 'md',
    variant = 'default',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    className,
    overlayClassName,
    preventScroll = true,
    animate = true,
  },
  ref
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(true);
      
      if (preventScroll) {
        document.body.style.overflow = 'hidden';
      }
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, animate ? 200 : 0);
      
      if (preventScroll) {
        document.body.style.overflow = '';
      }
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, preventScroll, animate]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (closeOnEscape && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeOnEscape, onClose]);

  const sizeClasses: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]',
  };

  const variantClasses: Record<ModalVariant, string> = {
    default: 'bg-bg-primary border border-navy-700',
    glass: 'bg-navy-900/80 backdrop-blur-xl border border-navy-600/50',
    dark: 'bg-navy-900 border border-navy-600',
  };

  const overlayClasses = cn(
    'fixed inset-0 z-50 flex items-center justify-center p-4',
    'bg-black/60 backdrop-blur-sm',
    animate && [
      'transition-all duration-200 ease-out',
      isAnimating ? 'opacity-100' : 'opacity-0',
    ],
    overlayClassName
  );

  const modalClasses = cn(
    'relative w-full rounded-2xl shadow-2xl',
    'transform transition-all duration-200 ease-out',
    
    // Size
    sizeClasses[size],
    
    // Variant
    variantClasses[variant],
    
    // Animation
    animate && [
      isAnimating
        ? 'scale-100 opacity-100 translate-y-0'
        : 'scale-95 opacity-0 translate-y-4',
    ],
    
    className
  );

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (closeOnOverlayClick && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return createPortal(
    <div className={overlayClasses} onClick={handleOverlayClick}>
      <div ref={ref} className={modalClasses} role="dialog" aria-modal="true">
        {showCloseButton && (
          <button
            onClick={onClose}
            className={cn(
              'absolute top-4 right-4 z-10',
              'p-2 rounded-xl transition-all duration-200',
              'text-text-tertiary hover:text-text-primary',
              'hover:bg-navy-700/50 focus:outline-none',
              'focus:ring-2 focus:ring-neon-500/50'
            )}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
});

Modal.displayName = 'Modal';

// Modal Header Component
interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  onClose?: () => void;
}

const ModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>((
  { className, title, subtitle, onClose, children, ...props },
  ref
) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-start justify-between p-6 pb-4',
        'border-b border-navy-700',
        className
      )}
      {...props}
    >
      <div className="space-y-1">
        {title && (
          <h2 className="text-xl font-semibold text-text-primary">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="text-sm text-text-tertiary">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            'ml-4 p-2 rounded-xl transition-all duration-200',
            'text-text-tertiary hover:text-text-primary',
            'hover:bg-navy-700/50 focus:outline-none',
            'focus:ring-2 focus:ring-neon-500/50'
          )}
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
});

ModalHeader.displayName = 'ModalHeader';

// Modal Content Component
interface ModalContentProps extends React.HTMLAttributes<HTMLDivElement> {
  scrollable?: boolean;
}

const ModalContent = forwardRef<HTMLDivElement, ModalContentProps>((
  { className, scrollable = false, ...props },
  ref
) => {
  return (
    <div
      ref={ref}
      className={cn(
        'p-6',
        scrollable && 'max-h-[60vh] overflow-y-auto',
        'text-text-secondary',
        className
      )}
      {...props}
    />
  );
});

ModalContent.displayName = 'ModalContent';

// Modal Footer Component
interface ModalFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'left' | 'center' | 'right' | 'between';
}

const ModalFooter = forwardRef<HTMLDivElement, ModalFooterProps>((
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
        'flex items-center gap-3 p-6 pt-4',
        'border-t border-navy-700',
        alignClasses[align],
        className
      )}
      {...props}
    />
  );
});

ModalFooter.displayName = 'ModalFooter';

// Confirmation Modal Component
interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger' | 'warning';
  loading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  loading = false,
}) => {
  const variantStyles = {
    default: 'primary',
    danger: 'danger',
    warning: 'secondary',
  } as const;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalHeader title={title} />
      <ModalContent>
        <p className="text-text-secondary">{message}</p>
      </ModalContent>
      <ModalFooter>
        <Button
          variant="ghost"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>
        <Button
          variant={variantStyles[variant]}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export {
  Modal,
  ModalHeader,
  ModalContent,
  ModalFooter,
  ConfirmModal,
};
export type {
  ModalProps,
  ModalHeaderProps,
  ModalContentProps,
  ModalFooterProps,
  ConfirmModalProps,
};