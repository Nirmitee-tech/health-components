import { forwardRef } from 'react';
import { Badge, type BadgeProps, type BadgeTone } from '../Badge/Badge';

/** Levels of care. */
export type LevelOfCare = 'icu' | 'stepdown' | 'tele' | 'medsurg' | 'obs' | 'boarding' | 'l-d' | 'nicu' | 'psych';

/** What a level of care shows: short label, long name and tone. */
export interface LevelOfCareInfo {
  /** Short label ('Step-down') */
  label: string;
  /** Long name, shown in the tooltip ('Intermediate care') */
  long: string;
  /** Badge tone */
  tone: BadgeTone;
}

/** Label, long name and tone per level of care. */
export const levelsOfCare: Readonly<Record<LevelOfCare, LevelOfCareInfo>> = {
  icu: { label: 'ICU', long: 'Intensive care', tone: 'danger' },
  stepdown: { label: 'Step-down', long: 'Intermediate care', tone: 'warning' },
  tele: { label: 'Telemetry', long: 'Med-surg with cardiac monitoring', tone: 'info' },
  medsurg: { label: 'Med-Surg', long: 'Medical-surgical', tone: 'neutral' },
  obs: { label: 'Observation', long: 'Outpatient observation status', tone: 'ai' },
  boarding: { label: 'ED boarding', long: 'Admitted, waiting in the ED for a bed', tone: 'warning' },
  'l-d': { label: 'L&D', long: 'Labor and delivery', tone: 'info' },
  nicu: { label: 'NICU', long: 'Neonatal intensive care', tone: 'danger' },
  psych: { label: 'Behavioral', long: 'Inpatient behavioral health', tone: 'neutral' },
};

/** The info for a level; unknown levels read as Med-Surg. */
export function levelOfCareInfo(level: string | null | undefined): LevelOfCareInfo {
  return level && Object.prototype.hasOwnProperty.call(levelsOfCare, level)
    ? levelsOfCare[level as LevelOfCare]
    : levelsOfCare.medsurg;
}

export interface LevelOfCareBadgeProps extends Omit<BadgeProps, 'tone' | 'icon' | 'children' | 'shape' | 'dot' | 'size'> {
  /** 'icu' | 'stepdown' | 'tele' | 'medsurg' | 'obs' | 'boarding' | 'l-d' | 'nicu' | 'psych'; required */
  level: LevelOfCare;
  /** A requested change of level, shown as "ICU → Step-down pending"; default none */
  pendingTo?: LevelOfCare;
  /** Short label only (hides the pending change); default false */
  compact?: boolean;
  /** 'sm' | 'md'; default 'md' */
  size?: 'sm' | 'md';
}

const LevelOfCareBadgeBase = forwardRef<HTMLSpanElement, LevelOfCareBadgeProps>(function LevelOfCareBadge(
  { level, pendingTo, compact = false, size = 'md', ...rest },
  ref
) {
  const l = levelOfCareInfo(level);
  const to = pendingTo ? levelOfCareInfo(pendingTo) : null;
  const txt = compact ? l.label : l.label + (to ? ' → ' + to.label + ' pending' : '');
  return (
    <Badge
      ref={ref}
      tone={l.tone}
      shape="pill"
      size={size}
      title={l.long + (to ? '. Transfer pending to ' + to.long : '')}
      {...rest}
    >
      {txt}
    </Badge>
  );
});

/** LevelOfCareBadge shows how much monitoring a patient needs, from observation to ICU, and a pending change in level. */
export const LevelOfCareBadge = Object.assign(LevelOfCareBadgeBase, {
  /** Every level of care. */
  levels: Object.keys(levelsOfCare) as LevelOfCare[],
});
