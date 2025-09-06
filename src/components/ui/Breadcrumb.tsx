import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  showHome?: boolean;
  homeHref?: string;
  className?: string;
  maxItems?: number;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = <ChevronRight className="w-4 h-4" />,
  showHome = true,
  homeHref = '/',
  className,
  maxItems,
  onItemClick,
}) => {
  // Add home item if showHome is true and not already present
  const allItems = showHome && items[0]?.href !== homeHref
    ? [{ label: 'Home', href: homeHref, icon: <Home className="w-4 h-4" />, current: false }, ...items]
    : items;

  // Handle max items with ellipsis
  const displayItems = maxItems && allItems.length > maxItems
    ? [
        ...allItems.slice(0, 1), // First item
        { label: '...', href: undefined, icon: undefined }, // Ellipsis
        ...allItems.slice(-(maxItems - 2)), // Last items
      ]
    : allItems;

  const handleItemClick = (item: BreadcrumbItem, index: number, event: React.MouseEvent) => {
    if (onItemClick) {
      event.preventDefault();
      onItemClick(item, index);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      <ol className="flex items-center space-x-1">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isEllipsis = item.label === '...';
          const isCurrent = item.current || isLast;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center">
              {/* Breadcrumb Item */}
              <div className="flex items-center">
                {isEllipsis ? (
                  <span className="px-2 py-1 text-text-tertiary">
                    {item.label}
                  </span>
                ) : (
                  <>
                    {item.href && !isCurrent ? (
                      <a
                        href={item.href}
                        onClick={(e) => handleItemClick(item, index, e)}
                        className={cn(
                          'flex items-center space-x-1 px-2 py-1 rounded-lg',
                          'text-text-secondary hover:text-text-primary',
                          'hover:bg-navy-700/50 transition-all duration-200',
                          'focus:outline-none focus:ring-2 focus:ring-neon-500/50'
                        )}
                        aria-current={isCurrent ? 'page' : undefined}
                      >
                        {item.icon && (
                          <span className="text-neon-400">{item.icon}</span>
                        )}
                        <span>{item.label}</span>
                      </a>
                    ) : (
                      <span
                        className={cn(
                          'flex items-center space-x-1 px-2 py-1',
                          isCurrent
                            ? 'text-text-primary font-medium'
                            : 'text-text-secondary'
                        )}
                        aria-current={isCurrent ? 'page' : undefined}
                      >
                        {item.icon && (
                          <span className={cn(
                            isCurrent ? 'text-neon-400' : 'text-text-tertiary'
                          )}>
                            {item.icon}
                          </span>
                        )}
                        <span>{item.label}</span>
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Separator */}
              {!isLast && (
                <span className="mx-2 text-text-tertiary" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

// Compact Breadcrumb for mobile
interface CompactBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

const CompactBreadcrumb: React.FC<CompactBreadcrumbProps> = ({
  items,
  className,
  onItemClick,
}) => {
  const currentItem = items[items.length - 1];
  const parentItem = items.length > 1 ? items[items.length - 2] : null;

  const handleItemClick = (item: BreadcrumbItem, index: number, event: React.MouseEvent) => {
    if (onItemClick) {
      event.preventDefault();
      onItemClick(item, index);
    }
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm', className)}
    >
      {parentItem && (
        <>
          <a
            href={parentItem.href}
            onClick={(e) => handleItemClick(parentItem, items.length - 2, e)}
            className={cn(
              'flex items-center space-x-1 px-2 py-1 rounded-lg',
              'text-text-secondary hover:text-text-primary',
              'hover:bg-navy-700/50 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-neon-500/50'
            )}
          >
            {parentItem.icon && (
              <span className="text-neon-400">{parentItem.icon}</span>
            )}
            <span>{parentItem.label}</span>
          </a>
          <ChevronRight className="w-4 h-4 text-text-tertiary" />
        </>
      )}
      
      <span className="flex items-center space-x-1 text-text-primary font-medium">
        {currentItem.icon && (
          <span className="text-neon-400">{currentItem.icon}</span>
        )}
        <span>{currentItem.label}</span>
      </span>
    </nav>
  );
};

// Breadcrumb with dropdown for overflow items
interface DropdownBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

const DropdownBreadcrumb: React.FC<DropdownBreadcrumbProps> = ({
  items,
  className,
  onItemClick,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  if (items.length <= 3) {
    return (
      <Breadcrumb
        items={items}
        className={className}
        onItemClick={onItemClick}
      />
    );
  }

  const firstItem = items[0];
  const lastTwoItems = items.slice(-2);
  const middleItems = items.slice(1, -2);

  const handleItemClick = (item: BreadcrumbItem, index: number, event: React.MouseEvent) => {
    if (onItemClick) {
      event.preventDefault();
      onItemClick(item, index);
    }
    setIsOpen(false);
  };

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      <ol className="flex items-center space-x-1">
        {/* First item */}
        <li className="flex items-center">
          <a
            href={firstItem.href}
            onClick={(e) => handleItemClick(firstItem, 0, e)}
            className={cn(
              'flex items-center space-x-1 px-2 py-1 rounded-lg',
              'text-text-secondary hover:text-text-primary',
              'hover:bg-navy-700/50 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-neon-500/50'
            )}
          >
            {firstItem.icon && (
              <span className="text-neon-400">{firstItem.icon}</span>
            )}
            <span>{firstItem.label}</span>
          </a>
          <ChevronRight className="mx-2 w-4 h-4 text-text-tertiary" />
        </li>

        {/* Dropdown for middle items */}
        {middleItems.length > 0 && (
          <li className="relative flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                'px-2 py-1 rounded-lg text-text-secondary hover:text-text-primary',
                'hover:bg-navy-700/50 transition-all duration-200',
                'focus:outline-none focus:ring-2 focus:ring-neon-500/50'
              )}
            >
              ...
            </button>
            
            {isOpen && (
              <div className={cn(
                'absolute top-full left-0 mt-1 py-1 z-50',
                'bg-bg-secondary border border-navy-700 rounded-xl shadow-premium',
                'min-w-[200px]'
              )}>
                {middleItems.map((item, index) => (
                  <a
                    key={`middle-${index}`}
                    href={item.href}
                    onClick={(e) => handleItemClick(item, index + 1, e)}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2',
                      'text-text-secondary hover:text-text-primary',
                      'hover:bg-navy-700/50 transition-all duration-200'
                    )}
                  >
                    {item.icon && (
                      <span className="text-neon-400">{item.icon}</span>
                    )}
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            )}
            
            <ChevronRight className="mx-2 w-4 h-4 text-text-tertiary" />
          </li>
        )}

        {/* Last two items */}
        {lastTwoItems.map((item, index) => {
          const actualIndex = items.length - 2 + index;
          const isLast = index === lastTwoItems.length - 1;
          
          return (
            <li key={`last-${index}`} className="flex items-center">
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  onClick={(e) => handleItemClick(item, actualIndex, e)}
                  className={cn(
                    'flex items-center space-x-1 px-2 py-1 rounded-lg',
                    'text-text-secondary hover:text-text-primary',
                    'hover:bg-navy-700/50 transition-all duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-neon-500/50'
                  )}
                >
                  {item.icon && (
                    <span className="text-neon-400">{item.icon}</span>
                  )}
                  <span>{item.label}</span>
                </a>
              ) : (
                <span className={cn(
                  'flex items-center space-x-1 px-2 py-1',
                  isLast ? 'text-text-primary font-medium' : 'text-text-secondary'
                )}>
                  {item.icon && (
                    <span className={cn(
                      isLast ? 'text-neon-400' : 'text-text-tertiary'
                    )}>
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </span>
              )}
              
              {!isLast && (
                <ChevronRight className="mx-2 w-4 h-4 text-text-tertiary" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export { Breadcrumb, CompactBreadcrumb, DropdownBreadcrumb };
export type { BreadcrumbProps, BreadcrumbItem, CompactBreadcrumbProps, DropdownBreadcrumbProps };