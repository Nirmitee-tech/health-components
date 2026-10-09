import { forwardRef, useState, type HTMLAttributes } from 'react';
import { unitLabel, useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useDomId } from '../../internal/hooks';
import { measureOf, num, NURSING_CONTEXT, Value } from '../../internal/nursing';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Icon } from '../Icon/Icon';

/** The current wound assessment. Measurements in cm; tissue in percent of the wound bed. */
export interface WoundMeasure {
  /** Length in cm */
  length?: number | string;
  /** Width in cm */
  width?: number | string;
  /** Depth in cm */
  depth?: number | string;
  /** Wound bed tissue, percent per type (granulation, slough, eschar, epithelial); should add to 100 */
  tissue?: Record<string, number>;
  /** Exudate amount and type */
  exudate?: string;
  /** Odor */
  odor?: string;
  /** Periwound skin */
  periwound?: string;
  /** Pain at dressing change, 0 to 10 */
  pain?: number;
  /** Undermining ('0.5 cm at 12 o'clock') */
  undermining?: string;
  /** Tunneling */
  tunneling?: string;
  /** Treatment and dressing */
  dressing?: string;
  /** Next dressing change */
  nextChange?: string;
}

/** One wound. */
export interface Wound {
  /** Label ('Wound 1'); default 'Wound' */
  label?: string;
  /** Site */
  location?: string;
  /** Stage or grade ('Stage 3', 'Unstageable', 'Wagner grade 2') */
  stage?: string;
  /** Cause */
  etiology?: string;
  /** First seen */
  onset?: string;
  /** Hospital-acquired pressure injury */
  hapi?: boolean;
  /** Photo summary ('3 photos') */
  photo?: string;
  /** Current assessment */
  current?: WoundMeasure;
}

/** One measurement in the history (oldest first). */
export interface WoundHistoryEntry {
  date: string;
  length: number;
  width: number;
  depth?: number;
  by?: string;
}

export interface WoundCareDocProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The wound; required */
  wound: Wound;
  /** Measurement history, oldest first; default [] */
  history?: WoundHistoryEntry[];
  /** View only; default false */
  readOnly?: boolean;
  /** Called with the current assessment on Save wound assessment */
  onSave?: (current: WoundMeasure) => void;
  /** Called on Add photo; default none */
  onAddPhoto?: () => void;
  /** Card title; default 'Wound Care' */
  title?: string;
  /** Patient line; default none */
  subtitle?: string;
  /** Which shared reference range flags use; default 'inpatient' when no global context is set */
  rangeContext?: RangeContextId;
}

const TISSUE_CLASS: Record<string, string> = {
  granulation: 'nu-tis-granulation',
  slough: 'nu-tis-slough',
  eschar: 'nu-tis-eschar',
  epithelial: 'nu-tis-epithelial',
};
const tissueClass = (k: string) => (Object.prototype.hasOwnProperty.call(TISSUE_CLASS, k) ? TISSUE_CLASS[k] : 'nu-tis-other');

/** Length x width in cm², or null. */
export function woundArea(length: unknown, width: unknown): number | null {
  const l = num(length);
  const w = num(width);
  return l !== null && w !== null ? l * w : null;
}

/**
 * WoundCareDoc documents one wound: site, stage and cause, length, width and depth in cm with computed area and
 * change since first measure, tissue mix, exudate, treatment and the measurement history.
 */
export const WoundCareDoc = forwardRef<HTMLElement, WoundCareDocProps>(function WoundCareDoc(
  { wound, history, readOnly = false, onSave, onAddPhoto, title = 'Wound Care', subtitle, rangeContext, ...rest },
  ref
) {
  const ctx = useRangeContext(NURSING_CONTEXT, rangeContext);
  const idBase = useDomId('co-wound');
  const w = wound || {};
  const hist = history || [];
  const [cur, setCur] = useState<WoundMeasure>(w.current || {});
  const area = woundArea(cur.length, cur.width);
  const first = hist[0];
  const firstArea = first ? woundArea(first.length, first.width) : null;
  const pct = area !== null && firstArea ? ((area - firstArea) / firstArea) * 100 : null;
  const cmUnit = unitLabel(measureOf('cm')!.unit);

  const field = (k: 'length' | 'width' | 'depth', label: string) => {
    const text = label + ' (' + cmUnit + ')';
    if (readOnly) {
      return (
        <div className="nu-lbl">
          <span>{text}</span>
          <Value measure="cm" value={cur[k]} label={label} rangeContext={ctx} />
        </div>
      );
    }
    return (
      <label className="nu-lbl" htmlFor={idBase + '-' + k}>
        {text}
        <input
          id={idBase + '-' + k}
          className="nu-inp nu-num nu-w80"
          inputMode="decimal"
          value={cur[k] == null ? '' : cur[k]}
          onChange={(e) => setCur({ ...cur, [k]: e.target.value })}
        />
      </label>
    );
  };

  const tissue = cur.tissue || {};
  const tKeys = Object.keys(tissue);
  let tsum = 0;
  tKeys.forEach((k) => {
    tsum += num(tissue[k]) || 0;
  });
  const kv: Array<[string, string | undefined]> = [
    ['Exudate', cur.exudate],
    ['Odor', cur.odor],
    ['Periwound', cur.periwound],
  ];

  return (
    <Card
      ref={ref}
      title={title}
      subtitle={subtitle}
      actions={
        w.stage || w.hapi ? (
          <div className="nu-row">
            {w.stage ? <Badge tone={/4|unstage|deep/i.test(w.stage) ? 'danger' : 'warning'}>{w.stage}</Badge> : null}
            {w.hapi ? (
              <Badge tone="danger" icon="alert">
                Hospital-acquired
              </Badge>
            ) : null}
          </div>
        ) : undefined
      }
      {...rest}
    >
      <div className="nu-w">
        <div>
          <div className="nu-w-name">{w.label || 'Wound'}</div>
          {w.location ? <div className="nu-muted">{w.location}</div> : null}
          {w.etiology ? <div className="nu-muted">Cause: {w.etiology}</div> : null}
          {w.onset ? <div className="nu-muted">First seen {w.onset}</div> : null}
          {w.photo ? (
            <div className="nu-photo">
              <Icon name="camera" size={18} /> {w.photo}
            </div>
          ) : null}
        </div>
        <div>
          <div className="nu-row">
            {field('length', 'Length')}
            {field('width', 'Width')}
            {field('depth', 'Depth')}
            <div className="nu-lbl">
              <span>Area (L x W)</span>
              {area !== null ? <Value measure="cm2" value={area} label="Area" rangeContext={ctx} /> : <span className="nu-muted">--</span>}
            </div>
            {pct !== null && first ? (
              <div className="nu-lbl">
                <span>Change since {first.date}</span>
                <span className={pct <= 0 ? 'nu-delta-good' : 'nu-delta-bad'}>
                  <Value measure="pct" value={pct} signed label="Area change" rangeContext={ctx} />
                </span>
              </div>
            ) : null}
          </div>
          {cur.undermining || cur.tunneling ? (
            <div className="nu-muted nu-hint">
              {cur.undermining ? 'Undermining ' + cur.undermining + '. ' : ''}
              {cur.tunneling ? 'Tunneling ' + cur.tunneling + '.' : ''}
            </div>
          ) : null}
          {tKeys.length ? (
            <div className="nu-tissue-wrap">
              <div className="nu-muted nu-tissue-h">
                Wound bed tissue
                {tsum !== 100 ? <span className="nu-tissue-bad"> (adds to {tsum}%, should be 100%)</span> : null}
              </div>
              <div className="nu-tissue" role="img" aria-label={tKeys.map((k) => k + ' ' + tissue[k] + '%').join(', ')}>
                {tKeys.map((k) => (
                  <span key={k} className={tissueClass(k)} style={{ width: (num(tissue[k]) || 0) + '%' }} />
                ))}
              </div>
              <div className="nu-row nu-legend">
                {tKeys.map((k) => (
                  <span key={k} className="nu-ink2">
                    <span className={cx('nu-sw', tissueClass(k))} />
                    {k}{' '}
                    <Value measure="pct" value={tissue[k]} label={k} rangeContext={ctx} />
                  </span>
                ))}
              </div>
            </div>
          ) : null}
          <div className="nu-kv nu-kv-mt">
            {kv.map(([k, v]) =>
              v ? (
                <span key={k}>
                  <span className="l">{k}</span>
                  {v}
                </span>
              ) : null
            )}
            {cur.pain != null ? (
              <span>
                <span className="l">Pain at dressing</span>
                <Value measure="pain" value={cur.pain} label="Pain at dressing" rangeContext={ctx} />
              </span>
            ) : null}
          </div>
          {cur.dressing ? (
            <div className="nu-treat">
              <span className="nu-muted">Treatment: </span>
              {cur.dressing}
              {cur.nextChange ? <span className="nu-muted"> . next change {cur.nextChange}</span> : null}
            </div>
          ) : null}
        </div>
      </div>
      {hist.length ? (
        <div className="nu-tbx nu-tbx-mt">
          <table className="nu-t">
            <caption className="co-sr">Measurement history</caption>
            <thead>
              <tr>
                {['Date', 'Length', 'Width', 'Depth', 'Area', 'By'].map((c, i) => (
                  <th key={c} scope="col" className={i && i < 5 ? 'nu-th-r' : undefined}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hist.map((r, i) => (
                <tr key={i}>
                  <td className="nu-num">{r.date}</td>
                  <td className="nu-c">
                    <Value measure="cm" value={r.length} label="Length" rangeContext={ctx} />
                  </td>
                  <td className="nu-c">
                    <Value measure="cm" value={r.width} label="Width" rangeContext={ctx} />
                  </td>
                  <td className="nu-c">
                    <Value measure="cm" value={r.depth} label="Depth" rangeContext={ctx} />
                  </td>
                  <td className="nu-c">
                    <Value measure="cm2" value={woundArea(r.length, r.width)} label="Area" rangeContext={ctx} />
                  </td>
                  <td>{r.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {readOnly ? null : (
        <div className="nu-row nu-handoff-f">
          <Button size="sm" variant="primary" onClick={() => onSave?.(cur)}>
            Save wound assessment
          </Button>
          <Button size="sm" iconLeft="camera" onClick={onAddPhoto}>
            Add photo
          </Button>
        </div>
      )}
    </Card>
  );
});
