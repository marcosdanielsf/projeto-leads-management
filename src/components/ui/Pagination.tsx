import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  showPageNumbers?: boolean;
  showEllipsis?: boolean;
  siblingCount?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outlined' | 'minimal';
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
  activeClassName?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  showPrevNext = true,
  showPageNumbers = true,
  showEllipsis = true,
  siblingCount = 1,
  size = 'md',
  variant = 'default',
  disabled = false,
  className,
  itemClassName,
  activeClassName,
}) => {
  // Generate page numbers to display
  const generatePageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if total is 7 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of sibling range
      const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
      const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
      
      // Show left ellipsis if needed
      const shouldShowLeftEllipsis = leftSiblingIndex > 2;
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;
      
      if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        // No left ellipsis, show right ellipsis
        const leftItemCount = 3 + 2 * siblingCount;
        for (let i = 2; i <= leftItemCount; i++) {
          pages.push(i);
        }
        if (showEllipsis) pages.push('ellipsis');
        pages.push(totalPages);
      } else if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        // Show left ellipsis, no right ellipsis
        if (showEllipsis) pages.push('ellipsis');
        const rightItemCount = 3 + 2 * siblingCount;
        for (let i = totalPages - rightItemCount + 1; i <= totalPages - 1; i++) {
          pages.push(i);
        }
        pages.push(totalPages);
      } else {
        // Show both ellipses
        if (showEllipsis) pages.push('ellipsis');
        for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
          pages.push(i);
        }
        if (showEllipsis) pages.push('ellipsis');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  // Size classes
  const sizeClasses = {
    sm: {
      item: 'h-8 min-w-8 px-2 text-xs',
      icon: 'w-3 h-3',
    },
    md: {
      item: 'h-10 min-w-10 px-3 text-sm',
      icon: 'w-4 h-4',
    },
    lg: {
      item: 'h-12 min-w-12 px-4 text-base',
      icon: 'w-5 h-5',
    },
  };

  // Variant classes
  const variantClasses = {
    default: {
      item: [
        'bg-bg-tertiary border border-navy-700',
        'hover:bg-navy-700/50 hover:border-navy-600',
        'focus:bg-navy-700/50 focus:border-neon-500',
      ],
      active: 'bg-neon-500 border-neon-500 text-navy-900 hover:bg-neon-400',
      disabled: 'opacity-50 cursor-not-allowed hover:bg-bg-tertiary hover:border-navy-700',
    },
    outlined: {
      item: [
        'bg-transparent border-2 border-navy-600',
        'hover:border-navy-500 hover:bg-navy-700/20',
        'focus:border-neon-500 focus:bg-navy-700/20',
      ],
      active: 'border-neon-500 bg-neon-500/10 text-neon-400 hover:bg-neon-500/20',
      disabled: 'opacity-50 cursor-not-allowed hover:border-navy-600 hover:bg-transparent',
    },
    minimal: {
      item: [
        'bg-transparent border border-transparent',
        'hover:bg-navy-700/50',
        'focus:bg-navy-700/50',
      ],
      active: 'bg-neon-500/10 text-neon-400 border-neon-500/20',
      disabled: 'opacity-50 cursor-not-allowed hover:bg-transparent',
    },
  };

  // Base item classes
  const getItemClasses = (isActive = false, isDisabled = false) => {
    return cn(
      // Base styles
      'inline-flex items-center justify-center',
      'rounded-lg font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-neon-500/20',
      'text-text-primary',
      
      // Size
      sizeClasses[size].item,
      
      // Variant
      isActive
        ? variantClasses[variant].active
        : isDisabled
        ? variantClasses[variant].disabled
        : variantClasses[variant].item,
      
      // Custom classes
      itemClassName,
      isActive && activeClassName
    );
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (disabled || page < 1 || page > totalPages || page === currentPage) {
      return;
    }
    onPageChange(page);
  };

  // Navigation button component
  const NavButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
    'aria-label': string;
  }> = ({ onClick, disabled: buttonDisabled, children, 'aria-label': ariaLabel }) => (
    <button
      type="button"
      className={getItemClasses(false, disabled || buttonDisabled)}
      onClick={onClick}
      disabled={disabled || buttonDisabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );

  // Page number button component
  const PageButton: React.FC<{
    page: number;
    isActive?: boolean;
  }> = ({ page, isActive = false }) => (
    <button
      type="button"
      className={getItemClasses(isActive, disabled)}
      onClick={() => handlePageChange(page)}
      disabled={disabled}
      aria-label={`Go to page ${page}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {page}
    </button>
  );

  // Ellipsis component
  const Ellipsis: React.FC = () => (
    <div className={cn(
      'inline-flex items-center justify-center',
      sizeClasses[size].item,
      'text-text-tertiary'
    )}>
      <MoreHorizontal className={sizeClasses[size].icon} />
    </div>
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      className={cn(
        'flex items-center space-x-1',
        className
      )}
      role="navigation"
      aria-label="Pagination"
    >
      {/* First page button */}
      {showFirstLast && (
        <NavButton
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
          aria-label="Go to first page"
        >
          <ChevronsLeft className={sizeClasses[size].icon} />
        </NavButton>
      )}

      {/* Previous page button */}
      {showPrevNext && (
        <NavButton
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft className={sizeClasses[size].icon} />
        </NavButton>
      )}

      {/* Page numbers */}
      {showPageNumbers && pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return <Ellipsis key={`ellipsis-${index}`} />;
        }
        
        return (
          <PageButton
            key={page}
            page={page}
            isActive={page === currentPage}
          />
        );
      })}

      {/* Next page button */}
      {showPrevNext && (
        <NavButton
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight className={sizeClasses[size].icon} />
        </NavButton>
      )}

      {/* Last page button */}
      {showFirstLast && (
        <NavButton
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
          aria-label="Go to last page"
        >
          <ChevronsRight className={sizeClasses[size].icon} />
        </NavButton>
      )}
    </nav>
  );
};

// Pagination info component
interface PaginationInfoProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  className?: string;
}

const PaginationInfo: React.FC<PaginationInfoProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  className,
}) => {
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  return (
    <div className={cn('text-sm text-text-tertiary', className)}>
      {totalItems && itemsPerPage ? (
        <span>
          Showing {startItem} to {endItem} of {totalItems} results
        </span>
      ) : (
        <span>
          Page {currentPage} of {totalPages}
        </span>
      )}
    </div>
  );
};

export { Pagination, PaginationInfo };
export type { PaginationProps, PaginationInfoProps };