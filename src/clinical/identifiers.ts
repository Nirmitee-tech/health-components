/*
 * Identifiers (masking, check digits) and code systems.
 * Check digits catch typing errors only; they do not prove the number is real or belongs to this person.
 * Ported from CareOS.fmt (ext: clinical-values).
 */
import { ownValue } from './own';

function digits(s: unknown): string {
  return String(s || '').replace(/\D/g, '');
}

function luhn(s: string): boolean {
  let sum = 0;
  let alt = false;
  for (let i = s.length - 1; i >= 0; i--) {
    let n = +s[i]!;
    if (alt) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

/** NPI check digit (Luhn with the 80840 prefix). True only for 10 digits that pass. Proves shape, not that the NPI exists. */
export function npiValid(v: string | null | undefined): boolean {
  const d = digits(v);
  return d.length === 10 && luhn('80840' + d);
}

/** DEA number checksum (two letters, seven digits). Proves shape, not that the registration exists. */
export function deaValid(v: string | null | undefined): boolean {
  const m = /^[A-Z][A-Z9](\d{7})$/.exec(String(v || '').toUpperCase());
  if (!m) return false;
  const d = m[1]!;
  const s = +d[0]! + +d[2]! + +d[4]! + 2 * (+d[1]! + +d[3]! + +d[5]!);
  return s % 10 === +d[6]!;
}

/** Identifier kinds IdentifierDisplay and `identifier` know. */
export type IdTypeKey = 'ssn' | 'mrn' | 'npi' | 'dea' | 'member' | 'other';

/** How one identifier type is labelled, masked, formatted and checked. */
export interface IdType {
  /** Short label ('SSN', 'Member ID'). */
  label: string;
  /** Masked by default. */
  masked: boolean;
  /** Full-value formatter (SSN 123-45-6789). */
  fmt?: (v: string) => string;
  /** Masked formatter; default masks all but the last 4 characters. */
  mask?: (v: string) => string;
  /** Check-digit test; false means a likely typing error. */
  check?: (v: string) => boolean;
}

/** Identifier types: SSN and member ID and DEA masked by default; NPI and DEA have check digits. */
export const ID_TYPES: Readonly<Record<IdTypeKey, IdType>> = {
  ssn: {
    label: 'SSN',
    masked: true,
    fmt: (v) => {
      const d = digits(v);
      return d.slice(0, 3) + '-' + d.slice(3, 5) + '-' + d.slice(5);
    },
    mask: (v) => '•••-••-' + digits(v).slice(-4),
  },
  mrn: { label: 'MRN', masked: false },
  npi: { label: 'NPI', masked: false, check: npiValid },
  dea: { label: 'DEA', masked: true, check: deaValid },
  member: { label: 'Member ID', masked: true },
  other: { label: 'ID', masked: false },
};

/** The IdType for a key, falling back to 'other'. */
export function idType(type: string | null | undefined): IdType {
  return ownValue(ID_TYPES, type) ?? ID_TYPES.other;
}

/** Masks all but the last 4 characters with •, keeping dashes and spaces: 'XQK123456789' gives '••••••••6789'. */
export function maskTail(v: string | null | undefined): string {
  const s = String(v || '');
  return s.length <= 4 ? s : s.slice(0, -4).replace(/[^-\s]/g, '•') + s.slice(-4);
}

/** An identifier formatted for its type, masked when `masked`: `identifier('ssn', '123456789', true)` is '•••-••-6789'. */
export function identifier(type: IdTypeKey | string, v: string | null | undefined, masked?: boolean): string {
  const t = idType(type);
  const s = String(v || '');
  if (masked) return (t.mask || maskTail)(s);
  return t.fmt ? t.fmt(s) : s;
}

/** Code systems CodeDisplay and `code` know. */
export type CodeSystemKey = 'icd10' | 'cpt' | 'hcpcs' | 'loinc' | 'snomed' | 'rxnorm' | 'ndc';

/** One code system: its label, FHIR system URI and optional normaliser. */
export interface CodeSystem {
  /** Label shown on the tag ('ICD-10-CM'). */
  label: string;
  /** FHIR system URI. */
  uri: string;
  /** Normalises a code for display. */
  fmt?: (c: string) => string;
}

/** Code systems with labels and FHIR URIs. ICD-10 gets its dot (E119 to E11.9); an 11-digit NDC shows 5-4-2. */
export const CODE_SYSTEMS: Readonly<Record<CodeSystemKey, CodeSystem>> = {
  icd10: {
    label: 'ICD-10-CM',
    uri: 'http://hl7.org/fhir/sid/icd-10-cm',
    fmt: (c) => {
      const s = String(c).toUpperCase().replace(/\./g, '');
      return s.length > 3 ? s.slice(0, 3) + '.' + s.slice(3) : s;
    },
  },
  cpt: { label: 'CPT', uri: 'http://www.ama-assn.org/go/cpt' },
  hcpcs: { label: 'HCPCS', uri: 'urn:oid:2.16.840.1.113883.6.285' },
  loinc: { label: 'LOINC', uri: 'http://loinc.org' },
  snomed: { label: 'SNOMED CT', uri: 'http://snomed.info/sct' },
  rxnorm: { label: 'RxNorm', uri: 'http://www.nlm.nih.gov/research/umls/rxnorm' },
  ndc: {
    label: 'NDC',
    uri: 'http://hl7.org/fhir/sid/ndc',
    fmt: (c) => {
      const d = digits(c);
      return d.length === 11 ? d.slice(0, 5) + '-' + d.slice(5, 9) + '-' + d.slice(9) : String(c);
    },
  },
};

/** A code normalised for its system: `code('icd10', 'e119')` is 'E11.9'. Unknown systems and empty codes pass through. */
export function code(system: CodeSystemKey | string, c: string | number | null | undefined): string {
  if (c == null || c === '') return '';
  const s = ownValue(CODE_SYSTEMS as Record<string, CodeSystem>, system);
  return s && s.fmt ? s.fmt(String(c)) : String(c);
}
