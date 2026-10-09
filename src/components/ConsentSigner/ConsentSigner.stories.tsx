import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { ConsentSigner } from './ConsentSigner';

const telehealth =
  'I agree to receive care by video. I understand the clinician may decide an in-person visit is needed.\n\nMy information is protected under HIPAA. Video visits are not recorded.\n\nI can withdraw this consent at any time.';

const meta = {
  title: 'Complex/Clinical/ConsentSigner',
  component: ConsentSigner,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'ConsentSigner shows a consent document in a scroll box with agree, signature and guardian fields. Sign Consent is enabled once the box is ticked and the pad is signed (and, for a guardian, the relationship is filled).',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
    version: { control: 'text' },
    body: { control: 'text' },
    signer: { control: 'text' },
    guardian: { control: 'text' },
  },
  args: {
    title: 'Consent for Telehealth Services',
    version: 'Version 3 . effective 01/01/2026',
    body: telehealth,
    signer: 'Henna West',
    onSignConsent: fn(),
    onDecline: fn(),
    onAgreedChange: fn(),
    onSignedChange: fn(),
  },
} satisfies Meta<typeof ConsentSigner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

/** The design system demo: a parent signs a telehealth consent for a child. */
export const Guardian: Story = {
  args: { signer: 'Maria Jones', guardian: 'Mother', signerLabel: 'Parent or Guardian Signature' },
};

export const Signed: Story = { args: { agreed: true, signed: true } };

export const Compact: Story = {
  args: {
    title: 'Notice of Privacy Practices',
    version: 'Version 7 . effective 04/14/2026',
    body: 'We use your health information to treat you, bill for care and run our practice.\n\nYou can ask for a copy of your record at any time.',
    compact: true,
  },
};
