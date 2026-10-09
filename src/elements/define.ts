import { Component, createElement, type ComponentType, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { flushSync } from 'react-dom';

/**
 * How a React prop maps onto a custom element:
 * - string / number / boolean: an attribute (kebab-case) and a property (camelCase)
 * - json: a property that takes any value; the attribute is parsed as JSON (arrays, objects)
 * - function: a property only (render functions, formatters)
 * - event: an `on*` callback; the element dispatches `co-<name>` CustomEvents and the property can also be set
 * - node: React content; filled from light-DOM children with `slot="<kebab-name>"` (`children` is the default slot)
 */
export type PropKind = 'string' | 'number' | 'boolean' | 'json' | 'function' | 'event' | 'node';

export interface ElementSpec {
  /** Custom element tag, for example `co-button`. */
  tag: string;
  /** The React component it renders. */
  component: ComponentType<never>;
  /** Prop name to kind. */
  props: Record<string, PropKind>;
  /** Values used until the page sets the prop (required lists start as `[]` so the element renders before data arrives). */
  defaults?: Record<string, unknown>;
}

/**
 * Keeps one element's failure from taking down the page: logs it with the tag name and renders nothing
 * until the next prop change (the element remounts the boundary with a new key).
 */
class ElementBoundary extends Component<{ tag: string; onError: () => void; children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  override componentDidCatch(error: unknown) {
    console.error(`<${this.props.tag}> failed to render. Check its properties.`, error);
    this.props.onError();
  }
  override render() {
    return this.state.failed ? null : this.props.children;
  }
}

export interface DefineOptions {
  /**
   * Stylesheet text adopted into every shadow root. Defaults to the CareOS component CSS.
   * Tokens are CSS custom properties and inherit through the shadow boundary.
   */
  css?: string;
}

const kebab = (s: string) => s.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
/** `onSelect` -> `co-select`, `onRowClick` -> `co-row-click`. */
export const eventName = (prop: string) => 'co-' + kebab(prop.slice(2)).replace(/^-/, '');

function parseAttr(kind: PropKind, value: string | null): unknown {
  if (value === null) return kind === 'boolean' ? false : undefined;
  switch (kind) {
    case 'boolean':
      return value !== 'false';
    case 'number': {
      const n = Number(value);
      return Number.isNaN(n) ? undefined : n;
    }
    case 'json':
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    default:
      return value;
  }
}

let sharedSheet: CSSStyleSheet | null | undefined;
function getSheet(css: string): CSSStyleSheet | null {
  if (sharedSheet !== undefined) return sharedSheet;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    sharedSheet = sheet;
  } catch {
    sharedSheet = null; // no constructable stylesheets (old browsers, jsdom): fall back to <style>
  }
  return sharedSheet;
}

const HOST_CSS = ':host{display:contents}:host([hidden]){display:none}';

/** Creates the custom element class for one component. */
export function createElementClass(spec: ElementSpec, options: DefineOptions = {}): CustomElementConstructor {
  const entries = Object.entries(spec.props);
  const attrToProp = new Map<string, [string, PropKind]>();
  for (const [name, kind] of entries) {
    if (kind === 'string' || kind === 'number' || kind === 'boolean' || kind === 'json') attrToProp.set(kebab(name), [name, kind]);
  }
  const css = HOST_CSS + (options.css ?? '');

  class CareOSElement extends HTMLElement {
    static observedAttributes = [...attrToProp.keys()];

    private _root: Root | null = null;
    private _mount: HTMLElement | null = null;
    private _props: Record<string, unknown> = {};
    private _observer: MutationObserver | null = null;
    private _scheduled = false;
    private _version = 0;
    private _failed = false;

    constructor() {
      super();
      // Properties set before the element upgraded (frameworks often do this) are re-applied through setters.
      for (const [name] of entries) {
        if (Object.prototype.hasOwnProperty.call(this, name)) {
          const v = (this as unknown as Record<string, unknown>)[name];
          delete (this as unknown as Record<string, unknown>)[name];
          this._props[name] = v;
        }
      }
    }

    connectedCallback() {
      if (!this.shadowRoot) {
        const shadow = this.attachShadow({ mode: 'open' });
        const sheet = getSheet(css);
        if (sheet && 'adoptedStyleSheets' in shadow) shadow.adoptedStyleSheets = [sheet];
        else {
          const style = document.createElement('style');
          style.textContent = css;
          shadow.appendChild(style);
        }
        this._mount = document.createElement('div');
        this._mount.className = 'co-wc';
        this._mount.style.display = 'contents';
        shadow.appendChild(this._mount);
      }
      for (const [attr, [name, kind]] of attrToProp) {
        if (this.hasAttribute(attr) && !(name in this._props)) this._props[name] = parseAttr(kind, this.getAttribute(attr));
      }
      if (!this._root && this._mount) this._root = createRoot(this._mount);
      // Re-render when slotted content appears or disappears (frameworks add children after connecting).
      this._observer = new MutationObserver(() => this._schedule());
      this._observer.observe(this, { childList: true });
      this._render(true);
    }

    disconnectedCallback() {
      this._observer?.disconnect();
      this._observer = null;
      // Unmount after the current task so moving the element within the DOM does not remount it.
      queueMicrotask(() => {
        if (!this.isConnected && this._root) {
          this._root.unmount();
          this._root = null;
        }
      });
    }

    attributeChangedCallback(attr: string, _old: string | null, value: string | null) {
      const entry = attrToProp.get(attr);
      if (!entry) return;
      this._props[entry[0]] = parseAttr(entry[1], value);
      this._schedule();
    }

    private _schedule() {
      if (this._scheduled) return;
      this._scheduled = true;
      queueMicrotask(() => {
        this._scheduled = false;
        this._render(false);
      });
    }

    private _hasSlotContent(slot: string | null): boolean {
      for (const node of Array.from(this.childNodes)) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const s = (node as Element).getAttribute('slot');
          if (slot === null ? !s : s === slot) return true;
        } else if (slot === null && node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) return true;
      }
      return false;
    }

    private _render(sync: boolean) {
      if (!this._root) return;
      const props: Record<string, unknown> = {};
      for (const [name, kind] of entries) {
        if (kind === 'event') {
          const own = this._props[name] as ((...a: unknown[]) => unknown) | undefined;
          props[name] = (...args: unknown[]) => {
            this.dispatchEvent(
              new CustomEvent(eventName(name), {
                detail: args.length <= 1 ? args[0] : args,
                bubbles: true,
                composed: true,
              })
            );
            return own?.(...args);
          };
        } else if (kind === 'node') {
          const slot = name === 'children' ? null : kebab(name);
          if (this._hasSlotContent(slot)) {
            props[name] = createElement('slot', slot ? { name: slot } : {}) as ReactNode;
          } else if (this._props[name] !== undefined) props[name] = this._props[name];
        } else if (this._props[name] !== undefined) props[name] = this._props[name];
        else if (spec.defaults && name in spec.defaults) props[name] = spec.defaults[name];
      }
      // After a failure, the next update remounts the boundary so the element can recover.
      if (this._failed) {
        this._failed = false;
        this._version += 1;
      }
      const el = createElement(ElementBoundary, {
        tag: spec.tag,
        key: this._version,
        onError: () => {
          this._failed = true;
        },
        children: createElement(spec.component as ComponentType<Record<string, unknown>>, props),
      });
      if (sync) flushSync(() => this._root!.render(el));
      else this._root.render(el);
    }
  }

  for (const [name, kind] of entries) {
    Object.defineProperty(CareOSElement.prototype, name, {
      configurable: true,
      enumerable: true,
      get(this: CareOSElement) {
        return (this as unknown as { _props: Record<string, unknown> })._props[name];
      },
      set(this: CareOSElement, v: unknown) {
        const self = this as unknown as { _props: Record<string, unknown>; _schedule(): void };
        self._props[name] = kind === 'number' && typeof v === 'string' ? Number(v) : v;
        self._schedule();
      },
    });
  }

  return CareOSElement;
}

/** Registers one element. Already-defined tags are left alone, so calling twice is safe. */
export function defineElement(spec: ElementSpec, options?: DefineOptions): void {
  if (typeof customElements === 'undefined' || customElements.get(spec.tag)) return;
  customElements.define(spec.tag, createElementClass(spec, options));
}
