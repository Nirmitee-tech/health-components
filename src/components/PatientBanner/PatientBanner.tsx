import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx } from '../../internal/cx';
import { Avatar } from '../Avatar/Avatar';
import { Badge, type BadgeTone } from '../Badge/Badge';

/** A clinical flag: plain text (amber) or text with a tone. */
export type PatientFlag = string | { label: string; tone?: BadgeTone };

export type PatientBannerVariant = 'full' | 'compact' | 'mobile';

export interface PatientBannerProps extends HTMLAttributes<HTMLElement> {
  /** Patient name. Required. */
  name: string;
  /** Sex ("F"). Required. */
  sex: string;
  /** Age in years. Required. */
  age: string | number;
  /** Date of birth ("03/14/1988"). Required. */
  dob: string;
  /** Medical record number ("MRN-100231"). Required. */
  mrn: string;
  /** Phone; default none */
  phone?: string;
  /** Payer and member id ("Aetna W123456789"); default none */
  insurance?: string;
  /** Preferred name, shown in quotes; default none */
  preferred?: string;
  /** Allergies: a list, `[]` for No Known Allergies, or undefined when not reviewed; default undefined */
  allergies?: string[];
  /** Flags such as Diabetic, Fall Risk; default [] */
  flags?: PatientFlag[];
  /** Code status ("Full Code", "DNR"); DNR, DNI and Comfort show red; default none */
  codeStatus?: string;
  /** Restricted (break-the-glass) chart; default false */
  restricted?: boolean;
  /** Photo URL; default initials */
  photo?: string;
  /** Buttons on the right; default none */
  actions?: ReactNode;
  /** 'full' | 'compact' | 'mobile'; default 'full' */
  variant?: PatientBannerVariant;
  /** Heading level of the name; default 1 for full, 2 otherwise */
  headingLevel?: 1 | 2 | 3;
}

const RISKY_CODE = /DNR|DNI|Comfort/i;

/** PatientBanner identifies the patient at the top of every chart screen: name, sex, age, DOB, MRN, phone, insurance, allergies, flags and code status. */
export const PatientBanner = forwardRef<HTMLElement, PatientBannerProps>(function PatientBanner(
  {
    name,
    sex,
    age,
    dob,
    mrn,
    phone,
    insurance,
    preferred,
    allergies,
    flags = [],
    codeStatus,
    restricted = false,
    photo,
    actions,
    variant = 'full',
    headingLevel,
    className,
    ...rest
  },
  ref
) {
  const compact = variant === 'compact' || variant === 'mobile';
  const H = `h${headingLevel ?? (compact ? 2 : 1)}` as 'h1' | 'h2' | 'h3';
  const risky = codeStatus ? RISKY_CODE.test(codeStatus) : false;
  const idLine = [sex && age !== '' && age != null ? `${sex}, ${age} y (${dob})` : dob, mrn, phone, insurance]
    .filter(Boolean)
    .join(' · ');
  return (
    <section
      ref={ref}
      className={cx('co-pb', `co-pb-${variant}`, className)}
      aria-label={`Patient ${name}`}
      {...rest}
    >
      <Avatar name={name} src={photo} size={compact ? 'md' : 'lg'} aria-hidden="true" />
      <div className="co-pb-id">
        <div className="co-row co-gap-8">
          <H>{name}</H>
          {preferred ? <span className="co-muted">{`"${preferred}"`}</span> : null}
          {restricted ? (
            <Badge tone="danger" icon="shield">
              Restricted
            </Badge>
          ) : null}
        </div>
        <div className="co-muted">{idLine}</div>
      </div>
      <div className="co-row co-gap-6 co-pb-tags">
        {allergies && allergies.length ? (
          allergies.map((a) => (
            <Badge key={a} tone="danger" icon="alert">
              {`Allergy: ${a}`}
            </Badge>
          ))
        ) : allergies ? (
          <Badge tone="success">No Known Allergies</Badge>
        ) : (
          <Badge tone="warning" icon="alert">
            Allergies not reviewed
          </Badge>
        )}
        {flags.map((f) => {
          const o = typeof f === 'string' ? { label: f } : f;
          return (
            <Badge key={o.label} tone={o.tone ?? 'warning'}>
              {o.label}
            </Badge>
          );
        })}
        {codeStatus ? (
          <Badge tone={risky ? 'danger' : 'success'} icon={risky ? 'alert-circle' : 'heart'}>
            {`Code status: ${codeStatus}`}
          </Badge>
        ) : null}
      </div>
      {actions ? <div className="co-row co-gap-8 co-ml co-pb-a">{actions}</div> : null}
    </section>
  );
});
