# Health Components

A modern, accessible React component library built with TypeScript and styled with Tailwind CSS. Clean, customizable components for building beautiful user interfaces.

[![npm version](https://badge.fury.io/js/health-components.svg)](https://badge.fury.io/js/health-components)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **React 19+**: Built with the latest React features
- **TypeScript**: Full type safety and excellent developer experience
- **Tailwind CSS**: Utility-first styling with easy customization
<!-- - **♿ Accessible**: WCAG compliant components -->
- **Responsive**: Mobile-first design approach
- **Tested**: Comprehensive test coverage with Jest
- **Tree-shakable**: Import only what you need
- **Performance**: Optimized for production

## Installation

```bash
npm install health-components
```

```bash
yarn add health-components
```

```bash
pnpm add health-components
```

## Usage

### Basic Usage

```tsx
import React from 'react';
import { Button } from 'health-components';
import 'health-components/styles/components.css';

function App() {
  return (
    <div>
      <Button 
        label="Click Me" 
        variant="primary" 
        onClick={() => console.log('Button clicked!')}
      />
    </div>
  );
}
```

### Button Examples

```tsx
import { Button } from 'health-components';

function ButtonShowcase() {
  return (
    <div>
      {/* Basic Variants */}
      <Button label="Primary" variant="primary" />
      <Button label="Secondary" variant="secondary" />
      <Button label="Success" variant="success" />
      <Button label="Danger" variant="danger" />
      
      {/* Different Sizes */}
      <Button label="Small" variant="primary" size="small" />
      <Button label="Medium" variant="primary" size="medium" />
      <Button label="Large" variant="primary" size="large" />
      
      {/* With Icons */}
          <Button 
        variant="primary" 
        size="large"
        icon={<span>DOWNLOAD</span>} 
        onClick={() => alert('Downloaded!')}
    >
        Download File
    </Button>
      
      {/* Loading State */}
      <Button 
        label="Loading..." 
        variant="primary" 
        loading={true} 
      />
      
      {/* Full Width */}
      <Button 
        label="Full Width Button" 
        variant="primary" 
        fullWidth 
      />
    </div>
  );
}
```

### Custom Styling

```tsx
import { Button } from 'health-components';

function CustomButtons() {
  return (
    <div>
      {/* Custom colors */}
      <Button 
        label="Custom Red" 
        className="!bg-red-500 hover:!bg-red-600 !text-white"
      />
      
      {/* Gradient button */}
      <Button 
        label="Gradient" 
        className="!bg-gradient-to-r !from-purple-500 !to-pink-500"
      />
      
      {/* Shadow and animations */}
      <Button 
        label="Animated" 
        variant="primary"
        className="shadow-lg hover:scale-105 transition-transform"
      />
    </div>
  );
}
```

## Components

### Button

A versatile button component with multiple variants, sizes, and customization options.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Button text content |
| `variant` | `'primary' \| 'secondary' \| 'success' \| 'danger' \| 'warning' \| 'info' \| 'light' \| 'dark'` | `'primary'` | Button style variant |
| `size` | `'xs' \| 'small' \| 'medium' \| 'large' \| 'xl'` | `'medium'` | Button size |
| `outline` | `boolean` | `false` | Use outline style |
| `rounded` | `'none' \| 'sm' \| 'md' \| 'lg' \| 'full'` | `'md'` | Border radius |
| `fullWidth` | `boolean` | `false` | Full width button |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `icon` | `React.ReactNode` | - | Icon element |
| `iconPosition` | `'left' \| 'right'` | `'left'` | Icon position |
| `className` | `string` | - | Additional CSS classes |

#### Examples

```tsx
// Basic variants
<Button label="Primary" variant="primary" />
<Button label="Secondary" variant="secondary" />
<Button label="Success" variant="success" />

// Different sizes
<Button label="Small" size="small" />
<Button label="Large" size="large" />

// With icons
<Button 
  label="Save" 
  variant="success" 
  icon={<SaveIcon />} 
  iconPosition="left" 
/>

// Loading state
<Button 
  label="Saving..." 
  variant="primary" 
  loading={true} 
/>

// Custom styling
<Button 
  label="Custom" 
  variant="primary" 
  className="shadow-lg hover:scale-105 transition-transform" 
/>
```

## Styling

Health Components uses Tailwind CSS for styling. You have several options for customization:

### Option 1: Use Default Styles

```tsx
import 'health-components/styles/components.css';
```

### Option 2: Custom Tailwind Classes

```tsx
<Button 
  label="Custom Button" 
  className="bg-blue-500 hover:bg-blue-600 text-white shadow-lg"
/>
```

### Option 3: Extend with Your Theme

```css
/* your-styles.css */
.btn-custom {
  @apply bg-purple-600 text-white hover:bg-purple-700 shadow-md;
}

.btn-gradient {
  @apply bg-gradient-to-r from-blue-500 to-purple-600;
}
```

## Development

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm

### Setup

```bash
# Clone the repository
git clone https://github.com/iUtkarshtiwari/RepositoryP.git
cd health-components

# Install dependencies
npm install

# Start development mode
npm run dev

# Run Storybook
npm run storybook

# Run tests
npm test
```

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Build the library for production |
| `npm run dev` | Start development mode with watch |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run clean` | Clean build artifacts |

## Documentation

For detailed documentation and interactive examples, visit our documentation site.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-component`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit your changes: `git commit -m 'feat: add new component'`
7. Push to the branch: `git push origin feature/new-component`
8. Submit a pull request

## Use Cases

This component library is perfect for:

- **Web applications** requiring consistent UI components
- **Admin dashboards** and management interfaces  
- **Form-heavy applications** with complex interactions
- **Mobile-responsive** web applications
- **Enterprise applications** requiring accessibility compliance
- **Rapid prototyping** and development

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Links

- [NPM Package](https://www.npmjs.com/package/health-components)
<!-- - [GitHub Repository](https://github.com/iUtkarshtiwari/RepositoryP) -->
<!-- - [Documentation](https://your-docs-url.com) -->

<!-- ## Support

- Create an [issue](https://github.com/iUtkarshtiwari/RepositoryP/issues) for bug reports or feature requests
- Check existing [discussions](https://github.com/iUtkarshtiwari/RepositoryP/discussions) for questions -->

## Acknowledgments

- Built with [React](https://reactjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Tested with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/)

<!-- --- -->

<!-- <p align="center">
  Made with for the developer community
</p> -->