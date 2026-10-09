import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import type { RangeContextId } from '../../clinical';
import { useControllableState, useDomId } from '../../internal/hooks';
import { Val, withRangeProvider } from '../../internal/chartPanels';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { Tabs } from '../Tabs/Tabs';

/** One past medical history entry. */
export interface HistoryMedicalItem {
  /** ICD-10-CM code; default none */
  code?: string;
  /** Condition */
  label: string;
  /** When ('2022'); default none */
  when?: string;
  /** Note ('PCI to LAD'); default none */
  note?: string;
  /** Resolved; default false */
  resolved?: boolean;
}

/** One past surgery. */
export interface HistorySurgicalItem {
  /** CPT code; default none */
  cpt?: string;
  /** Procedure */
  label: string;
  /** Date ('03/2022'); default none */
  date?: string;
  /** 'Left' | 'Right' | 'Bilateral'...; default none */
  laterality?: string;
  /** Surgeon; default none */
  surgeon?: string;
  /** Facility; default none */
  site?: string;
  /** Complication; default none */
  complication?: string;
}

/** One condition of a relative. */
export interface HistoryFamilyCondition {
  /** Condition */
  label: string;
  /** Age at onset; default none */
  onset?: number;
  /** It was the cause of death; default false */
  causeOfDeath?: boolean;
}

/** One relative. */
export interface HistoryFamilyMember {
  /** Relation ('Father', 'Maternal grandfather') */
  relation: string;
  /** 'Paternal' | 'Maternal'; default none */
  side?: string;
  /** Current age; default none */
  age?: number;
  /** Deceased; default false */
  deceased?: boolean;
  /** Age at death; default none */
  ageAtDeath?: number;
  /** History unknown (adopted or no contact); default false */
  unknown?: boolean;
  /** Conditions; [] = no known conditions; default none */
  conditions?: HistoryFamilyCondition[];
}

/** One social needs (SDOH) screening answer. */
export interface HistorySdohItem {
  /** Domain ('Food insecurity') */
  domain: string;
  /** LOINC code of the question; default none */
  loinc?: string;
  /** Answer given; empty = declined; default none */
  answer?: string;
  /** 'positive' (need found) | 'negative' | 'declined' */
  result: 'positive' | 'negative' | 'declined';
  /** Referral made; default none (a positive result shows Refer) */
  referral?: string;
}

/** Social history and social needs screening. */
export interface HistorySocial {
  /** Tobacco use ('Former smoker, quit 2015'); default 'Not asked' */
  tobacco?: string;
  /** Pack-years; default 'Not applicable' */
  packYears?: number;
  /** Alcohol use; default 'Not asked' */
  alcohol?: string;
  /** AUDIT-C score; flagged above 3 (men) or above 2 (women), see `sex`; default 'Not screened' */
  auditC?: number;
  /** Sex used for the AUDIT-C cut-off: 'F' | 'M'; default 'M' */
  sex?: 'F' | 'M';
  /** Other substances; default 'Not asked' */
  drugs?: string;
  /** Occupation; default 'Not recorded' */
  occupation?: string;
  /** Who the patient lives with; default 'Not recorded' */
  livesWith?: string;
  /** Sexual activity; default 'Not asked' */
  sexual?: string;
  /** Screening tool ('AHC HRSN'); default none */
  sdohTool?: string;
  /** Screening date; default none */
  sdohDate?: string;
  /** Screening answers; undefined = not asked */
  sdoh?: HistorySdohItem[];
}

export type HistoryTab = 'pmh' | 'psh' | 'fam' | 'soc';

export interface HistoryPanelsProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Past medical history. undefined = not asked, [] = none; default undefined */
  pmh?: HistoryMedicalItem[];
  /** Surgical history. undefined = not asked, [] = none; default undefined */
  psh?: HistorySurgicalItem[];
  /** Family history by relative. undefined = not asked; default undefined */
  family?: HistoryFamilyMember[];
  /** Social history. undefined = not asked; default undefined */
  social?: HistorySocial;
  /** Shown tab (controlled): 'pmh' | 'psh' | 'fam' | 'soc'; default uncontrolled */
  tab?: HistoryTab;
  /** Initial tab; default 'pmh' */
  defaultTab?: HistoryTab;
  /** Called when the tab changes; default none */
  onTabChange?: (tab: HistoryTab) => void;
  /** When and by whom it was last reviewed; default none ('Not reviewed this visit') */
  reviewed?: string;
  /** No Mark Reviewed and Add buttons; default false */
  readOnly?: boolean;
  /** Called by Mark Reviewed; default none */
  onMarkReviewed?: () => void;
  /** Called by Add with the shown tab; default none */
  onAdd?: (tab: HistoryTab) => void;
  /** Called by Refer with the SDOH domain; default none */
  onRefer?: (item: HistorySdohItem) => void;
  /** Card title; default 'History' */
  title?: string;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

function notAsked(what: string) {
  return (
    <Alert tone="warning" title={what + ' not asked'}>
      Ask the patient and record the answer, or record &quot;Patient declined&quot;.
    </Alert>
  );
}

/**
 * HistoryPanels holds past medical, surgical, family and social history in tabs, with family history as a
 * relative-by-relative pedigree list and social history including the social needs (SDOH) screening.
 */
export const HistoryPanels = forwardRef<HTMLElement, HistoryPanelsProps>(function HistoryPanels(
  {
    pmh,
    psh,
    family,
    social: s,
    tab: tabProp,
    defaultTab = 'pmh',
    onTabChange,
    reviewed,
    readOnly = false,
    onMarkReviewed,
    onAdd,
    onRefer,
    title = 'History',
    rangeContext,
    ...rest
  },
  ref
) {
  const [tab, setTab] = useControllableState<HistoryTab>(tabProp, defaultTab, onTabChange);
  const tabsId = useDomId('cp-hist');
  const panelId = tabsId + '-panel';
  const counts = { pmh: (pmh || []).length, psh: (psh || []).length, fam: (family || []).length };
  let body: ReactNode;
  if (tab === 'pmh') {
    body =
      pmh == null ? (
        notAsked('Past medical history')
      ) : !pmh.length ? (
        <Badge tone="success" icon="check">
          No past medical history
        </Badge>
      ) : (
        <ul className="co-list">
          {pmh.map((x, i) => (
            <li key={i} className="co-li">
              {x.code ? <span className="co-code">{x.code}</span> : null}
              <div className="co-li-b">
                <b>{x.label}</b>
                <span className="co-mi-s">{[x.when, x.note].filter(Boolean).join(' . ')}</span>
              </div>
              {x.resolved ? (
                <Badge tone="success" size="sm">
                  Resolved
                </Badge>
              ) : null}
            </li>
          ))}
        </ul>
      );
  } else if (tab === 'psh') {
    body =
      psh == null ? (
        notAsked('Surgical history')
      ) : !psh.length ? (
        <Badge tone="success" icon="check">
          No past surgeries
        </Badge>
      ) : (
        <ul className="co-list">
          {psh.map((x, i) => (
            <li key={i} className="co-li">
              {x.cpt ? <span className="co-code">{x.cpt}</span> : null}
              <div className="co-li-b">
                <b>{x.label}</b>
                <span className="co-mi-s">{[x.date, x.laterality, x.surgeon, x.site].filter(Boolean).join(' . ')}</span>
              </div>
              {x.complication ? (
                <Badge tone="warning" size="sm">
                  {x.complication}
                </Badge>
              ) : null}
            </li>
          ))}
        </ul>
      );
  } else if (tab === 'fam') {
    body =
      family == null ? (
        notAsked('Family history')
      ) : (
        <div className="cp-ped" role="list" aria-label="Family history by relative">
          {family.map((r, i) => [
            <div key={'a' + i} role="listitem">
              <b>{r.relation}</b>
              <span className="co-mi-s" style={{ display: 'block' }}>
                {r.side ? r.side + ' side' : ''}
                {r.deceased
                  ? (r.side ? ' . ' : '') + 'Deceased' + (r.ageAtDeath != null ? ' at ' + r.ageAtDeath : '')
                  : r.age != null
                    ? (r.side ? ' . ' : '') + 'Age ' + r.age
                    : ''}
              </span>
            </div>,
            <div key={'b' + i} className="cp-chips" style={{ paddingBottom: 6, borderBottom: '1px solid var(--co-line-soft)' }}>
              {r.unknown ? (
                <span className="co-mi-s">History unknown (adopted or no contact)</span>
              ) : !r.conditions || !r.conditions.length ? (
                <span className="co-mi-s">No known conditions</span>
              ) : (
                r.conditions.map((c, j) => (
                  <Badge key={j} tone={c.causeOfDeath ? 'danger' : 'outline'}>
                    {c.label + (c.onset != null ? ', onset ' + c.onset : '') + (c.causeOfDeath ? ', cause of death' : '')}
                  </Badge>
                ))
              )}
            </div>,
          ])}
        </div>
      );
  } else {
    body =
      s == null ? (
        notAsked('Social history')
      ) : (
        <div>
          <DescriptionList
            items={[
              ['Tobacco', s.tobacco || 'Not asked'],
              [
                'Pack-years',
                s.packYears != null ? (
                  <Val code="PY" value={s.packYears} over={{ name: 'Pack-years', unit: 'pack-years', dp: 1 }} noRange />
                ) : (
                  'Not applicable'
                ),
              ],
              ['Alcohol', s.alcohol || 'Not asked'],
              [
                'AUDIT-C',
                s.auditC != null ? (
                  <Val
                    code="AUDITC"
                    value={s.auditC}
                    over={{ name: 'AUDIT-C', unit: 'score', dp: 0, high: s.sex === 'F' ? 2 : 3 }}
                    label="AUDIT-C"
                  />
                ) : (
                  'Not screened'
                ),
              ],
              ['Substances', s.drugs || 'Not asked'],
              ['Occupation', s.occupation || 'Not recorded'],
              ['Lives with', s.livesWith || 'Not recorded'],
              ['Sexual activity', s.sexual || 'Not asked'],
            ]}
          />
          <div className="cp-sec">
            {'Social needs screening' + (s.sdohTool ? ' (' + s.sdohTool + (s.sdohDate ? ', ' + s.sdohDate : '') + ')' : '')}
          </div>
          {s.sdoh == null ? (
            notAsked('Social needs screening')
          ) : (
            <div className="co-tbx">
              <table className="co-table">
                <caption className="co-sr">Social needs screening</caption>
                <thead>
                  <tr>
                    {['Domain', 'Answer', 'Result', 'Action'].map((c) => (
                      <th key={c} scope="col" className="co-th-plain">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.sdoh.map((d, i) => (
                    <tr key={i}>
                      <td>
                        {d.domain}
                        {d.loinc ? (
                          <span className="co-mi-s" style={{ display: 'block' }}>
                            {'LOINC ' + d.loinc}
                          </span>
                        ) : null}
                      </td>
                      <td>{d.answer || <span className="co-mi-s">Declined</span>}</td>
                      <td>
                        {d.result === 'positive' ? (
                          <Badge tone="warning" icon="alert">
                            Need found
                          </Badge>
                        ) : d.result === 'declined' ? (
                          <Badge>Declined</Badge>
                        ) : (
                          <Badge tone="success">No need</Badge>
                        )}
                      </td>
                      <td>
                        {d.referral ? (
                          <span>{d.referral}</span>
                        ) : d.result === 'positive' && !readOnly ? (
                          <Button size="sm" aria-label={'Refer for ' + d.domain.toLowerCase()} onClick={() => onRefer?.(d)}>
                            Refer
                          </Button>
                        ) : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      );
  }
  const items = [
    { id: 'pmh', label: 'Medical (' + counts.pmh + ')', panelId },
    { id: 'psh', label: 'Surgical (' + counts.psh + ')', panelId },
    { id: 'fam', label: 'Family (' + counts.fam + ')', panelId },
    { id: 'soc', label: 'Social and needs', panelId },
  ];
  return withRangeProvider(
    rangeContext,
    <Card
      ref={ref}
      title={title}
      subtitle={reviewed ? 'Reviewed ' + reviewed : 'Not reviewed this visit'}
      actions={
        readOnly ? null : (
          <>
            <Button size="sm" onClick={onMarkReviewed}>
              Mark Reviewed
            </Button>
            <Button size="sm" variant="primary" iconLeft="plus" onClick={() => onAdd?.(tab)}>
              Add
            </Button>
          </>
        )
      }
      {...rest}
    >
      <Tabs id={tabsId} label="History sections" value={tab} onChange={(t) => setTab(t as HistoryTab)} items={items} />
      <div id={panelId} role="tabpanel" aria-labelledby={tabsId + '-' + tab} tabIndex={0} style={{ paddingTop: 10 }}>
        {body}
      </div>
    </Card>
  );
});
