import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FaxDocumentViewer } from './FaxDocumentViewer';

describe('FaxDocumentViewer', () => {
  it('pages through the fax with labelled buttons', async () => {
    const onPageChange = vi.fn();
    render(<FaxDocumentViewer from="Lakeview Heart" pages={2} onPageChange={onPageChange} />);
    const prev = screen.getByRole('button', { name: 'Previous page' });
    const next = screen.getByRole('button', { name: 'Next page' });
    expect(screen.getByRole('img', { name: /Fax page 1 of 2/ })).toBeInTheDocument();
    expect(prev).toBeDisabled();
    await userEvent.click(next);
    expect(onPageChange).toHaveBeenCalledWith(2);
    expect(screen.getByRole('img', { name: /Fax page 2 of 2/ })).toBeInTheDocument();
    expect(next).toBeDisabled();
    expect(prev).toBeEnabled();
  });

  it('keeps the pager outside the page image', () => {
    render(<FaxDocumentViewer from="Lakeview Heart" pages={3} />);
    const img = screen.getByRole('img', { name: /Fax page/ });
    expect(img).not.toContainElement(screen.getByRole('button', { name: 'Next page' }));
  });

  it('shows the AI suggestion and files with the form values', async () => {
    const onFile = vi.fn();
    const onJunk = vi.fn();
    render(
      <FaxDocumentViewer
        from="Lakeview Heart"
        pages={1}
        ai={{ text: 'Matches Ralph Edwards', confidence: 'high' }}
        onFile={onFile}
        onJunk={onJunk}
      />
    );
    expect(screen.getByText('Matches Ralph Edwards')).toBeInTheDocument();
    await userEvent.selectOptions(screen.getByLabelText(/Document type/), 'Referral');
    await userEvent.selectOptions(screen.getByLabelText(/Route to/), 'Billing');
    await userEvent.click(screen.getByRole('button', { name: 'File to Chart' }));
    expect(onFile).toHaveBeenCalledWith({ patient: undefined, documentType: 'Referral', routeTo: 'Billing' });
    await userEvent.click(screen.getByRole('button', { name: 'Mark as Junk' }));
    expect(onJunk).toHaveBeenCalled();
  });
});
