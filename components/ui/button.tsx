import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 admin:cursor-pointer admin:rounded-xl admin:not-disabled:hover:brightness-95 admin:not-disabled:active:scale-[0.98] admin:not-disabled:active:brightness-90 admin:focus-visible:ring-ring admin:focus-visible:ring-offset-background admin:disabled:pointer-events-auto admin:disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground admin:shadow-none',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground admin:shadow-none',
        link: 'text-primary underline-offset-4 hover:underline admin:shadow-none',
      },
      size: {
        default: 'h-10 px-4 py-2 admin:h-11 admin:md:h-10',
        sm: 'h-9 rounded-md px-3 text-xs admin:h-11 admin:rounded-xl admin:md:h-10',
        lg: 'h-11 rounded-md px-8 admin:h-12 admin:rounded-xl admin:md:h-11',
        icon: 'h-10 w-10 admin:h-11 admin:w-11 admin:p-0 admin:md:h-10 admin:md:w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
