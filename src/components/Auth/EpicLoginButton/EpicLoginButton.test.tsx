import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EpicLoginButton } from './EpicLoginButton';
import { EpicAuthProvider } from './EpicAuthProvider';
import { useAuth, FHIRError } from '@nirmiteeio/fhir-sdk';
import { SMARTAuthClient } from '@nirmiteeio/fhir-sdk';

// Mock the FHIR SDK
jest.mock('@nirmiteeio/fhir-sdk', () => ({
  useAuth: jest.fn(),
  FHIRError: class FHIRError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'FHIRError';
    }
  },
  EPIC_TEMPLATE: {
    /* Mock template fields if necessary */
  },
  emrRegistry: {
    registerProvider: jest.fn(),
  },
}));

// Mock the constants
jest.mock('./constant', () => ({
  EPIC_CONFIG: {
    BUTTON_LABEL: 'Sign in with Epic',
    LOGO_URL: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Epic_Systems.svg',
  },
}));

// Typecast the mock for easy control in our tests
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// --- THIS IS THE KEY ---
// A custom render function that wraps the component in the
// provider it needs.
const renderWithProvider = (
  ui: React.ReactElement,
  providerProps = {},
  authHookState = {},
) => {
  // Set a default mock return value for the SDK's useAuth hook
  mockUseAuth.mockReturnValue({
    login: jest.fn().mockResolvedValue(undefined),
    logout: jest.fn().mockResolvedValue(undefined),
    handleCallback: jest.fn().mockResolvedValue(undefined),
    isLoading: false,
    isAuthenticated: false,
    patientId: null,
    authClient: {} as SMARTAuthClient,
    ...authHookState,
  });

  return render(
    <EpicAuthProvider
      clientId="test-client-id"
      redirectUri="http://localhost:3000"
      onSuccess={jest.fn()}
      onError={jest.fn()}
      {...providerProps}
    >
      {ui}
    </EpicAuthProvider>,
  );
};

describe('EpicLoginButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default props', () => {
      renderWithProvider(<EpicLoginButton />);
      
      expect(screen.getByRole('button', { name: /sign in with epic/i })).toBeInTheDocument();
      expect(screen.getByAltText('Epic logo')).toBeInTheDocument();
    });

    it('renders with custom button label', () => {
      renderWithProvider(<EpicLoginButton buttonLabel="Connect to MyChart" />);
      
      expect(screen.getByRole('button', { name: /connect to mychart/i })).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('shows loading state when SDK is loading', () => {
      renderWithProvider(
        <EpicLoginButton />, 
        {}, 
        { isLoading: true }
      );
      
      expect(screen.getByText('Redirecting...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('is disabled when disabled prop is true', () => {
      renderWithProvider(<EpicLoginButton disabled />);
      
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('Click Handling', () => {
    it('calls login function when clicked', async () => {
      const mockLogin = jest.fn().mockResolvedValue(undefined);
      const mockOnStart = jest.fn();

      renderWithProvider(
        <EpicLoginButton onStart={mockOnStart} />,
        {},
        { login: mockLogin } // Pass in our spy
      );
      
      fireEvent.click(screen.getByRole('button'));

      expect(mockOnStart).toHaveBeenCalled();
      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalled();
      });
    });

    it('calls onError when login fails', async () => {
      const mockLogin = jest.fn().mockRejectedValue(new Error('Login failed'));
      const mockOnError = jest.fn();

      renderWithProvider(
        <EpicLoginButton onError={mockOnError} />,
        {},
        { login: mockLogin } // Pass in our failing spy
      );
      
      fireEvent.click(screen.getByRole('button'));

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(expect.any(Error));
      });
    });

    it('does not call login when disabled', () => {
      const mockLogin = jest.fn();
      renderWithProvider(<EpicLoginButton disabled />, {}, { login: mockLogin });
      
      fireEvent.click(screen.getByRole('button'));

      expect(mockLogin).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label', () => {
      const customLabel = 'Custom Epic Login';
      renderWithProvider(<EpicLoginButton buttonLabel={customLabel} />);
      
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', customLabel);
    });
  });
});