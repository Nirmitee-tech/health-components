import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { expect, it, vi } from 'vitest';
import { DemoNavigation, ChartNavigation, type DemoScreen } from '../website/src/components/docs/DemoNavigation';
it('navigates the actual workspace and indicates the selected screen', async () => {
  function Workspace() {
    const [current, setCurrent] = useState<DemoScreen>('Patient chart');
    return <DemoNavigation screen={current} onScreenChange={setCurrent}><h1>{current}</h1></DemoNavigation>;
  }
  render(<Workspace />);
  await userEvent.click(screen.getByRole('link',{name:'Billing'}));
  expect(screen.getByRole('heading',{name:'Billing'})).toBeVisible();
  expect(screen.getByRole('link',{name:'Billing'})).toHaveAttribute('aria-current','page');
});
it('allows the chart section selection to change', async () => {
  render(<ChartNavigation><section data-chart-section="Allergies">Allergy details</section></ChartNavigation>);
  const scroll = vi.spyOn(screen.getByText('Allergy details'), 'scrollIntoView');
  await userEvent.click(screen.getByRole('link',{name:'Allergies'}));
  expect(scroll).toHaveBeenCalledWith({ block: 'start', behavior: 'smooth' });
  expect(screen.getByRole('link',{name:'Allergies'})).toHaveAttribute('aria-current','page');
});
