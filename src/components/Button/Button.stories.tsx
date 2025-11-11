import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Button component supports multiple styling approaches:
- **Default styling**: Use built-in variants and props
- **Tailwind CSS**: Add custom Tailwind classes via className
- **Custom CSS**: Use semantic classes or the unstyled prop
- **CSS-in-JS**: Works with styled-components, emotion, etc.
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
      description: 'Visual style variant of the button'
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
      description: 'Size of the button'
    },
    fullWidth: {
      control: 'boolean',
      description: 'Whether the button should take full width of its container'
    },
    isLoading: {
      control: 'boolean',
      description: 'Shows loading spinner and disables the button'
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button'
    },
    unstyled: {
      control: 'boolean',
      description: 'Removes all default styling for complete customization'
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Examples
export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger Button',
    variant: 'danger',
  },
};

// Sizes
export const Small: Story = {
  args: {
    children: 'Small Button',
    variant: 'primary',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    children: 'Medium Button',
    variant: 'primary',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    children: 'Large Button',
    variant: 'primary',
    size: 'large',
  },
};

// States
export const Loading: Story = {
  args: {
    children: 'Loading Button',
    variant: 'primary',
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// Custom Styling Examples
export const TailwindStyling: Story = {
  args: {
    children: 'Custom Tailwind Button',
    className: "bg-red-500",
    variant: "primary"
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of using Tailwind CSS classes for custom styling. The className prop allows you to override or extend default styles.'
      }
    }
  }
};

export const CustomCSS: Story = {
  args: {
    children: 'Custom CSS Button',
    className: "custom-gradient-button bg-red-500",
  },
  decorators: [
    (Story) => (
      <div>
        <style>{`
          .custom-gradient-button {
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4);
            border: none;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
          }
          .custom-gradient-button:hover {
            background: linear-gradient(45deg, #ff5252, #26c6da);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
        `}</style>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Example of using custom CSS classes. You can define your own styles and apply them via className.'
      }
    }
  }
};

export const UnstyledCustom: Story = {
  args: {
    children: 'Completely Custom Button',
    className: 'brand-button',
    unstyled: true,
  },
  decorators: [
    (Story) => (
      <div>
        <style>{`
          .brand-button {
            background-color: #2563eb;
            color: white;
            border: 2px solid transparent;
            border-radius: 0.5rem;
            padding: 0.75rem 1.5rem;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
          }
          .brand-button:hover {
            background-color: #1d4ed8;
            border-color: #3b82f6;
          }
          .brand-button:disabled {
            background-color: #9ca3af;
            cursor: not-allowed;
          }
        `}</style>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Example of completely custom styling using the `unstyled` prop. This removes all default styles, giving you complete control.'
      }
    }
  }
};
