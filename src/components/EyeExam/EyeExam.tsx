import { forwardRef, type HTMLAttributes } from 'react';
import { RangeContextProvider, useRangeContext, type RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { Muted, SpecHeading, SpecTable, V, specFmt } from '../../internal/specialty';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

/** Acuity and pressure for one eye. Acuity is Snellen text ('20/40'). */
export interface EyeFindings {
  /** Distance acuity without correction */
  vaSc?: string;
  /** Distance acuity with correction */
  vaCc?: string;
  /** Pinhole acuity */
  ph?: string;
  /** Near acuity with correction ('J1') */
  near?: string;
  /** Intraocular pressure in mmHg */
  iop?: number | null;
}

/** The exam: both eyes plus how and when IOP was taken. */
export interface EyeExamData {
  /** Right eye */
  od?: EyeFindings;
  /** Left eye */
  os?: EyeFindings;
  /** Tonometry method; default 'Goldmann' */
  iopMethod?: string;
  /** Time IOP was taken ('10:20') */
  iopTime?: string;
}

/** Lens powers for one eye. */
export interface RefractionEye {
  /** Sphere in dioptres */
  sph?: number | null;
  /** Cylinder in dioptres (minus form); 0 or none reads DS */
  cyl?: number | null;
  /** Axis 1-180 degrees */
  axis?: number | null;
  /** Near add in dioptres */
  add?: number | null;
  /** Prism text */
  prism?: string;
  /** Acuity with this Rx */
  va?: string;
}

/** One refraction (Manifest, Cycloplegic, Autorefraction, Final Rx). */
export interface Refraction {
  type: string;
  od?: RefractionEye;
  os?: RefractionEye;
}

export interface EyeExamProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** {od, os, iopMethod, iopTime}; required */
  exam: EyeExamData;
  /** Refraction rows; default [] */
  refractions?: ReadonlyArray<Refraction>;
  /** Card title; default 'Eye exam' */
  title?: string;
  /** Line under the title; default none */
  subtitle?: string;
  /** Hides Copy Last Exam and Finalize Rx; default false */
  readOnly?: boolean;
  /** Copy Last Exam action; default none */
  onCopyLastExam?: () => void;
  /** Finalize Rx action; default none */
  onFinalizeRx?: () => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/** The denominator of a Snellen fraction ('20/40' gives 40), or null. */
export function snellenDenominator(s: string | null | undefined): number | null {
  if (!s) return null;
  const m = String(s).match(/^20\/(\d+)/);
  return m ? +m[1]! : null;
}

function VA({ v }: { v?: string }) {
  if (!v) return <Muted>Not tested</Muted>;
  const d = snellenDenominator(v);
  const bad = d != null && d >= 200;
  const red = d != null && d > 40;
  return (
    <span className={cx('co-sp-val', red && 'is-flag')}>
      <b aria-hidden="true">{v}</b>
      <span className="co-sp-val-u" aria-hidden="true">
        Snellen
      </span>
      <span className="co-sr">{v + ' Snellen' + (bad ? ', legally blind range' : red ? ', reduced' : '')}</span>
      {red ? (
        <Badge tone={bad ? 'danger' : 'warning'} size="sm" aria-hidden="true">
          {bad ? '20/200 or worse' : 'Worse than 20/40'}
        </Badge>
      ) : null}
    </span>
  );
}

const EMPTY: ReadonlyArray<Refraction> = [];

/**
 * EyeExam records right eye (OD) and left eye (OS) visual acuity, intraocular pressure and refraction in one place,
 * with flags for reduced acuity, high pressure and pressure asymmetry.
 */
export const EyeExam = forwardRef<HTMLElement, EyeExamProps>(function EyeExam(
  {
    exam,
    refractions = EMPTY,
    title = 'Eye exam',
    subtitle,
    readOnly = false,
    onCopyLastExam,
    onFinalizeRx,
    rangeContext,
    className,
    ...rest
  },
  ref
) {
  const ctx = useRangeContext(null, rangeContext);
  const e = exam || {};
  const eyes: Array<[string, string, EyeFindings]> = [
    ['OD', 'Right eye', e.od || {}],
    ['OS', 'Left eye', e.os || {}],
  ];
  const asym = !!e.od && !!e.os && e.od.iop != null && e.os.iop != null && Math.abs(e.od.iop - e.os.iop) >= 4;
  const hi = eyes.some((x) => specFmt('iop', x[2].iop, { context: ctx }).flag === 'HH');
  return (
    <RangeContextProvider value={rangeContext}>
      <Card
        ref={ref}
        className={cx('co-eye', className)}
        title={title}
        subtitle={subtitle}
        actions={
          readOnly ? null : (
            <>
              <Button size="sm" onClick={onCopyLastExam}>
                Copy Last Exam
              </Button>
              <Button size="sm" variant="primary" onClick={onFinalizeRx}>
                Finalize Rx
              </Button>
            </>
          )
        }
        {...rest}
      >
        {hi ? (
          <Alert tone="error" title="IOP at or above 30 mmHg">
            Recheck and treat or refer the same day. Angle-closure must be ruled out.
          </Alert>
        ) : null}
        {asym ? (
          <Alert tone="warning" title="IOP differs by 4 mmHg or more between eyes">
            Asymmetry is a glaucoma risk sign. Consider gonioscopy and OCT of the nerve.
          </Alert>
        ) : null}
        <SpecHeading first>Visual acuity and pressure</SpecHeading>
        <SpecTable
          caption="Visual acuity and intraocular pressure"
          rowHead
          cols={['Eye', 'Distance sc', 'Distance cc', 'Pinhole', 'Near cc', 'IOP', 'Method']}
          num={[5]}
          rows={eyes.map(([ab, name, o]) => [
            <span key="e">
              <b>{ab}</b>
              <span className="co-mi-s">{name}</span>
            </span>,
            <VA key="sc" v={o.vaSc} />,
            <VA key="cc" v={o.vaCc} />,
            <VA key="ph" v={o.ph} />,
            o.near ? (
              <span key="n" className="co-sp-num">
                {o.near}
              </span>
            ) : (
              <span key="n" className="co-mi-s">
                Not tested
              </span>
            ),
            <V key="iop" k="iop" v={o.iop} />,
            e.iopMethod || 'Goldmann',
          ])}
        />
        {e.iopTime ? (
          <div className="co-help">
            {'IOP taken ' +
              e.iopTime +
              '. Normal range 10 to 21 mmHg; corneal thickness changes how a reading should be read.'}
          </div>
        ) : null}
        {refractions.length ? <SpecHeading>Refraction</SpecHeading> : null}
        {refractions.length ? (
          <SpecTable
            caption="Refraction"
            cols={['Type', 'Eye', 'Sphere', 'Cylinder', 'Axis', 'Add', 'Prism', 'VA']}
            num={[2, 3, 4, 5]}
            rows={refractions.flatMap((r) =>
              (['od', 'os'] as const).map((k, i) => {
                const o = r[k] || {};
                return [
                  i === 0 ? <b key="t">{r.type}</b> : '',
                  k.toUpperCase(),
                  <V key="s" k="sph" v={o.sph} />,
                  o.cyl == null || o.cyl === 0 ? <Muted key="c">DS</Muted> : <V key="c" k="cyl" v={o.cyl} />,
                  o.cyl ? <V key="a" k="axis" v={o.axis} /> : '',
                  o.add != null ? <V key="d" k="add" v={o.add} /> : '',
                  o.prism || '',
                  <VA key="va" v={o.va} />,
                ];
              })
            )}
          />
        ) : null}
        <div className="co-help">
          {(refractions.length ? 'Cylinder shown in minus form. Axis 1 to 180 degrees. ' : '') +
            'sc without correction, cc with correction.'}
        </div>
      </Card>
    </RangeContextProvider>
  );
});
