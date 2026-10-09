import { forwardRef } from 'react';
import { Badge, type BadgeProps, type BadgeTone } from '../Badge/Badge';
import type { IconName } from '../Icon/Icon';

/** Claim statuses across the X12 cycle (837, 999, 277CA, 277, 835). */
export type ClaimStatus =
  | 'Ready to Send'
  | 'Sent (837)'
  | 'Accepted (999)'
  | 'Rejected (999)'
  | 'Accepted (277CA)'
  | 'Rejected (277CA)'
  | 'Pending (277)'
  | 'Paid (835)'
  | 'Partially Paid (835)'
  | 'Denied (835)'
  | 'Appealed';

/** Tone, icon and meaning of one claim status. */
export interface ClaimStatusInfo {
  tone: BadgeTone;
  icon: IconName;
  /** Plain-language meaning, shown as the tooltip title. */
  meaning: string;
}

/** Every claim status with its tone, icon and meaning. */
export const claimStatusInfo: Record<ClaimStatus, ClaimStatusInfo> = {
  'Ready to Send': { tone: 'neutral', icon: 'file', meaning: 'Draft passed claim check' },
  'Sent (837)': { tone: 'info', icon: 'send', meaning: '837P sent to the clearinghouse' },
  'Accepted (999)': { tone: 'info', icon: 'check', meaning: 'File syntax accepted' },
  'Rejected (999)': { tone: 'danger', icon: 'x', meaning: 'File syntax rejected' },
  'Accepted (277CA)': { tone: 'info', icon: 'check', meaning: 'Payer accepted the claim for processing' },
  'Rejected (277CA)': { tone: 'danger', icon: 'x', meaning: 'Payer front end rejected the claim' },
  'Pending (277)': { tone: 'warning', icon: 'clock', meaning: 'Payer is processing' },
  'Paid (835)': { tone: 'success', icon: 'paid', meaning: 'Payment posted from the ERA' },
  'Partially Paid (835)': { tone: 'warning', icon: 'dollar', meaning: 'Paid less than expected' },
  'Denied (835)': { tone: 'danger', icon: 'x', meaning: 'Denied on the ERA' },
  Appealed: { tone: 'ai', icon: 'shield', meaning: 'Appeal sent' },
};

export interface ClaimStatusTagProps extends Omit<BadgeProps, 'tone' | 'icon' | 'children'> {
  /** One of `ClaimStatusTag.statuses`; other strings render neutral without an icon. Required */
  status: ClaimStatus | (string & {});
}

const ClaimStatusTagBase = forwardRef<HTMLSpanElement, ClaimStatusTagProps>(function ClaimStatusTag(
  { status, title, ...rest },
  ref
) {
  const info = (claimStatusInfo as Record<string, ClaimStatusInfo | undefined>)[status];
  return (
    <Badge ref={ref} tone={info?.tone ?? 'neutral'} icon={info?.icon} title={title ?? info?.meaning} {...rest}>
      {status}
    </Badge>
  );
});

/**
 * ClaimStatusTag names where a claim is in the X12 cycle: 837 sent, 999 accepted or rejected, 277CA,
 * 277 pending and 835 paid, partial or denied. The list is on `ClaimStatusTag.statuses`.
 */
export const ClaimStatusTag = Object.assign(ClaimStatusTagBase, {
  statuses: Object.keys(claimStatusInfo) as ClaimStatus[],
});
