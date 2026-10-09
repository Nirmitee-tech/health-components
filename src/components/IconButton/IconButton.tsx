import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Icon, type IconName } from '../Icon/Icon';

export type IconButtonVariant = 'ghost' | 'secondary' | 'primary' | 'danger';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Icon name (see Icon); required */
  icon: IconName;
  /** Accessible name: becomes aria-label and the hover title; required */
  label: string;
  /** 'ghost' | 'secondary' | 'primary' | 'danger'; default 'ghost' */
  variant?: IconButtonVariant;
  /** 'sm' 30px, 'md' 34px, 'lg' 44px (touch); default 'md' */
  size?: IconButtonSize;
  /** Count bubble, read as "N unread"; default none */
  badge?: number | string;
  /** Disables the button; default false */
  disabled?: boolean;
}

const iconSize: Record<IconButtonSize, number> = { sm: 14, md: 18, lg: 20 };

/** IconButton is a square button that shows only an icon, with its name in aria-label. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, variant = 'ghost', size = 'md', badge, className, type = 'button', title, ...rest },
  ref
) {
  const hasBadge = badge !== undefined && badge !== null && badge !== '' && badge !== 0;
  return (
    <button
      ref={ref}
      type={type}
      className={cx('co-ib', `co-ib-${variant}`, size !== 'md' && `co-ib-${size}`, className)}
      aria-label={hasBadge ? `${label}, ${badge} unread` : label}
      title={title ?? label}
      {...rest}
    >
      <Icon name={icon} size={iconSize[size]} />
      {hasBadge ? (
        <span className="co-count" aria-hidden="true">
          {badge}
        </span>
      ) : null}
    </button>
  );
});
