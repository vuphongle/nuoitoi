import type { AnchorHTMLAttributes, ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function LixiShell({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('lixi-shell', className)} {...props} />;
}

interface LixiSectionProps extends HTMLAttributes<HTMLElement> {
  tone?: 'canvas' | 'soft' | 'accent';
}

export function LixiSection({ className, tone = 'canvas', ...props }: LixiSectionProps) {
  return <section className={cn('lixi-section', `lixi-section-${tone}`, className)} {...props} />;
}

interface LixiSectionHeadingProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  align?: 'left' | 'center';
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  titleId?: string;
}

export function LixiSectionHeading({
  align = 'left',
  className,
  description,
  eyebrow,
  title,
  titleId,
  ...props
}: LixiSectionHeadingProps) {
  return (
    <div
      className={cn('lixi-section-heading', `lixi-section-heading-${align}`, className)}
      {...props}
    >
      {eyebrow ? <p className="lixi-eyebrow">{eyebrow}</p> : null}
      <h2 id={titleId}>{title}</h2>
      {description ? <p className="lixi-section-description">{description}</p> : null}
    </div>
  );
}

interface LixiSurfaceProps extends HTMLAttributes<HTMLElement> {
  as?: 'article' | 'div';
  variant?: 'card' | 'panel' | 'inset';
}

export function LixiSurface({
  as: Component = 'div',
  className,
  variant = 'card',
  ...props
}: LixiSurfaceProps) {
  return (
    <Component className={cn('lixi-surface', `lixi-surface-${variant}`, className)} {...props} />
  );
}

type LixiActionVariant = 'primary' | 'secondary' | 'ghost';

interface LixiActionLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: LixiActionVariant;
}

export function LixiActionLink({ className, variant = 'primary', ...props }: LixiActionLinkProps) {
  return <a className={cn('lixi-action', `lixi-action-${variant}`, className)} {...props} />;
}

interface LixiActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: LixiActionVariant;
}

export function LixiActionButton({
  className,
  type = 'button',
  variant = 'primary',
  ...props
}: LixiActionButtonProps) {
  return (
    <button
      className={cn('lixi-action', `lixi-action-${variant}`, className)}
      type={type}
      {...props}
    />
  );
}

interface LixiIconTileProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: 'amber' | 'blue' | 'green' | 'coral';
}

export function LixiIconTile({ className, tone = 'amber', ...props }: LixiIconTileProps) {
  return <span className={cn('lixi-icon-tile', `lixi-icon-tile-${tone}`, className)} {...props} />;
}
