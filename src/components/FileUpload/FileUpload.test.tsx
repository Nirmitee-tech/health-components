import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { FileUpload, formatFileSize } from './FileUpload';

describe('FileUpload', () => {
  it('labels the hidden input and adds picked files', async () => {
    const onFiles = vi.fn();
    const onFilesChange = vi.fn();
    render(<FileUpload label="Referral Letter" onFiles={onFiles} onFilesChange={onFilesChange} />);
    const input = screen.getByLabelText(/Referral Letter/) as HTMLInputElement;
    expect(input).toHaveAttribute('type', 'file');
    expect(input).toHaveAccessibleDescription('PDF, JPG or PNG, up to 10 MB');
    const file = new File(['x'.repeat(2048)], 'referral.pdf', { type: 'application/pdf' });
    await userEvent.upload(input, file);
    expect(onFiles).toHaveBeenCalled();
    expect(onFilesChange).toHaveBeenCalledWith([{ name: 'referral.pdf', size: 2048, status: 'done' }]);
    expect(screen.getByText('referral.pdf')).toBeInTheDocument();
    expect(screen.getByText('Uploaded')).toBeInTheDocument();
  });

  it('adds dropped files and shows the drag state', () => {
    const { container } = render(<FileUpload label="Records" />);
    const zone = container.querySelector('.co-dz')!;
    fireEvent.dragOver(zone);
    expect(zone).toHaveClass('is-drag');
    expect(screen.getByText('Drop to upload')).toBeInTheDocument();
    const file = new File(['a'], 'ccd.xml');
    fireEvent.drop(zone, { dataTransfer: { files: [file] } });
    expect(zone).not.toHaveClass('is-drag');
    expect(screen.getByText('ccd.xml')).toBeInTheDocument();
  });

  it('renders statuses and removes a file', async () => {
    const onRemove = vi.fn();
    render(
      <FileUpload
        label="Referral"
        onRemove={onRemove}
        defaultFiles={[
          { name: 'a.pdf', size: 482000, status: 'done' },
          { name: 'b.pdf', size: 2100000, status: 'uploading', progress: 62 },
          { name: 'c.heic', status: 'error', error: 'HEIC is not supported.' },
        ]}
      />
    );
    expect(screen.getByRole('progressbar', { name: 'Uploading b.pdf' })).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
    expect(screen.getByText(/HEIC is not supported/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Remove a.pdf' }));
    expect(onRemove).toHaveBeenCalledWith(expect.objectContaining({ name: 'a.pdf' }), 0);
    expect(screen.queryByText('a.pdf')).not.toBeInTheDocument();
  });

  it('shows photo, done and error states', () => {
    const { container, rerender } = render(<FileUpload variant="photo" label="Front of Card" title="Take photo" />);
    expect(container.querySelector('input')).toHaveAttribute('capture', 'environment');
    expect(screen.getByText('Take photo')).toBeInTheDocument();
    rerender(<FileUpload variant="photo" label="Back" done />);
    expect(screen.getByText('Photo captured')).toBeInTheDocument();
    rerender(<FileUpload label="Consent" error="Upload the signed consent." />);
    expect(screen.getByRole('alert')).toHaveTextContent('Upload the signed consent.');
  });

  it('formats sizes', () => {
    expect(formatFileSize(482000)).toBe('471 KB');
    expect(formatFileSize(2100000)).toBe('2.0 MB');
  });
});
