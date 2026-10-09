import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Icon, type IconName } from '../Icon/Icon';

export type BadgeTone = 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'ai' | 'outline';
export type BadgeShape = 'square' | 'pill';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** 'neutral' | 'success' | 'danger' | 'warning' | 'info' | 'ai' | 'outline'; default 'neutral' */
  tone?: BadgeTone;
  /** 'square' | 'pill'; default 'square' */
  shape?: BadgeShape;
  /** 'sm' | 'md'; default 'md' */
  size?: BadgeSize;
  /** Icon before the label; default none */
  icon?: IconName;
  /** Shows a small dot in the current colour before the label (ignored when `icon` is set); default false */
  dot?: boolean;
  /** Label text, a status word in Title Case. */
  children?: ReactNode;
}

/** Badge is a small coloured label for a status or attribute. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', shape = 'square', size = 'md', icon, dot = false, className, children, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      className={cx(
        'co-tag',
        `co-tag-${tone}`,
        shape === 'pill' && 'co-tag-pill',
        size === 'sm' && 'co-tag-sm',
        className
      )}
      {...rest}
    >
      {icon ? <Icon name={icon} size={12} /> : dot ? <span className="co-tag-dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
});

/** Status kinds that StatusTag knows how to colour. */
export type StatusKind = 'claim' | 'pa' | 'appointment' | 'eligibility';

/** Status word to tone, per kind. Add new status words here rather than per screen. */
export const statusTones: Record<StatusKind, Record<string, BadgeTone>> = {
  claim: {
    Draft: 'neutral',
    Ready: 'info',
    Submitted: 'info',
    Accepted: 'info',
    Rejected: 'danger',
    Denied: 'danger',
    Pending: 'warning',
    'Partially Paid': 'warning',
    Paid: 'success',
    Appealed: 'ai',
    Void: 'neutral',
  },
  pa: {
    'Not Started': 'neutral',
    Draft: 'neutral',
    Submitted: 'info',
    'In Review': 'warning',
    Pended: 'warning',
    'More Info Needed': 'warning',
    Approved: 'success',
    'Partially Approved': 'warning',
    Denied: 'danger',
    Expired: 'danger',
    'Not Required': 'neutral',
  },
  appointment: {
    Scheduled: 'neutral',
    Confirmed: 'info',
    Arrived: 'warning',
    'Checked In': 'warning',
    'In Room': 'ai',
    'Checked Out': 'success',
    Completed: 'success',
    'No Show': 'danger',
    Cancelled: 'danger',
  },
  eligibility: {
    Active: 'success',
    Eligible: 'success',
    Inactive: 'danger',
    'Not Eligible': 'danger',
    Unknown: 'neutral',
    'Not Checked': 'neutral',
    Error: 'danger',
    'Self-Pay': 'warning',
  },
};

const STATUS_ICON: Record<BadgeTone, IconName | undefined> = {
  success: 'check',
  danger: 'x',
  warning: 'clock',
  info: 'info',
  ai: 'sparkle',
  neutral: undefined,
  outline: undefined,
};

export interface StatusTagProps extends Omit<BadgeProps, 'tone' | 'icon' | 'children'> {
  /** 'claim' | 'pa' | 'appointment' | 'eligibility': which status map to use */
  kind: StatusKind;
  /** Status word in Title Case, as in `StatusTag.statuses[kind]`. */
  status: string;
  /** Overrides the tone from the map; default from the map, else 'neutral' */
  tone?: BadgeTone;
  /** `false` hides the tone icon; default true */
  icon?: boolean;
}

const StatusTagBase = forwardRef<HTMLSpanElement, StatusTagProps>(function StatusTag(
  { kind, status, tone, icon = true, ...rest },
  ref
) {
  const t = tone ?? statusTones[kind]?.[status] ?? 'neutral';
  return (
    <Badge ref={ref} tone={t} icon={icon ? STATUS_ICON[t] : undefined} {...rest}>
      {status}
    </Badge>
  );
});

/**
 * StatusTag picks the right colour and icon for claim, PA, appointment and eligibility statuses,
 * so colour is never the only cue. The maps are on `StatusTag.statuses`.
 */
export const StatusTag = Object.assign(StatusTagBase, { statuses: statusTones });
