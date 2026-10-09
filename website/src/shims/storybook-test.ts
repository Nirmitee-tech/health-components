/** Docs-site stand-in for Storybook's `fn()` action spy: a plain function that does nothing. */
export const fn =
  <T extends (...args: never[]) => unknown>(impl?: T) =>
  (...args: Parameters<T>) =>
    impl?.(...args);
