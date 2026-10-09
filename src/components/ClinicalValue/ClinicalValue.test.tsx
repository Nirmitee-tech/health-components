import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { RangeContextProvider, setRangeContext } from '../../clinical';
import { ClinicalValue } from './ClinicalValue';

afterEach(() => act(() => setRangeContext(null)));

const flagOf = (c: HTMLElement) => c.querySelector('.co-af')?.getAttribute('aria-label') ?? null;

describe('ClinicalValue', () => {
  it('formats at the measure precision with the unit label and a spoken sentence', () => {
    const { container } = render(<ClinicalValue measure="temp" value={37} />);
    expect(container.querySelector('.co-cv-v')).toHaveTextContent('37.0');
    expect(container.querySelector('.co-cv-u')).toHaveTextContent('°C');
    expect(screen.getByText('Temperature 37.0 °C')).toHaveClass('co-cv-sr');
    expect(flagOf(container)).toBeNull();
  });

  it('flags high and critical values; critical shows the word', () => {
    const { container, rerender } = render(<ClinicalValue measure="potassium" value={5.4} />);
    expect(flagOf(container)).toBe('High');
    expect(container.querySelector('.co-cv')).toHaveClass('co-cv-hi');
    expect(screen.getByText('Potassium 5.4 mmol/L, High')).toBeInTheDocument();
    rerender(<ClinicalValue measure="glucose" value={48} />);
    expect(flagOf(container)).toBe('Critical low');
    expect(container.querySelector('.co-cv')).toHaveClass('co-cv-crit');
    expect(container.querySelector('.co-af-w')).toHaveTextContent('Critical low');
  });

  it('uses strict comparison at the critical edge', () => {
    const { container } = render(<ClinicalValue measure="potassium" value={6.2} />);
    expect(flagOf(container)).toBe('High');
  });

  it('follows rangeContext, provider and global context, and the lab range wins', () => {
    const { container, rerender } = render(<ClinicalValue measure="glucose" value={150} />);
    expect(flagOf(container)).toBe('High');
    rerender(<ClinicalValue measure="glucose" value={150} rangeContext="inpatient" />);
    expect(flagOf(container)).toBeNull();
    rerender(
      <RangeContextProvider value="inpatient">
        <ClinicalValue measure="glucose" value={150} />
      </RangeContextProvider>
    );
    expect(flagOf(container)).toBeNull();
    rerender(<ClinicalValue measure="glucose" value={150} />);
    act(() => setRangeContext('inpatient'));
    expect(flagOf(container)).toBeNull();
    rerender(<ClinicalValue measure="glucose" value={150} refLow={70} refHigh={140} />);
    expect(flagOf(container)).toBe('High');
  });

  it('picks the pediatric band by age', () => {
    const { container } = render(<ClinicalValue measure="hr" value={150} rangeContext="pediatric" ageYears={0.5} />);
    expect(flagOf(container)).toBeNull();
  });

  it('never flags entered-in-error and labels it', () => {
    const { container } = render(<ClinicalValue measure="potassium" value={7.9} status="entered-in-error" />);
    expect(container.querySelector('.co-cv')).toHaveClass('co-cv-eie');
    expect(flagOf(container)).toBe(null);
    expect(screen.getByText('Entered in error')).toBeInTheDocument();
  });

  it('honours a lab flag and showNormal', () => {
    const { container, rerender } = render(<ClinicalValue measure="trop" value={31} flag="A" />);
    expect(flagOf(container)).toBe('Abnormal');
    rerender(<ClinicalValue measure="sodium" value={140} showNormal />);
    expect(flagOf(container)).toBe('Normal');
  });

  it('drops the sample range when shown in another unit without a lab range', () => {
    const { container } = render(<ClinicalValue measure="glucose" unit="mmol/L" value={2.0} precision={1} />);
    expect(flagOf(container)).toBeNull();
    expect(screen.getByRole('tooltip')).toHaveTextContent('No reference range');
  });

  it('describes the value with the range tooltip and shows a meta line', () => {
    render(
      <ClinicalValue measure="potassium" value={5.4} showMeta source="Quest" timestamp="2026-10-09T13:40:00Z" timeZone="America/Chicago" data-testid="cv" />
    );
    const tip = screen.getByRole('tooltip');
    expect(tip).toHaveTextContent('Reference 3.5–5.1 mmol/L · LOINC 2823-3 · 10/09/2026 08:40 CDT · Quest');
    expect(document.querySelector('[aria-describedby]')).toHaveAttribute('aria-describedby', tip.id);
    expect(screen.getByTestId('cv')).toHaveClass('co-cv-stack');
    expect(screen.getByText('Ref 3.5–5.1 mmol/L · 10/09/2026 08:40 CDT · Quest')).toBeInTheDocument();
  });

  it('reads the trend in words', () => {
    render(<ClinicalValue measure="potassium" value={5.4} trend="up" delta="+0.6" tooltip={false} />);
    expect(screen.getByTitle('rising +0.6')).toHaveTextContent('↑ +0.6 rising');
  });
});
