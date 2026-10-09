import { forwardRef, useState, type HTMLAttributes } from 'react';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { AISuggestion } from '../AISuggestion/AISuggestion';
import { Button } from '../Button/Button';
import { Combobox, type ComboboxOption } from '../Combobox/Combobox';
import { IconButton } from '../IconButton/IconButton';
import { Select } from '../Select/Select';

/** AI patient-match suggestion shown above the indexing form. */
export interface FaxAISuggestion {
  /** Suggestion text; say it is a candidate a person must confirm */
  text: string;
  /** Confidence word ("high", "medium") */
  confidence?: string;
}

/** What the indexing form holds when the user files the fax. */
export interface FaxIndexValues {
  /** The chosen patient; undefined when none was picked from the list */
  patient?: ComboboxOption;
  /** Chosen document type */
  documentType: string;
  /** Chosen inbox or person to route to */
  routeTo: string;
}

export interface FaxDocumentViewerProps extends HTMLAttributes<HTMLDivElement> {
  /** Sender line shown at the top of the page ("From: Lakeview Heart (312) 555-0188"); required */
  from: string;
  /** Number of pages; required */
  pages: number;
  /** Combobox options for the patient search; default [] */
  patients?: ComboboxOption[];
  /** Initial patient search text; default none */
  patientQuery?: string;
  /** {text, confidence}; default none */
  ai?: FaxAISuggestion;
  /** Controlled current page (1-based); default undefined (uncontrolled) */
  page?: number;
  /** Initial page (uncontrolled); default 1 */
  defaultPage?: number;
  /** Called when the page changes */
  onPageChange?: (page: number) => void;
  /** Document type options; default ['Lab result', 'Referral', 'Prior auth response', 'Medical records', 'Other'] */
  documentTypes?: string[];
  /** Route-to options; default ['James Bell MD', 'Clinical Inbox', 'Billing'] */
  routes?: string[];
  /** Called by File to Chart with the form values; default none */
  onFile?: (values: FaxIndexValues) => void;
  /** Called by Mark as Junk; default none */
  onJunk?: () => void;
}

const DOC_TYPES = ['Lab result', 'Referral', 'Prior auth response', 'Medical records', 'Other'];
const ROUTES = ['James Bell MD', 'Clinical Inbox', 'Billing'];
const LINE_WIDTHS = [80, 92, 70, 88, 60, 90, 75, 40];

/** FaxDocumentViewer shows an incoming fax page next to the indexing form: patient, document type, route, file or junk, with an AI match suggestion. */
export const FaxDocumentViewer = forwardRef<HTMLDivElement, FaxDocumentViewerProps>(function FaxDocumentViewer(
  {
    from,
    pages,
    patients = [],
    patientQuery,
    ai,
    page,
    defaultPage = 1,
    onPageChange,
    documentTypes = DOC_TYPES,
    routes = ROUTES,
    onFile,
    onJunk,
    className,
    ...rest
  },
  ref
) {
  const total = Math.max(1, pages);
  const [rawPage, setPage] = useControllableState(page, defaultPage, onPageChange);
  const pg = Math.min(Math.max(1, rawPage), total);
  const [patient, setPatient] = useState<ComboboxOption | undefined>(undefined);
  const [documentType, setDocumentType] = useState(documentTypes[0] ?? '');
  const [routeTo, setRouteTo] = useState(routes[0] ?? '');

  return (
    <div ref={ref} className={cx('co-fax', className)} {...rest}>
      <div className="co-fax-page">
        <div className="co-fax-lines" role="img" aria-label={`Fax page ${pg} of ${total}. ${from}`}>
          <b>{from}</b>
          <span>{`Page ${pg} of ${total}`}</span>
          {LINE_WIDTHS.map((w, i) => (
            <span key={i} className="co-sk" style={{ width: `${w}%`, animation: 'none' }} />
          ))}
        </div>
        <div className="co-row co-gap-6" style={{ justifyContent: 'center' }}>
          <IconButton
            icon="chevron-left"
            label="Previous page"
            size="sm"
            disabled={pg <= 1}
            onClick={() => setPage(pg - 1)}
          />
          <span className="co-mi-s" aria-live="polite">{`${pg} / ${total}`}</span>
          <IconButton
            icon="chevron-right"
            label="Next page"
            size="sm"
            disabled={pg >= total}
            onClick={() => setPage(pg + 1)}
          />
        </div>
      </div>
      <div className="co-dt">
        <b>Index this fax</b>
        {ai ? (
          <AISuggestion title="Suggested match" confidence={ai.confidence}>
            {ai.text}
          </AISuggestion>
        ) : null}
        <Combobox
          label="Patient"
          kind="patient"
          options={patients}
          required
          defaultQuery={patientQuery}
          onSelect={setPatient}
        />
        <Select
          label="Document type"
          options={documentTypes}
          required
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
        />
        <Select label="Route to" options={routes} value={routeTo} onChange={(e) => setRouteTo(e.target.value)} />
        <div className="co-row co-gap-8">
          <Button variant="primary" onClick={() => onFile?.({ patient, documentType, routeTo })}>
            File to Chart
          </Button>
          <Button variant="danger" onClick={() => onJunk?.()}>
            Mark as Junk
          </Button>
        </div>
      </div>
    </div>
  );
});
