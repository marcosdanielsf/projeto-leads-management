import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: NavigationItem[];
  disabled?: boolean;
  onClick?: () => void;
}

interface NavigationProps {
  items: NavigationItem[];
  activeId?: string;
  variant?: 'horizontal' | 'vertical' | 'sidebar';
  size?: 'sm' | 'md' | 'lg';
  showIcons?: boolean;
  showBadges?: boolean;
  collapsible?: boolean;
  collapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
  onItemClick?: (item: NavigationItem) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  items,
  activeId,
  variant = 'horizontal',
  size = 'md',
  showIcons = true,
  showBadges = true,
  collapsible = false,
  collapsed: controlledCollapsed,
  onCollapseChange,
  className,
  itemClassName,
  activeClassName,
  onItemClick,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Set<string>>(new Set());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;

  // Handle collapse change
  const handleCollapseChange = (newCollapsed: boolean) => {
    if (controlledCollapsed === undefined) {
      setInternalCollapsed(newCollapsed);
    }
    onCollapseChange?.(newCollapsed);
  };

  // Toggle dropdown
  const toggleDropdown = (itemId: string) => {
    setOpenDropdowns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  // Handle item click
  const handleItemClick = (item: NavigationItem, event?: React.MouseEvent) => {
    if (item.disabled) return;

    if (item.children && item.children.length > 0) {
      event?.preventDefault();
      toggleDropdown(item.id);
    } else {
      onItemClick?.(item);
      item.onClick?.();
      setMobileMenuOpen(false);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const clickedOutside = Array.from(dropdownRefs.current.values()).every(
        ref => !ref.contains(event.target as Node)
      );
      
      if (clickedOutside) {
        setOpenDropdowns(new Set());
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Size classes
  const sizeClasses = {
    sm: {
      item: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      badge: 'text-xs px-1.5 py-0.5',
    },
    md: {
      item: 'px-4 py-3 text-sm',
      icon: 'w-5 h-5',
      badge: 'text-xs px-2 py-1',
    },
    lg: {
      item: 'px-6 py-4 text-base',
      icon: 'w-6 h-6',
      badge: 'text-sm px-2.5 py-1',
    },
  };

  // Variant classes
  const variantClasses = {
    horizontal: {
      container: 'flex items-center space-x-1',
      item: 'rounded-lg transition-all duration-200',
      dropdown: 'absolute top-full left-0 mt-1 min-w-48 z-50',
    },
    vertical: {
      container: 'flex flex-col space-y-1',
      item: 'rounded-lg transition-all duration-200',
      dropdown: 'ml-4 mt-1 space-y-1',
    },
    sidebar: {
      container: 'flex flex-col space-y-1',
      item: 'rounded-lg transition-all duration-200',
      dropdown: 'ml-6 mt-1 space-y-1',
    },
  };

  // Render navigation item
  const renderItem = (item: NavigationItem, level = 0) => {
    const isActive = activeId === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = openDropdowns.has(item.id);
    const isNested = level > 0;

    const itemClasses = cn(
      // Base styles
      'flex items-center justify-between group relative',
      'hover:bg-navy-700/50 focus:outline-none focus:bg-navy-700/50',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      
      // Size
      sizeClasses[size].item,
      
      // Variant
      variantClasses[variant].item,
      
      // Active state
      isActive && [
        'bg-neon-500/10 text-neon-400 border-l-2 border-neon-500',
        activeClassName,
      ],
      
      // Disabled state
      item.disabled && 'opacity-50 cursor-not-allowed',
      
      // Nested item
      isNested && 'ml-4 text-sm',
      
      // Collapsed sidebar
      variant === 'sidebar' && isCollapsed && 'justify-center',
      
      itemClassName
    );

    const content = (
      <>
        <div className="flex items-center space-x-3">
          {/* Icon */}
          {showIcons && item.icon && (
            <div className={cn(
              'flex-shrink-0 transition-colors duration-200',
              sizeClasses[size].icon,
              isActive ? 'text-neon-400' : 'text-text-tertiary group-hover:text-text-secondary'
            )}>
              {item.icon}
            </div>
          )}
          
          {/* Label */}
          {(!isCollapsed || variant !== 'sidebar') && (
            <span className={cn(
              'font-medium transition-colors duration-200',
              isActive ? 'text-neon-400' : 'text-text-primary group-hover:text-text-primary'
            )}>
              {item.label}
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Badge */}
          {showBadges && item.badge && (!isCollapsed || variant !== 'sidebar') && (
            <span className={cn(
              'rounded-full bg-neon-500 text-navy-900 font-medium',
              sizeClasses[size].badge
            )}>
              {item.badge}
            </span>
          )}
          
          {/* Dropdown arrow */}
          {hasChildren && (!isCollapsed || variant !== 'sidebar') && (
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform duration-200',
              isDropdownOpen && 'rotate-180'
            )} />
          )}
        </div>
      </>
    );

    return (
      <div key={item.id} className="relative">
        {item.href ? (
          <a
            href={item.href}
            className={itemClasses}
            onClick={(e) => handleItemClick(item, e)}
            aria-expanded={hasChildren ? isDropdownOpen : undefined}
            aria-haspopup={hasChildren ? 'menu' : undefined}
          >
            {content}
          </a>
        ) : (
          <button
            type="button"
            className={itemClasses}
            onClick={(e) => handleItemClick(item, e)}
            disabled={item.disabled}
            aria-expanded={hasChildren ? isDropdownOpen : undefined}
            aria-haspopup={hasChildren ? 'menu' : undefined}
          >
            {content}
          </button>
        )}

        {/* Dropdown/Submenu */}
        {hasChildren && isDropdownOpen && (
          <div
            ref={(ref) => {
              if (ref) {
                dropdownRefs.current.set(item.id, ref);
              } else {
                dropdownRefs.current.delete(item.id);
              }
            }}
            className={cn(
              'bg-bg-secondary border border-navy-700 rounded-lg shadow-premium',
              'animate-in fade-in-0 slide-in-from-top-2 duration-200',
              variant === 'horizontal' ? variantClasses.horizontal.dropdown : variantClasses.vertical.dropdown
            )}
          >
            {item.children?.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  // Mobile menu toggle
  const MobileMenuToggle = () => (
    <button
      type="button"
      className={cn(
        'md:hidden flex items-center justify-center',
        'w-10 h-10 rounded-lg',
        'bg-navy-700/50 hover:bg-navy-700 transition-colors duration-200',
        'text-text-primary'
      )}
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      aria-label="Toggle mobile menu"
    >
      {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );

  // Collapse toggle for sidebar
  const CollapseToggle = () => (
    collapsible && variant === 'sidebar' && (
      <button
        type="button"
        className={cn(
          'flex items-center justify-center',
          'w-10 h-10 rounded-lg mb-4',
          'bg-navy-700/50 hover:bg-navy-700 transition-colors duration-200',
          'text-text-primary'
        )}
        onClick={() => handleCollapseChange(!isCollapsed)}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        <Menu className="w-5 h-5" />
      </button>
    )
  );

  // Container classes
  const containerClasses = cn(
    // Base styles
    'navigation',
    
    // Variant styles
    variantClasses[variant].container,
    
    // Responsive
    variant === 'horizontal' && [
      'hidden md:flex', // Hide on mobile, show on desktop
    ],
    
    // Sidebar specific
    variant === 'sidebar' && [
      'h-full p-4',
      isCollapsed ? 'w-16' : 'w-64',
      'transition-all duration-300',
    ],
    
    className
  );

  return (
    <>
      {/* Mobile menu toggle */}
      {variant === 'horizontal' && <MobileMenuToggle />}
      
      {/* Main navigation */}
      <nav className={containerClasses}>
        {/* Collapse toggle */}
        <CollapseToggle />
        
        {/* Navigation items */}
        {items.map(item => renderItem(item))}
      </nav>

      {/* Mobile menu overlay */}
      {variant === 'horizontal' && mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
          <div className="fixed top-0 right-0 h-full w-80 bg-bg-primary border-l border-navy-700 shadow-premium">
            <div className="flex items-center justify-between p-4 border-b border-navy-700">
              <h2 className="text-lg font-semibold text-text-primary">Menu</h2>
              <button
                type="button"
                className="w-8 h-8 rounded-lg bg-navy-700/50 hover:bg-navy-700 transition-colors duration-200 flex items-center justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="w-4 h-4 text-text-primary" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {items.map(item => renderItem(item))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { Navigation };
export type { NavigationProps, NavigationItem };