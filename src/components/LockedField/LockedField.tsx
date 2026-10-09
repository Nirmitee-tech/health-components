import { forwardRef } from 'react';
import { TextField, type TextFieldProps } from '../TextField/TextField';

export interface LockedFieldProps
  extends Omit<
    TextFieldProps,
    'value' | 'defaultValue' | 'onChange' | 'readOnly' | 'lockMessage' | 'mask' | 'error' | 'required'
  > {
  /** Visible label; required */
  label: string;
  /** Value shown, selectable and copyable; required */
  value: string;
  /** Lock line under the field (name the missing permission); default "Your role can view but not edit" */
  message?: string;
}

/** LockedField is a read-only field for the View access level: value visible and copyable, lock icon and "Your role can view but not edit". */
export const LockedField = forwardRef<HTMLInputElement, LockedFieldProps>(function LockedField(
  { label, value, message = 'Your role can view but not edit', ...rest },
  ref
) {
  return <TextField ref={ref} label={label} value={value} readOnly lockMessage={message} {...rest} />;
});
