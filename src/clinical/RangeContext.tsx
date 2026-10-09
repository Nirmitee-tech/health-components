/*
 * Range context for React.
 * RangeContextProvider passes a context down a tree; a component's `rangeContext` prop does the same for its own
 * subtree. useRangeContext(setDefault, prop) returns the context that applies and re-renders on setRangeContext.
 * SSR safe: no window or document access; the global setting is read with useSyncExternalStore.
 */
import { createContext, createElement, useContext, useSyncExternalStore, type ComponentType, type ReactNode } from 'react';
import { getRangeContext, isRangeContext, onRangeContext, resolveContext, type RangeContextId } from './ranges';

/** The React context that carries a range context down a tree (CareOS.RangeContext in the source). null = none. */
export const RangeContext = createContext<RangeContextId | null>(null);
RangeContext.displayName = 'RangeContext';

export interface RangeContextProviderProps {
  /**
   * Range context for every value inside: 'outpatient' | 'inpatient' | 'ed' | 'pediatric' | 'pregnancy'.
   * null or undefined passes the outer provider's context through unchanged.
   */
  value?: RangeContextId | null;
  children?: ReactNode;
}

/**
 * Sets the range context for a subtree. It ranks with a component's own `rangeContext` prop: above the global
 * setRangeContext and the set's default; a lab range passed on a result (refLow/refHigh) still wins.
 */
export function RangeContextProvider({ value, children }: RangeContextProviderProps) {
  const outer = useContext(RangeContext);
  const next = isRangeContext(value) ? value : outer;
  return createElement(RangeContext.Provider, { value: next }, children);
}

const subscribe = (cb: () => void) => onRangeContext(cb);

/**
 * The range context that applies to a component. Precedence: `prop` > nearest RangeContextProvider > global
 * setRangeContext > `setDefault` (the set's own default: 'ed' for ED parts, 'inpatient' for inpatient parts...) >
 * 'outpatient'. Re-renders when setRangeContext is called.
 */
export function useRangeContext(setDefault?: RangeContextId | null, prop?: RangeContextId | null): RangeContextId {
  const inherited = useContext(RangeContext);
  /* Subscribing re-renders on setRangeContext; the snapshot keeps server and client renders consistent. */
  useSyncExternalStore(subscribe, getRangeContext, getRangeContext);
  return resolveContext((isRangeContext(prop) ? prop : null) || inherited, setDefault);
}

/** Props of a component wrapped by withRangeContext. */
export interface RangeContextProp {
  /** Which shared reference range flags use inside this component; the lab range on a result still wins. */
  rangeContext?: RangeContextId | null;
}

/**
 * Wraps a component so its `rangeContext` prop reaches every value inside it (through RangeContextProvider).
 * Static members (e.g. `.phases`) are copied. On React 18 the wrapper does not forward refs: a forwardRef component
 * should instead render `<RangeContextProvider value={rangeContext}>` around its own content.
 */
export function withRangeContext<P extends RangeContextProp>(Comp: ComponentType<P>): ComponentType<P> {
  function WithRangeContext(p: P) {
    const el = createElement(Comp, p);
    return p && p.rangeContext ? createElement(RangeContextProvider, { value: p.rangeContext }, el) : el;
  }
  for (const k of Object.keys(Comp)) {
    if (k === 'displayName' || k === 'propTypes' || k === 'defaultProps' || k === '$$typeof' || k === 'render') continue;
    (WithRangeContext as unknown as Record<string, unknown>)[k] = (Comp as unknown as Record<string, unknown>)[k];
  }
  WithRangeContext.displayName = Comp.displayName || Comp.name;
  return WithRangeContext;
}
