import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from './Button';

describe('Button Component', () => {
  // Basic rendering tests
  it('renders with default props', () => {
    render(<Button label="Test Button" />);
    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<Button label="Custom Label" />);
    expect(screen.getByText('Custom Label')).toBeInTheDocument();
  });

  // Variant tests
  it('applies primary variant class', () => {
    render(<Button label="Primary" variant="primary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-blue-500');
  });

  it('applies secondary variant class', () => {
    render(<Button label="Secondary" variant="secondary" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-500');
  });

  it('applies danger variant class', () => {
    render(<Button label="Danger" variant="danger" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-500');
  });

  // Size tests
  it('applies small size class', () => {
    render(<Button label="Small" size="small" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-1.5', 'text-sm');
  });

  it('applies large size class', () => {
    render(<Button label="Large" size="large" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('px-5', 'py-3', 'text-lg');
  });

  // State tests
  it('handles disabled state', () => {
    render(<Button label="Disabled" disabled />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-60', 'disabled:cursor-not-allowed');
  });

  it('handles loading state', () => {
    render(<Button label="Loading" loading />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  // Event handling tests
  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Clickable" onClick={handleClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button label="Disabled" onClick={handleClick} disabled />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Icon tests
  it('renders with icon on the left', () => {
    render(
      <Button 
        label="With Icon" 
        icon={<span data-testid="test-icon">★</span>} 
        iconPosition="left" 
      />
    );
    
    const icon = screen.getByTestId('test-icon');
    const button = screen.getByRole('button');
    
    expect(icon).toBeInTheDocument();
    expect(button).toContainElement(icon);
  });

  it('renders with icon on the right', () => {
    render(
      <Button 
        label="With Icon" 
        icon={<span data-testid="test-icon">★</span>} 
        iconPosition="right" 
      />
    );
    
    const icon = screen.getByTestId('test-icon');
    expect(icon).toBeInTheDocument();
  });

  // Full width test
  it('applies full width class', () => {
    render(<Button label="Full Width" fullWidth />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  // Outline test
  it('applies outline styles', () => {
    render(<Button label="Outline" variant="primary" outline />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('border-blue-500', 'text-blue-500');
  });

  // Custom className test
  it('applies custom className', () => {
    render(<Button label="Custom" className="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  // Rounded variants test
  it('applies rounded styles', () => {
    render(<Button label="Rounded" rounded="full" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('rounded-full');
  });

  // Button type test
  it('applies correct button type', () => {
    render(<Button label="Submit" type="submit" />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
});
