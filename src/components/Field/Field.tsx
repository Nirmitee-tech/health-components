import type { CSSProperties, ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';
import { Icon } from '../Icon/Icon';

/** Default read-only lock wording, from the screens' lock banner. */
export const DEFAULT_LOCK_MESSAGE = 'Your role can view but not edit';

/** Attributes Field hands to its control when `children` is a function. */
export interface FieldControlProps {
  id: string;
  'aria-describedby'?: string;
  'aria-invalid'?: true;
  'aria-required'?: true;
}

export interface FieldProps {
  /** id of the control inside; the label points at it and the help, error and lock ids derive from it; default generated */
  id?: string;
  /** Visible label; default none */
  label?: ReactNode;
  /** Red asterisk after the label (the control sets aria-required); default false */
  required?: boolean;
  /** Error message under the control, role alert; replaces the helper; default none */
  error?: ReactNode;
  /** Muted hint under the control; default none */
  helper?: ReactNode;
  /** Read-only lock line with a lock icon ("Your role can view but not edit"); default none */
  lock?: ReactNode;
  /** Class on the root */
  className?: string;
  /** Inline style of the root */
  style?: CSSProperties;
  /** The control, or a function that receives id and aria attributes to spread on it */
  children?: ReactNode | ((control: FieldControlProps) => ReactNode);
}

/** The aria-describedby value for a control inside Field: error (or helper), then the lock line. */
export function fieldDescribedBy(
  id: string,
  state: { error?: unknown; helper?: unknown; lock?: unknown },
  extra?: string
): string | undefined {
  const ids: string[] = [];
  if (state.error) ids.push(`${id}-err`);
  else if (state.helper) ids.push(`${id}-help`);
  if (state.lock) ids.push(`${id}-lock`);
  if (extra) ids.push(extra);
  return ids.length ? ids.join(' ') : undefined;
}

/**
 * Field is the labelled wrapper every form control shares: label with required marker, the control,
 * then a read-only lock line and an error (role alert) or helper line, linked with aria-describedby.
 */
export function Field({ id: idProp, label, required, error, helper, lock, className, style, children }: FieldProps) {
  const id = useDomId('field', idProp);
  const content =
    typeof children === 'function'
      ? children({
          id,
          'aria-describedby': fieldDescribedBy(id, { error, helper, lock }),
          'aria-invalid': error ? true : undefined,
          'aria-required': required ? true : undefined,
        })
      : children;
  return (
    <div className={cx('co-field', className)} style={style}>
      {label ? (
        <label className="co-lbl" htmlFor={id} id={`${id}-label`}>
          {label}
          {required ? (
            <span className="co-req" aria-hidden="true">
              {' *'}
            </span>
          ) : null}
        </label>
      ) : null}
      {content}
      {lock ? (
        <div className="co-help co-lockline" id={`${id}-lock`}>
          <Icon name="lock" size={12} /> {lock}
        </div>
      ) : null}
      {error ? (
        <div className="co-errt" id={`${id}-err`} role="alert">
          {error}
        </div>
      ) : helper ? (
        <div className="co-help" id={`${id}-help`}>
          {helper}
        </div>
      ) : null}
    </div>
  );
}
