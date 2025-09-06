import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { cn } from '../../lib/utils';
import { LoadingSpinner, Skeleton } from './LoadingStates';

// Lazy loading wrapper component
interface LazyComponentProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <Skeleton className="w-full h-32" />,
  threshold = 0.1,
  rootMargin = '50px',
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, hasLoaded]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible ? children : fallback}
    </div>
  );
};

// Lazy image component with progressive loading
interface LazyImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  className,
  width,
  height,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={{ width, height }}
    >
      {/* Placeholder */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy-700">
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              className="w-full h-full object-cover filter blur-sm scale-110"
            />
          ) : (
            <Skeleton className="w-full h-full" />
          )}
        </div>
      )}

      {/* Main image */}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}

      {/* Error state */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-navy-700 text-text-tertiary">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
};

// Virtual scrolling component
interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
}

function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className,
  onScroll,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    const result = [];
    for (let i = startIndex; i <= endIndex; i++) {
      result.push({
        index: i,
        item: items[i],
        offsetY: i * itemHeight,
      });
    }
    return result;
  }, [items, startIndex, endIndex, itemHeight]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll]
  );

  return (
    <div
      ref={scrollElementRef}
      className={cn('overflow-auto', className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems.map(({ index, item, offsetY }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: offsetY,
              left: 0,
              right: 0,
              height: itemHeight,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

// Infinite scroll component
interface InfiniteScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading: boolean;
  threshold?: number;
  className?: string;
  loadingComponent?: React.ReactNode;
}

function InfiniteScroll<T>({
  items,
  renderItem,
  loadMore,
  hasMore,
  loading,
  threshold = 200,
  className,
  loadingComponent = <LoadingSpinner size="md" />,
}: InfiniteScrollProps<T>) {
  const [isFetching, setIsFetching] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(async () => {
    if (isFetching || loading || !hasMore) return;

    setIsFetching(true);
    try {
      await loadMore();
    } finally {
      setIsFetching(false);
    }
  }, [isFetching, loading, hasMore, loadMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading && !isFetching) {
          handleLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: `${threshold}px` }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, isFetching, threshold, handleLoadMore]);

  return (
    <div ref={containerRef} className={className}>
      {items.map((item, index) => (
        <div key={index}>{renderItem(item, index)}</div>
      ))}
      
      {hasMore && (
        <div
          ref={sentinelRef}
          className="flex justify-center py-4"
          aria-hidden="true"
        >
          {(loading || isFetching) && loadingComponent}
        </div>
      )}
    </div>
  );
}

// Memoized component wrapper
interface MemoizedProps {
  children: React.ReactNode;
  dependencies?: unknown[];
}

const Memoized: React.FC<MemoizedProps> = ({ children, dependencies = [] }) => {
  return useMemo(() => children, dependencies);
};

// Debounced input component
interface DebouncedInputProps {
  value: string;
  onChange: (value: string) => void;
  delay?: number;
  placeholder?: string;
  className?: string;
}

const DebouncedInput: React.FC<DebouncedInputProps> = ({
  value,
  onChange,
  delay = 300,
  placeholder,
  className,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      onChange(localValue);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localValue, delay, onChange]);

  return (
    <input
      type="text"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      placeholder={placeholder}
      className={cn(
        'w-full px-3 py-2 rounded-lg border border-navy-600',
        'bg-navy-800 text-text-primary placeholder-text-tertiary',
        'focus:outline-none focus:ring-2 focus:ring-neon-500/20 focus:border-neon-500',
        'transition-all duration-200',
        className
      )}
    />
  );
};

// Performance monitoring hook
interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage?: number;
}

export const usePerformanceMonitor = (componentName: string) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const renderStartTime = useRef<number>();
  const componentCountRef = useRef(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    componentCountRef.current += 1;

    return () => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current;
        
        const newMetrics: PerformanceMetrics = {
          renderTime,
          componentCount: componentCountRef.current,
        };

        // Add memory usage if available
        if ('memory' in performance) {
          const perfWithMemory = performance as Performance & {
            memory?: { usedJSHeapSize: number };
          };
          newMetrics.memoryUsage = perfWithMemory.memory?.usedJSHeapSize;
        }

        setMetrics(newMetrics);

        // Log performance in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Performance] ${componentName}:`, newMetrics);
        }
      }
    };
  });

  return metrics;
};

// Code splitting helper
export const createLazyComponent = (
  importFunc: () => Promise<{ default: React.ComponentType }>,
  fallback?: React.ReactNode
) => {
  const LazyComp = lazy(importFunc);
  
  return (props: Record<string, unknown>) => (
    <Suspense fallback={fallback || <LoadingSpinner size="lg" />}>
      <LazyComp {...props} />
    </Suspense>
  );
};

// Bundle size analyzer (development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== 'development') return;

  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const totalSize = scripts.reduce((acc, script) => {
    const src = script.getAttribute('src');
    if (src && !src.startsWith('http')) {
      // This is a rough estimation - in real apps you'd use webpack-bundle-analyzer
      return acc + 1;
    }
    return acc;
  }, 0);

  console.log(`[Bundle Analysis] Estimated script count: ${totalSize}`);
};

export {
  LazyComponent,
  LazyImage,
  VirtualScroll,
  InfiniteScroll,
  Memoized,
  DebouncedInput,
};

export type {
  LazyComponentProps,
  LazyImageProps,
  VirtualScrollProps,
  InfiniteScrollProps,
  MemoizedProps,
  DebouncedInputProps,
  PerformanceMetrics,
};