import { act, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it } from 'vitest';
import { RangeContextProvider, setRangeContext, useRangeContext, withRangeContext, type RangeContextId } from './index';

afterEach(() => act(() => setRangeContext(null)));

function Show({ setDefault, prop }: { setDefault?: RangeContextId; prop?: RangeContextId }) {
  return <span data-testid="ctx">{useRangeContext(setDefault, prop)}</span>;
}
const ctx = () => screen.getByTestId('ctx').textContent;

describe('useRangeContext', () => {
  it('defaults to outpatient, then the set default', () => {
    const { rerender } = render(<Show />);
    expect(ctx()).toBe('outpatient');
    rerender(<Show setDefault="ed" />);
    expect(ctx()).toBe('ed');
  });

  it('prop > provider > global > set default', () => {
    const { rerender } = render(
      <RangeContextProvider value="pregnancy">
        <Show setDefault="ed" />
      </RangeContextProvider>
    );
    expect(ctx()).toBe('pregnancy');
    act(() => setRangeContext('inpatient'));
    expect(ctx()).toBe('pregnancy');
    rerender(
      <RangeContextProvider value="pregnancy">
        <Show setDefault="ed" prop="pediatric" />
      </RangeContextProvider>
    );
    expect(ctx()).toBe('pediatric');
    rerender(<Show setDefault="ed" />);
    expect(ctx()).toBe('inpatient');
  });

  it('re-renders when the global context changes', () => {
    render(<Show />);
    act(() => setRangeContext('ed'));
    expect(ctx()).toBe('ed');
    act(() => setRangeContext(null));
    expect(ctx()).toBe('outpatient');
  });

  it('a provider without a value passes the outer context through', () => {
    render(
      <RangeContextProvider value="inpatient">
        <RangeContextProvider value={null}>
          <Show />
        </RangeContextProvider>
      </RangeContextProvider>
    );
    expect(ctx()).toBe('inpatient');
  });

  it('renders on the server', () => {
    expect(
      renderToString(
        <RangeContextProvider value="ed">
          <Show />
        </RangeContextProvider>
      )
    ).toContain('ed');
  });
});

describe('withRangeContext', () => {
  it('passes the rangeContext prop to everything inside and keeps statics', () => {
    function Panel(_: { rangeContext?: RangeContextId; title: string }) {
      return <Show />;
    }
    Panel.phases = ['a'];
    const Wrapped = withRangeContext(Panel);
    render(<Wrapped rangeContext="ed" title="x" />);
    expect(ctx()).toBe('ed');
    expect((Wrapped as unknown as { phases: string[] }).phases).toEqual(['a']);
    expect(Wrapped.displayName).toBe('Panel');
  });
});
