import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { SplitPaneChartLayout, Splitter } from './SplitPaneChartLayout';

/* jsdom has no PointerEvent: a MouseEvent subclass carries clientX and button. */
beforeAll(() => {
  if (typeof window.PointerEvent === 'undefined') {
    class PointerEventShim extends MouseEvent {}
    (window as unknown as { PointerEvent: typeof MouseEvent }).PointerEvent = PointerEventShim;
  }
});

const layout = (props = {}) =>
  render(
    <SplitPaneChartLayout nav={<span>Sections</span>} context={<span>CDS</span>} rightTitle="Decision support" {...props}>
      <p>Progress note</p>
    </SplitPaneChartLayout>
  );

describe('SplitPaneChartLayout', () => {
  it('renders nav, main and aside landmarks with focusable separators', () => {
    layout();
    expect(screen.getByRole('navigation', { name: 'Chart sections' })).toBeInTheDocument();
    expect(screen.getByRole('main', { name: 'Note' })).toHaveTextContent('Progress note');
    expect(screen.getByRole('complementary', { name: 'Decision support' })).toHaveTextContent('CDS');
    const left = screen.getByRole('separator', { name: 'Resize chart sections' });
    expect(left).toHaveAttribute('tabindex', '0');
    expect(left).toHaveAttribute('aria-orientation', 'vertical');
    expect(left).toHaveAttribute('aria-valuenow', '220');
    expect(left).toHaveAttribute('aria-valuemin', '160');
    expect(left).toHaveAttribute('aria-valuemax', '360');
    expect(left.getAttribute('aria-controls')).toBe(screen.getByRole('navigation').id);
  });

  it('resizes the left pane with the arrow keys, Shift for bigger steps, clamped to its limits', async () => {
    const onLeftWidthChange = vi.fn();
    layout({ onLeftWidthChange });
    const sep = screen.getByRole('separator', { name: 'Resize chart sections' });
    sep.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(sep).toHaveAttribute('aria-valuenow', '236');
    expect(screen.getByRole('navigation')).toHaveStyle({ width: '236px' });
    await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}');
    expect(sep).toHaveAttribute('aria-valuenow', '188');
    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}');
    expect(sep).toHaveAttribute('aria-valuenow', '160');
    expect(onLeftWidthChange).toHaveBeenLastCalledWith(160);
    await userEvent.keyboard('{End}');
    expect(sep).toHaveAttribute('aria-valuenow', '360');
    await userEvent.keyboard('{Home}');
    expect(sep).toHaveAttribute('aria-valuenow', '160');
  });

  it('collapses to the minimum with Enter and restores the previous size', async () => {
    layout();
    const sep = screen.getByRole('separator', { name: 'Resize chart sections' });
    sep.focus();
    await userEvent.keyboard('{ArrowRight}{Enter}');
    expect(sep).toHaveAttribute('aria-valuenow', '160');
    await userEvent.keyboard('{Enter}');
    expect(sep).toHaveAttribute('aria-valuenow', '236');
  });

  it('grows the right pane with ArrowLeft', async () => {
    layout();
    const sep = screen.getByRole('separator', { name: 'Resize context panel' });
    sep.focus();
    await userEvent.keyboard('{ArrowLeft}');
    expect(sep).toHaveAttribute('aria-valuenow', '316');
    expect(screen.getByRole('complementary')).toHaveStyle({ width: '316px' });
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(sep).toHaveAttribute('aria-valuenow', '284');
  });

  it('resizes by dragging', () => {
    layout();
    const sep = screen.getByRole('separator', { name: 'Resize chart sections' });
    fireEvent.pointerDown(sep, { button: 0, clientX: 300 });
    fireEvent.pointerMove(window, { clientX: 340 });
    expect(sep).toHaveAttribute('aria-valuenow', '260');
    fireEvent.pointerUp(window);
    fireEvent.pointerMove(window, { clientX: 500 });
    expect(sep).toHaveAttribute('aria-valuenow', '260');
  });

  it('collapses the nav and closes and reopens the context panel', async () => {
    const onRightOpenChange = vi.fn();
    layout({ onRightOpenChange });
    await userEvent.click(screen.getByRole('button', { name: 'Hide chart sections' }));
    expect(screen.queryByRole('separator', { name: 'Resize chart sections' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Show chart sections' }));
    expect(screen.getByText('Sections')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Close Decision support' }));
    expect(onRightOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Decision support' }));
    expect(screen.getByRole('complementary', { name: 'Decision support' })).toBeInTheDocument();
  });

  it('starts collapsed and closed from the defaults', () => {
    layout({ defaultLeftCollapsed: true, defaultRightOpen: false });
    expect(screen.getByRole('button', { name: 'Show chart sections' })).toBeInTheDocument();
    expect(screen.queryAllByRole('separator')).toHaveLength(0);
  });
});

describe('Splitter', () => {
  it('reports clamped sizes and ignores other keys', () => {
    const onResize = vi.fn();
    render(<Splitter label="Resize" value={200} min={100} max={210} onResize={onResize} />);
    const sep = screen.getByRole('separator', { name: 'Resize' });
    fireEvent.keyDown(sep, { key: 'ArrowRight' });
    expect(onResize).toHaveBeenLastCalledWith(210);
    fireEvent.keyDown(sep, { key: 'a' });
    expect(onResize).toHaveBeenCalledTimes(1);
  });
});
