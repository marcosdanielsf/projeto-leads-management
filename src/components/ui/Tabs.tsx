import React, { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '../../lib/utils';

interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline' | 'cards';
  size?: 'sm' | 'md' | 'lg';
  orientation?: 'horizontal' | 'vertical';
  animated?: boolean;
  fullWidth?: boolean;
  className?: string;
  tabListClassName?: string;
  tabClassName?: string;
  activeTabClassName?: string;
  contentClassName?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  defaultTab,
  activeTab: controlledActiveTab,
  onTabChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  animated = true,
  fullWidth = false,
  className,
  tabListClassName,
  tabClassName,
  activeTabClassName,
  contentClassName,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    controlledActiveTab || defaultTab || items[0]?.id || ''
  );
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const tabListRef = useRef<HTMLDivElement>(null);

  const activeTab = controlledActiveTab || internalActiveTab;

  // Update indicator position
  const updateIndicator = useCallback(() => {
    const activeTabElement = tabRefs.current[activeTab];
    const tabListElement = tabListRef.current;
    
    if (activeTabElement && tabListElement && (variant === 'underline' || variant === 'default')) {
      const tabRect = activeTabElement.getBoundingClientRect();
      const listRect = tabListElement.getBoundingClientRect();
      
      if (orientation === 'horizontal') {
        setIndicatorStyle({
          width: tabRect.width,
          height: '2px',
          transform: `translateX(${tabRect.left - listRect.left}px)`,
          transition: animated ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        });
      } else {
        setIndicatorStyle({
          width: '2px',
          height: tabRect.height,
          transform: `translateY(${tabRect.top - listRect.top}px)`,
          transition: animated ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
        });
      }
    }
  }, [activeTab, variant, orientation, animated]);

  // Update indicator on active tab change
  useEffect(() => {
    updateIndicator();
  }, [activeTab, variant, orientation, animated, updateIndicator]);

  // Update indicator on window resize
  useEffect(() => {
    const handleResize = () => updateIndicator();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateIndicator]);

  // Handle tab change
  const handleTabChange = (tabId: string) => {
    const tab = items.find(item => item.id === tabId);
    if (tab?.disabled) return;
    
    if (!controlledActiveTab) {
      setInternalActiveTab(tabId);
    }
    onTabChange?.(tabId);
  };

  // Size classes
  const sizeClasses = {
    sm: {
      tab: 'px-3 py-1.5 text-xs',
      icon: 'w-3 h-3',
      badge: 'text-xs px-1.5 py-0.5',
    },
    md: {
      tab: 'px-4 py-2 text-sm',
      icon: 'w-4 h-4',
      badge: 'text-xs px-2 py-0.5',
    },
    lg: {
      tab: 'px-6 py-3 text-base',
      icon: 'w-5 h-5',
      badge: 'text-sm px-2 py-1',
    },
  };

  // Variant classes
  const variantClasses = {
    default: {
      tabList: cn(
        'relative border-b border-navy-700',
        orientation === 'vertical' && 'border-b-0 border-r'
      ),
      tab: [
        'relative font-medium transition-all duration-200',
        'text-text-tertiary hover:text-text-secondary',
        'focus:outline-none focus:text-text-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
      ],
      activeTab: 'text-neon-400',
      indicator: cn(
        'absolute bg-neon-500 rounded-full',
        orientation === 'horizontal' ? 'bottom-0 left-0' : 'right-0 top-0'
      ),
    },
    pills: {
      tabList: 'flex gap-1 p-1 bg-bg-tertiary rounded-lg',
      tab: [
        'rounded-md font-medium transition-all duration-200',
        'text-text-tertiary hover:text-text-secondary hover:bg-navy-700/50',
        'focus:outline-none focus:text-text-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
      ],
      activeTab: 'bg-neon-500 text-navy-900 hover:bg-neon-400 hover:text-navy-900',
      indicator: 'hidden',
    },
    underline: {
      tabList: cn(
        'relative',
        orientation === 'horizontal' ? 'border-b border-navy-700' : 'border-r border-navy-700'
      ),
      tab: [
        'relative font-medium transition-all duration-200',
        'text-text-tertiary hover:text-text-secondary',
        'focus:outline-none focus:text-text-primary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
      ],
      activeTab: 'text-neon-400',
      indicator: cn(
        'absolute bg-neon-500',
        orientation === 'horizontal' ? 'bottom-0 left-0 h-0.5' : 'right-0 top-0 w-0.5'
      ),
    },
    cards: {
      tabList: 'flex gap-2',
      tab: [
        'rounded-lg border border-navy-700 bg-bg-tertiary',
        'font-medium transition-all duration-200',
        'text-text-tertiary hover:text-text-secondary hover:border-navy-600',
        'focus:outline-none focus:text-text-primary focus:border-neon-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
      ],
      activeTab: 'bg-neon-500/10 border-neon-500 text-neon-400',
      indicator: 'hidden',
    },
  };

  // Get tab classes
  const getTabClasses = (tab: TabItem, isActive: boolean) => {
    return cn(
      // Base styles
      'inline-flex items-center gap-2 whitespace-nowrap',
      'focus:ring-2 focus:ring-neon-500/20',
      
      // Size
      sizeClasses[size].tab,
      
      // Variant
      variantClasses[variant].tab,
      isActive && variantClasses[variant].activeTab,
      
      // Full width
      fullWidth && 'flex-1 justify-center',
      
      // Custom classes
      tabClassName,
      isActive && activeTabClassName
    );
  };

  return (
    <div className={cn(
      'w-full',
      orientation === 'vertical' && 'flex gap-6',
      className
    )}>
      {/* Tab List */}
      <div
        ref={tabListRef}
        className={cn(
          'flex',
          orientation === 'horizontal' ? 'flex-row' : 'flex-col',
          fullWidth && orientation === 'horizontal' && 'w-full',
          orientation === 'vertical' && 'min-w-48',
          variantClasses[variant].tabList,
          tabListClassName
        )}
        role="tablist"
        aria-orientation={orientation}
      >
        {/* Animated indicator */}
        {(variant === 'default' || variant === 'underline') && (
          <div
            className={variantClasses[variant].indicator}
            style={indicatorStyle}
          />
        )}
        
        {items.map((tab) => {
          const isActive = tab.id === activeTab;
          
          return (
            <button
              key={tab.id}
              ref={(el) => {
                tabRefs.current[tab.id] = el;
              }}
              className={getTabClasses(tab, isActive)}
              onClick={() => handleTabChange(tab.id)}
              disabled={tab.disabled}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              id={`tab-${tab.id}`}
              type="button"
            >
              {tab.icon && (
                <span className={cn('flex-shrink-0', sizeClasses[size].icon)}>
                  {tab.icon}
                </span>
              )}
              
              <span className="flex-1">{tab.label}</span>
              
              {tab.badge && (
                <span className={cn(
                  'flex-shrink-0 rounded-full bg-neon-500/20 text-neon-400 font-medium',
                  sizeClasses[size].badge,
                  isActive && 'bg-neon-500 text-navy-900'
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div
        className={cn(
          'flex-1',
          orientation === 'vertical' && 'min-w-0',
          contentClassName
        )}
      >
        {items.map((tab) => {
          const isActive = tab.id === activeTab;
          
          return (
            <div
              key={tab.id}
              className={cn(
                'focus:outline-none',
                !isActive && 'hidden',
                animated && isActive && 'animate-in fade-in-0 duration-200'
              )}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              id={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Tab trigger component for custom layouts
interface TabTriggerProps {
  tabId: string;
  isActive?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const TabTrigger: React.FC<TabTriggerProps> = ({
  tabId,
  isActive = false,
  disabled = false,
  onClick,
  children,
  className,
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 text-sm font-medium',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-500/20',
        'text-text-tertiary hover:text-text-secondary',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isActive && 'text-neon-400',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${tabId}`}
      id={`tab-${tabId}`}
      type="button"
    >
      {children}
    </button>
  );
};

// Tab content component for custom layouts
interface TabContentProps {
  tabId: string;
  isActive?: boolean;
  children: React.ReactNode;
  className?: string;
}

const TabContent: React.FC<TabContentProps> = ({
  tabId,
  isActive = false,
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'focus:outline-none',
        !isActive && 'hidden',
        isActive && 'animate-in fade-in-0 duration-200',
        className
      )}
      role="tabpanel"
      aria-labelledby={`tab-${tabId}`}
      id={`tabpanel-${tabId}`}
      tabIndex={isActive ? 0 : -1}
    >
      {children}
    </div>
  );
};

export { Tabs, TabTrigger, TabContent };
export type { TabsProps, TabItem, TabTriggerProps, TabContentProps };