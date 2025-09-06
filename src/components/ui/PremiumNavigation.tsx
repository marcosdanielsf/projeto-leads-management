import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavigationItem {
  label: string;
  href?: string;
  onClick?: () => void;
  children?: NavigationItem[];
  icon?: React.ReactNode;
}

interface PremiumNavigationProps {
  items: NavigationItem[];
  logo?: React.ReactNode;
  variant?: 'glass' | 'glass-dark' | 'glass-neon' | 'solid';
  position?: 'fixed' | 'sticky' | 'static';
  className?: string;
}

const PremiumNavigation: React.FC<PremiumNavigationProps> = ({
  items,
  logo,
  variant = 'glass-dark',
  position = 'fixed',
  className
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const variantClasses = {
    glass: 'glass',
    'glass-dark': 'glass-dark',
    'glass-neon': 'glass-neon',
    solid: 'bg-navy-900/95 border-b border-white/10'
  };

  const positionClasses = {
    fixed: 'fixed top-0 left-0 right-0 z-40',
    sticky: 'sticky top-0 z-40',
    static: 'relative'
  };

  const NavigationLink: React.FC<{ item: NavigationItem; isMobile?: boolean }> = ({ 
    item, 
    isMobile = false 
  }) => {
    const hasChildren = item.children && item.children.length > 0;
    const isDropdownOpen = activeDropdown === item.label;

    const handleClick = () => {
      if (hasChildren) {
        setActiveDropdown(isDropdownOpen ? null : item.label);
      } else {
        item.onClick?.();
        if (isMobile) {
          setIsMobileMenuOpen(false);
        }
      }
    };

    return (
      <div className={cn('relative', isMobile && 'w-full')}>
        <button
          onClick={handleClick}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
            'text-white/80 hover:text-white hover:bg-white/10',
            'focus:outline-none focus:ring-2 focus:ring-white/20',
            isMobile && 'w-full justify-between text-left'
          )}
        >
          {item.icon && <span className="w-5 h-5">{item.icon}</span>}
          <span>{item.label}</span>
          {hasChildren && (
            <ChevronDown 
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isDropdownOpen && 'rotate-180'
              )} 
            />
          )}
        </button>

        {/* Dropdown Menu */}
        {hasChildren && isDropdownOpen && (
          <div className={cn(
            'absolute top-full left-0 mt-2 py-2 rounded-xl shadow-dropdown',
            'glass-dark border border-white/10',
            'min-w-48 z-50',
            isMobile && 'relative top-0 mt-0 shadow-none border-0 bg-white/5 ml-4'
          )}>
            {item.children?.map((child, index) => (
              <button
                key={index}
                onClick={() => {
                  child.onClick?.();
                  setActiveDropdown(null);
                  if (isMobile) setIsMobileMenuOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-white/80 hover:text-white',
                  'hover:bg-white/10 transition-colors duration-200',
                  'focus:outline-none focus:bg-white/10'
                )}
              >
                <div className="flex items-center gap-2">
                  {child.icon && <span className="w-4 h-4">{child.icon}</span>}
                  <span>{child.label}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className={cn(
      'w-full transition-all duration-300',
      positionClasses[position],
      variantClasses[variant],
      isScrolled && position === 'fixed' && 'shadow-floating',
      className
    )}>
      {/* Brand Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-neon-500/10 via-transparent to-primary-500/10 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            {logo || (
              <div className="text-xl font-bold text-white">
                Premium
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {items.map((item, index) => (
              <NavigationLink key={index} item={item} />
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'p-2 rounded-lg text-white/80 hover:text-white',
                'hover:bg-white/10 transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-white/20'
              )}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className={cn(
            'md:hidden py-4 border-t border-white/10',
            'animate-slide-down'
          )}>
            <div className="space-y-2">
              {items.map((item, index) => (
                <NavigationLink key={index} item={item} isMobile />
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default PremiumNavigation;