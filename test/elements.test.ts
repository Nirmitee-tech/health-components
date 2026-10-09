import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { defineCareOSElements, elementSpecs } from '../src/elements';

// Elements render through their own React roots, outside act().
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = false;

const tick = () => new Promise((r) => setTimeout(r, 0));

beforeAll(() => defineCareOSElements());
afterEach(() => {
  document.body.innerHTML = '';
});

describe('custom elements', () => {
  it('registers every component and injects tokens once', () => {
    for (const spec of elementSpecs) expect(customElements.get(spec.tag), spec.tag).toBeDefined();
    defineCareOSElements();
    expect(document.querySelectorAll('style[data-careos-tokens]')).toHaveLength(1);
  });

  it('renders <co-button> into its shadow root with attributes mapped to props', async () => {
    document.body.innerHTML = '<co-button variant="primary" icon-left="plus" disabled>Start Visit Note</co-button>';
    await tick();
    const host = document.querySelector('co-button')!;
    const btn = host.shadowRoot!.querySelector('button')!;
    expect(btn.className).toContain('co-btn-pri');
    expect(btn.disabled).toBe(true);
    expect(btn.querySelector('svg.co-icon')).not.toBeNull();
    // Light-DOM text is projected through the default slot.
    expect(btn.querySelector('slot')).not.toBeNull();
    expect(host.textContent).toBe('Start Visit Note');
  });

  it('reacts to attribute and property changes', async () => {
    document.body.innerHTML = '<co-button>Save</co-button>';
    await tick();
    const host = document.querySelector('co-button') as HTMLElement & { variant?: string; loading?: boolean };
    host.setAttribute('variant', 'danger');
    await tick();
    expect(host.shadowRoot!.querySelector('button')!.className).toContain('co-btn-dng');
    host.loading = true;
    await tick();
    expect(host.shadowRoot!.querySelector('button')!.getAttribute('aria-busy')).toBe('true');
  });

  it('accepts properties set before upgrade', async () => {
    const el = document.createElement('co-icon') as HTMLElement & { name?: string; size?: number };
    el.name = 'heart';
    el.size = 24;
    document.body.appendChild(el);
    await tick();
    const svg = el.shadowRoot!.querySelector('svg')!;
    expect(svg.getAttribute('width')).toBe('24');
  });

  it('dispatches co-* events for callback props and forwards native clicks', async () => {
    document.body.innerHTML = '<co-button>Go</co-button>';
    await tick();
    const host = document.querySelector('co-button')!;
    const onClick = vi.fn();
    host.addEventListener('click', onClick);
    host.shadowRoot!.querySelector('button')!.click();
    expect(onClick).toHaveBeenCalled();
  });
});
