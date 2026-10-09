import { forwardRef, useState, type HTMLAttributes } from 'react';
import { useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { chartValue, Val, withContext, withRangeProvider, worstFlag, type ChartValueOverride } from '../../internal/chartPanels';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { Checkbox } from '../Checkbox/Checkbox';
import { Select } from '../Select/Select';
import { TextArea } from '../TextArea/TextArea';

export type ResultReviewStatus = 'new' | 'acknowledged' | 'routed';

/** One test row of the result. */
export interface ResultReviewRow {
  /** Measure code: a section key ('Na', 'K', 'Cr'...), a shared fmt key or a LOINC code */
  code: string;
  /** This result, unrounded */
  value: number;
  /** The prior result; default none */
  prior?: number;
  /** Lab range, unit or decimals sent with the result; wins over the shared registry; default none */
  over?: ChartValueOverride;
}

/** One chart comment on the result. */
export interface ResultReviewComment {
  /** Who wrote it */
  by: string;
  /** Comment text */
  text: string;
  /** When ('10/09/2026 10:15', 'Just now') */
  at: string;
}

/** One resulted order. */
export interface ResultReviewResult {
  /** Order name ('Basic metabolic panel') */
  title: string;
  /** Patient line; default none */
  patient?: string;
  /** Ordering clinician */
  orderedBy: string;
  /** Collection time */
  collected: string;
  /** Result time */
  resulted: string;
  /** Test rows */
  rows: ResultReviewRow[];
  /** Initial status: 'new' | 'acknowledged' | 'routed'; default 'new' */
  status?: ResultReviewStatus;
  /** Existing comments; default none */
  comments?: ResultReviewComment[];
  /** Lab comment; default none */
  interpretation?: string;
  /** Who the critical value was called to; default 'the ordering clinician' */
  calledTo?: string;
  /** Who acknowledged it; default `user`, else 'you' */
  ackBy?: string;
  /** When it was acknowledged; default none */
  ackAt?: string;
  /** Who it was routed to; default none */
  routedTo?: string;
}

export interface ResultsReviewProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** The resulted order; required */
  result: ResultReviewResult;
  /** People and pools the result can be routed to; default none */
  routeOptions?: string[];
  /** Name of the signed-in user, used on new comments; default 'You' */
  user?: string;
  /** View only (role cannot acknowledge); default false */
  readOnly?: boolean;
  /** Review status (controlled); default uncontrolled, starting at `result.status` */
  status?: ResultReviewStatus;
  /** Called when the status changes; default none */
  onStatusChange?: (status: ResultReviewStatus) => void;
  /** Called when the user acknowledges the result; default none */
  onAcknowledge?: () => void;
  /** Called with a comment the user adds; default none */
  onComment?: (comment: ResultReviewComment) => void;
  /** Called with the person or pool the result is routed to; default none */
  onRoute?: (to: string) => void;
  /** Called when the user clicks Notify Patient; default none */
  onNotifyPatient?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/**
 * ResultsReview is the inbox detail for one resulted order: values against the prior draw, then Acknowledge,
 * Comment, Route and Notify Patient. A critical value needs the read-back recorded before Acknowledge.
 */
export const ResultsReview = forwardRef<HTMLElement, ResultsReviewProps>(function ResultsReview(
  {
    result: r,
    routeOptions,
    user,
    readOnly = false,
    status: statusProp,
    onStatusChange,
    onAcknowledge,
    onComment,
    onRoute,
    onNotifyPatient,
    rangeContext,
    ...rest
  },
  ref
) {
  const ctx = useRangeContext(null, rangeContext);
  const [status, setStatus] = useControllableState<ResultReviewStatus>(statusProp, r.status || 'new', onStatusChange);
  const [comments, setComments] = useState<ResultReviewComment[]>(r.comments || []);
  const [draft, setDraft] = useState('');
  const [routed, setRouted] = useState(r.routedTo || '');
  const [routeDraft, setRouteDraft] = useState('');
  const [mode, setMode] = useState<'comment' | 'route' | null>(null);
  const [readBack, setReadBack] = useState(false);
  const rows = r.rows || [];
  const flags = rows.map((x) => chartValue(x.code, x.value, withContext(x.over, ctx)).flag);
  const w = worstFlag(flags);
  const crit = w === 'HH' || w === 'LL';
  const tag =
    status === 'acknowledged' ? (
      <Badge tone="success" icon="check">
        Acknowledged
      </Badge>
    ) : status === 'routed' ? (
      <Badge tone="info" icon="send">
        {'Routed to ' + routed}
      </Badge>
    ) : (
      <Badge tone={crit ? 'danger' : w ? 'warning' : 'neutral'} icon={crit ? 'alert' : undefined}>
        {crit ? 'Critical, not acknowledged' : 'New'}
      </Badge>
    );
  const locked = readOnly || status === 'acknowledged';
  const subtitle = [r.patient, 'Ordered by ' + r.orderedBy, 'Collected ' + r.collected, 'Resulted ' + r.resulted].filter(Boolean).join(' . ');

  return withRangeProvider(
    rangeContext,
    <Card ref={ref} title={r.title} subtitle={subtitle} actions={tag} {...rest}>
      {crit && status !== 'acknowledged' ? (
        <Alert tone="error" title="Critical value">
          {'Called to ' + (r.calledTo || 'the ordering clinician') + '. Acknowledge only after the read-back is done.'}
        </Alert>
      ) : null}
      <div className="co-tbx">
        <table className="co-table">
          <caption className="co-sr">{r.title}</caption>
          <thead>
            <tr>
              {['Test', 'Result', 'Reference range', 'Prior'].map((c, i) => (
                <th key={c} scope="col" className={cx('co-th-plain', (i === 1 || i === 3) && 'co-num')}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((x, i) => {
              const f = chartValue(x.code, x.value, withContext(x.over, ctx));
              return (
                <tr key={i} className={f.flag && f.flag.length === 2 ? 'is-crit' : undefined}>
                  <td>
                    {f.m.name}
                    <span className="co-mi-s" style={{ display: 'block' }}>
                      {'LOINC ' + (f.m.loinc || 'none')}
                    </span>
                  </td>
                  <td className="co-num">
                    <Val code={x.code} value={x.value} over={x.over} label={f.m.name} />
                  </td>
                  <td>
                    <span className="cp-rr">{f.range}</span>
                  </td>
                  <td className="co-num">
                    {x.prior != null ? (
                      <Val code={x.code} value={x.prior} over={x.over} label={'Prior ' + f.m.name} />
                    ) : (
                      <span className="co-mi-s">None</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {r.interpretation ? (
        <p className="co-help" style={{ margin: '8px 0' }}>
          {'Lab comment: ' + r.interpretation}
        </p>
      ) : null}
      {comments.length ? (
        <div>
          <div className="cp-sec">Comments</div>
          <ul className="co-list">
            {comments.map((c, i) => (
              <li key={i} className="co-li">
                <div className="co-li-b">
                  <b>{c.by}</b>
                  <span>{c.text}</span>
                  <span className="co-mi-s">{c.at}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {mode === 'comment' ? (
        <div className="co-dt">
          <TextArea label="Comment for the chart" value={draft} onChange={(v) => setDraft(v)} rows={2} />
          <div className="co-row co-gap-8">
            <Button
              size="sm"
              variant="primary"
              disabled={!draft.trim()}
              onClick={() => {
                const c: ResultReviewComment = { by: user || 'You', text: draft.trim(), at: 'Just now' };
                setComments(comments.concat([c]));
                setDraft('');
                setMode(null);
                onComment?.(c);
              }}
            >
              Add Comment
            </Button>
            <Button size="sm" onClick={() => setMode(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
      {mode === 'route' ? (
        <div className="co-dt">
          <Select
            label="Route to"
            value={routeDraft}
            onChange={(e) => setRouteDraft(e.target.value)}
            options={[{ value: '', label: 'Choose a person or pool' }].concat((routeOptions || []).map((o) => ({ value: o, label: o })))}
          />
          <div className="co-row co-gap-8">
            <Button
              size="sm"
              variant="primary"
              disabled={!routeDraft}
              onClick={() => {
                setRouted(routeDraft);
                setStatus('routed');
                setMode(null);
                onRoute?.(routeDraft);
              }}
            >
              Route
            </Button>
            <Button size="sm" onClick={() => setMode(null)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
      {crit && !locked ? (
        <Checkbox
          label="Read-back done with the lab"
          description="Required for a critical value"
          checked={readBack}
          onChange={(e) => setReadBack(e.target.checked)}
        />
      ) : null}
      {locked ? (
        status === 'acknowledged' ? (
          <Alert tone="success">{'Acknowledged by ' + (r.ackBy || user || 'you') + (r.ackAt ? ' at ' + r.ackAt : '') + '.'}</Alert>
        ) : (
          <Alert tone="lock">Your role can view results but not acknowledge them.</Alert>
        )
      ) : (
        <div className="co-row co-gap-8" style={{ marginTop: 8, flexWrap: 'wrap' }}>
          <Button
            variant="primary"
            iconLeft="check"
            disabled={crit && !readBack}
            onClick={() => {
              setStatus('acknowledged');
              onAcknowledge?.();
            }}
          >
            Acknowledge
          </Button>
          <Button iconLeft="message" onClick={() => setMode('comment')}>
            Comment
          </Button>
          <Button
            iconLeft="send"
            onClick={() => {
              setRouteDraft(routed);
              setMode('route');
            }}
          >
            Route
          </Button>
          <Button variant="tertiary" onClick={onNotifyPatient}>
            Notify Patient
          </Button>
        </div>
      )}
    </Card>
  );
});
