import { useState, useRef, type ReactNode } from 'react';
import { TopBar } from '../../../../src/components/TopBar/TopBar';
import { SectionNav } from '../../../../src/components/SectionNav/SectionNav';

export const demoScreens = ['Patient chart', 'Schedule', 'Billing', 'Clinical inbox'] as const;
export type DemoScreen = typeof demoScreens[number];
export function DemoNavigation({ screen, onScreenChange, children }: { screen: DemoScreen; onScreenChange: (screen: DemoScreen) => void; children: ReactNode }) {
  return <><TopBar links={Array.from(demoScreens)} active={screen} role="Provider" user="Lisa Chen" onNavigate={(label) => onScreenChange(label as DemoScreen)} />{children}</>;
}
export function ChartNavigation({ children }: { children: ReactNode }) {
  const chart = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState('Summary');
  const sections = ['Summary', 'Vitals', 'Allergies', 'Problems', 'Medications', 'Lab results'];
  return <div ref={chart} className="demo-chart"><aside><SectionNav items={sections} active={active} onChange={(label) => {
    setActive(label);
    // Look within this chart's shadow root, where the section is rendered.
    chart.current?.querySelector(`[data-chart-section="${label}"]`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }} /></aside><div className="demo-col">{children}</div></div>;
}
