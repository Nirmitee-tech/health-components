import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';

export interface SettingRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Setting name, left column */
  label: string;
  /** Explanation under the label; default none */
  help?: string;
  /** The control, right column. Give it its own accessible label. */
  children: ReactNode;
}

/** SettingRow is the two-column settings row: label and help on the left, control on the right. */
export const SettingRow = forwardRef<HTMLDivElement, SettingRowProps>(function SettingRow(
  { label, help, className, children, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cx('co-set', className)} {...rest}>
      <div>
        <div className="co-set-l">{label}</div>
        {help ? <div className="co-help">{help}</div> : null}
      </div>
      <div>{children}</div>
    </div>
  );
});
