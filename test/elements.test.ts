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

describe('element state', () => {
  it('keeps component state across prop updates (no remount)', async () => {
    document.body.innerHTML = '<co-text-field label="Member ID"></co-text-field>';
    await tick();
    const host = document.querySelector('co-text-field') as HTMLElement & { helper?: string };
    const input = host.shadowRoot!.querySelector('input')!;
    input.focus();
    host.helper = 'Printed on the card';
    await tick();
    expect(host.shadowRoot!.querySelector('input')).toBe(input);
  });
});

describe('content props', () => {
  it('take text from an attribute or rich content from a named slot', async () => {
    document.body.innerHTML = '<co-card title="Claim lines">Body</co-card>';
    await tick();
    const host = document.querySelector('co-card')!;
    expect(host.shadowRoot!.textContent).toContain('Claim lines');
    host.innerHTML = '<span slot="title">Rich <b>title</b></span>Body';
    await tick();
    await tick();
    expect(host.shadowRoot!.querySelector('slot[name="title"]')).not.toBeNull();
  });
});

describe('native change events', () => {
  it('re-dispatch as co-change with the plain value', async () => {
    document.body.innerHTML = '<co-select label="Provider"></co-select><co-checkbox label="Only show differences"></co-checkbox>';
    await tick();
    const sel = document.querySelector('co-select') as HTMLElement & { options?: string[] };
    sel.options = ['All', 'James Bell MD'];
    await tick();
    await tick();
    const seen: unknown[] = [];
    sel.addEventListener('co-change', (e) => seen.push((e as CustomEvent).detail));
    const select = sel.shadowRoot!.querySelector('select')!;
    select.value = 'James Bell MD';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    const cb = document.querySelector('co-checkbox')!;
    cb.addEventListener('co-change', (e) => seen.push((e as CustomEvent).detail));
    cb.shadowRoot!.querySelector('input')!.click();
    expect(seen).toEqual(['James Bell MD', true]);
  });
});

describe('callback arguments', () => {
  it('sends the value alone for onChange(value, event)', async () => {
    document.body.innerHTML = '<co-text-field label="Member ID"></co-text-field>';
    await tick();
    const host = document.querySelector('co-text-field')!;
    const seen: unknown[] = [];
    host.addEventListener('co-change', (e) => seen.push((e as CustomEvent).detail));
    const input = host.shadowRoot!.querySelector('input')!;
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!;
    setter.call(input, 'W123');
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(seen).toEqual(['W123']);
  });
});
