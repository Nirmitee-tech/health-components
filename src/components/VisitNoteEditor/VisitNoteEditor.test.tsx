import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { VisitNoteEditor, type VisitNoteCode, type VisitNoteSection } from './VisitNoteEditor';
import { VisitNote } from './index';

const icd: VisitNoteCode[] = [
  { code: 'E11.9', label: 'Type 2 diabetes mellitus without complications' },
  { code: 'I10', label: 'Essential (primary) hypertension' },
];
const sections: VisitNoteSection[] = [
  { id: 's', title: 'Subjective', required: true, text: 'A1c follow-up.' },
  { id: 'a', title: 'Assessment and Plan', ai: 'Type 2 diabetes, improving.' },
];

describe('VisitNoteEditor', () => {
  it('renders sections named by their titles in Draft', () => {
    render(<VisitNoteEditor sections={sections} />);
    expect(screen.getByRole('heading', { name: 'Visit Note' })).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Subjective' })).toHaveValue('A1c follow-up.');
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('accepts an AI draft into the section and reports the change', async () => {
    const onSectionChange = vi.fn();
    render(<VisitNoteEditor sections={sections} onSectionChange={onSectionChange} />);
    const field = screen.getByRole('textbox', { name: 'Assessment and Plan' });
    expect(field).toHaveValue('');
    await userEvent.click(screen.getByRole('button', { name: 'Accept' }));
    expect(field).toHaveValue('Type 2 diabetes, improving.');
    expect(onSectionChange).toHaveBeenCalledWith('a', 'Type 2 diabetes, improving.');
    expect(screen.queryByRole('button', { name: 'Accept' })).not.toBeInTheDocument();
  });

  it('Edit accepts the draft and focuses the field', async () => {
    render(<VisitNoteEditor sections={sections} />);
    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));
    expect(screen.getByRole('textbox', { name: 'Assessment and Plan' })).toHaveFocus();
  });

  it('adds and removes diagnosis codes', async () => {
    const onDx = vi.fn();
    render(<VisitNoteEditor sections={sections} icdOptions={icd} defaultDiagnoses={[icd[0]!]} onDiagnosesChange={onDx} />);
    const list = screen.getByRole('list', { name: 'Diagnoses' });
    expect(within(list).getByText('E11.9')).toBeInTheDocument();
    await userEvent.type(screen.getByRole('combobox', { name: 'Add diagnosis' }), 'hyper');
    await userEvent.click(screen.getByRole('option', { name: /I10/ }));
    expect(onDx).toHaveBeenLastCalledWith([icd[0], icd[1]]);
    await userEvent.click(screen.getByRole('button', { name: 'Remove E11.9' }));
    expect(onDx).toHaveBeenLastCalledWith([icd[1]]);
    expect(screen.queryByRole('button', { name: 'Remove E11.9' })).not.toBeInTheDocument();
  });

  it('signs and locks the note', async () => {
    const onSign = vi.fn();
    render(<VisitNoteEditor sections={sections} icdOptions={icd} defaultDiagnoses={[icd[0]!]} onSign={onSign} />);
    await userEvent.click(screen.getByRole('button', { name: 'Sign Note' }));
    expect(onSign).toHaveBeenCalled();
    expect(screen.getByText('Signed')).toBeInTheDocument();
    expect(screen.getByText('Signed notes are locked. Add an addendum to change them.')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Subjective' })).toHaveAttribute('readonly');
    expect(screen.queryByRole('button', { name: 'Remove E11.9' })).not.toBeInTheDocument();
    expect(screen.queryByRole('combobox', { name: 'Add diagnosis' })).not.toBeInTheDocument();
  });

  it('shows the lock banner when readOnly', () => {
    render(<VisitNoteEditor sections={sections} readOnly />);
    expect(screen.getByText('Your role can view this note but not edit it.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Sign Note' })).not.toBeInTheDocument();
  });

  it('is exported as VisitNote', () => {
    expect(VisitNote).toBe(VisitNoteEditor);
  });
});
