import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Audiogram, audioDegree, audioPTA } from './Audiogram';

describe('Audiogram', () => {
  it('averages 500, 1000 and 2000 Hz', () => {
    expect(audioPTA({ 500: 20, 1000: 20, 2000: 30 })).toBe(23);
    expect(audioPTA({ 500: 95, 1000: 100, 2000: 110 })).toBe(102);
    expect(audioPTA({ 500: 20, 1000: 20 })).toBeNull();
    expect(audioPTA(undefined)).toBeNull();
  });

  it('grades the degree with inclusive cut-offs', () => {
    expect([25, 26, 40, 41, 55, 56, 70, 71, 90, 91].map(audioDegree)).toEqual([
      'Normal', 'Mild', 'Mild', 'Moderate', 'Moderate', 'Moderately severe', 'Moderately severe', 'Severe', 'Severe', 'Profound',
    ]);
  });

  it('summarises each ear in the chart label and tabulates every value', () => {
    render(
      <Audiogram
        right={{ ac: { 250: 45, 500: 45, 1000: 40, 2000: 35 }, bc: { 500: 10 } }}
        left={{ ac: { 500: 95, 1000: 100, 2000: 110, 4000: 120 }, nr: [4000] }}
      />
    );
    expect(
      screen.getByRole('img', {
        name: 'Audiogram. Right ear pure tone average 40 dB HL, Mild. Left ear pure tone average 102 dB HL, Profound. Full values in the table below.',
      })
    ).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Right ear air' })).toBeInTheDocument();
    expect(screen.getByText('Profound', { selector: '.co-tag' })).toBeInTheDocument();
  });
});
