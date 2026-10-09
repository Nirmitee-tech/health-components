import type { ReactNode } from 'react';
import { PreviewThemeProvider } from '@site/src/components/docs/PreviewTheme';

/** Site-wide wrapper: the preview theme is shared by every example. */
export default function Root({ children }: { children: ReactNode }) {
  return <PreviewThemeProvider>{children}</PreviewThemeProvider>;
}
