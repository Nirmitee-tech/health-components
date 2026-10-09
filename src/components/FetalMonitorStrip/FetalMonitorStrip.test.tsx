import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FetalMonitorStrip, approximateBaseline } from './FetalMonitorStrip';

describe('FetalMonitorStrip', () => {
  it('rounds the approximate baseline to 5 bpm, ignoring signal loss', () => {
    expect(approximateBaseline([140, 142, null, 146])).toBe(145);
    expect(approximateBaseline([null])).toBeNull();
  });

  it('describes the tracing, signal loss and category', () => {
    render(<FetalMonitorStrip fhr={[140, 142, null, 146]} toco={[10, 40, 60, 20]} category="II" categoryBy="Dr. Grace Obi 14:22" />);
    expect(screen.getByRole('img', { name: /approximate baseline 145 bpm, with signal loss/ })).toBeInTheDocument();
    expect(screen.getByText('Category II, Dr. Grace Obi 14:22')).toBeInTheDocument();
    expect(screen.getByText('Signal loss')).toBeInTheDocument();
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('is disconnected without data', () => {
    render(<FetalMonitorStrip room="Triage 2" />);
    expect(screen.getByText('Connect the bedside monitor in room Triage 2 to stream the tracing.')).toBeInTheDocument();
  });
});
