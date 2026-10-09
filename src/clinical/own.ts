/** Own-property lookup that never returns inherited members such as `constructor` or `toString`. Internal. */
export function ownValue<T>(map: Readonly<Record<string, T>>, key: string | null | undefined): T | undefined {
  return key != null && Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;
}
