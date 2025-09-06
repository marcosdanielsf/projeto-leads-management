import React from 'react';
import { cn } from '../../lib/utils';

// Breakpoint system
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

interface GridProps {
  children: React.ReactNode;
  cols?: ResponsiveValue<number>;
  gap?: ResponsiveValue<number>;
  rows?: ResponsiveValue<number>;
  autoRows?: ResponsiveValue<string>;
  autoCols?: ResponsiveValue<string>;
  flow?: ResponsiveValue<'row' | 'col' | 'row-dense' | 'col-dense'>;
  className?: string;
}

interface GridItemProps {
  children: React.ReactNode;
  colSpan?: ResponsiveValue<number>;
  rowSpan?: ResponsiveValue<number>;
  colStart?: ResponsiveValue<number>;
  colEnd?: ResponsiveValue<number>;
  rowStart?: ResponsiveValue<number>;
  rowEnd?: ResponsiveValue<number>;
  order?: ResponsiveValue<number>;
  className?: string;
}

// Utility function to generate responsive classes
const generateResponsiveClasses = <T extends string | number>(
  value: ResponsiveValue<T> | undefined,
  prefix: string,
  transform?: (val: T) => string
): string[] => {
  if (!value) return [];
  
  const classes: string[] = [];
  
  if (typeof value === 'object' && value !== null) {
    Object.entries(value).forEach(([breakpoint, val]) => {
      if (val !== undefined) {
        const transformedVal = transform ? transform(val as T) : val;
        const breakpointPrefix = breakpoint === 'xs' ? '' : `${breakpoint}:`;
        classes.push(`${breakpointPrefix}${prefix}-${transformedVal}`);
      }
    });
  } else if (value !== undefined) {
    const transformedVal = transform ? transform(value as T) : value;
    classes.push(`${prefix}-${transformedVal}`);
  }
  
  return classes;
};

// Grid component
const Grid: React.FC<GridProps> = ({
  children,
  cols = 12,
  gap = 4,
  rows,
  autoRows,
  autoCols,
  flow = 'row',
  className,
}) => {
  const gridClasses = cn(
    'grid',
    
    // Columns
    ...generateResponsiveClasses(cols, 'grid-cols'),
    
    // Gap
    ...generateResponsiveClasses(gap, 'gap'),
    
    // Rows
    ...generateResponsiveClasses(rows, 'grid-rows'),
    
    // Auto rows
    ...generateResponsiveClasses(autoRows, 'auto-rows', (val) => `[${val}]`),
    
    // Auto cols
    ...generateResponsiveClasses(autoCols, 'auto-cols', (val) => `[${val}]`),
    
    // Flow
    ...generateResponsiveClasses(flow, 'grid-flow'),
    
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

// Grid item component
const GridItem: React.FC<GridItemProps> = ({
  children,
  colSpan,
  rowSpan,
  colStart,
  colEnd,
  rowStart,
  rowEnd,
  order,
  className,
}) => {
  const itemClasses = cn(
    // Column span
    ...generateResponsiveClasses(colSpan, 'col-span'),
    
    // Row span
    ...generateResponsiveClasses(rowSpan, 'row-span'),
    
    // Column start
    ...generateResponsiveClasses(colStart, 'col-start'),
    
    // Column end
    ...generateResponsiveClasses(colEnd, 'col-end'),
    
    // Row start
    ...generateResponsiveClasses(rowStart, 'row-start'),
    
    // Row end
    ...generateResponsiveClasses(rowEnd, 'row-end'),
    
    // Order
    ...generateResponsiveClasses(order, 'order'),
    
    className
  );

  return (
    <div className={itemClasses}>
      {children}
    </div>
  );
};

// Container component with responsive padding and max-width
interface ContainerProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: ResponsiveValue<number>;
  center?: boolean;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  padding = { xs: 4, sm: 6, lg: 8 },
  center = true,
  className,
}) => {
  const sizeClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-full',
  };

  const containerClasses = cn(
    'w-full',
    sizeClasses[size],
    center && 'mx-auto',
    ...generateResponsiveClasses(padding, 'px'),
    className
  );

  return (
    <div className={containerClasses}>
      {children}
    </div>
  );
};

// Flex component with responsive properties
interface FlexProps {
  children: React.ReactNode;
  direction?: ResponsiveValue<'row' | 'col' | 'row-reverse' | 'col-reverse'>;
  wrap?: ResponsiveValue<'wrap' | 'nowrap' | 'wrap-reverse'>;
  justify?: ResponsiveValue<'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'>;
  align?: ResponsiveValue<'start' | 'end' | 'center' | 'baseline' | 'stretch'>;
  gap?: ResponsiveValue<number>;
  className?: string;
}

const Flex: React.FC<FlexProps> = ({
  children,
  direction = 'row',
  wrap = 'wrap',
  justify = 'start',
  align = 'start',
  gap = 0,
  className,
}) => {
  const flexClasses = cn(
    'flex',
    
    // Direction
    ...generateResponsiveClasses(direction, 'flex'),
    
    // Wrap
    ...generateResponsiveClasses(wrap, 'flex'),
    
    // Justify
    ...generateResponsiveClasses(justify, 'justify'),
    
    // Align
    ...generateResponsiveClasses(align, 'items'),
    
    // Gap
    ...generateResponsiveClasses(gap, 'gap'),
    
    className
  );

  return (
    <div className={flexClasses}>
      {children}
    </div>
  );
};

// Stack component for vertical layouts
interface StackProps {
  children: React.ReactNode;
  spacing?: ResponsiveValue<number>;
  align?: ResponsiveValue<'start' | 'end' | 'center' | 'stretch'>;
  className?: string;
}

const Stack: React.FC<StackProps> = ({
  children,
  spacing = 4,
  align = 'stretch',
  className,
}) => {
  const stackClasses = cn(
    'flex flex-col',
    ...generateResponsiveClasses(spacing, 'space-y'),
    ...generateResponsiveClasses(align, 'items'),
    className
  );

  return (
    <div className={stackClasses}>
      {children}
    </div>
  );
};

// Responsive visibility utilities
interface ShowProps {
  children: React.ReactNode;
  above?: Breakpoint;
  below?: Breakpoint;
  only?: Breakpoint | Breakpoint[];
}

const Show: React.FC<ShowProps> = ({ children, above, below, only }) => {
  let classes = '';
  
  if (above) {
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const index = breakpoints.indexOf(above);
    if (index > 0) {
      classes += ` hidden ${above}:block`;
    }
  }
  
  if (below) {
    classes += ` ${below}:hidden`;
  }
  
  if (only) {
    const breakpoints = Array.isArray(only) ? only : [only];
    classes = 'hidden';
    breakpoints.forEach(bp => {
      classes += ` ${bp}:block`;
    });
  }

  return (
    <div className={classes.trim()}>
      {children}
    </div>
  );
};

const Hide: React.FC<ShowProps> = ({ children, above, below, only }) => {
  let classes = 'block';
  
  if (above) {
    classes += ` ${above}:hidden`;
  }
  
  if (below) {
    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'];
    const index = breakpoints.indexOf(below);
    if (index > 0) {
      classes += ` hidden ${below}:block`;
    }
  }
  
  if (only) {
    const breakpoints = Array.isArray(only) ? only : [only];
    breakpoints.forEach(bp => {
      classes += ` ${bp}:hidden`;
    });
  }

  return (
    <div className={classes.trim()}>
      {children}
    </div>
  );
};

// Aspect ratio component
interface AspectRatioProps {
  children: React.ReactNode;
  ratio?: number | string;
  className?: string;
}

const AspectRatio: React.FC<AspectRatioProps> = ({
  children,
  ratio = '16/9',
  className,
}) => {
  const aspectRatioStyle = typeof ratio === 'number' 
    ? { aspectRatio: ratio }
    : { aspectRatio: ratio };

  return (
    <div 
      className={cn('relative w-full', className)}
      style={aspectRatioStyle}
    >
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  );
};

// Center component
interface CenterProps {
  children: React.ReactNode;
  inline?: boolean;
  className?: string;
}

const Center: React.FC<CenterProps> = ({
  children,
  inline = false,
  className,
}) => {
  const centerClasses = cn(
    inline ? 'inline-flex' : 'flex',
    'items-center justify-center',
    className
  );

  return (
    <div className={centerClasses}>
      {children}
    </div>
  );
};

export {
  Grid,
  GridItem,
  Container,
  Flex,
  Stack,
  Show,
  Hide,
  AspectRatio,
  Center,
};

export type {
  GridProps,
  GridItemProps,
  ContainerProps,
  FlexProps,
  StackProps,
  ShowProps,
  AspectRatioProps,
  CenterProps,
  Breakpoint,
  ResponsiveValue,
};