import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { catalogueGroups, type CatalogueEntry } from '../src/internal/docs/catalogue-utils';
import { ComponentCatalogue } from '../src/internal/docs/ComponentCatalogue';
const entries: CatalogueEntry[] = [
  {name:'PatientBanner',layer:'Complex',group:'Clinical',groupSlug:'complex-clinical',summary:'Patient identity and safety alerts',tag:'co-patient-banner'},
  {name:'Button',layer:'Basic',group:'Actions',groupSlug:'basic-actions',summary:'Trigger an action',tag:'co-button'},
];
describe('component catalogue', () => {
  it('groups into string labels and places basic controls first', () => {
    expect(catalogueGroups(entries).map(group => group.label)).toEqual(['Basic · Actions','Complex · Clinical']);
  });
  it('searches purpose and tag, and combines search with layer', () => {
    expect(catalogueGroups(entries,'safety alerts','Complex')[0]?.entries[0]?.name).toBe('PatientBanner');
    expect(catalogueGroups(entries,'co-button','Complex')).toEqual([]);
  });
  it('shows links, filters the visible catalogue and recovers from no results', async () => {
    const user = userEvent.setup();
    render(<ComponentCatalogue entries={entries} base="/health-components/docs/components/" />);
    expect(screen.getByRole('link',{name:/PatientBanner/})).toHaveAttribute('href','/health-components/docs/components/complex-clinical/PatientBanner/');
    await user.type(screen.getByRole('searchbox'), 'safety');
    expect(screen.queryByRole('link',{name:/Button/})).not.toBeInTheDocument();
    await user.selectOptions(screen.getByRole('combobox'), 'Basic');
    expect(screen.getByRole('heading',{name:'No matching components'})).toBeVisible();
    await user.click(screen.getByRole('button',{name:'Clear filters'}));
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
});
