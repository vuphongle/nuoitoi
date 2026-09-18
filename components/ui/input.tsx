import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      id,
      'aria-describedby': ariaDescribedBy,
      'aria-errormessage': ariaErrorMessage,
      ...props
    },
    ref
  ) => {
    const generatedErrorId = error && id ? `${id}-error` : undefined;
    const errorId = ariaErrorMessage || generatedErrorId;
    const describedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full">
        <input
          type={type}
          id={id}
          aria-describedby={describedBy}
          aria-errormessage={error ? errorId : undefined}
          className={cn(
            'flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background transition-colors duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:h-10',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1 text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input };
