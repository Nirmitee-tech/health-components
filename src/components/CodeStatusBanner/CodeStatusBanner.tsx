import { forwardRef, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';

export interface CodeStatusBannerProps extends HTMLAttributes<HTMLDivElement> {
  /** Code status ("Full Code", "DNR / DNI", "Comfort care"). DNR, DNI or Comfort turn the banner red. Required */
  status: string;
  /** Advance directive on file ("Living will on file"); default none ("No advance directive on file") */
  directive?: string;
  /** Date the POLST was signed; default none */
  polst?: string;
  /** Health care proxy name and relationship; default none */
  proxy?: string;
  /** Called by the View Documents button; default none */
  onViewDocuments?: () => void;
  /** Makes View Documents a link to the signed documents; default none */
  documentsHref?: string;
}

/** True for statuses that limit resuscitation (DNR, DNI, comfort care). */
export function isLimitedCodeStatus(status: string): boolean {
  return /DNR|DNI|Comfort/i.test(status);
}

/** CodeStatusBanner shows code status and advance directive, red for DNR, DNI or comfort care and green for Full Code. */
export const CodeStatusBanner = forwardRef<HTMLDivElement, CodeStatusBannerProps>(function CodeStatusBanner(
  { status, directive, polst, proxy, onViewDocuments, documentsHref, className, ...rest },
  ref
) {
  const dnr = isLimitedCodeStatus(status);
  const details = [
    directive ? `Advance directive: ${directive}` : 'No advance directive on file',
    polst ? `POLST signed ${polst}` : null,
    proxy ? `Health care proxy: ${proxy}` : null,
  ]
    .filter(Boolean)
    .join(' . ');
  return (
    <div
      ref={ref}
      className={cx('co-codestatus', dnr ? 'is-dnr' : 'is-full', className)}
      role={dnr ? 'alert' : 'status'}
      {...rest}
    >
      <Icon name={dnr ? 'alert-circle' : 'heart'} size={18} />
      <div className="co-li-b">
        <b>{`Code status: ${status}`}</b>
        <span>{details}</span>
      </div>
      {documentsHref !== undefined ? (
        <Button size="sm" className="co-ml" href={documentsHref}>
          View Documents
        </Button>
      ) : (
        <Button size="sm" className="co-ml" onClick={onViewDocuments}>
          View Documents
        </Button>
      )}
    </div>
  );
});
