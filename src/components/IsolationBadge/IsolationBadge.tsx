import { forwardRef } from 'react';
import { Badge, type BadgeProps, type BadgeTone } from '../Badge/Badge';

/** Transmission-based precaution types. */
export type IsolationType =
  | 'contact'
  | 'contact-plus'
  | 'droplet'
  | 'airborne'
  | 'airborne-contact'
  | 'neutropenic'
  | 'standard';

/** What a precaution type shows: its label, tone and the protection to wear. */
export interface IsolationPrecaution {
  /** Short label ('Contact Plus') */
  label: string;
  /** Badge tone */
  tone: BadgeTone;
  /** The protection to wear, shown in the tooltip */
  hint: string;
}

/** Label, tone and protection per precaution type. */
export const isolationPrecautions: Readonly<Record<IsolationType, IsolationPrecaution>> = {
  contact: { label: 'Contact', tone: 'warning', hint: 'Gown and gloves' },
  'contact-plus': {
    label: 'Contact Plus',
    tone: 'warning',
    hint: 'Gown, gloves, soap and water (C. diff)',
  },
  droplet: {
    label: 'Droplet',
    tone: 'info',
    hint: 'Surgical mask within 6 feet',
  },
  airborne: {
    label: 'Airborne',
    tone: 'danger',
    hint: 'N95 and negative-pressure room',
  },
  'airborne-contact': {
    label: 'Airborne + Contact',
    tone: 'danger',
    hint: 'N95, gown, gloves, negative-pressure room',
  },
  neutropenic: {
    label: 'Protective',
    tone: 'ai',
    hint: 'Neutropenic precautions: mask on entry, no fresh flowers',
  },
  standard: {
    label: 'Standard',
    tone: 'neutral',
    hint: 'Standard precautions only',
  },
};

export interface IsolationBadgeProps extends Omit<BadgeProps, 'tone' | 'icon' | 'children' | 'shape' | 'dot' | 'size'> {
  /** 'contact' | 'contact-plus' | 'droplet' | 'airborne' | 'airborne-contact' | 'neutropenic' | 'standard'; required */
  type: IsolationType;
  /** Organism, shown in brackets ('MRSA'); default none */
  organism?: string;
  /** Rule-out: on precautions while the test is pending; default false */
  pending?: boolean;
  /** Drops the "Isolation:" prefix in dense rows; default false */
  compact?: boolean;
  /** 'sm' | 'md'; default 'md' */
  size?: 'sm' | 'md';
  /** Shows 'standard' (hidden by default because it applies to everyone); default false */
  showStandard?: boolean;
}

const IsolationBadgeBase = forwardRef<HTMLSpanElement, IsolationBadgeProps>(function IsolationBadge(
  { type, organism, pending = false, compact = false, size = 'md', showStandard = false, ...rest },
  ref
) {
  const known = Object.prototype.hasOwnProperty.call(isolationPrecautions, type);
  const t = known ? isolationPrecautions[type] : isolationPrecautions.standard;
  const isStandard = !known || type === 'standard';
  if (isStandard && !showStandard) return null;
  return (
    <Badge
      ref={ref}
      tone={t.tone}
      icon={isStandard ? undefined : 'shield'}
      size={size}
      title={t.hint + (organism ? '. Organism: ' + organism : '')}
      {...rest}
    >
      {(compact ? t.label : 'Isolation: ' + t.label) +
        (organism ? ' (' + organism + ')' : '') +
        (pending ? ', pending' : '')}
    </Badge>
  );
});

/**
 * IsolationBadge names the transmission-based precautions a patient is on, so staff put on the right protection
 * before they enter the room.
 */
export const IsolationBadge = Object.assign(IsolationBadgeBase, {
  /** Every precaution type. */
  types: Object.keys(isolationPrecautions) as IsolationType[],
});
