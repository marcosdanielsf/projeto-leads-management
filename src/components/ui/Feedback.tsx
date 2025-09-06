import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info, Volume2, VolumeX } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AccessibleButton } from './Accessibility';

// Toast types and interfaces
type ToastType = 'success' | 'error' | 'warning' | 'info';
type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  persistent?: boolean;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
}

// Toast context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast provider component
interface ToastProviderProps {
  children: React.ReactNode;
  position?: ToastPosition;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  position = 'top-right',
  maxToasts = 5,
}) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 5000,
      dismissible: toast.dismissible ?? true,
    };

    setToasts(prev => {
      const updated = [newToast, ...prev];
      return updated.slice(0, maxToasts);
    });

    // Auto remove toast if not persistent
    if (!newToast.persistent && newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  }, [maxToasts, removeToast]);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearAllToasts }}>
      {children}
      
      {/* Toast container */}
      <div
        className={cn(
          'fixed z-50 flex flex-col space-y-2 w-full max-w-sm',
          positionClasses[position]
        )}
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map(toast => (
          <ToastComponent
            key={toast.id}
            toast={toast}
            onRemove={() => removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Individual toast component
interface ToastComponentProps {
  toast: Toast;
  onRemove: () => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(onRemove, 200); // Wait for exit animation
  };

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500/10 border-green-500/20',
      iconColor: 'text-green-400',
      titleColor: 'text-green-400',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-500/10 border-red-500/20',
      iconColor: 'text-red-400',
      titleColor: 'text-red-400',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500/10 border-yellow-500/20',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-400',
    },
  };

  const config = typeConfig[toast.type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border backdrop-blur-sm',
        'transform transition-all duration-200 ease-out',
        config.bgColor,
        isVisible && !isExiting
          ? 'translate-x-0 opacity-100 scale-100'
          : 'translate-x-full opacity-0 scale-95'
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start space-x-3">
        <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
          <IconComponent className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn('text-sm font-semibold', config.titleColor)}>
            {toast.title}
          </h4>
          
          {toast.description && (
            <p className="mt-1 text-sm text-text-secondary">
              {toast.description}
            </p>
          )}
          
          {toast.action && (
            <div className="mt-3">
              <AccessibleButton
                onClick={toast.action.onClick}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                {toast.action.label}
              </AccessibleButton>
            </div>
          )}
        </div>
        
        {toast.dismissible && (
          <button
            onClick={handleRemove}
            className={cn(
              'flex-shrink-0 p-1 rounded-md',
              'text-text-tertiary hover:text-text-secondary',
              'hover:bg-white/10 transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-neon-500/20'
            )}
            aria-label="Dismiss notification"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Alert component
interface AlertProps {
  type: ToastType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  description,
  action,
  dismissible = false,
  onDismiss,
  className,
}) => {
  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-500/10 border-green-500/20',
      iconColor: 'text-green-400',
      titleColor: 'text-green-400',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-red-500/10 border-red-500/20',
      iconColor: 'text-red-400',
      titleColor: 'text-red-400',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-500/10 border-yellow-500/20',
      iconColor: 'text-yellow-400',
      titleColor: 'text-yellow-400',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      iconColor: 'text-blue-400',
      titleColor: 'text-blue-400',
    },
  };

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <div
      className={cn(
        'relative p-4 rounded-lg border',
        config.bgColor,
        className
      )}
      role="alert"
    >
      <div className="flex items-start space-x-3">
        <div className={cn('flex-shrink-0 mt-0.5', config.iconColor)}>
          <IconComponent className="w-5 h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={cn('text-sm font-semibold', config.titleColor)}>
            {title}
          </h4>
          
          {description && (
            <p className="mt-1 text-sm text-text-secondary">
              {description}
            </p>
          )}
          
          {action && (
            <div className="mt-3">
              <AccessibleButton
                onClick={action.onClick}
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                {action.label}
              </AccessibleButton>
            </div>
          )}
        </div>
        
        {dismissible && (
          <button
            onClick={onDismiss}
            className={cn(
              'flex-shrink-0 p-1 rounded-md',
              'text-text-tertiary hover:text-text-secondary',
              'hover:bg-white/10 transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-neon-500/20'
            )}
            aria-label="Dismiss alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Notification badge component
interface NotificationBadgeProps {
  count: number;
  max?: number;
  showZero?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children?: React.ReactNode;
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count,
  max = 99,
  showZero = false,
  variant = 'primary',
  size = 'md',
  className,
  children,
}) => {
  const displayCount = count > max ? `${max}+` : count.toString();
  const shouldShow = count > 0 || showZero;

  const variantClasses = {
    default: 'bg-navy-600 text-text-primary',
    primary: 'bg-neon-500 text-navy-900',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-navy-900',
    error: 'bg-red-500 text-white',
  };

  const sizeClasses = {
    sm: 'text-xs min-w-[16px] h-4 px-1',
    md: 'text-xs min-w-[20px] h-5 px-1.5',
    lg: 'text-sm min-w-[24px] h-6 px-2',
  };

  return (
    <div className={cn('relative inline-block', className)}>
      {children}
      
      {shouldShow && (
        <span
          className={cn(
            'absolute -top-1 -right-1 flex items-center justify-center',
            'rounded-full font-semibold leading-none',
            'transform transition-all duration-200',
            'animate-in zoom-in-50',
            variantClasses[variant],
            sizeClasses[size]
          )}
          aria-label={`${count} notifications`}
        >
          {displayCount}
        </span>
      )}
    </div>
  );
};

// Sound notification hook
interface SoundNotificationOptions {
  enabled?: boolean;
  volume?: number;
}

export const useSoundNotification = (options: SoundNotificationOptions = {}) => {
  const { enabled = true, volume = 0.5 } = options;
  const [isMuted, setIsMuted] = useState(!enabled);

  const playNotificationSound = useCallback((type: ToastType = 'info') => {
    if (isMuted) return;

    // Create audio context for different notification sounds
    const audioContext = new (window.AudioContext || (window as unknown as typeof AudioContext))();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different types
    const frequencies = {
      success: [523.25, 659.25], // C5, E5
      error: [220, 185], // A3, F#3
      warning: [440, 523.25], // A4, C5
      info: [523.25], // C5
    };

    const freqs = frequencies[type];
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.1, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

    freqs.forEach((freq, index) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(freq, audioContext.currentTime + index * 0.1);
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0, audioContext.currentTime + index * 0.1);
      gain.gain.linearRampToValueAtTime(volume * 0.05, audioContext.currentTime + index * 0.1 + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + index * 0.1 + 0.2);
      
      osc.start(audioContext.currentTime + index * 0.1);
      osc.stop(audioContext.currentTime + index * 0.1 + 0.2);
    });
  }, [isMuted, volume]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const SoundToggle = () => (
    <button
      onClick={toggleMute}
      className={cn(
        'p-2 rounded-lg transition-colors duration-200',
        'text-text-secondary hover:text-text-primary',
        'hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-neon-500/20'
      )}
      aria-label={isMuted ? 'Enable sound notifications' : 'Disable sound notifications'}
    >
      {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
    </button>
  );

  return {
    playNotificationSound,
    isMuted,
    toggleMute,
    SoundToggle,
  };
};

export {
  Alert,
  NotificationBadge,
  ToastComponent,
};

export type {
  Toast,
  ToastType,
  ToastPosition,
  AlertProps,
  NotificationBadgeProps,
  SoundNotificationOptions,
};