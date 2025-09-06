import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Star, Heart, ThumbsUp, Share2, Bookmark, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Tooltip } from './Tooltip';

// Interactive rating component
interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
  allowHalf?: boolean;
  className?: string;
}

const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  allowHalf = false,
  className,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const [isHovering, setIsHovering] = useState(false);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = (starValue: number) => {
    if (readonly || !onChange) return;
    onChange(starValue);
  };

  const handleMouseEnter = (starValue: number) => {
    if (readonly) return;
    setHoverValue(starValue);
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
    setIsHovering(false);
  };

  const getStarFill = (starIndex: number) => {
    const currentValue = isHovering && hoverValue !== null ? hoverValue : value;
    
    if (allowHalf) {
      if (currentValue >= starIndex) return 'full';
      if (currentValue >= starIndex - 0.5) return 'half';
      return 'empty';
    }
    
    return currentValue >= starIndex ? 'full' : 'empty';
  };

  return (
    <div className={cn('flex items-center space-x-1', className)}>
      {Array.from({ length: max }, (_, index) => {
        const starIndex = index + 1;
        const fill = getStarFill(starIndex);
        
        return (
          <button
            key={index}
            type="button"
            disabled={readonly}
            onClick={() => handleClick(starIndex)}
            onMouseEnter={() => handleMouseEnter(starIndex)}
            onMouseLeave={handleMouseLeave}
            className={cn(
              'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-neon-500/20 rounded',
              !readonly && 'hover:scale-110 cursor-pointer',
              readonly && 'cursor-default'
            )}
            aria-label={`Rate ${starIndex} out of ${max} stars`}
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors duration-200',
                fill === 'full' && 'fill-yellow-400 text-yellow-400',
                fill === 'half' && 'fill-yellow-400/50 text-yellow-400',
                fill === 'empty' && 'text-navy-600 hover:text-yellow-400/50'
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

// Like button with animation
interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'heart' | 'thumbs';
  showCount?: boolean;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  liked,
  onToggle,
  count,
  size = 'md',
  variant = 'heart',
  showCount = true,
  className,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = () => {
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 300);
  };

  const IconComponent = variant === 'heart' ? Heart : ThumbsUp;

  return (
    <Tooltip content={liked ? 'Unlike' : 'Like'}>
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200',
          'hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-neon-500/20',
          'group',
          className
        )}
        aria-label={`${liked ? 'Unlike' : 'Like'} this item`}
      >
        <IconComponent
          className={cn(
            iconSizeClasses[size],
            'transition-all duration-200',
            liked && 'fill-red-500 text-red-500',
            !liked && 'text-text-tertiary group-hover:text-red-400',
            isAnimating && 'animate-bounce scale-125'
          )}
        />
        
        {showCount && count !== undefined && (
          <span className={cn(
            sizeClasses[size],
            'font-medium transition-colors duration-200',
            liked ? 'text-red-500' : 'text-text-secondary group-hover:text-text-primary'
          )}>
            {count.toLocaleString()}
          </span>
        )}
      </button>
    </Tooltip>
  );
};

// Share button with dropdown
interface ShareButtonProps {
  url: string;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
  url,
  title = 'Check this out!',
  size = 'md',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      action: copyToClipboard,
      color: copied ? 'text-green-400' : 'text-text-secondary',
    },
    {
      name: 'Twitter',
      icon: Share2,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank'),
      color: 'text-blue-400',
    },
    {
      name: 'Facebook',
      icon: Share2,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank'),
      color: 'text-blue-600',
    },
  ];

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <Tooltip content="Share">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'p-2 rounded-lg transition-all duration-200',
            'text-text-tertiary hover:text-text-primary hover:bg-navy-700',
            'focus:outline-none focus:ring-2 focus:ring-neon-500/20'
          )}
          aria-label="Share options"
          aria-expanded={isOpen}
        >
          <Share2 className={iconSizeClasses[size]} />
        </button>
      </Tooltip>

      {isOpen && (
        <div className={cn(
          'absolute right-0 mt-2 w-48 py-2 bg-navy-800 border border-navy-600 rounded-lg shadow-xl z-50',
          'animate-in slide-in-from-top-2 duration-200'
        )}>
          {shareOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <button
                key={option.name}
                onClick={() => {
                  option.action();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center space-x-3 px-4 py-2 text-left',
                  'hover:bg-navy-700 transition-colors duration-200'
                )}
              >
                <IconComponent className={cn('w-4 h-4', option.color)} />
                <span className="text-text-primary">{option.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Bookmark button
interface BookmarkButtonProps {
  bookmarked: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  bookmarked,
  onToggle,
  size = 'md',
  className,
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const handleClick = () => {
    setIsAnimating(true);
    onToggle();
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <Tooltip content={bookmarked ? 'Remove bookmark' : 'Add bookmark'}>
      <button
        onClick={handleClick}
        className={cn(
          'p-2 rounded-lg transition-all duration-200',
          'hover:bg-navy-700 focus:outline-none focus:ring-2 focus:ring-neon-500/20',
          className
        )}
        aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        <Bookmark
          className={cn(
            iconSizeClasses[size],
            'transition-all duration-200',
            bookmarked && 'fill-neon-500 text-neon-500',
            !bookmarked && 'text-text-tertiary hover:text-neon-400',
            isAnimating && 'animate-pulse scale-110'
          )}
        />
      </button>
    </Tooltip>
  );
};

// Visibility toggle
interface VisibilityToggleProps {
  visible: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
  visible,
  onToggle,
  size = 'md',
  className,
}) => {
  const iconSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const IconComponent = visible ? Eye : EyeOff;

  return (
    <Tooltip content={visible ? 'Hide' : 'Show'}>
      <button
        onClick={onToggle}
        className={cn(
          'p-2 rounded-lg transition-all duration-200',
          'text-text-tertiary hover:text-text-primary hover:bg-navy-700',
          'focus:outline-none focus:ring-2 focus:ring-neon-500/20',
          className
        )}
        aria-label={visible ? 'Hide content' : 'Show content'}
      >
        <IconComponent className={iconSizeClasses[size]} />
      </button>
    </Tooltip>
  );
};

// Expandable content
interface ExpandableProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

const Expandable: React.FC<ExpandableProps> = ({
  title,
  children,
  defaultExpanded = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className={cn('border border-navy-600 rounded-lg overflow-hidden', className)}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'w-full flex items-center justify-between p-4',
          'bg-navy-800 hover:bg-navy-700 transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-neon-500/20'
        )}
        aria-expanded={isExpanded}
      >
        <span className="font-medium text-text-primary">{title}</span>
        
        <div className="transition-transform duration-200">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-text-secondary" />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-secondary" />
          )}
        </div>
      </button>
      
      <div
        ref={contentRef}
        className={cn(
          'overflow-hidden transition-all duration-300 ease-in-out',
          isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="p-4 bg-navy-900">
          {children}
        </div>
      </div>
    </div>
  );
};

// Interactive card with hover effects
interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  hoverable?: boolean;
  pressable?: boolean;
  className?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  onClick,
  hoverable = true,
  pressable = true,
  className,
}) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseDown={() => pressable && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={cn(
        'rounded-lg border border-navy-600 bg-navy-800 transition-all duration-200',
        hoverable && 'hover:border-navy-500 hover:shadow-lg hover:shadow-neon-500/10',
        pressable && isPressed && 'scale-98 shadow-inner',
        onClick && 'cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-neon-500/20',
        className
      )}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      {children}
    </div>
  );
};

export {
  Rating,
  LikeButton,
  ShareButton,
  BookmarkButton,
  VisibilityToggle,
  Expandable,
  InteractiveCard,
};

export type {
  RatingProps,
  LikeButtonProps,
  ShareButtonProps,
  BookmarkButtonProps,
  VisibilityToggleProps,
  ExpandableProps,
  InteractiveCardProps,
};