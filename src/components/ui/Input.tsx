import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, leftIcon, rightIcon, variant = 'default', ...props }, ref) => {
    const inputVariants = {
      default: 'bg-white border-gray-300 focus:border-primary-500 focus:ring-primary-500',
      filled: 'bg-gray-50 border-gray-300 focus:bg-white focus:border-primary-500 focus:ring-primary-500',
    };

    const errorClasses = error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-400 w-5 h-5">
                {leftIcon}
              </span>
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              'flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-all duration-fast',
              'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:opacity-50',
              inputVariants[variant],
              errorClasses,
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            ref={ref}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-400 w-5 h-5">
                {rightIcon}
              </span>
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <div className="mt-1">
            {error && (
              <p className="text-sm text-error-600 animate-shake">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p className="text-sm text-gray-500">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input; 