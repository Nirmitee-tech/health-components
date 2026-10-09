import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from './Radio';

const options = [
  { value: 'sms', label: 'Text message' },
  { value: 'app', label: 'Authenticator app' },
  { value: 'email', label: 'Email', disabled: true },
  { value: 'call', label: 'Phone call' },
];

describe('RadioGroup', () => {
  it('renders a fieldset with legend and selects on click', async () => {
    const onChange = vi.fn();
    render(<RadioGroup label="Send my code by" options={options} onChange={onChange} />);
    expect(screen.getByRole('group', { name: 'Send my code by' })).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Authenticator app'));
    expect(screen.getByLabelText('Authenticator app')).toBeChecked();
    expect(onChange).toHaveBeenCalledWith('app');
  });

  it('accepts string options and defaultValue', () => {
    render(<RadioGroup label="Visit Mode" options={['In person', 'Telehealth']} defaultValue="Telehealth" />);
    expect(screen.getByLabelText('Telehealth')).toBeChecked();
  });

  it('moves and selects with arrow keys, skipping disabled options and wrapping', async () => {
    const onChange = vi.fn();
    render(<RadioGroup label="Code" options={options} defaultValue="app" onChange={onChange} />);
    const app = screen.getByLabelText('Authenticator app');
    expect(app).toHaveAttribute('tabindex', '0');
    expect(screen.getByLabelText('Text message')).toHaveAttribute('tabindex', '-1');
    app.focus();
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByLabelText('Phone call')).toHaveFocus();
    expect(screen.getByLabelText('Phone call')).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith('call');
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByLabelText('Text message')).toBeChecked();
    await userEvent.keyboard('{ArrowUp}');
    expect(screen.getByLabelText('Phone call')).toBeChecked();
    await userEvent.keyboard('{Home}');
    expect(screen.getByLabelText('Text message')).toBeChecked();
  });

  it('stays on the controlled value', async () => {
    render(<RadioGroup label="Code" options={options} value="sms" onChange={() => {}} />);
    await userEvent.click(screen.getByLabelText('Phone call'));
    expect(screen.getByLabelText('Text message')).toBeChecked();
  });

  it('shows required and error', () => {
    render(<RadioGroup label="Visit Mode" options={['In person']} required error="Choose a visit mode." />);
    const group = screen.getByRole('group');
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a visit mode.');
    expect(group).toHaveAttribute('aria-describedby', screen.getByRole('alert').id);
    expect(screen.getByLabelText('In person')).toBeRequired();
  });
});
