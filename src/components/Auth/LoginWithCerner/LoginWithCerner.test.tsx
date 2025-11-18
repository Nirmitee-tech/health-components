import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginWithCerner from './LoginWithCerner';
import { buildCernerAuthUrl } from './utils/buildAuthUrl';
import { CernersandboxConfig } from './utils/cernerConfig';

// Mock the buildAuthUrl utility
jest.mock('./utils/buildAuthUrl');
jest.mock('./utils/cernerConfig');

// Mock window.location - will be set up in beforeEach

describe('LoginWithCerner Component', () => {
  const defaultProps = {
    clientId: 'test-client-id',
    redirectUri: 'http://localhost:3000/callback',
  };

  const originalLocation = window.location;

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset mock location - delete first if it exists, then define
    delete (window as any).location;
    (window as any).location = {
      href: '',
      pathname: '/',
      search: '',
      replaceState: jest.fn(),
    };
    (buildCernerAuthUrl as jest.Mock).mockReturnValue('https://authorization.sandboxcerner.com/tenants/default/authorize?client_id=test&redirect_uri=http://localhost:3000/callback');
  });

  afterEach(() => {
    // Restore original location
    (window as any).location = originalLocation;
  });

  describe('Basic Rendering', () => {
    it('renders with default props', () => {
      render(<LoginWithCerner {...defaultProps} />);
      const button = screen.getByTestId('login-with-cerner-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Login with Cerner');
    });

    it('renders with custom button text', () => {
      render(<LoginWithCerner {...defaultProps} buttonText="Sign in with Cerner" />);
      const button = screen.getByTestId('login-with-cerner-button');
      expect(button).toHaveTextContent('Sign in with Cerner');
    });

    it('applies custom className', () => {
      const { container } = render(<LoginWithCerner {...defaultProps} className="custom-class" />);
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies custom styles', () => {
      const customStyle = { backgroundColor: 'red' };
      render(<LoginWithCerner {...defaultProps} style={customStyle} />);
      const button = screen.getByTestId('login-with-cerner-button');
      expect(button).toHaveStyle({ backgroundColor: 'red' });
    });
  });

  describe('Login Flow - Client-side', () => {
    it('redirects to Cerner auth URL when button is clicked', () => {
      const authUrl = 'https://authorization.sandboxcerner.com/tenants/default/authorize?client_id=test';
      (buildCernerAuthUrl as jest.Mock).mockReturnValue(authUrl);

      // Create a spy for location.href
      const locationSpy = jest.spyOn(window.location, 'href', 'set');

      render(<LoginWithCerner {...defaultProps} />);
      const button = screen.getByTestId('login-with-cerner-button');
      
      fireEvent.click(button);

      expect(buildCernerAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          authorizeUrl: CernersandboxConfig.authorizeUrl,
          clientId: defaultProps.clientId,
          redirectUri: defaultProps.redirectUri,
          scope: 'openid',
        })
      );
      expect(locationSpy).toHaveBeenCalledWith(authUrl);
      
      locationSpy.mockRestore();
    });

    it('uses custom authorizeUrl when provided', () => {
      const customAuthUrl = 'https://custom.cerner.com/authorize';
      render(<LoginWithCerner {...defaultProps} authorizeUrl={customAuthUrl} />);
      const button = screen.getByTestId('login-with-cerner-button');
      
      fireEvent.click(button);

      expect(buildCernerAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          authorizeUrl: customAuthUrl,
        })
      );
    });

    it('uses custom scope when provided', () => {
      render(<LoginWithCerner {...defaultProps} scope="openid profile" />);
      const button = screen.getByTestId('login-with-cerner-button');
      
      fireEvent.click(button);

      expect(buildCernerAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: 'openid profile',
        })
      );
    });

    it('includes aud parameter when provided', () => {
      const aud = 'https://fhir.custom.com/r4';
      render(<LoginWithCerner {...defaultProps} aud={aud} />);
      const button = screen.getByTestId('login-with-cerner-button');
      
      fireEvent.click(button);

      expect(buildCernerAuthUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          aud: aud,
        })
      );
    });
  });

  describe('Login Flow - Backend', () => {
    it('redirects to backend login endpoint when useBackend is true', () => {
      const backendUrl = 'http://localhost:5000';
      const locationSpy = jest.spyOn(window.location, 'href', 'set');
      
      render(<LoginWithCerner {...defaultProps} useBackend={true} backendUrl={backendUrl} />);
      const button = screen.getByTestId('login-with-cerner-button');
      
      fireEvent.click(button);

      expect(locationSpy).toHaveBeenCalledWith(`${backendUrl}/cerner/login`);
      expect(buildCernerAuthUrl).not.toHaveBeenCalled();
      
      locationSpy.mockRestore();
    });
  });

  describe('Callback Handling', () => {
    it('shows success message when authorization code is present in URL', async () => {
      // Set up URL search params before rendering
      delete (window as any).location;
      (window as any).location = {
        href: '',
        pathname: '/',
        search: '?code=test-auth-code',
        replaceState: jest.fn(),
      };
      
      // For client-side mode, no fetch is needed
      render(<LoginWithCerner {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('login-success-message')).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(screen.getByTestId('login-success-message')).toHaveTextContent('Login successful!');
    });

    it('calls onSuccess callback when login is successful', async () => {
      const onSuccess = jest.fn();
      delete (window as any).location;
      (window as any).location = {
        href: '',
        pathname: '/',
        search: '?code=test-auth-code',
        replaceState: jest.fn(),
      };

      render(<LoginWithCerner {...defaultProps} onSuccess={onSuccess} />);

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalled();
      }, { timeout: 3000 });
      
      expect(onSuccess).toHaveBeenCalledWith(
        expect.objectContaining({ access_token: 'received' })
      );
    });

    it('shows error message when error parameter is present in URL', async () => {
      delete (window as any).location;
      (window as any).location = {
        href: '',
        pathname: '/',
        search: '?error=access_denied&error_description=User%20denied%20access',
        replaceState: jest.fn(),
      };

      render(<LoginWithCerner {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('login-error-message')).toBeInTheDocument();
      }, { timeout: 3000 });

      expect(screen.getByTestId('login-error-message')).toHaveTextContent('User denied access');
    });

    it('calls onError callback when error occurs', async () => {
      const onError = jest.fn();
      delete (window as any).location;
      (window as any).location = {
        href: '',
        pathname: '/',
        search: '?error=access_denied',
        replaceState: jest.fn(),
      };

      render(<LoginWithCerner {...defaultProps} onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      }, { timeout: 3000 });
    });

    it('handles token exchange failure with backend', async () => {
      const onError = jest.fn();
      delete (window as any).location;
      (window as any).location = {
        href: '',
        pathname: '/',
        search: '?code=test-auth-code',
        replaceState: jest.fn(),
      };

      (window as any).fetch = jest.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ error: 'Token exchange failed' }),
      });

      render(<LoginWithCerner {...defaultProps} useBackend={true} backendUrl="http://localhost:5000" onError={onError} />);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      }, { timeout: 3000 });

      expect(screen.getByTestId('login-error-message')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('shows loading text when redirecting', () => {
      render(<LoginWithCerner {...defaultProps} />);
      const button = screen.getByTestId('login-with-cerner-button');
      
      fireEvent.click(button);

      // Note: The redirect happens immediately, so we check the button state
      // In a real scenario, the page would navigate away
      expect(button).toHaveTextContent('Redirecting...');
    });

    it('disables button when loading', () => {
      render(<LoginWithCerner {...defaultProps} />);
      const button = screen.getByTestId('login-with-cerner-button');
      
      fireEvent.click(button);
      
      expect(button).toBeDisabled();
    });
  });

  describe('Success Message', () => {
    it('shows success message by default', async () => {
      delete (window as any).location;
      (window as any).location = {
        href: '',
        pathname: '/',
        search: '?code=test-code',
        replaceState: jest.fn(),
      };

      render(<LoginWithCerner {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByTestId('login-success-message')).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('hides success message when showSuccessMessage is false', async () => {
      delete (window as any).location;
      (window as any).location = {
        href: '',
        pathname: '/',
        search: '?code=test-code',
        replaceState: jest.fn(),
      };

      render(<LoginWithCerner {...defaultProps} showSuccessMessage={false} />);

      // Wait a bit to ensure the component processed the code
      await waitFor(() => {
        // Component should process the code but not show message
        expect(screen.queryByTestId('login-success-message')).not.toBeInTheDocument();
      }, { timeout: 3000 });
    });

    it('shows custom success message', async () => {
      const customMessage = 'You are now logged in!';
      delete (window as any).location;
      (window as any).location = {
        href: '',
        pathname: '/',
        search: '?code=test-code',
        replaceState: jest.fn(),
      };

      render(<LoginWithCerner {...defaultProps} successMessage={customMessage} />);

      await waitFor(() => {
        expect(screen.getByTestId('login-success-message')).toHaveTextContent(customMessage);
      }, { timeout: 3000 });
    });
  });

  describe('Error Handling', () => {
    it('handles errors during login initiation', () => {
      const onError = jest.fn();
      (buildCernerAuthUrl as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid URL');
      });

      render(<LoginWithCerner {...defaultProps} onError={onError} />);
      const button = screen.getByTestId('login-with-cerner-button');
      
      fireEvent.click(button);

      expect(onError).toHaveBeenCalled();
      expect(screen.getByTestId('login-error-message')).toBeInTheDocument();
    });
  });

  describe('Button Styling', () => {
    it('applies custom button color', () => {
      render(<LoginWithCerner {...defaultProps} buttonColor="#ff0000" />);
      const button = screen.getByTestId('login-with-cerner-button');
      expect(button).toHaveStyle({ backgroundColor: '#ff0000' });
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label', () => {
      render(<LoginWithCerner {...defaultProps} buttonText="Sign in" />);
      const button = screen.getByTestId('login-with-cerner-button');
      expect(button).toHaveAttribute('aria-label', 'Sign in');
    });
  });
});
