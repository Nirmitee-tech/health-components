import { forwardRef } from 'react';
import { Drawer, type DrawerProps, type DrawerSection } from '../Drawer/Drawer';

export interface DevDrawerProps
  extends Omit<DrawerProps, 'title' | 'developer' | 'sections' | 'children' | 'side' | 'footer'> {
  /** Screen name; the title reads "For developers: <screen>". Required */
  screen: string;
  /** Purpose and roles: what the screen does and who uses it. Required */
  purpose: string;
  /** Roles and access; default none */
  roles?: string;
  /** API calls and payloads, shown in mono; default none */
  api?: string;
  /** Fields and which are required; default none */
  fields?: string;
  /** States the screen can be in; default none */
  states?: string;
  /** Entry points: where the screen is opened from; default none */
  entry?: string;
  /** Panel width in px; default 560 */
  width?: number;
  /** Whether the drawer is shown; default true */
  open?: boolean;
  /** Called by the x button, Escape and a scrim press; default none */
  onClose?: () => void;
  /** Render in place for docs: no portal, focus trap, scroll lock or Escape; default false */
  inline?: boolean;
}

/** DevDrawer is the "For developers" panel every screen has: purpose and roles, API, fields, states and entry points. */
export const DevDrawer = forwardRef<HTMLDivElement, DevDrawerProps>(function DevDrawer(
  { screen, purpose, roles, api, fields, states, entry, ...rest },
  ref
) {
  const sections: DrawerSection[] = [{ title: 'Purpose and roles', body: purpose }];
  if (roles) sections.push({ title: 'Roles and access', body: roles });
  if (api) sections.push({ title: 'API', code: api });
  if (fields) sections.push({ title: 'Fields', body: fields });
  if (states) sections.push({ title: 'States', body: states });
  if (entry) sections.push({ title: 'Entry points', body: entry });
  return <Drawer ref={ref} developer title={screen} sections={sections} {...rest} />;
});
