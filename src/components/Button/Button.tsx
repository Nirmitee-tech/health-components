import React, { forwardRef } from "react";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual style variant of the button
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * Size of the button
   * @default 'medium'
   */
  size?: ButtonSize;
  /**
   * Content to display inside the button
   */
  children: React.ReactNode;
  /**
   * Whether the button should take full width of its container
   * @default false
   */
  fullWidth?: boolean;
  /**
   * Loading state of the button
   * @default false
   */
  isLoading?: boolean;
  /**
   * Disable default component styles (useful for complete custom styling)
   * @default false
   */
  unstyled?: boolean;
}

/**
 * Button component for user interactions
 *
 * @example
 * ```tsx
 * // Default styled button
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Click me
 * </Button>
 * 
 * // Custom styled with Tailwind
 * <Button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
 *   Custom Tailwind Button
 * </Button>
 * 
 * // Custom styled with CSS classes
 * <Button className="my-custom-button" unstyled>
 *   Custom CSS Button
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "medium",
      fullWidth = false,
      isLoading = false,
      unstyled = false,
      disabled,
      className = "",
      ...rest
    },
    ref
  ) => {
    // Base semantic class for external styling
    const semanticClasses = [
      "rclib-button", // Library namespace
      `rclib-button--${variant}`,
      `rclib-button--${size}`,
      fullWidth && "rclib-button--full-width",
      isLoading && "rclib-button--loading",
      disabled && "rclib-button--disabled",
    ].filter(Boolean);

    // Internal CSS Module classes (only if not unstyled)
    const moduleClasses = !unstyled
      ? [
          styles.btn,
          styles[`btn-${variant}`],
          styles[`btn-${size}`],
          fullWidth && styles["btn-full-width"],
          isLoading && styles["btn-loading"],
        ].filter(Boolean)
      : [];

    // Combine all classes
    const buttonClasses = [
      ...semanticClasses,
      ...moduleClasses,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        data-variant={variant}
        data-size={size}
        data-loading={isLoading}
        data-full-width={fullWidth}
        {...rest}
      >
        {isLoading && (
          <span 
            className={`${!unstyled ? styles.spinner : ""} rclib-button__spinner`} 
            aria-hidden="true" 
          />
        )}
        <span className={`${!unstyled ? styles.content : ""} rclib-button__content`}>
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
