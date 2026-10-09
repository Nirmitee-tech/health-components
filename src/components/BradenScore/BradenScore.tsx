import { forwardRef } from 'react';
import { ScoreForm, type NursingScoreBand, type NursingScoreItem, type NursingScoreOption, type NursingScoreToolProps } from '../../internal/nursing';

export interface BradenScoreProps extends NursingScoreToolProps {
  /** Option index per subscale (uncontrolled), keyed by sensory, moisture, activity, mobility, nutrition, friction; default {} */
  defaultValues?: Record<string, number>;
  /** Option index per subscale (controlled); default uncontrolled */
  values?: Record<string, number>;
  /** Bands, total to band; default bradenBand (9 or less very high ... 19+ no risk) */
  band?: (total: number) => NursingScoreBand;
  /** Card title; default 'Braden Scale' */
  title?: string;
}

const bo = (labels: string[]): NursingScoreOption[] => labels.map((label, i) => ({ label, points: i + 1 }));

/** The six Braden subscales; each option scores 1 to 4 (friction 1 to 3). */
export const BRADEN_ITEMS: readonly NursingScoreItem[] = [
  { id: 'sensory', label: 'Sensory perception', options: bo(['Completely limited', 'Very limited', 'Slightly limited', 'No impairment']) },
  { id: 'moisture', label: 'Moisture', options: bo(['Constantly moist', 'Very moist', 'Occasionally moist', 'Rarely moist']) },
  { id: 'activity', label: 'Activity', options: bo(['Bedfast', 'Chairfast', 'Walks occasionally', 'Walks frequently']) },
  { id: 'mobility', label: 'Mobility', options: bo(['Completely immobile', 'Very limited', 'Slightly limited', 'No limitation']) },
  { id: 'nutrition', label: 'Nutrition', options: bo(['Very poor', 'Probably inadequate', 'Adequate', 'Excellent']) },
  { id: 'friction', label: 'Friction and shear', options: bo(['Problem', 'Potential problem', 'No apparent problem']) },
];

/** Braden bands: 9 or less very high, 10-12 high, 13-14 moderate, 15-18 mild, 19+ no risk. */
export function bradenBand(t: number): NursingScoreBand {
  return t <= 9
    ? { tone: 'danger', label: 'Very high risk', action: 'Specialty surface, turn every 2 h, wound nurse consult, dietitian consult.' }
    : t <= 12
      ? { tone: 'danger', label: 'High risk', action: 'Turn every 2 h, pressure-redistribution mattress, heel offloading.' }
      : t <= 14
        ? { tone: 'warning', label: 'Moderate risk', action: 'Turn schedule, heel offloading, manage moisture.' }
        : t <= 18
          ? { tone: 'warning', label: 'Mild risk', action: 'Encourage mobility, protect heels, check skin each shift.' }
          : { tone: 'success', label: 'No risk', action: 'Reassess daily and on change in condition.' };
}

/**
 * BradenScore is the Braden Scale for pressure injury risk: six subscales, automatic total from 6 to 23 and the risk
 * band (lower is higher risk).
 */
export const BradenScore = Object.assign(
  forwardRef<HTMLElement, BradenScoreProps>(function BradenScore({ band, title = 'Braden Scale', ...rest }, ref) {
    return (
      <ScoreForm
        ref={ref}
        title={title}
        items={BRADEN_ITEMS}
        band={band || bradenBand}
        max={23}
        totalLabel="Total (6 to 23, lower is higher risk)"
        {...rest}
      />
    );
  }),
  { items: BRADEN_ITEMS, band: bradenBand }
);
