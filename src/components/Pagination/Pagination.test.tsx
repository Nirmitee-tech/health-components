import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('shows the range and moves between pages', async () => {
    const onPage = vi.fn();
    render(<Pagination total={248} onPage={onPage} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument();
    expect(screen.getByText('Showing 1-10 of 248')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(onPage).toHaveBeenCalledWith(2);
    expect(screen.getByText('Showing 11-20 of 248')).toBeInTheDocument();
    expect(screen.getByText('Page 2 of 25')).toBeInTheDocument();
  });

  it('changes rows per page and resets to page 1', async () => {
    const onPage = vi.fn();
    const onPageSize = vi.fn();
    render(<Pagination total={248} defaultPage={3} onPage={onPage} onPageSize={onPageSize} />);
    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Rows per page/ }), '25');
    expect(onPageSize).toHaveBeenCalledWith(25);
    expect(onPage).toHaveBeenCalledWith(1);
    expect(screen.getByText('Showing 1-25 of 248')).toBeInTheDocument();
  });

  it('respects a controlled page and hides the selector', async () => {
    const onPage = vi.fn();
    render(<Pagination total={248} page={25} pageSizes={false} onPage={onPage} />);
    expect(screen.queryByRole('combobox')).toBeNull();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }));
    expect(onPage).toHaveBeenCalledWith(24);
    expect(screen.getByText('Page 25 of 25')).toBeInTheDocument();
  });

  it('shows No records', () => {
    render(<Pagination total={0} />);
    expect(screen.getByText('No records')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });
});
