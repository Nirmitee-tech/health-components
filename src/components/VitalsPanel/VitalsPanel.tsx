import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { VitalSign, type VitalSignProps } from '../VitalSign/VitalSign';

export interface VitalsPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** VitalSign props[]; required */
  items: VitalSignProps[];
  /** Line under the title ("entered by Lisa Chen RN, 10:12 AM"); default none */
  subtitle?: ReactNode;
  /** Hides Enter Vitals; default false */
  readOnly?: boolean;
  /** Enter Vitals clicked; default none */
  onEnterVitals?: () => void;
}

/** VitalsPanel groups VitalSign tiles in a Card with Enter Vitals. */
export const VitalsPanel = forwardRef<HTMLElement, VitalsPanelProps>(function VitalsPanel(
  { items, subtitle, readOnly = false, onEnterVitals, ...rest },
  ref
) {
  return (
    <Card
      ref={ref}
      title="Vitals"
      subtitle={subtitle}
      actions={
        readOnly ? null : (
          <Button size="sm" iconLeft="plus" onClick={onEnterVitals}>
            Enter Vitals
          </Button>
        )
      }
      {...rest}
    >
      <div className="co-vitals">
        {items.map((v, i) => (
          <VitalSign key={v.id ?? `${v.label}-${i}`} {...v} />
        ))}
      </div>
    </Card>
  );
});
