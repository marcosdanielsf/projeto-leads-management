import React, { createContext, useContext, useId } from 'react';
import { cn } from '../../lib/utils';
import { AccessibleField } from './Accessibility';

// Form context
interface FormContextValue {
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
}

const FormContext = createContext<FormContextValue | null>(null);

const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('Form components must be used within a Form');
  }
  return context;
};

// Form component
interface FormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  errors?: Record<string, string>;
  touched?: Record<string, boolean>;
  isSubmitting?: boolean;
  className?: string;
  noValidate?: boolean;
}

const Form: React.FC<FormProps> = ({
  children,
  onSubmit,
  errors = {},
  touched = {},
  isSubmitting = false,
  className,
  noValidate = true,
}) => {
  const contextValue: FormContextValue = {
    errors,
    touched,
    isSubmitting,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        onSubmit={onSubmit}
        noValidate={noValidate}
        className={cn('space-y-6', className)}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
};

// Form field component
interface FormFieldProps {
  name: string;
  label: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  description,
  required = false,
  children,
  className,
}) => {
  const { errors, touched } = useFormContext();
  const error = touched[name] ? errors[name] : undefined;

  return (
    <AccessibleField
      label={label}
      description={description}
      error={error}
      required={required}
      className={className}
    >
      {React.cloneElement(children as React.ReactElement, {
        name,
        'aria-invalid': error ? 'true' : undefined,
      })}
    </AccessibleField>
  );
};

// Input component
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'filled' | 'flushed';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

const Input: React.FC<InputProps> = ({
  size = 'md',
  variant = 'default',
  leftIcon,
  rightIcon,
  error,
  className,
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  };

  const variantClasses = {
    default: [
      'border border-navy-600 bg-bg-tertiary',
      'focus:border-neon-500 focus:bg-bg-secondary',
      'hover:border-navy-500',
    ],
    filled: [
      'border-0 bg-navy-700',
      'focus:bg-navy-600',
      'hover:bg-navy-650',
    ],
    flushed: [
      'border-0 border-b-2 border-navy-600 bg-transparent rounded-none',
      'focus:border-neon-500',
      'hover:border-navy-500',
    ],
  };

  const inputClasses = cn(
    // Base styles
    'w-full rounded-lg font-medium transition-all duration-200',
    'text-text-primary placeholder:text-text-tertiary',
    'focus:outline-none focus:ring-2 focus:ring-neon-500/20',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    
    // Size
    sizeClasses[size],
    
    // Variant
    variantClasses[variant],
    
    // Error state
    error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
    
    // Icon padding
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    
    className
  );

  if (leftIcon || rightIcon) {
    return (
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {leftIcon}
          </div>
        )}
        
        <input
          className={inputClasses}
          disabled={disabled}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }

  return (
    <input
      className={inputClasses}
      disabled={disabled}
      {...props}
    />
  );
};

// Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  error?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  resize = 'vertical',
  error,
  className,
  disabled,
  ...props
}) => {
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
  };

  return (
    <textarea
      className={cn(
        // Base styles
        'w-full min-h-20 px-4 py-3 rounded-lg',
        'border border-navy-600 bg-bg-tertiary',
        'text-text-primary placeholder:text-text-tertiary',
        'focus:outline-none focus:ring-2 focus:ring-neon-500/20',
        'focus:border-neon-500 focus:bg-bg-secondary',
        'hover:border-navy-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transition-all duration-200',
        
        // Resize
        resizeClasses[resize],
        
        // Error state
        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
        
        className
      )}
      disabled={disabled}
      {...props}
    />
  );
};

// Select component
interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  error?: boolean;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({
  size = 'md',
  error,
  placeholder,
  className,
  disabled,
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-base',
  };

  return (
    <div className="relative">
      <select
        className={cn(
          // Base styles
          'w-full rounded-lg appearance-none',
          'border border-navy-600 bg-bg-tertiary',
          'text-text-primary',
          'focus:outline-none focus:ring-2 focus:ring-neon-500/20',
          'focus:border-neon-500 focus:bg-bg-secondary',
          'hover:border-navy-500',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200',
          'pr-10', // Space for arrow
          
          // Size
          sizeClasses[size],
          
          // Error state
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          
          className
        )}
        disabled={disabled}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      
      {/* Custom arrow */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

// Checkbox component
interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  error?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  size = 'md',
  label,
  description,
  error,
  className,
  disabled,
  id,
  ...props
}) => {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="flex items-center">
        <input
          type="checkbox"
          id={checkboxId}
          className={cn(
            // Base styles
            'rounded border-2 border-navy-600 bg-bg-tertiary',
            'text-neon-500 focus:ring-2 focus:ring-neon-500/20',
            'focus:border-neon-500',
            'hover:border-navy-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            
            // Size
            sizeClasses[size],
            
            // Error state
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          )}
          disabled={disabled}
          {...props}
        />
      </div>
      
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'block font-medium text-text-primary cursor-pointer',
                labelSizeClasses[size],
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {label}
            </label>
          )}
          
          {description && (
            <p className={cn(
              'text-text-tertiary mt-1',
              size === 'sm' ? 'text-xs' : 'text-xs'
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Radio component
interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  error?: boolean;
}

const Radio: React.FC<RadioProps> = ({
  size = 'md',
  label,
  description,
  error,
  className,
  disabled,
  id,
  ...props
}) => {
  const generatedId = useId();
  const radioId = id || generatedId;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div className="flex items-center">
        <input
          type="radio"
          id={radioId}
          className={cn(
            // Base styles
            'border-2 border-navy-600 bg-bg-tertiary',
            'text-neon-500 focus:ring-2 focus:ring-neon-500/20',
            'focus:border-neon-500',
            'hover:border-navy-500',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-all duration-200',
            
            // Size
            sizeClasses[size],
            
            // Error state
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
          )}
          disabled={disabled}
          {...props}
        />
      </div>
      
      {(label || description) && (
        <div className="flex-1">
          {label && (
            <label
              htmlFor={radioId}
              className={cn(
                'block font-medium text-text-primary cursor-pointer',
                labelSizeClasses[size],
                disabled && 'cursor-not-allowed opacity-50'
              )}
            >
              {label}
            </label>
          )}
          
          {description && (
            <p className={cn(
              'text-text-tertiary mt-1',
              size === 'sm' ? 'text-xs' : 'text-xs'
            )}>
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

// Form group for radio buttons
interface RadioGroupProps {
  children: React.ReactNode;
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  children,
  name,
  value,
  onChange,
  className,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={cn('space-y-3', className)} role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Radio) {
          return React.cloneElement(child as React.ReactElement<RadioProps>, {
            name,
            checked: child.props.value === value,
            onChange: handleChange,
          });
        }
        return child;
      })}
    </div>
  );
};

export {
  Form,
  FormField,
  Input,
  Textarea,
  Select,
  Checkbox,
  Radio,
  RadioGroup,
  useFormContext,
};

export type {
  FormProps,
  FormFieldProps,
  InputProps,
  TextareaProps,
  SelectProps,
  CheckboxProps,
  RadioProps,
  RadioGroupProps,
};