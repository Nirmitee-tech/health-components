import { forwardRef, useState, type HTMLAttributes } from 'react';
import type { RangeContextId } from '../../clinical';
import { cx } from '../../internal/cx';
import { useControllableState } from '../../internal/hooks';
import { withRangeProvider } from '../../internal/chartPanels';
import { Alert } from '../Alert/Alert';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import { EmptyState } from '../EmptyState/EmptyState';
import { IconButton } from '../IconButton/IconButton';
import { TextArea } from '../TextArea/TextArea';

/** One page of text lines. */
export interface DocumentPage {
  /** Lines of the page, in order ('' for a blank line) */
  lines: string[];
}

/** One annotation on a line. */
export interface DocumentAnnotation {
  /** Unique id */
  id: string;
  /** Page index, from 0 */
  page: number;
  /** Line index on the page, from 0 */
  line: number;
  /** 'highlight' (yellow) | 'comment' (blue, with text) */
  kind: 'highlight' | 'comment';
  /** Comment text; default none */
  text?: string;
  /** Who added it */
  author: string;
  /** When; default none */
  at?: string;
}

export interface DocumentViewerProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  /** Pages; default none (empty state) */
  pages?: DocumentPage[];
  /** Initial annotations; the viewer keeps its own copy; default none */
  annotations?: DocumentAnnotation[];
  /** Called with all annotations after one is added; default none */
  onAnnotationsChange?: (annotations: DocumentAnnotation[]) => void;
  /** Shown page index (controlled), from 0; default uncontrolled */
  page?: number;
  /** Initial page index; default 0 */
  defaultPage?: number;
  /** Called with the new page index; default none */
  onPageChange?: (page: number) => void;
  /** Called by Download; default none */
  onDownload?: () => void;
  /** Card title; default none */
  title?: string;
  /** Card subtitle (source, received); default none */
  subtitle?: string;
  /** Author name on new annotations; default 'You' */
  user?: string;
  /** No adding annotations; default false */
  readOnly?: boolean;
  /** Why the document could not be opened; shows the error state; default none */
  error?: string;
  /** Height of the page area in px; default 520 */
  maxHeight?: number;
  /** Which shared reference range flags use; the lab range on a result still wins; default the global context, else 'outpatient' */
  rangeContext?: RangeContextId;
}

/**
 * DocumentViewer shows a scanned or outside document page by page with zoom, and lets staff highlight a line or
 * comment on it, listing the annotations beside the page.
 */
export const DocumentViewer = forwardRef<HTMLElement, DocumentViewerProps>(function DocumentViewer(
  {
    pages: pagesProp,
    annotations,
    onAnnotationsChange,
    page,
    defaultPage = 0,
    onPageChange,
    onDownload,
    title,
    subtitle,
    user,
    readOnly = false,
    error,
    maxHeight = 520,
    rangeContext,
    ...rest
  },
  ref
) {
  const pages = pagesProp || [];
  const [pg, setPg] = useControllableState(page, defaultPage, onPageChange);
  const [zoom, setZoom] = useState(100);
  const [ann, setAnn] = useState<DocumentAnnotation[]>(annotations || []);
  const [on, setOn] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [pickLine, setPickLine] = useState<number | null>(null);
  const current = pages[pg] || { lines: [] };
  const here = ann.filter((a) => a.page === pg);
  const goTo = (n: number) => {
    setPg(n);
    setPickLine(null);
  };

  const add = () => {
    if (pickLine == null) return;
    const id = 'n' + Date.now();
    const next = ann.concat([
      { id, page: pg, line: pickLine, kind: note.trim() ? 'comment' : 'highlight', text: note.trim(), author: user || 'You', at: 'Just now' },
    ]);
    setAnn(next);
    onAnnotationsChange?.(next);
    setNote('');
    setPickLine(null);
    setOn(id);
  };

  return withRangeProvider(
    rangeContext,
    <Card
      ref={ref}
      title={title}
      subtitle={subtitle}
      padding="compact"
      actions={
        <>
          <IconButton icon="chevron-left" size="sm" label="Previous page" disabled={pg <= 0} onClick={() => goTo(pg - 1)} />
          <span className="co-mi-s" aria-live="polite">
            {'Page ' + (pages.length ? pg + 1 : 0) + ' of ' + pages.length}
          </span>
          <IconButton icon="chevron-right" size="sm" label="Next page" disabled={pg >= pages.length - 1} onClick={() => goTo(pg + 1)} />
          <IconButton icon="minus" size="sm" label="Zoom out" disabled={zoom <= 50} onClick={() => setZoom(zoom - 25)} />
          <span className="co-mi-s" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {zoom + ' %'}
          </span>
          <IconButton icon="plus" size="sm" label="Zoom in" disabled={zoom >= 200} onClick={() => setZoom(zoom + 25)} />
          <IconButton icon="download" size="sm" label="Download" onClick={onDownload} />
        </>
      }
      {...rest}
    >
      {!pages.length ? (
        <EmptyState compact kind={error ? 'error' : 'empty'} title={error ? 'Document could not be opened' : 'No document'}>
          {error || 'Choose a document from the list.'}
        </EmptyState>
      ) : (
        <div className="cp-doc">
          {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- scrollable pages must be keyboard focusable so they can be scrolled (axe scrollable-region-focusable). */}
          <div tabIndex={0}
            role="region"
            aria-label="Document pages, scrollable"
            style={{ overflow: 'auto', maxHeight, background: 'var(--co-surface-alt)', padding: 12 }}
          >
            <div className="cp-page" role="group" style={{ zoom: zoom / 100 }} aria-label={'Page ' + (pg + 1)}>
              {current.lines.map((ln, i) => {
                const a = here.find((x) => x.line === i);
                if (a) {
                  return (
                    <div key={i}>
                      <button
                        type="button"
                        className="cp-line"
                        aria-pressed={on === a.id}
                        aria-label={(a.kind === 'comment' ? 'Comment' : 'Highlight') + ' by ' + a.author + ': ' + (ln || 'blank line')}
                        onClick={() => setOn(a.id)}
                      >
                        <mark className={cx(a.kind === 'comment' && 'cp-cm', on === a.id && 'is-on')}>{ln || '\u00a0'}</mark>
                      </button>
                    </div>
                  );
                }
                if (readOnly) return <div key={i}>{ln || '\u00a0'}</div>;
                return (
                  <div key={i} style={{ outline: pickLine === i ? '1px dashed var(--co-primary)' : undefined }}>
                    <button
                      type="button"
                      className="cp-line"
                      aria-pressed={pickLine === i}
                      aria-label={ln ? undefined : 'Blank line ' + (i + 1)}
                      onClick={() => setPickLine(i)}
                    >
                      {ln || '\u00a0'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          <aside aria-label="Annotations">
            <div className="cp-sec" style={{ marginTop: 0 }}>
              {'Annotations on this page (' + here.length + ')'}
            </div>
            {here.length ? (
              <ul className="co-list">
                {here.map((a) => (
                  <li
                    key={a.id}
                    className={cx('co-li', on === a.id && 'is-on')}
                    style={on === a.id ? { background: 'var(--co-primary-soft)' } : undefined}
                  >
                    <div className="co-li-b">
                      <div className="co-row co-gap-6">
                        <Badge size="sm" tone={a.kind === 'comment' ? 'info' : 'warning'}>
                          {a.kind === 'comment' ? 'Comment' : 'Highlight'}
                        </Badge>
                        <b>{a.author}</b>
                      </div>
                      {a.text ? <span>{a.text}</span> : null}
                      <span className="co-mi-s">{'Line ' + (a.line + 1) + (a.at ? ' . ' + a.at : '')}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <span className="co-mi-s">None yet.</span>
            )}
            {readOnly ? (
              <Alert tone="lock">Annotations are read only for your role.</Alert>
            ) : pickLine == null ? (
              <p className="co-help">Click a line to highlight it or add a comment.</p>
            ) : (
              <div className="co-dt" style={{ marginTop: 8 }}>
                <TextArea label={'Comment on line ' + (pickLine + 1)} rows={2} value={note} onChange={(v) => setNote(v)} />
                <div className="co-row co-gap-8">
                  <Button size="sm" variant="primary" onClick={add}>
                    {note.trim() ? 'Add Comment' : 'Highlight'}
                  </Button>
                  <Button size="sm" onClick={() => setPickLine(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}
    </Card>
  );
});
