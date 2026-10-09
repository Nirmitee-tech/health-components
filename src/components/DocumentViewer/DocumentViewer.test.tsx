import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DocumentViewer, type DocumentPage } from './DocumentViewer';

const pages: DocumentPage[] = [{ lines: ['DISCHARGE SUMMARY', '', 'Discharge K 5.4 mmol/L'] }, { lines: ['Page 2'] }];

describe('DocumentViewer', () => {
  it('pages and zooms', async () => {
    const onPageChange = vi.fn();
    render(<DocumentViewer title="Discharge summary" pages={pages} onPageChange={onPageChange} />);
    expect(screen.getByText('Page 1 of 2')).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Next page' }));
    expect(onPageChange).toHaveBeenCalledWith(1);
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: 'Page 2' })).toHaveTextContent('Page 2');
    expect(screen.getByText('100 %')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
    await userEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
    expect(screen.getByText('50 %')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled();
  });

  it('comments on a line and highlights another', async () => {
    const onAnnotationsChange = vi.fn();
    render(<DocumentViewer title="Discharge summary" pages={pages} user="Priya Shah MD" onAnnotationsChange={onAnnotationsChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Discharge K 5.4 mmol/L' }));
    await userEvent.type(screen.getByLabelText('Comment on line 3'), 'Recheck K');
    await userEvent.click(screen.getByRole('button', { name: 'Add Comment' }));
    expect(onAnnotationsChange.mock.calls[0]![0]).toEqual([
      expect.objectContaining({ page: 0, line: 2, kind: 'comment', text: 'Recheck K', author: 'Priya Shah MD' }),
    ]);
    const aside = screen.getByRole('complementary', { name: 'Annotations' });
    expect(aside).toHaveTextContent('Annotations on this page (1)');
    expect(within(aside).getByText('Recheck K')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Comment by Priya Shah MD: Discharge K 5.4 mmol/L' })).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(screen.getByRole('button', { name: 'Blank line 2' }));
    await userEvent.click(screen.getByRole('button', { name: 'Highlight' }));
    expect(aside).toHaveTextContent('Annotations on this page (2)');
  });

  it('is read only for some roles, and shows the error state', () => {
    const { unmount } = render(<DocumentViewer title="Consult" pages={pages} readOnly />);
    expect(screen.getByText('Annotations are read only for your role.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'DISCHARGE SUMMARY' })).not.toBeInTheDocument();
    unmount();
    render(<DocumentViewer title="Outside MRI report" error="The file is damaged." />);
    expect(screen.getByText('Document could not be opened')).toBeInTheDocument();
    expect(screen.getByText('The file is damaged.')).toBeInTheDocument();
  });
});
