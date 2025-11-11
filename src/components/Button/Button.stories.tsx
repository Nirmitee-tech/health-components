// Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

// Sample icons (you can replace with your icon library)

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'],
    },
    size: {
      control: 'select',
      options: ['xs', 'small', 'medium', 'large', 'xl'],
    },
    rounded: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'full'],
    },
    outline: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    iconPosition: {
      control: 'select',
      options: ['left', 'right'],
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// ============================================
// BASIC VARIANTS
// ============================================

export const Primary: Story = {
  args: {
    label: 'Primary Button',
    variant: 'primary',
  },
};

export const Secondary: Story = {
  args: {
    label: 'Secondary Button',
    variant: 'secondary',
  },
};

export const Success: Story = {
  args: {
    label: 'Success Button',
    variant: 'success',
  },
};

export const Danger: Story = {
  args: {
    label: 'Danger Button',
    variant: 'danger',
  },
};

export const Warning: Story = {
  args: {
    label: 'Warning Button',
    variant: 'warning',
  },
};

export const Info: Story = {
  args: {
    label: 'Info Button',
    variant: 'info',
  },
};

export const Light: Story = {
  args: {
    label: 'Light Button',
    variant: 'light',
  },
};

export const Dark: Story = {
  args: {
    label: 'Dark Button',
    variant: 'dark',
  },
};

// ============================================
// OUTLINE VARIANTS
// ============================================

export const OutlinePrimary: Story = {
  args: {
    label: 'Outline Primary',
    variant: 'primary',
    outline: true,
  },
};

export const OutlineSecondary: Story = {
  args: {
    label: 'Outline Secondary',
    variant: 'secondary',
    outline: true,
  },
};

export const OutlineSuccess: Story = {
  args: {
    label: 'Outline Success',
    variant: 'success',
    outline: true,
  },
};

export const OutlineDanger: Story = {
  args: {
    label: 'Outline Danger',
    variant: 'danger',
    outline: true,
  },
};

// ============================================
// SIZES
// ============================================

export const ExtraSmall: Story = {
  args: {
    label: 'Extra Small',
    variant: 'primary',
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    label: 'Small Button',
    variant: 'primary',
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    label: 'Medium Button',
    variant: 'primary',
    size: 'medium',
  },
};

export const Large: Story = {
  args: {
    label: 'Large Button',
    variant: 'primary',
    size: 'large',
  },
};

export const ExtraLarge: Story = {
  args: {
    label: 'Extra Large',
    variant: 'primary',
    size: 'xl',
  },
};

// ============================================
// ROUNDED CORNERS
// ============================================

export const RoundedNone: Story = {
  args: {
    label: 'No Rounded',
    variant: 'primary',
    rounded: 'none',
  },
};

export const RoundedSmall: Story = {
  args: {
    label: 'Small Rounded',
    variant: 'primary',
    rounded: 'sm',
  },
};

export const RoundedMedium: Story = {
  args: {
    label: 'Medium Rounded',
    variant: 'primary',
    rounded: 'md',
  },
};

export const RoundedLarge: Story = {
  args: {
    label: 'Large Rounded',
    variant: 'primary',
    rounded: 'lg',
  },
};

export const RoundedFull: Story = {
  args: {
    label: 'Pill Button',
    variant: 'primary',
    rounded: 'full',
  },
};

// ============================================
// STATES
// ============================================

export const Loading: Story = {
  args: {
    label: 'Loading...',
    variant: 'primary',
    loading: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
};

export const FullWidth: Story = {
  args: {
    label: 'Full Width Button',
    variant: 'primary',
    fullWidth: true,
  },
  parameters: {
    layout: 'padded',
  },
};

// ============================================
// WITH ICONS
// ============================================

// export const WithIconLeft: Story = {
//   args: {
//     label: 'Favorite',
//     variant: 'primary',
//     icon: <StarIcon />,
//     iconPosition: 'left',
//   },
// };

// export const WithIconRight: Story = {
//   args: {
//     label: 'Download',
//     variant: 'success',
//     icon: <DownloadIcon />,
//     iconPosition: 'right',
//   },
// };

// export const IconOnlyStyle: Story = {
//   args: {
//     label: '',
//     variant: 'primary',
//     icon: <HeartIcon />,
//     size: 'large',
//     rounded: 'full',
//     className: 'icon-only-btn',
//   },
// };

// ============================================
// CUSTOM CLASSNAMES EXAMPLES
// ============================================

export const WithCustomClass: Story = {
  args: {
    label: 'Custom Styled',
    variant: 'primary',
    className: 'custom-shadow-glow',
  },
};

export const WithTailwindClasses: Story = {
  args: {
    label: 'Tailwind Styled',
    className: 'shadow-2xl hover:scale-105'
    
  },
};

export const WithMultipleClasses: Story = {
  args: {
    label: 'Multiple Classes',
    variant: 'success',
    className: 'custom-animation pulse-effect gradient-bg',
  },
};

// ============================================
// COMBINATION EXAMPLES
// ============================================

export const LargeOutlineRounded: Story = {
  args: {
    label: 'Sign Up Now',
    variant: 'primary',
    outline: true,
    size: 'large',
    rounded: 'full',
  },
};

export const DangerWithIcon: Story = {
  args: {
    label: 'Delete',
    variant: 'danger',
    icon: <span>🗑️</span>,
    iconPosition: 'left',
    size: 'medium',
  },
};

export const LoadingOutline: Story = {
  args: {
    label: 'Processing',
    variant: 'info',
    outline: true,
    loading: true,
  },
};

// export const FullWidthSuccess: Story = {
//   args: {
//     label: 'Complete Purchase',
//     variant: 'success',
//     size: 'large',
//     fullWidth: true,
//     icon: <PlusIcon />,
//   },
//   parameters: {
//     layout: 'padded',
//   },
// };