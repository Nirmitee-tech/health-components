import { forwardRef, type SVGAttributes } from 'react';
import { cx } from '../../internal/cx';
import { iconNames, iconPaths, type IconName } from './paths';

export type { IconName };

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'name'> {
  /** Icon name, one of `Icon.names`. */
  name: IconName;
  /** Size in px; default 16 */
  size?: number;
  /** Stroke width; default 2 */
  strokeWidth?: number;
  /** Makes the icon meaningful to screen readers (role img). Without it the icon is decorative and hidden. */
  label?: string;
}

/**
 * Icon draws one of the CareOS inline 24px stroke icons in `currentColor`.
 * An icon beside text is decorative; an icon that carries meaning alone needs `label`.
 */
const IconBase = forwardRef<SVGSVGElement, IconProps>(function Icon(
  { name, size = 16, strokeWidth = 2, label, className, ...rest },
  ref
) {
  const d = iconPaths[name] ?? iconPaths.info;
  return (
    <svg
      ref={ref}
      className={cx('co-icon', className)}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={label ? undefined : true}
      role={label ? 'img' : undefined}
      aria-label={label}
      focusable="false"
      {...rest}
    >
      {d.map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
});

/** Icon with the list of available names on `Icon.names`. */
export const Icon = Object.assign(IconBase, { names: iconNames });
