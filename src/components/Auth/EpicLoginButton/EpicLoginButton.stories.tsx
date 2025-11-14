import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { EpicLoginButton } from "./EpicLoginButton";
import { EPIC_SANDBOX_CONFIG } from "./constant";

const meta: Meta<typeof EpicLoginButton> = {
  title: "Components/EpicLoginButton",
  component: EpicLoginButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Epic Login Button

A SMART on FHIR compliant login button. This component handles **Step 1** of the OAuth 2.0 PKCE flow: it redirects the user to Epic.

### Usage
\`\`\`tsx
import { EpicLoginButton } from 'my-library';

<EpicLoginButton
  clientId="your-epic-client-id"
  redirectUri="https://yourapp.com/callback"
  wellKnown="https://fhir.epic.com/.../.well-known/smart_configuration"
  fhirBase="https://fhir.epic.com/..."
  onError={(error) => console.error('Error:', error)}
  onStart={() => console.log('Login started...')}
/>
\`\`\`

To complete the login, use the \`useEpicCallback\` hook on your \`/callback\` page.
        `,
      },
    },
  },
  argTypes: {
    clientId: {
      description: "Epic client ID registered with Epic",
      control: { type: "text" },
    },
    redirectUri: {
      description: "Redirect URI for OAuth callback",
      control: { type: "text" },
    },
    wellKnown: {
      description: "Well-known SMART configuration endpoint URL",
      control: { type: "text" },
    },
    disabled: {
      description: "Disable the button",
      control: { type: "boolean" },
    },
    onStart: { action: "onStart" },
    onError: { action: "onError" }
  },
  args: {
    onStart: action("onStart"),
    onError: action("onError")
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const EPIC_SAMPLE_CONFIG = {
  clientId: "your-epic-client-id",
  redirectUri: process.env.STORYBOOK_EPIC_REDIRECT_URI || "http://localhost:3000",
  ...EPIC_SANDBOX_CONFIG,
};

export const Default: Story = {
  args: {
    ...EPIC_SAMPLE_CONFIG,
    onStart: action('authentication-started'),
    onError: action('authentication-error'),
  },
  parameters: {
    docs: {
      description: {
        story: 'Default Epic login button with sample app configuration. Click to test authentication flow.',
      },
    },
  },
};
