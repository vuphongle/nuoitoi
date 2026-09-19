import React from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonWithIconProps {
  children: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export function ButtonWithIcon({
  children,
  icon: Icon,
  iconPosition = 'right',
  variant = 'default',
  size = 'default',
  className,
  onClick,
  disabled,
  type = 'button',
}: ButtonWithIconProps) {
  return (
    <Button
      type={type}
      size={size}
      variant={variant}
      className={cn('group transition-all duration-300', className)}
      onClick={onClick}
      disabled={disabled}
    >
      {Icon && iconPosition === 'left' && (
        <Icon className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
      )}
    </Button>
  );
}
