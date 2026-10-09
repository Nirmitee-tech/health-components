import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from '../../internal/cx';
import { Icon, type IconName } from '../Icon/Icon';
import { Spinner } from '../Spinner/Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'danger' | 'danger-solid' | 'link' | 'ai';
export type ButtonSize = 'sm' | 'md' | 'lg';

/** Maps a variant to its CSS class. Shared with SplitButton. */
export const buttonVariantClass: Record<ButtonVariant, string> = {
  primary: 'co-btn-pri',
  secondary: 'co-btn-sec',
  tertiary: 'co-btn-ghost',
  ghost: 'co-btn-ghost',
  danger: 'co-btn-dng',
  'danger-solid': 'co-btn-dngs',
  link: 'co-btn-lnk',
  ai: 'co-btn-ai',
};

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual weight. Use `primary` once per area; `ai` only for actions that run an AI model. Default 'secondary' */
  variant?: ButtonVariant;
  /** 'sm' 30px (tables, toolbars), 'md' 36px, 'lg' 48px (kiosk, portal); default 'md' */
  size?: ButtonSize;
  /** Shows a spinner, keeps the label, disables the button and sets aria-busy; default false */
  loading?: boolean;
  /** Icon before the label; default none */
  iconLeft?: IconName;
  /** Icon after the label; default none */
  iconRight?: IconName;
  /** Full width (phone screens); default false */
  full?: boolean;
  /** Toggle state; sets aria-pressed; default undefined (not a toggle) */
  pressed?: boolean;
  /** Renders an `<a>` with button styling */
  href?: string;
  /** Link target when `href` is set */
  target?: AnchorHTMLAttributes<HTMLAnchorElement>['target'];
  /** Link rel when `href` is set */
  rel?: string;
  /** Label text: a verb in Title Case that says what happens ("Submit Claim"). */
  children?: ReactNode;
}

/** Button runs one action on the screen, from Save Claim to Start Visit Note. */
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  {
    variant = 'secondary',
    size = 'md',
    loading = false,
    disabled = false,
    iconLeft,
    iconRight,
    full = false,
    pressed,
    href,
    target,
    rel,
    className,
    children,
    type = 'button',
    ...rest
  },
  ref
) {
  const cls = cx(
    'co-btn',
    buttonVariantClass[variant],
    size !== 'md' && `co-btn-${size}`,
    full && 'co-btn-full',
    pressed && 'is-on',
    loading && 'is-loading',
    className
  );
  const content = (
    <>
      {loading ? (
        <Spinner label="Working" />
      ) : iconLeft ? (
        <Icon name={iconLeft} size={size === 'lg' ? 18 : 16} />
      ) : null}
      {children != null ? <span>{children}</span> : null}
      {iconRight ? <Icon name={iconRight} size={16} /> : null}
    </>
  );

  if (href !== undefined) {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        ref={ref as Ref<HTMLAnchorElement>}
        className={cls}
        href={disabled ? undefined : href}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        aria-disabled={disabled || undefined}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={type}
      className={cls}
      aria-pressed={pressed === undefined ? undefined : pressed}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      {...rest}
    >
      {content}
    </button>
  );
});
