import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { Search as SearchIcon, X, Clock, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category?: string;
  url?: string;
  icon?: React.ReactNode;
}

interface SearchProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  recentSearches?: string[];
  popularSearches?: string[];
  loading?: boolean;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'outlined';
  showResults?: boolean;
  maxResults?: number;
  debounceMs?: number;
  className?: string;
  clearable?: boolean;
  autoFocus?: boolean;
}

const Search = forwardRef<HTMLInputElement, SearchProps>((
  {
    placeholder = 'Search...',
    value,
    onChange,
    onSearch,
    onResultSelect,
    results = [],
    recentSearches = [],
    popularSearches = [],
    loading = false,
    disabled = false,
    size = 'md',
    variant = 'default',
    showResults = true,
    maxResults = 10,
    debounceMs = 300,
    className,
    clearable = true,
    autoFocus = false,
  },
  ref
) => {
  const [internalValue, setInternalValue] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const currentValue = value !== undefined ? value : internalValue;
  const hasValue = currentValue.length > 0;
  const displayResults = showResults && isOpen && (hasValue || recentSearches.length > 0 || popularSearches.length > 0);

  // Handle value changes with debouncing
  const handleValueChange = (newValue: string) => {
    if (value === undefined) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);

    // Debounce search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      if (newValue.trim()) {
        onSearch?.(newValue.trim());
      }
    }, debounceMs);
  };

  // Handle input focus
  const handleFocus = () => {
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  // Handle input blur
  const handleBlur = () => {
    // Delay closing to allow for result clicks
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }, 150);
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!displayResults) return;

    const allItems = [
      ...results.slice(0, maxResults),
      ...(hasValue ? [] : recentSearches.map(search => ({ id: `recent-${search}`, title: search, category: 'Recent' }))),
      ...(hasValue ? [] : popularSearches.map(search => ({ id: `popular-${search}`, title: search, category: 'Popular' }))),
    ];

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setHighlightedIndex(prev => (prev + 1) % allItems.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setHighlightedIndex(prev => prev <= 0 ? allItems.length - 1 : prev - 1);
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && allItems[highlightedIndex]) {
          handleResultSelect(allItems[highlightedIndex]);
        } else if (currentValue.trim()) {
          onSearch?.(currentValue.trim());
          setIsOpen(false);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    handleValueChange(result.title);
    onResultSelect?.(result);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Handle clear
  const handleClear = () => {
    handleValueChange('');
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  // Size classes
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-13 px-5 text-base',
  };

  // Variant classes
  const variantClasses = {
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

  const inputClasses = cn(
    // Base styles
    'w-full rounded-xl transition-all duration-200',
    'text-text-primary placeholder:text-text-tertiary',
    'focus:outline-none focus:ring-2 focus:ring-neon-500/20',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'pl-10 pr-10',
    
    // Size
    sizeClasses[size],
    
    // Variant
    variantClasses[variant],
    
    className
  );

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
          ) : (
            <SearchIcon className="w-4 h-4" />
          )}
        </div>

        {/* Input */}
        <input
          ref={ref}
          type="text"
          value={currentValue}
          onChange={(e) => handleValueChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          className={inputClasses}
          autoComplete="off"
          role="combobox"
          aria-expanded={displayResults}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />

        {/* Clear Button */}
        {clearable && hasValue && !disabled && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors duration-200"
            tabIndex={-1}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {displayResults && (
        <div className={cn(
          'absolute top-full left-0 right-0 mt-1 z-50',
          'bg-bg-secondary border border-navy-700 rounded-xl shadow-premium',
          'max-h-96 overflow-y-auto'
        )}>
          {/* Search Results */}
          {hasValue && results.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                Results
              </div>
              {results.slice(0, maxResults).map((result, index) => (
                <button
                  key={result.id}
                  onClick={() => handleResultSelect(result)}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 text-left',
                    'hover:bg-navy-700/50 transition-colors duration-200',
                    'focus:outline-none focus:bg-navy-700/50',
                    highlightedIndex === index && 'bg-navy-700/50'
                  )}
                >
                  {result.icon && (
                    <div className="flex-shrink-0 text-neon-400">
                      {result.icon}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-text-primary truncate">
                      {result.title}
                    </div>
                    {result.description && (
                      <div className="text-xs text-text-tertiary truncate">
                        {result.description}
                      </div>
                    )}
                  </div>
                  {result.category && (
                    <div className="flex-shrink-0 text-xs text-text-tertiary">
                      {result.category}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {hasValue && results.length === 0 && !loading && (
            <div className="py-8 text-center">
              <div className="text-text-tertiary text-sm">
                No results found for "{currentValue}"
              </div>
            </div>
          )}

          {/* Recent Searches */}
          {!hasValue && recentSearches.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-medium text-text-tertiary uppercase tracking-wide flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Recent</span>
              </div>
              {recentSearches.slice(0, 5).map((search, index) => {
                const adjustedIndex = results.length + index;
                return (
                  <button
                    key={`recent-${search}`}
                    onClick={() => handleResultSelect({ id: `recent-${search}`, title: search })}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 text-left',
                      'hover:bg-navy-700/50 transition-colors duration-200',
                      'focus:outline-none focus:bg-navy-700/50',
                      highlightedIndex === adjustedIndex && 'bg-navy-700/50'
                    )}
                  >
                    <Clock className="w-4 h-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">{search}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Popular Searches */}
          {!hasValue && popularSearches.length > 0 && (
            <div className="py-2">
              <div className="px-3 py-1 text-xs font-medium text-text-tertiary uppercase tracking-wide flex items-center space-x-1">
                <TrendingUp className="w-3 h-3" />
                <span>Popular</span>
              </div>
              {popularSearches.slice(0, 5).map((search, index) => {
                const adjustedIndex = results.length + recentSearches.length + index;
                return (
                  <button
                    key={`popular-${search}`}
                    onClick={() => handleResultSelect({ id: `popular-${search}`, title: search })}
                    className={cn(
                      'w-full flex items-center space-x-3 px-3 py-2 text-left',
                      'hover:bg-navy-700/50 transition-colors duration-200',
                      'focus:outline-none focus:bg-navy-700/50',
                      highlightedIndex === adjustedIndex && 'bg-navy-700/50'
                    )}
                  >
                    <TrendingUp className="w-4 h-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">{search}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

Search.displayName = 'Search';

export { Search };
export type { SearchProps, SearchResult };