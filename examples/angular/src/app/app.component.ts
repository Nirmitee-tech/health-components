import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';

type Theme = 'classic' | 'sidebar' | 'rail' | 'command' | 'dark';

@Component({
  selector: 'app-root',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
})
export class AppComponent {
  readonly themes: Theme[] = ['classic', 'sidebar', 'rail', 'command', 'dark'];
  readonly theme = signal<Theme>('classic');
  readonly tab = signal('summary');
  readonly log = signal<string[]>([]);
  readonly allergies = ['Penicillin', 'Sulfa'];
  readonly tabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'meds', label: 'Medications', count: 6 },
    { id: 'claims', label: 'Claims', count: 2 },
  ];
  readonly providers = ['All', 'James Bell MD', 'Kristen Yale MD', 'Priya Shah MD'];
  readonly claimActions = [{ label: 'Submit and Print CMS-1500', icon: 'file' }, { label: 'Save as Draft', icon: 'download' }];

  record(message: string) {
    this.log.update((l) => [...l, message]);
  }
  onTab(event: Event) {
    const id = (event as CustomEvent<string>).detail;
    this.tab.set(id);
    this.record(`Tab: ${id}`);
  }
  onClaimAction(event: Event) {
    const [item] = (event as CustomEvent<[{ label: string }, number]>).detail;
    this.record(`Claim action: ${item.label}`);
  }
  onProvider(event: Event) {
    // Change events carry the control's value in `detail`.
    this.record(`Provider: ${(event as CustomEvent<string>).detail}`);
  }
}
