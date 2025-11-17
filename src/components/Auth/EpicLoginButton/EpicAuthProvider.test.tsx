import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EpicAuthProvider } from './EpicAuthProvider';
import { useEpicAuth } from './useEpicAuth';
import { emrRegistry, EPIC_TEMPLATE } from '@nirmiteeio/fhir-sdk';


jest.mock('@nirmiteeio/fhir-sdk', () => ({
  useAuth: jest.fn(),
  EPIC_TEMPLATE: { id: 'epic', name: 'Epic Template' },
  emrRegistry: {
    registerProvider: jest.fn(),
  },
}));

import { useAuth, SMARTAuthClient } from '@nirmiteeio/fhir-sdk';
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

beforeEach(() => {
  jest.clearAllMocks();

  mockUseAuth.mockReturnValue({
    login: jest.fn(),
    logout: jest.fn(),
    handleCallback: jest.fn(),
    isLoading: false,
    isAuthenticated: false,
    patientId: null,
    authClient: {} as SMARTAuthClient,
  });
});

describe('EpicAuthProvider (Unit Tests Only)', () => {
  test('registers provider on mount', () => {
    render(
      <EpicAuthProvider clientId="id-123" redirectUri="http://cb">
        <div>child</div>
      </EpicAuthProvider>
    );

    expect(emrRegistry.registerProvider).toHaveBeenCalledTimes(1);
    expect(emrRegistry.registerProvider).toHaveBeenCalledWith({
      ...EPIC_TEMPLATE,
      clientId: 'id-123',
      redirectUri: 'http://cb',
      scopes: ['openid', 'fhirUser', 'patient/*.read'],
    });
  });

  test('renders children', () => {
    render(
      <EpicAuthProvider clientId="id-123" redirectUri="http://cb">
        <div data-testid="child">hello</div>
      </EpicAuthProvider>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  test('passes context values from useEpicAuth', () => {
    mockUseAuth.mockReturnValue({
      login: jest.fn(),
      logout: jest.fn(),
      handleCallback: jest.fn(),
      isLoading: false,
      isAuthenticated: true,
      patientId: 'patient-999',
      authClient: {} as SMARTAuthClient,
    });

    const Consumer = () => {
      const auth = useEpicAuth();
      return (
        <>
          <div data-testid="status">{auth.isAuthenticated ? 'yes' : 'no'}</div>
          <div data-testid="patient">{auth.patientId}</div>
        </>
      );
    };

    render(
      <EpicAuthProvider clientId="id" redirectUri="cb">
        <Consumer />
      </EpicAuthProvider>
    );

    expect(screen.getByTestId('status')).toHaveTextContent('yes');
    expect(screen.getByTestId('patient')).toHaveTextContent('patient-999');
  });

  test('uses default scopes when none are passed', () => {
    render(
      <EpicAuthProvider clientId="id-123" redirectUri="http://cb">
        <div />
      </EpicAuthProvider>
    );

    expect(emrRegistry.registerProvider).toHaveBeenCalledWith({
      ...EPIC_TEMPLATE,
      clientId: 'id-123',
      redirectUri: 'http://cb',
      scopes: ['openid', 'fhirUser', 'patient/*.read'],
    });
  });

  test('uses custom scopes when provided', () => {
    render(
      <EpicAuthProvider
        clientId="id-123"
        redirectUri="http://cb"
        scopes={['custom-scope']}
      >
        <div />
      </EpicAuthProvider>
    );

    expect(emrRegistry.registerProvider).toHaveBeenCalledWith({
      ...EPIC_TEMPLATE,
      clientId: 'id-123',
      redirectUri: 'http://cb',
      scopes: ['custom-scope'],
    });
  });
});