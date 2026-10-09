import { forwardRef, type HTMLAttributes } from 'react';
import { Badge, type BadgeTone } from '../Badge/Badge';
import type { IconName } from '../Icon/Icon';

export type AllergySeverity = 'severe' | 'moderate' | 'mild';

/** How each allergy severity is shown: badge tone, label and icon. Shared with AllergyList. */
export const allergySeverities: Record<AllergySeverity, { tone: BadgeTone; label: string; icon?: IconName }> = {
  severe: { tone: 'danger', label: 'Severe', icon: 'alert-circle' },
  moderate: { tone: 'warning', label: 'Moderate', icon: 'alert' },
  mild: { tone: 'neutral', label: 'Mild' },
};

export interface AllergyBadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Allergen ("Penicillin"); required */
  substance: string;
  /** 'severe' | 'moderate' | 'mild'; default 'moderate' */
  severity?: AllergySeverity;
  /** Reaction ("Anaphylaxis"), shown in the tooltip and read by screen readers; default none */
  reaction?: string;
  /** Shows the severity in the label ("Allergy: Penicillin (Severe)"); default false */
  showSeverity?: boolean;
}

/** AllergyBadge is the red allergy tag used in banners and lists, with severity in its title and optional label. */
export const AllergyBadge = forwardRef<HTMLSpanElement, AllergyBadgeProps>(function AllergyBadge(
  { substance, severity = 'moderate', reaction, showSeverity = false, title, ...rest },
  ref
) {
  const s = allergySeverities[severity] ?? allergySeverities.moderate;
  const detail = s.label + (reaction ? `, ${reaction}` : '');
  // The tooltip (title) is not read reliably, so the hidden detail repeats what the label leaves out.
  const hidden = showSeverity ? (reaction ? `, ${reaction}` : '') : `, ${detail}`;
  return (
    <Badge
      ref={ref}
      tone={severity === 'mild' ? 'warning' : 'danger'}
      icon={s.icon ?? 'alert'}
      title={title ?? detail}
      {...rest}
    >
      {`Allergy: ${substance}${showSeverity ? ` (${s.label})` : ''}`}
      {hidden ? <span className="co-sr">{hidden}</span> : null}
    </Badge>
  );
});
