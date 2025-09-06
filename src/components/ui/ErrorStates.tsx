import React from 'react';
import { AlertTriangle, WifiOff, Search, Inbox, FileX, ShieldAlert, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';
import { AccessibleButton } from './Accessibility';

// Base error state component
interface ErrorStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'error' | 'warning' | 'info' | 'empty';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  icon,
  action,
  secondaryAction,
  variant = 'error',
  size = 'md',
  className,
}) => {
  const variantClasses = {
    error: {
      icon: 'text-red-400',
      title: 'text-red-400',
      description: 'text-text-secondary',
    },
    warning: {
      icon: 'text-yellow-400',
      title: 'text-yellow-400',
      description: 'text-text-secondary',
    },
    info: {
      icon: 'text-blue-400',
      title: 'text-blue-400',
      description: 'text-text-secondary',
    },
    empty: {
      icon: 'text-text-tertiary',
      title: 'text-text-primary',
      description: 'text-text-tertiary',
    },
  };

  const sizeClasses = {
    sm: {
      container: 'p-6',
      icon: 'w-8 h-8',
      title: 'text-lg',
      description: 'text-sm',
      spacing: 'space-y-3',
    },
    md: {
      container: 'p-8',
      icon: 'w-12 h-12',
      title: 'text-xl',
      description: 'text-base',
      spacing: 'space-y-4',
    },
    lg: {
      container: 'p-12',
      icon: 'w-16 h-16',
      title: 'text-2xl',
      description: 'text-lg',
      spacing: 'space-y-6',
    },
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      sizeClasses[size].container,
      sizeClasses[size].spacing,
      className
    )}>
      {icon && (
        <div className={cn(
          'flex-shrink-0 mb-2',
          sizeClasses[size].icon,
          variantClasses[variant].icon
        )}>
          {icon}
        </div>
      )}
      
      <div className="space-y-2">
        <h3 className={cn(
          'font-semibold',
          sizeClasses[size].title,
          variantClasses[variant].title
        )}>
          {title}
        </h3>
        
        {description && (
          <p className={cn(
            sizeClasses[size].description,
            variantClasses[variant].description,
            'max-w-md mx-auto'
          )}>
            {description}
          </p>
        )}
      </div>
      
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 mt-2">
          {action && (
            <AccessibleButton
              onClick={action.onClick}
              loading={action.loading}
              variant="primary"
              size={size}
            >
              {action.label}
            </AccessibleButton>
          )}
          
          {secondaryAction && (
            <AccessibleButton
              onClick={secondaryAction.onClick}
              variant="ghost"
              size={size}
            >
              {secondaryAction.label}
            </AccessibleButton>
          )}
        </div>
      )}
    </div>
  );
};

// Network error component
interface NetworkErrorProps {
  onRetry?: () => void;
  retryLoading?: boolean;
  className?: string;
}

const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  retryLoading = false,
  className,
}) => {
  return (
    <ErrorState
      variant="error"
      icon={<WifiOff />}
      title="Connection Problem"
      description="Please check your internet connection and try again."
      action={onRetry ? {
        label: 'Try Again',
        onClick: onRetry,
        loading: retryLoading,
      } : undefined}
      className={className}
    />
  );
};

// Server error component
interface ServerErrorProps {
  onRetry?: () => void;
  retryLoading?: boolean;
  onContactSupport?: () => void;
  className?: string;
}

const ServerError: React.FC<ServerErrorProps> = ({
  onRetry,
  retryLoading = false,
  onContactSupport,
  className,
}) => {
  return (
    <ErrorState
      variant="error"
      icon={<ShieldAlert />}
      title="Server Error"
      description="Something went wrong on our end. Our team has been notified and is working on a fix."
      action={onRetry ? {
        label: 'Try Again',
        onClick: onRetry,
        loading: retryLoading,
      } : undefined}
      secondaryAction={onContactSupport ? {
        label: 'Contact Support',
        onClick: onContactSupport,
      } : undefined}
      className={className}
    />
  );
};

// Not found component
interface NotFoundProps {
  title?: string;
  description?: string;
  onGoBack?: () => void;
  onGoHome?: () => void;
  className?: string;
}

const NotFound: React.FC<NotFoundProps> = ({
  title = "Page Not Found",
  description = "The page you're looking for doesn't exist or has been moved.",
  onGoBack,
  onGoHome,
  className,
}) => {
  return (
    <ErrorState
      variant="info"
      icon={<FileX />}
      title={title}
      description={description}
      action={onGoHome ? {
        label: 'Go Home',
        onClick: onGoHome,
      } : undefined}
      secondaryAction={onGoBack ? {
        label: 'Go Back',
        onClick: onGoBack,
      } : undefined}
      className={className}
    />
  );
};

// Empty state component
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <Inbox />,
  action,
  className,
}) => {
  return (
    <ErrorState
      variant="empty"
      icon={icon}
      title={title}
      description={description}
      action={action}
      className={className}
    />
  );
};

// No search results component
interface NoSearchResultsProps {
  query?: string;
  onClearSearch?: () => void;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
  className?: string;
}

const NoSearchResults: React.FC<NoSearchResultsProps> = ({
  query,
  onClearSearch,
  suggestions = [],
  onSuggestionClick,
  className,
}) => {
  return (
    <div className={cn('text-center p-8 space-y-6', className)}>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-12 h-12 text-text-tertiary">
          <Search />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-text-primary">
            No results found
          </h3>
          
          <p className="text-text-tertiary max-w-md mx-auto">
            {query ? (
              <>We couldn't find anything matching <span className="font-medium text-text-secondary">"{query}"</span></>
            ) : (
              "Try adjusting your search terms or filters"
            )}
          </p>
        </div>
      </div>
      
      {suggestions.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-text-tertiary">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onSuggestionClick?.(suggestion)}
                className={cn(
                  'px-3 py-1.5 text-sm rounded-full',
                  'bg-navy-700 text-text-secondary',
                  'hover:bg-navy-600 hover:text-text-primary',
                  'focus:outline-none focus:ring-2 focus:ring-neon-500/20',
                  'transition-all duration-200'
                )}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {onClearSearch && (
        <AccessibleButton
          onClick={onClearSearch}
          variant="ghost"
          size="sm"
        >
          Clear Search
        </AccessibleButton>
      )}
    </div>
  );
};

// Loading error component
interface LoadingErrorProps {
  message?: string;
  onRetry?: () => void;
  retryLoading?: boolean;
  className?: string;
}

const LoadingError: React.FC<LoadingErrorProps> = ({
  message = "Failed to load content",
  onRetry,
  retryLoading = false,
  className,
}) => {
  return (
    <ErrorState
      variant="warning"
      icon={<AlertTriangle />}
      title={message}
      description="There was a problem loading this content. Please try again."
      action={onRetry ? {
        label: 'Retry',
        onClick: onRetry,
        loading: retryLoading,
      } : undefined}
      size="sm"
      className={className}
    />
  );
};

// Timeout error component
interface TimeoutErrorProps {
  onRetry?: () => void;
  retryLoading?: boolean;
  className?: string;
}

const TimeoutError: React.FC<TimeoutErrorProps> = ({
  onRetry,
  retryLoading = false,
  className,
}) => {
  return (
    <ErrorState
      variant="warning"
      icon={<Clock />}
      title="Request Timeout"
      description="The request is taking longer than expected. Please try again."
      action={onRetry ? {
        label: 'Try Again',
        onClick: onRetry,
        loading: retryLoading,
      } : undefined}
      className={className}
    />
  );
};

// Permission denied component
interface PermissionDeniedProps {
  title?: string;
  description?: string;
  onContactAdmin?: () => void;
  onGoBack?: () => void;
  className?: string;
}

const PermissionDenied: React.FC<PermissionDeniedProps> = ({
  title = "Access Denied",
  description = "You don't have permission to access this resource.",
  onContactAdmin,
  onGoBack,
  className,
}) => {
  return (
    <ErrorState
      variant="warning"
      icon={<ShieldAlert />}
      title={title}
      description={description}
      action={onContactAdmin ? {
        label: 'Contact Admin',
        onClick: onContactAdmin,
      } : undefined}
      secondaryAction={onGoBack ? {
        label: 'Go Back',
        onClick: onGoBack,
      } : undefined}
      className={className}
    />
  );
};

// Generic error boundary fallback
interface ErrorBoundaryFallbackProps {
  error?: Error;
  onReset?: () => void;
  className?: string;
}

const ErrorBoundaryFallback: React.FC<ErrorBoundaryFallbackProps> = ({
  error,
  onReset,
  className,
}) => {
  return (
    <ErrorState
      variant="error"
      icon={<AlertTriangle />}
      title="Something went wrong"
      description={error?.message || "An unexpected error occurred. Please refresh the page or try again later."}
      action={onReset ? {
        label: 'Try Again',
        onClick: onReset,
      } : {
        label: 'Refresh Page',
        onClick: () => window.location.reload(),
      }}
      className={className}
    />
  );
};

export {
  ErrorState,
  NetworkError,
  ServerError,
  NotFound,
  EmptyState,
  NoSearchResults,
  LoadingError,
  TimeoutError,
  PermissionDenied,
  ErrorBoundaryFallback,
};

export type {
  ErrorStateProps,
  NetworkErrorProps,
  ServerErrorProps,
  NotFoundProps,
  EmptyStateProps,
  NoSearchResultsProps,
  LoadingErrorProps,
  TimeoutErrorProps,
  PermissionDeniedProps,
  ErrorBoundaryFallbackProps,
};