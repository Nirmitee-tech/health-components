import { forwardRef } from 'react';
import { ScoreForm, type NursingScoreBand, type NursingScoreItem, type NursingScoreToolProps } from '../../internal/nursing';

export type { NursingPreviousScore, NursingScoreBand, NursingScoreItem, NursingScoreOption } from '../../internal/nursing';

export interface FallRiskScoreProps extends NursingScoreToolProps {
  /** Option index per item (uncontrolled), keyed by item id: history, secondary, aid, iv, gait, mental; default {} */
  defaultValues?: Record<string, number>;
  /** Option index per item (controlled); default uncontrolled */
  values?: Record<string, number>;
  /** Cut-offs, total to band; default morseBand (0-24 low, 25-44 moderate, 45+ high) */
  band?: (total: number) => NursingScoreBand;
  /** Card title; default 'Morse Fall Scale' */
  title?: string;
}

/** The six Morse Fall Scale items. */
export const MORSE_ITEMS: readonly NursingScoreItem[] = [
  { id: 'history', label: 'History of falling (within 3 months)', options: [{ label: 'No', points: 0 }, { label: 'Yes', points: 25 }] },
  { id: 'secondary', label: 'Secondary diagnosis', options: [{ label: 'No', points: 0 }, { label: 'Yes', points: 15 }] },
  {
    id: 'aid',
    label: 'Ambulatory aid',
    options: [
      { label: 'None, bed rest, nurse assist', points: 0 },
      { label: 'Crutches, cane, walker', points: 15 },
      { label: 'Furniture', points: 30 },
    ],
  },
  { id: 'iv', label: 'IV or heparin lock', options: [{ label: 'No', points: 0 }, { label: 'Yes', points: 20 }] },
  {
    id: 'gait',
    label: 'Gait',
    options: [
      { label: 'Normal, bed rest, wheelchair', points: 0 },
      { label: 'Weak', points: 10 },
      { label: 'Impaired', points: 20 },
    ],
  },
  {
    id: 'mental',
    label: 'Mental status',
    options: [
      { label: 'Knows own limits', points: 0 },
      { label: 'Overestimates or forgets limits', points: 15 },
    ],
  },
];

/**
 * Morse bands with the common 0-24 / 25-44 / 45+ cut-offs. Sites that use 0-24 / 25-50 / 51+ pass `band`.
 */
export function morseBand(t: number): NursingScoreBand {
  return t >= 45
    ? { tone: 'danger', label: 'High fall risk', action: 'Bed alarm on, low bed, non-slip socks, hourly rounding, yellow wristband.' }
    : t >= 25
      ? { tone: 'warning', label: 'Moderate fall risk', action: 'Standard fall precautions plus assist with ambulation.' }
      : { tone: 'success', label: 'Low fall risk', action: 'Standard fall precautions.' };
}

/** FallRiskScore is the Morse Fall Scale: six items, automatic total and the risk band with the precautions it calls for. */
export const FallRiskScore = Object.assign(
  forwardRef<HTMLElement, FallRiskScoreProps>(function FallRiskScore({ band, title = 'Morse Fall Scale', ...rest }, ref) {
    return <ScoreForm ref={ref} title={title} items={MORSE_ITEMS} band={band || morseBand} max={125} {...rest} />;
  }),
  { items: MORSE_ITEMS, band: morseBand }
);
