import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTheme } from '../components/ThemeProvider/ThemeProvider';

export interface PortalProps {
  children: ReactNode;
  /** Element to render into; default document.body. */
  container?: Element | null;
  /** Render in place instead of portalling (docs, previews, inline overlays). */
  disabled?: boolean;
}

/**
 * Renders overlays (Modal, Drawer, CommandPalette, Toast) at the end of <body> so no parent
 * `overflow` or `z-index` clips them. The wrapper carries the active ThemeProvider theme.
 * Renders nothing on the server and on the first client render, so hydration matches.
 */
export function Portal({ children, container, disabled }: PortalProps) {
  const theme = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (disabled) return <>{children}</>;
  if (!mounted || typeof document === 'undefined') return null;
  return createPortal(
    <div className="co-root co-portal" data-co-theme={theme}>
      {children}
    </div>,
    container ?? document.body
  );
}
