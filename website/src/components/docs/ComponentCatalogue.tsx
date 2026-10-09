import { useState } from 'react';
import { catalogueGroups, type CatalogueEntry } from './catalogue-utils';

export function ComponentCatalogue({ entries, base }: { entries: readonly CatalogueEntry[]; base: string }) {
  const [query, setQuery] = useState('');
  const [layer, setLayer] = useState('All');
  const groups = catalogueGroups(entries, query, layer);
  const count = groups.reduce((sum, group) => sum + group.entries.length, 0);
  return (
    <div className="docs-catalogue">
      <div className="docs-catalogue-tools">
        <label className="docs-catalogue-search">Find a component
          <input type="search" placeholder="Search by name, workflow or purpose" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
        <label>Component layer
          <select value={layer} onChange={(event) => setLayer(event.target.value)}>
            <option>All</option><option>Basic</option><option>Complex</option>
          </select>
        </label>
      </div>
      <p role="status" className="docs-catalogue-count">{count} components{query ? ` matching “${query}”` : ' available'}. Open a component for live examples, variants and usage.</p>
      {!count && <div className="docs-catalogue-empty"><h2>No matching components</h2><p>Try a shorter name or choose another layer.</p><button type="button" onClick={() => { setQuery(''); setLayer('All'); }}>Clear filters</button></div>}
      {groups.map(({ label, entries: items }) => (
        <section key={label} className="docs-cat-group">
          <h2 id={label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}>{label} <span>{items.length}</span></h2>
          <div className="docs-cat-grid">
            {items.map((entry) => <a key={entry.name} className="docs-cat-card" href={`${base}${entry.groupSlug}/${entry.name}/`}>
              <strong>{entry.name}<span aria-hidden="true">↗</span></strong><span>{entry.summary}</span><small>Live examples · Props · Usage</small>
            </a>)}
          </div>
        </section>
      ))}
    </div>
  );
}
