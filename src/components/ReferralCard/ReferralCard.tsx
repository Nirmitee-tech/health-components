import { forwardRef, type ReactNode } from 'react';
import { Badge, type BadgeTone } from '../Badge/Badge';
import { Card, type CardProps } from '../Card/Card';
import { DescriptionList } from '../DescriptionList/DescriptionList';
import { Timeline, type TimelineItem } from '../Timeline/Timeline';

/** Referral status; drives the badge tone. */
export type ReferralStatus =
  | 'Draft'
  | 'Sent'
  | 'Received'
  | 'Scheduled'
  | 'Seen'
  | 'Report Back'
  | 'Declined'
  | 'Needs Info';

/** One referral. */
export interface ReferralData {
  /** Specialty ("Cardiology") */
  specialty: string;
  /** Patient name */
  patient: string;
  /** Receiving provider and practice */
  to: string;
  /** Draft, Sent, Received, Scheduled, Seen, Report Back, Declined or Needs Info */
  status: ReferralStatus;
  /** Reason for referral */
  reason: string;
  /** Urgency ("Within 2 weeks") */
  urgency: string;
  /** Authorization text; default "Not required" */
  auth?: string;
  /** Referring provider */
  from: string;
  /** Status history (Timeline items); default none */
  timeline?: TimelineItem[];
}

export interface ReferralCardProps extends Omit<CardProps, 'title' | 'subtitle' | 'children'> {
  /** {specialty, patient, to, status, reason, urgency, auth?, from, timeline?}; required */
  referral: ReferralData;
  /** Buttons under the card body; default none */
  actions?: ReactNode;
}

/** Badge tone per referral status. */
export const referralStatusTones: Record<ReferralStatus, BadgeTone> = {
  Draft: 'neutral',
  Sent: 'info',
  Received: 'info',
  Scheduled: 'success',
  Seen: 'success',
  'Report Back': 'success',
  Declined: 'danger',
  'Needs Info': 'warning',
};

/** ReferralCard summarizes an outgoing or incoming referral with status, reason, urgency, authorization and its status timeline. */
export const ReferralCard = forwardRef<HTMLElement, ReferralCardProps>(function ReferralCard(
  { referral: r, actions, ...rest },
  ref
) {
  return (
    <Card
      ref={ref}
      title={`${r.specialty} referral`}
      subtitle={`${r.patient} . to ${r.to}`}
      actions={<Badge tone={referralStatusTones[r.status] ?? 'neutral'}>{r.status}</Badge>}
      {...rest}
    >
      <DescriptionList
        compact
        items={[
          ['Reason', r.reason],
          ['Urgency', r.urgency],
          ['Authorization', r.auth || 'Not required'],
          ['Sent by', r.from],
        ]}
      />
      {r.timeline ? <Timeline items={r.timeline} /> : null}
      {actions ? <div className="co-row co-gap-8">{actions}</div> : null}
    </Card>
  );
});
