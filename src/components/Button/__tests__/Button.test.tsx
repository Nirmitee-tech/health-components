import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-primary', 'rclib-button--primary');

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(button).toHaveClass('btn-secondary', 'rclib-button--secondary');

    rerender(<Button variant="danger">Danger</Button>);
    expect(button).toHaveClass('btn-danger', 'rclib-button--danger');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-small', 'rclib-button--small');

    rerender(<Button size="medium">Medium</Button>);
    expect(button).toHaveClass('btn-medium', 'rclib-button--medium');

    rerender(<Button size="large">Large</Button>);
    expect(button).toHaveClass('btn-large', 'rclib-button--large');
  });

  it('applies semantic classes', () => {
    render(<Button variant="primary" size="large" fullWidth>Test</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('rclib-button');
    expect(button).toHaveClass('rclib-button--primary');
    expect(button).toHaveClass('rclib-button--large');
    expect(button).toHaveClass('rclib-button--full-width');
  });

  it('applies data attributes', () => {
    render(
      <Button variant="danger" size="small" isLoading fullWidth>
        Test
      </Button>
    );
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('data-variant', 'danger');
    expect(button).toHaveAttribute('data-size', 'small');
    expect(button).toHaveAttribute('data-loading', 'true');
    expect(button).toHaveAttribute('data-full-width', 'true');
  });

  it('shows loading state', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('btn-loading', 'rclib-button--loading');
    expect(screen.getByText('Loading')).toBeInTheDocument();
    expect(button.querySelector('.rclib-button__spinner')).toBeInTheDocument();
  });

  it('applies full width class', () => {
    render(<Button fullWidth>Full Width</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-full-width', 'rclib-button--full-width');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('rclib-button--disabled');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('applies custom className alongside component classes', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
    expect(button).toHaveClass('rclib-button');
    expect(button).toHaveClass('btn');
  });

  it('removes default styles when unstyled prop is true', () => {
    render(<Button unstyled className="completely-custom">Unstyled</Button>);
    const button = screen.getByRole('button');
    
    // Should have semantic classes
    expect(button).toHaveClass('rclib-button');
    expect(button).toHaveClass('completely-custom');
    
    // Should NOT have CSS module classes
    expect(button).not.toHaveClass('btn');
    expect(button).not.toHaveClass('btn-primary');
  });

  it('applies content and spinner wrapper classes', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByRole('button');
    
    expect(button.querySelector('.rclib-button__content')).toBeInTheDocument();
    expect(button.querySelector('.rclib-button__spinner')).toBeInTheDocument();
  });

  it('defaults to medium size and primary variant', () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveAttribute('data-variant', 'primary');
    expect(button).toHaveAttribute('data-size', 'medium');
    expect(button).toHaveClass('rclib-button--primary');
    expect(button).toHaveClass('rclib-button--medium');
  });
});
