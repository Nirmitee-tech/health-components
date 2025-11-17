import type { Meta, StoryObj } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { EpicLoginButton } from "./EpicLoginButton";
import { EpicAuthProvider } from "./EpicAuthProvider";

const meta: Meta<typeof EpicLoginButton> = {
  title: "Components/Auth/EpicLoginButton",
  component: EpicLoginButton,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
## Epic Login Button

A simple UI component that initiates the Epic login flow.
This component **MUST** be used inside an \`<EpicAuthProvider />\` wrapper.

### Usage
\`\`\`tsx
import { EpicAuthProvider, EpicLoginButton } from 'my-health-components';

function App() {
  return (
    <EpicAuthProvider
      clientId="your-epic-client-id"
      redirectUri="http://localhost:3000"
      onSuccess={(data) => console.log('Login Success!', data)}
      onError={(err) => alert(err.message)}
    >
      <MyPage />
    </EpicAuthProvider>
  )
}

function MyPage() {
  const { isAuthenticated, logout } = useEpicAuth();

  if (isAuthenticated) {
    return <button onClick={logout}>Logout</button>
  }
  
  return <EpicLoginButton />
}
\`\`\`
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <EpicAuthProvider
        clientId="YOUR_EPIC_CLIENT_ID"
        redirectUri={window.location.origin}
        onSuccess={action('onSuccess')}
        onError={action('onError')}
      >
        <Story />
      </EpicAuthProvider>
    ),
  ],
  // ---
  argTypes: {
    buttonLabel: {
      description: "Custom button label",
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

export const Default: Story = {
  args: {
    buttonLabel: "Sign in with Epic",
  },
};