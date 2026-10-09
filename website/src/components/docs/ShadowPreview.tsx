import { useEffect, useRef, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import careosCss from '@site/src/generated/careos-css';

let sheet: CSSStyleSheet | null = null;
function getSheet(): CSSStyleSheet | null {
  if (sheet) return sheet;
  try {
    sheet = new CSSStyleSheet();
    sheet.replaceSync(careosCss + '\n:host{display:block}.docs-shadow-root{padding:20px;display:flex;flex-direction:column;gap:12px}' +
        '.demo-chart{display:grid;grid-template-columns:240px 1fr;gap:12px;align-items:start}.demo-col{display:flex;flex-direction:column;gap:12px;min-width:0}' +
        '.demo-grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:12px}@media (max-width:900px){.demo-chart{grid-template-columns:1fr}}');
    return sheet;
  } catch {
    return null;
  }
}

export interface ShadowPreviewProps {
  /** CareOS theme id applied inside the preview. */
  theme: string;
  children: ReactNode;
  className?: string;
}

/**
 * Renders CareOS content inside a shadow root with the CareOS stylesheet adopted, so the docs site's own
 * CSS (Infima) never restyles the components and the components never restyle the docs.
 * Rendered on the client in its own React root (events inside shadow roots need one).
 */
export function ShadowPreview({ theme, children, className }: ShadowPreviewProps) {
  const host = useRef<HTMLDivElement>(null);
  const root = useRef<Root | null>(null);
  const mount = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const shadow = el.shadowRoot ?? el.attachShadow({ mode: 'open' });
    const s = getSheet();
    if (s) shadow.adoptedStyleSheets = [s];
    else if (!shadow.querySelector('style')) {
      const style = document.createElement('style');
      style.textContent = careosCss;
      shadow.appendChild(style);
    }
    if (!mount.current) {
      mount.current = document.createElement('div');
      shadow.appendChild(mount.current);
      root.current = createRoot(mount.current);
    }
    return () => {
      const r = root.current;
      root.current = null;
      mount.current = null;
      // Unmount after React finishes the current commit.
      setTimeout(() => r?.unmount(), 0);
      shadow.replaceChildren();
    };
  }, []);

  useEffect(() => {
    root.current?.render(
      <div className="co-root docs-shadow-root" data-co-theme={theme}>
        {children}
      </div>
    );
  });

  return <div ref={host} className={className} />;
}
