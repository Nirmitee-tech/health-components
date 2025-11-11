import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  outline?: boolean;
  size?: 'xs' | 'small' | 'medium' | 'large' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  outline = false,
  size = 'medium',
  rounded = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props
}) => {
  // ✅ Tailwind variants
  const variantClasses = {
    primary: outline
      ? 'border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
      : 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: outline
      ? 'border border-gray-500 text-gray-700 hover:bg-gray-100'
      : 'bg-gray-500 text-white hover:bg-gray-600',
    success: outline
      ? 'border border-green-500 text-green-500 hover:bg-green-500 hover:text-white'
      : 'bg-green-500 text-white hover:bg-green-600',
    danger: outline
      ? 'border border-red-500 text-red-500 hover:bg-red-500 hover:text-white'
      : 'bg-red-500 text-white hover:bg-red-600',
    warning: outline
      ? 'border border-yellow-400 text-yellow-500 hover:bg-yellow-400 hover:text-white'
      : 'bg-yellow-400 text-black hover:bg-yellow-500',
    info: outline
      ? 'border border-sky-500 text-sky-500 hover:bg-sky-500 hover:text-white'
      : 'bg-sky-500 text-white hover:bg-sky-600',
    light: outline
      ? 'border border-gray-300 text-gray-600 hover:bg-gray-100'
      : 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    dark: outline
      ? 'border border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white'
      : 'bg-gray-800 text-white hover:bg-gray-900',
  }[variant];

  // ✅ Sizes
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-5 py-3 text-lg',
    xl: 'px-6 py-3 text-xl',
  }[size];

  // ✅ Rounded options
  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  }[rounded];

  // ✅ Common base styles
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed';

  return (
    <button
      className={`
        ${baseClasses}
        ${variantClasses}
        ${sizeClasses}
        ${roundedClasses}
        ${fullWidth ? 'w-full' : ''}
        ${loading ? 'opacity-70 cursor-wait' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <span className="mr-2">{icon}</span>
      )}
      <span>{label}</span>
      {!loading && icon && iconPosition === 'right' && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;
