import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TaskCard } from './TaskCard';

const task = { title: 'Send school form', patient: 'Jacob Jones', due: '10/07', overdue: true, owner: 'Maria Lopez', tag: 'Forms' };

describe('TaskCard', () => {
  it('names the checkbox after the task and shows overdue state', () => {
    const { container } = render(<TaskCard task={task} />);
    expect(screen.getByRole('checkbox', { name: 'Done: Send school form' })).not.toBeChecked();
    expect(container.firstChild).toHaveClass('co-task', 'is-overdue');
    expect(screen.getByText('Overdue')).toBeInTheDocument();
    expect(screen.getByText('Jacob Jones . Due 10/07')).toBeInTheDocument();
  });

  it('toggles uncontrolled, starting at task.done', async () => {
    const onDoneChange = vi.fn();
    render(<TaskCard task={{ ...task, done: true }} onDoneChange={onDoneChange} />);
    const box = screen.getByRole('checkbox');
    expect(box).toBeChecked();
    await userEvent.click(box);
    expect(box).not.toBeChecked();
    expect(onDoneChange).toHaveBeenCalledWith(false, expect.objectContaining({ title: 'Send school form' }));
  });

  it('respects a controlled done prop', async () => {
    const onDoneChange = vi.fn();
    render(<TaskCard task={task} done={false} onDoneChange={onDoneChange} />);
    await userEvent.click(screen.getByRole('checkbox'));
    expect(onDoneChange).toHaveBeenCalledWith(true, task);
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
