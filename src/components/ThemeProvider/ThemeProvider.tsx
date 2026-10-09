import { createContext, forwardRef, useContext, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import type { ThemeId } from '../../tokens/tokens';

export type { ThemeId };

const ThemeContext = createContext<ThemeId | undefined>(undefined);

/** The theme set by the nearest ThemeProvider, or undefined when the page sets it on `<html>` instead. */
export function useTheme(): ThemeId | undefined {
  return useContext(ThemeContext);
}

export interface ThemeProviderProps extends HTMLAttributes<HTMLDivElement> {
  /** 'classic' | 'sidebar' | 'rail' | 'command' | 'dark'; default 'classic' */
  theme?: ThemeId;
  /** Render the root as `display: contents` so it adds no box to the layout; default false */
  contents?: boolean;
  children?: ReactNode;
}

/**
 * ThemeProvider applies a CareOS theme (Classic, Clinical Sidebar, Focus Rail, Command Bar or Dark)
 * and the base type to everything inside it. Overlays rendered through a portal keep the theme.
 * Alternatively set `data-co-theme="<id>"` and `class="co-root"` on `<html>` or `<body>`.
 */
export const ThemeProvider = forwardRef<HTMLDivElement, ThemeProviderProps>(function ThemeProvider(
  { theme = 'classic', contents = false, className, style, children, ...rest },
  ref
) {
  return (
    <ThemeContext.Provider value={theme}>
      <div
        ref={ref}
        data-co-theme={theme}
        className={cx('co-root', className)}
        style={contents ? { display: 'contents', ...style } : style}
        {...rest}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
});
