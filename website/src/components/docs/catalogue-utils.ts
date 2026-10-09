export type CatalogueEntry = { name: string; layer: string; group: string; groupSlug: string; summary: string; tag: string | null };

export function catalogueGroups(entries: readonly CatalogueEntry[], query = '', layer = 'All') {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const groups: Record<string, CatalogueEntry[]> = {};
  for (const entry of entries) {
    const searchable = `${entry.name} ${entry.group} ${entry.summary} ${entry.tag ?? ''}`.toLowerCase();
    if (layer !== 'All' && entry.layer !== layer) continue;
    if (!terms.every((term) => searchable.includes(term))) continue;
    const key = `${entry.layer} · ${entry.group}`;
    (groups[key] ??= []).push(entry);
  }
  return Object.keys(groups)
    .sort((a, b) => a.startsWith('Basic') === b.startsWith('Basic') ? a.localeCompare(b) : a.startsWith('Basic') ? -1 : 1)
    .map((label) => ({ label, entries: groups[label]! }));
}
