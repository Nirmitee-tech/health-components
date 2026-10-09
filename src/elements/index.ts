import elementCss from 'virtual:careos-element-css';
import { defineElement, type DefineOptions, type ElementSpec } from './define';
import { elementSpecs } from './registry.generated';
import tokensCss from 'virtual:careos-tokens-css';

export { createElementClass, defineElement, eventName } from './define';
export type { DefineOptions, ElementSpec, PropKind } from './define';
export { elementSpecs } from './registry.generated';
export type * from './registry.generated';

export interface DefineCareOSElementsOptions extends DefineOptions {
  /** Only register these tags (for example `['co-button', 'co-patient-banner']`); default all. */
  only?: string[];
  /**
   * Inject the token stylesheet (`--co-*` variables for all five themes) into `<head>` once, so the elements
   * work without loading `health-components/tokens.css` yourself. Default true. Set false when you already
   * load `styles.css` or `tokens.css`.
   */
  injectTokens?: boolean;
}

function injectTokenStyles() {
  if (typeof document === 'undefined' || document.querySelector('style[data-careos-tokens]')) return;
  const style = document.createElement('style');
  style.setAttribute('data-careos-tokens', '');
  style.textContent = tokensCss;
  document.head.prepend(style);
}

/**
 * Registers the CareOS custom elements (`<co-button>`, `<co-patient-banner>`, ...).
 * Safe to call more than once. Use from Angular, Vue, Svelte or plain HTML.
 */
export function defineCareOSElements(options: DefineCareOSElementsOptions = {}): void {
  if (typeof window === 'undefined' || typeof customElements === 'undefined') return;
  const { only, injectTokens = true, css = elementCss } = options;
  if (injectTokens) injectTokenStyles();
  const wanted = only ? new Set(only) : null;
  for (const spec of elementSpecs as ElementSpec[]) {
    if (!wanted || wanted.has(spec.tag)) defineElement(spec, { css });
  }
}

/** The component stylesheet adopted into every element's shadow root. */
export { elementCss };
