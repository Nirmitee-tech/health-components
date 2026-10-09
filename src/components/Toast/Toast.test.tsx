import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Toast, ToastProvider, useToast, type ToastApi } from './Toast';

describe('Toast', () => {
  it('renders status toasts politely and errors as alerts', () => {
    render(
      <>
        <Toast inline tone="success" message="Draft Saved Successfully" />
        <Toast inline tone="error" message="Could not save." />
      </>
    );
    const ok = screen.getByRole('status');
    expect(ok).toHaveTextContent('Draft Saved Successfully');
    expect(ok).toHaveAttribute('aria-live', 'polite');
    expect(ok).toHaveClass('co-toast', 'co-inline', 'co-toast-success');
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save.');
  });

  it('renders the action button', () => {
    const onAction = vi.fn();
    render(<Toast inline message="Notification Deleted Successfully" action="Undo" onAction={onAction} />);
    screen.getByRole('button', { name: 'Undo' }).click();
    expect(onAction).toHaveBeenCalledTimes(1);
  });
});

describe('ToastProvider', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function setup(props: { max?: number } = {}) {
    let api!: ToastApi;
    function Grab() {
      api = useToast();
      return null;
    }
    render(
      <ToastProvider {...props}>
        <Grab />
      </ToastProvider>
    );
    act(() => {});
    return () => api;
  }

  it('shows a toast in a polite live region and hides it after 2.8 s', () => {
    const api = setup();
    act(() => {
      api().success('Draft Saved Successfully');
    });
    const toast = screen.getByText('Draft Saved Successfully');
    expect(toast.closest('.co-toast-stack')).toHaveAttribute('aria-live', 'polite');
    act(() => vi.advanceTimersByTime(2700));
    expect(screen.getByText('Draft Saved Successfully')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(200));
    expect(screen.queryByText('Draft Saved Successfully')).not.toBeInTheDocument();
  });

  it('keeps toasts with an action for 5 s and errors until dismissed', () => {
    const api = setup();
    act(() => {
      api().show({ message: 'Notification Deleted Successfully', action: 'Undo' });
      api().error('Could not save.');
    });
    act(() => vi.advanceTimersByTime(4000));
    expect(screen.getByText('Notification Deleted Successfully')).toBeInTheDocument();
    act(() => vi.advanceTimersByTime(1100));
    expect(screen.queryByText('Notification Deleted Successfully')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole('alert')).toHaveTextContent('Could not save.');
    act(() => screen.getByRole('button', { name: 'Dismiss' }).click());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('queues beyond max and shows the next when one hides', () => {
    const api = setup({ max: 1 });
    act(() => {
      api().show('Reminder Sent Successfully');
      api().show('Draft Saved Successfully');
    });
    expect(screen.getByText('Reminder Sent Successfully')).toBeInTheDocument();
    expect(screen.queryByText('Draft Saved Successfully')).not.toBeInTheDocument();
    act(() => vi.advanceTimersByTime(2800));
    expect(screen.getByText('Draft Saved Successfully')).toBeInTheDocument();
    act(() => api().dismiss());
    expect(screen.queryByText('Draft Saved Successfully')).not.toBeInTheDocument();
  });

  it('useToast throws outside a provider', () => {
    function Bad() {
      useToast();
      return null;
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Bad />)).toThrow(/ToastProvider/);
    spy.mockRestore();
  });
});
