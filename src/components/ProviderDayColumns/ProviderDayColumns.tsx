import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { AppointmentChip, type AppointmentChipProps } from '../AppointmentChip/AppointmentChip';
import { Avatar } from '../Avatar/Avatar';

/** One provider column: appointments and blocked time keyed by the row time. */
export interface ProviderColumn {
  /** Provider name, e.g. "James Bell MD"; also the column heading */
  name: string;
  /** Appointments keyed by a value of `times`; default {} */
  appts?: Record<string, AppointmentChipProps>;
  /** Blocked time keyed by a value of `times`, with the reason ("Lunch"); default {} */
  blocks?: Record<string, string>;
}

export interface ProviderDayColumnsProps extends HTMLAttributes<HTMLDivElement> {
  /** Row times, e.g. ['8:00 AM', '8:20 AM']. Required */
  times: string[];
  /** One column per provider. Required */
  providers: ProviderColumn[];
  /** Called when a free slot is chosen; default none */
  onBook?: (provider: string, time: string) => void;
  /** Accessible name of the view; default 'Schedule by provider' */
  label?: string;
}

/** ProviderDayColumns is the multi-provider day view: one column per provider, time rows, chips, blocks and free slots. */
export const ProviderDayColumns = forwardRef<HTMLDivElement, ProviderDayColumnsProps>(function ProviderDayColumns(
  { times, providers, onBook, label = 'Schedule by provider', className, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cx('co-provcols', className)} role="region" aria-label={label} {...rest}>
      <div className="co-provcol co-provcol-t" aria-hidden="true">
        <div className="co-cal-wh">Time</div>
        {times.map((t) => (
          <div key={t} className="co-cal-tm co-provslot">
            {t}
          </div>
        ))}
      </div>
      {providers.map((pr) => (
        <div key={pr.name} className="co-provcol" role="group" aria-label={pr.name}>
          <div className="co-cal-wh co-row co-gap-6" style={{ justifyContent: 'center' }}>
            <Avatar name={pr.name} size="xs" aria-hidden="true" />
            {pr.name}
          </div>
          {times.map((t) => {
            const a = pr.appts?.[t];
            const b = pr.blocks?.[t];
            return (
              <div key={t} className="co-provslot">
                {b ? (
                  <span className="co-blk">
                    <span className="co-sr">{`${t}: `}</span>
                    {b}
                  </span>
                ) : a ? (
                  <AppointmentChip {...a} />
                ) : (
                  <button type="button" className="co-free" onClick={() => onBook?.(pr.name, t)}>
                    {`+ Book ${t}`}
                    <span className="co-sr">{` with ${pr.name}`}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
});
