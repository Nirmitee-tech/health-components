import { Icon, iconNames } from '@lib/components/Icon/Icon';
import { tokens } from '@lib/tokens/tokens';
import { useState } from 'react';

type Entry = { name: string; cssVar: string; value: string | Record<string, string>; usage: string };
const themes = tokens.themes as readonly { id: string; name: string }[];
const val = (v: Entry['value'], t: string) => (typeof v === 'string' ? v : (v[t] ?? v[themes[0]!.id]!));
/** Escapes markdown-style backticks in usage notes into <code>. */
function Usage({ text }: { text: string }) {
  const parts = text.split(/`([^`]+)`/);
  return <>{parts.map((p, i) => (i % 2 ? <code key={i}>{p}</code> : p))}</>;
}

export function ColorTokens({ filter }: { filter?: string }) {
  const list = (tokens.color as readonly Entry[]).filter((t) => !filter || new RegExp(filter).test(t.name));
  return (
    <div className="docs-table-wrap">
      <table className="docs-props docs-swatches">
        <thead>
          <tr>
            <th>Token</th>
            {themes.map((t) => (
              <th key={t.id}>{t.name}</th>
            ))}
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          {list.map((t) => (
            <tr key={t.name}>
              <td>
                <code>{t.cssVar}</code>
              </td>
              {themes.map((th) => {
                const c = val(t.value, th.id);
                return (
                  <td key={th.id}>
                    <span className="docs-swatch" style={{ background: c }} title={c} />
                    <span className="docs-hex">{c.startsWith('rgba') ? c.replace(/\s/g, '') : c}</span>
                  </td>
                );
              })}
              <td className="docs-usage">
                <Usage text={t.usage} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ScaleTokens({ family, visual }: { family: 'spacing' | 'radius' | 'shadow' | 'zIndex' | 'density'; visual?: 'bar' | 'radius' | 'shadow' }) {
  const list = tokens[family] as readonly Entry[];
  return (
    <div className="docs-table-wrap">
      <table className="docs-props">
        <thead>
          <tr>
            <th>Token</th>
            <th>Value</th>
            {visual ? <th>Sample</th> : null}
            <th>Usage</th>
          </tr>
        </thead>
        <tbody>
          {list.map((t) => {
            const v = val(t.value, 'classic');
            return (
              <tr key={t.name}>
                <td>
                  <code>{t.cssVar}</code>
                </td>
                <td>
                  <code>{typeof t.value === 'string' ? t.value : Object.entries(t.value).map(([k, x]) => `${k}: ${x}`).join('; ')}</code>
                </td>
                {visual === 'bar' ? (
                  <td>
                    <span className="docs-bar" style={{ width: v }} />
                  </td>
                ) : visual === 'radius' ? (
                  <td>
                    <span className="docs-radius" style={{ borderRadius: v }} />
                  </td>
                ) : visual === 'shadow' ? (
                  <td>
                    <span className="docs-shadow" style={{ boxShadow: v }} />
                  </td>
                ) : null}
                <td className="docs-usage">
                  <Usage text={t.usage} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

type TypeStyle = { name: string; fontSize: string; lineHeight: string; fontWeight: number; letterSpacing?: string; sample?: string; usage?: string; textTransform?: string };

export function TypeScale() {
  const families = tokens.typography.families as Record<string, { cssVar: string; value: string }>;
  return (
    <>
      <div className="docs-table-wrap">
        <table className="docs-props">
          <thead>
            <tr>
              <th>Family</th>
              <th>Variable</th>
              <th>Stack</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(families).map(([k, f]) => (
              <tr key={k}>
                <td>{k}</td>
                <td>
                  <code>{f.cssVar}</code>
                </td>
                <td style={{ fontFamily: f.value }}>{f.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(tokens.typography.groups as readonly { name: string; family: string; styles: readonly TypeStyle[] }[]).map((g) => (
        <div key={g.name}>
          <h3>{g.name}</h3>
          <div className="docs-type-list">
            {g.styles.map((s) => (
              <div key={s.name} className="docs-type-row">
                <div className="docs-type-meta">
                  <code>{s.name}</code>
                  <span>
                    {s.fontSize} / {s.lineHeight} · {s.fontWeight}
                  </span>
                </div>
                <div
                  className="docs-type-sample"
                  style={{
                    fontFamily: families[g.family]?.value,
                    fontSize: s.fontSize,
                    lineHeight: s.lineHeight,
                    fontWeight: s.fontWeight,
                    letterSpacing: s.letterSpacing,
                    textTransform: s.name === 'overline' ? 'uppercase' : undefined,
                  }}
                >
                  {s.sample ?? 'Henna West, F, 38 y'}
                </div>
                {s.usage ? <div className="docs-usage">{s.usage}</div> : null}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export function IconGallery() {
  const [q, setQ] = useState('');
  const list = iconNames.filter((n) => n.includes(q.toLowerCase()));
  return (
    <div>
      <input className="docs-search" placeholder={`Filter ${iconNames.length} icons`} value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter icons" />
      <div className="docs-icon-grid">
        {list.map((n) => (
          <div key={n} className="docs-icon-cell">
            <Icon name={n} size={24} />
            <code>{n}</code>
          </div>
        ))}
      </div>
    </div>
  );
}
