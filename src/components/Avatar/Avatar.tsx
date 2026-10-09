import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarColor = 'primary' | 'accent' | 'ai' | 'success-strong' | 'ink-2';
export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  /** Full name; gives the initials and the accessible name. Required */
  name: string;
  /** Photo URL; default none (initials) */
  src?: string;
  /** 'xs' 20 | 'sm' 30 | 'md' 40 | 'lg' 48 | 'xl' 64; default 'md' */
  size?: AvatarSize;
  /** Initials background: 'primary' (patients) | 'accent' (signed-in user) | 'ai' | 'success-strong' | 'ink-2'; default 'primary' */
  color?: AvatarColor;
  /** Presence dot: 'online' | 'busy' | 'away' | 'offline'; default none */
  status?: AvatarStatus;
}

const TITLES = /^(MD|DO|NP|PA|LCSW|DPT|OD|RN|Dr\.?)$/i;

/** First and last initial of a name, skipping titles such as MD and LCSW. */
export function getInitials(name: string): string {
  const parts = String(name || '')
    .replace(/,/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !TITLES.test(w));
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

const INK: Record<AvatarColor, string> = {
  primary: 'var(--co-primary-ink)',
  accent: 'var(--co-on-accent)',
  ai: 'var(--co-ai-ink)',
  'success-strong': 'var(--co-primary-ink)',
  'ink-2': 'var(--co-primary-ink)',
};

/** Avatar shows a person as a photo or initials, in five sizes, with an optional presence dot. */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { name, src, size = 'md', color = 'primary', status, className, style, ...rest },
  ref
) {
  const colorStyle: CSSProperties | undefined = src ? undefined : { background: `var(--co-${color})`, color: INK[color] };
  return (
    <span
      ref={ref}
      className={cx('co-av', `co-av-${size}`, className)}
      style={{ ...colorStyle, ...style }}
      role="img"
      aria-label={name + (status ? `, ${status}` : '')}
      {...rest}
    >
      {src ? <img src={src} alt="" /> : getInitials(name)}
      {status ? <span className={cx('co-av-st', `co-av-${status}`)} aria-hidden="true" /> : null}
    </span>
  );
});
