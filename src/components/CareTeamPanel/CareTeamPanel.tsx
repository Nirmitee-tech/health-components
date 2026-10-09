import { forwardRef, type HTMLAttributes } from 'react';
import type { RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { withRangeProvider } from '../../internal/chartPanels';
import { Avatar, type AvatarStatus } from '../Avatar/Avatar';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { IconButton } from '../IconButton/IconButton';
import { KebabMenu, type MenuItem } from '../Menu/Menu';

/** One care team member. */
export interface CareTeamMember {
  /** Full name with credentials ('James Bell MD') */
  name: string;
  /** Role on the team ('Primary care', 'Care manager') */
  role: string;
  /** Specialty; default none */
  specialty?: string;
  /** Organization; default none */
  org?: string;
  /** NPI; default none */
  npi?: string;
  /** Phone; shows a Call button; default none */
  phone?: string;
  /** Primary for their role; default false */
  primary?: boolean;
  /** Label of the primary tag; default 'PCP' */
  primaryLabel?: string;
  /** Outside the practice (no in-app messaging); default false */
  external?: boolean;
  /** 'active' | 'inactive'; default 'active' */
  status?: 'active' | 'inactive';
  /** When the relationship ended; default none */
  ended?: string;
  /** Last contact; default none */
  lastSeen?: string;
  /** Presence dot: 'online' | 'busy' | 'away' | 'offline'; default none */
  presence?: AvatarStatus;
}

/** A row menu action. */
export type CareTeamAction = 'set-primary' | 'edit-role' | 'end';

export interface CareTeamPanelProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Team members; default none (empty state) */
  members?: CareTeamMember[];
  /** When the team was last updated; default none */
  updated?: string;
  /** No Add Member or row menus; default false */
  readOnly?: boolean;
  /** Card title; default 'Care Team' */
  title?: string;
  /** Called by Add Member; default none */
  onAddMember?: () => void;
  /** Called by Call; default none */
  onCall?: (member: CareTeamMember) => void;
  /** Called by Message; default none */
  onMessage?: (member: CareTeamMember) => void;
  /** Called with a row menu action; default none */
  onMemberAction?: (action: CareTeamAction, member: CareTeamMember) => void;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/**
 * CareTeamPanel lists everyone caring for the patient, inside and outside the practice, with role, specialty, NPI,
 * last contact and call or message actions.
 */
export const CareTeamPanel = forwardRef<HTMLElement, CareTeamPanelProps>(function CareTeamPanel(
  { members, updated, readOnly = false, title = 'Care Team', onAddMember, onCall, onMessage, onMemberAction, rangeContext, ...rest },
  ref
) {
  const m = members || [];
  const menu = (x: CareTeamMember): MenuItem[] => [
    { label: 'Set as primary', onSelect: () => onMemberAction?.('set-primary', x) },
    { label: 'Edit role', onSelect: () => onMemberAction?.('edit-role', x) },
    { divider: true },
    { label: 'End relationship', danger: true, onSelect: () => onMemberAction?.('end', x) },
  ];
  return withRangeProvider(
    rangeContext,
    <Card
      ref={ref}
      title={title}
      subtitle={m.length + ' members' + (updated ? ' . updated ' + updated : '')}
      actions={
        readOnly ? null : (
          <Button size="sm" iconLeft="plus" onClick={onAddMember}>
            Add Member
          </Button>
        )
      }
      {...rest}
    >
      {!m.length ? (
        <EmptyState compact title="No care team recorded">
          Add the PCP first. Referrals and messages route to the care team.
        </EmptyState>
      ) : (
        <ul className="co-list">
          {m.map((x, i) => (
            <li key={i} className={cx('co-li', x.status === 'inactive' && 'is-dim')}>
              <Avatar name={x.name} size="sm" color={x.external ? 'accent' : 'primary'} status={x.presence} />
              <div className="co-li-b">
                <div className="co-row co-gap-6">
                  <b>{x.name}</b>
                  {x.primary ? (
                    <Badge tone="info" size="sm">
                      {x.primaryLabel || 'PCP'}
                    </Badge>
                  ) : null}
                  {x.external ? (
                    <Badge tone="outline" size="sm">
                      Outside
                    </Badge>
                  ) : null}
                  {x.status === 'inactive' ? <Badge size="sm">{'Ended ' + (x.ended || '')}</Badge> : null}
                </div>
                <span className="co-mi-s">{[x.role, x.specialty, x.org, x.npi ? 'NPI ' + x.npi : null].filter(Boolean).join(' . ')}</span>
                {x.lastSeen ? <span className="co-mi-s">{'Last contact ' + x.lastSeen}</span> : null}
              </div>
              {x.phone ? <IconButton icon="phone" size="sm" label={'Call ' + x.name + ' ' + x.phone} onClick={() => onCall?.(x)} /> : null}
              {x.external ? null : <IconButton icon="message" size="sm" label={'Message ' + x.name} onClick={() => onMessage?.(x)} />}
              {readOnly ? null : <KebabMenu label={'Actions for ' + x.name} items={menu(x)} />}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
});
