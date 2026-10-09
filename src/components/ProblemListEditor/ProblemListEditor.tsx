import { forwardRef, useRef, useState, type HTMLAttributes } from 'react';
import type { RangeContextId } from '../../clinical';
import { useControllableState, useDomId } from '../../internal/hooks';
import { withRangeProvider } from '../../internal/chartPanels';
import { Alert } from '../Alert/Alert';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { Select } from '../Select/Select';

/** One ICD-10-CM candidate from the SNOMED CT map table. */
export interface ProblemIcdCandidate {
  /** ICD-10-CM code ('I48.0') */
  code: string;
  /** Code description */
  label: string;
  /** Map rule ('IF episodes end within 7 days'); default none */
  rule?: string;
}

/** Problem status values the editor offers. */
export type ProblemStatus = 'Active' | 'Inactive' | 'Resolved' | 'Entered in error';

/** One problem. */
export interface ProblemListEditorItem {
  /** SNOMED CT concept id */
  snomed: string;
  /** Concept name */
  label: string;
  /** ICD-10-CM candidates from the map; [] = no map; default none */
  icd?: ProblemIcdCandidate[];
  /** ICD-10-CM code a person picked; default none */
  picked?: string;
  /** Onset; default none */
  onset?: string;
  /** Status ('Active', 'Resolved'...); default none (shown as Active in the editor) */
  status?: ProblemStatus | string;
  /** HCC category; default none */
  hcc?: string;
  /** Principal problem; default false */
  principal?: boolean;
}

/** Map state of a problem. */
export type ProblemMapState = 'exact' | 'choose' | 'none' | 'chosen';

/** Tone and words of each map state. */
export const problemMapStates: Record<ProblemMapState, { tone: BadgeTone; label: string }> = {
  exact: { tone: 'success', label: 'One ICD-10 match' },
  choose: { tone: 'warning', label: 'Pick ICD-10 code' },
  none: { tone: 'danger', label: 'No ICD-10 map' },
  chosen: { tone: 'info', label: 'ICD-10 picked' },
};

export interface ProblemListEditorProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Initial problems; the editor keeps its own copy; default none (empty state) */
  items?: ProblemListEditorItem[];
  /** Called with the problems after every change (code picked, status changed); default none */
  onItemsChange?: (items: ProblemListEditorItem[]) => void;
  /** Index of the problem being edited (controlled), -1 for none; default uncontrolled */
  editing?: number;
  /** Index of the problem open for editing at first; default -1 (none) */
  defaultEditing?: number;
  /** Called when a problem opens or closes for editing; default none */
  onEditingChange?: (index: number) => void;
  /** Called by Add Problem (open your SNOMED CT search); default none */
  onAdd?: () => void;
  /** No edit buttons; default false */
  readOnly?: boolean;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

const STATUSES: ProblemStatus[] = ['Active', 'Inactive', 'Resolved', 'Entered in error'];

/*
 * The SNOMED to ICD-10 map shown is a candidate list from the map table. A person picks the billable code; a
 * single-target map is shown as matched, never as approved.
 */

/**
 * ProblemListEditor records problems as SNOMED CT concepts and shows the ICD-10-CM codes the map table offers, so a
 * person picks the billable code the note supports.
 */
export const ProblemListEditor = forwardRef<HTMLElement, ProblemListEditorProps>(function ProblemListEditor(
  { items: itemsProp, onItemsChange, editing, defaultEditing = -1, onEditingChange, onAdd, readOnly = false, rangeContext, ...rest },
  ref
) {
  const base = useDomId('cp-ple');
  const [items, setItemsState] = useState<ProblemListEditorItem[]>(itemsProp || []);
  const [edit, setEdit] = useControllableState<number>(editing, defaultEditing, onEditingChange);
  /* The item as it was when editing opened, so Cancel can put it back. */
  const snapshot = useRef<{ index: number; item: ProblemListEditorItem } | null>(null);
  const setItems = (next: ProblemListEditorItem[]) => {
    setItemsState(next);
    onItemsChange?.(next);
  };
  const upd = (i: number, o: Partial<ProblemListEditorItem>) => {
    if (!snapshot.current || snapshot.current.index !== i) snapshot.current = { index: i, item: items[i]! };
    setItems(items.map((x, j) => (j === i ? { ...x, ...o } : x)));
  };
  const open = (i: number) => {
    snapshot.current = i >= 0 && items[i] ? { index: i, item: items[i]! } : null;
    setEdit(i);
  };
  const done = () => {
    snapshot.current = null;
    setEdit(-1);
  };
  const cancel = () => {
    const s = snapshot.current;
    if (s && items[s.index] !== s.item) setItems(items.map((x, j) => (j === s.index ? s.item : x)));
    snapshot.current = null;
    setEdit(-1);
  };

  return withRangeProvider(
    rangeContext,
    <Card
      ref={ref}
      title="Problem List"
      subtitle="SNOMED CT concept with ICD-10-CM for billing"
      actions={
        readOnly ? null : (
          <Button size="sm" variant="primary" iconLeft="plus" onClick={onAdd}>
            Add Problem
          </Button>
        )
      }
      {...rest}
    >
      {!items.length ? (
        <EmptyState compact title="No problems recorded">
          Search by words or SNOMED CT code.
        </EmptyState>
      ) : (
        <ul className="co-list">
          {items.map((x, i) => {
            const maps = x.icd || [];
            const state: ProblemMapState = x.picked ? 'chosen' : !maps.length ? 'none' : maps.length === 1 ? 'exact' : 'choose';
            const t = problemMapStates[state];
            const code = x.picked || (maps.length === 1 ? maps[0]!.code : null);
            const isEditing = edit === i && !readOnly;
            return (
              <li key={i} className="co-li" style={{ flexWrap: 'wrap' }}>
                <div className="co-li-b" style={{ minWidth: 260 }}>
                  <b>{x.label}</b>
                  <span className="co-mi-s">
                    {'SNOMED CT ' + x.snomed + (x.onset ? ' . Onset ' + x.onset : '') + (x.status ? ' . ' + x.status : '')}
                  </span>
                  <div className="co-row co-gap-6" style={{ marginTop: 4 }}>
                    {code ? <span className="co-code">{code}</span> : null}
                    <Badge tone={t.tone} size="sm">
                      {t.label}
                    </Badge>
                    {x.hcc ? (
                      <Badge tone="outline" size="sm">
                        {'HCC ' + x.hcc}
                      </Badge>
                    ) : null}
                    {x.principal ? (
                      <Badge tone="info" size="sm">
                        Principal
                      </Badge>
                    ) : null}
                  </div>
                  {isEditing ? (
                    <div className="co-dt" style={{ marginTop: 8 }}>
                      {maps.length > 1 ? (
                        <fieldset className="co-fs">
                          <legend className="co-lbl">ICD-10-CM candidates from the map. Pick the one the note supports.</legend>
                          {maps.map((m) => (
                            <label key={m.code} className="co-chk">
                              <input
                                type="radio"
                                name={base + '-map-' + i}
                                className="co-box"
                                checked={x.picked === m.code}
                                onChange={() => upd(i, { picked: m.code })}
                              />
                              <span className="co-chk-t">
                                <span>
                                  <span className="co-code">{m.code}</span> {m.label}
                                </span>
                                {m.rule ? <span className="co-help">{'Map rule: ' + m.rule}</span> : null}
                              </span>
                            </label>
                          ))}
                        </fieldset>
                      ) : !maps.length ? (
                        <Alert tone="warning">This concept has no ICD-10-CM map. Pick a code by hand or choose a more specific concept.</Alert>
                      ) : null}
                      <Select
                        label="Status"
                        size="sm"
                        value={x.status || 'Active'}
                        onChange={(e) => upd(i, { status: e.target.value })}
                        options={STATUSES}
                      />
                      <div className="co-row co-gap-8">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={done}
                        >
                          Done
                        </Button>
                        <Button size="sm" onClick={cancel}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : null}
                </div>
                {readOnly ? null : (
                  <Button
                    size="sm"
                    variant="tertiary"
                    aria-expanded={isEditing}
                    aria-label={(isEditing ? 'Close ' : 'Edit ') + x.label}
                    onClick={() => (isEditing ? done() : open(i))}
                  >
                    {isEditing ? 'Close' : 'Edit'}
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
});
