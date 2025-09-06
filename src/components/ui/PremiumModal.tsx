import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'glass' | 'glass-dark' | 'glass-neon';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  className?: string;
}

const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = 'md',
  variant = 'glass-dark',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  const variantClasses = {
    default: 'bg-white border border-neutral-200 shadow-modal',
    glass: 'glass',
    'glass-dark': 'glass-dark',
    'glass-neon': 'glass-neon'
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with glassmorphism */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={handleOverlayClick}
      />
      
      {/* Modal Content */}
      <div 
        className={cn(
          'relative w-full rounded-2xl p-6 transition-all duration-300 ease-out',
          'animate-scale-in',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between mb-6">
            {title && (
              <h2 
                id="modal-title" 
                className="text-xl font-semibold text-white"
              >
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className={cn(
                  'p-2 rounded-lg transition-all duration-200',
                  'hover:bg-white/10 focus:bg-white/10',
                  'focus:outline-none focus:ring-2 focus:ring-white/20',
                  'text-white/70 hover:text-white'
                )}
                aria-label="Fechar modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="text-white/90">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;