export type ClassValue = string | false | null | undefined | 0;

/** Joins truthy class names with a space. */
export function cx(...classes: ClassValue[]): string {
  let out = '';
  for (const c of classes) if (c) out += (out ? ' ' : '') + c;
  return out;
}
