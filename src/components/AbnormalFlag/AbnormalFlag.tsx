import { forwardRef, type HTMLAttributes } from 'react';
import { FLAGS, type FlagCode } from '../../clinical';
import { cx } from '../../internal/cx';
import { Icon } from '../Icon/Icon';

export type { FlagCode };

/** 'compact' shows the letter; 'full' adds the word. */
export type AbnormalFlagVariant = 'compact' | 'full';

export interface AbnormalFlagProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Interpretation code: 'N' | 'L' | 'H' | 'LL' | 'HH' | 'A' | 'AA' (HL7 v2 OBX-8 / FHIR interpretation); required */
  flag: FlagCode;
  /** 'compact' (letter and icon) | 'full' (letter, icon and word); default 'compact' */
  variant?: AbnormalFlagVariant;
}

/**
 * AbnormalFlag marks a result as normal, low, high, critical or abnormal with a letter, an icon and a word,
 * never colour alone. Renders nothing for an unknown code.
 */
export const AbnormalFlag = forwardRef<HTMLSpanElement, AbnormalFlagProps>(function AbnormalFlag(
  { flag, variant = 'compact', className, ...rest },
  ref
) {
  const f = Object.prototype.hasOwnProperty.call(FLAGS, flag) ? FLAGS[flag] : undefined;
  if (!f) return null;
  return (
    <span
      ref={ref}
      className={cx('co-af', `co-af-${f.tone}`, className)}
      role="img"
      aria-label={f.text}
      title={f.text}
      {...rest}
    >
      <Icon name={f.icon} size={11} />
      <span aria-hidden="true">{flag}</span>
      {variant === 'full' ? (
        <span className="co-af-w" aria-hidden="true">
          {f.text}
        </span>
      ) : null}
    </span>
  );
});
