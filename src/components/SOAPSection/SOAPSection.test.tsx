import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SOAPSection } from './SOAPSection';

describe('SOAPSection', () => {
  it('names the textarea by the title and shows the initial text', () => {
    render(<SOAPSection title="Subjective" text="Knee pain 3 weeks." required />);
    const ta = screen.getByRole('textbox', { name: 'Subjective' });
    expect(ta).toHaveValue('Knee pain 3 weeks.');
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('inserts a smart phrase from the Insert popover', async () => {
    const onChange = vi.fn();
    const onInsertMacro = vi.fn();
    render(
      <SOAPSection title="Plan" text="Follow up" macros={['.followup3m']} onChange={onChange} onInsertMacro={onInsertMacro} />
    );
    await userEvent.click(screen.getByRole('button', { name: /Insert/ }));
    await userEvent.click(screen.getByRole('button', { name: '.followup3m' }));
    expect(screen.getByRole('textbox', { name: 'Plan' })).toHaveValue('Follow up .followup3m');
    expect(onInsertMacro).toHaveBeenCalledWith('.followup3m');
    expect(onChange).toHaveBeenLastCalledWith('Follow up .followup3m');
    expect(screen.queryByRole('button', { name: '.followup3m' })).not.toBeInTheDocument();
  });

  it('accepts the AI draft into the text and hides the suggestion', async () => {
    const onAcceptAI = vi.fn();
    render(<SOAPSection title="Plan" ai="Start PT 2x a week." onAcceptAI={onAcceptAI} />);
    await userEvent.click(screen.getByRole('button', { name: 'Accept' }));
    expect(screen.getByRole('textbox', { name: 'Plan' })).toHaveValue('Start PT 2x a week.');
    expect(onAcceptAI).toHaveBeenCalledWith('Start PT 2x a week.');
    expect(screen.queryByRole('button', { name: 'Accept' })).not.toBeInTheDocument();
  });

  it('Edit puts the draft in the textarea without accepting it', async () => {
    const onAcceptAI = vi.fn();
    render(<SOAPSection title="Plan" ai="Recheck in 6 weeks." onAcceptAI={onAcceptAI} />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('textbox', { name: 'Plan' })).toHaveValue('Recheck in 6 weeks.');
    expect(onAcceptAI).not.toHaveBeenCalled();
  });

  it('is controllable', async () => {
    const onChange = vi.fn();
    render(<SOAPSection title="Plan" value="Fixed" onChange={onChange} />);
    await userEvent.type(screen.getByRole('textbox', { name: 'Plan' }), 'x');
    expect(onChange).toHaveBeenCalledWith('Fixedx');
    expect(screen.getByRole('textbox', { name: 'Plan' })).toHaveValue('Fixed');
  });

  it('renders children instead of the textarea and shows errors', () => {
    const { rerender } = render(
      <SOAPSection title="ROS">
        <p>Custom content</p>
      </SOAPSection>
    );
    expect(screen.getByText('Custom content')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    rerender(<SOAPSection title="Assessment" error="Add an assessment." className="x" />);
    expect(screen.getByRole('textbox', { name: 'Assessment' })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('Add an assessment.');
  });
});
