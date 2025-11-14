// EpicLoginButton.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EpicLoginButton } from './EpicLoginButton';
import type { EpicLoginButtonProps } from './types';
import { getAuthorizationEndpoint } from './services/epicAuth';

// Mock dependencies
jest.mock('./services/epicAuth', () => ({
  getAuthorizationEndpoint: jest.fn().mockResolvedValue('https://fhir.epic.com/authorize'),
}));

jest.mock('./utils/crypto', () => ({
  generateRandomString: jest.fn(() => 'randomString'),
  generatePKCEChallenge: jest.fn(() => Promise.resolve('mockedChallenge')),
}));

Object.defineProperty(globalThis, 'crypto', {
  value: {
    getRandomValues: (arr: Uint8Array) => arr.fill(1),
    subtle: {
      digest: () => Promise.resolve(new ArrayBuffer(32)),
    },
  },
});

describe('EpicLoginButton', () => {
  const defaultProps: EpicLoginButtonProps = {
    clientId: 'test-client-id',
    redirectUri: 'https://example.com/callback',
    wellKnown: 'https://fhir.epic.com/.well-known/smart-configuration',
    fhirBase: 'https://fhir.epic.com',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    delete (window as any).location;
    (window as any).location = { href: '' };
    sessionStorage.clear();
  });

  it('renders the Epic logo and label', () => {
    render(<EpicLoginButton {...defaultProps} />);
    expect(screen.getByAltText('Epic logo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in with epic/i })).toBeInTheDocument();
  });

  it('calls onStart when login begins', async () => {
    const onStart = jest.fn();
    render(<EpicLoginButton {...defaultProps} onStart={onStart} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(onStart).toHaveBeenCalled());
  });

  it('shows "Redirecting..." while loading', async () => {
    render(<EpicLoginButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Redirecting...')).toBeInTheDocument();
  });

  it('stores PKCE verifier and state in sessionStorage', async () => {
    render(<EpicLoginButton {...defaultProps} />);
    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(sessionStorage.getItem('epic_code_verifier')).toBeTruthy();
      expect(sessionStorage.getItem('epic_oauth_state')).toBeTruthy();
    });
  });

  // it('redirects to Epic authorization endpoint with correct params', async () => {
  //   render(<EpicLoginButton {...defaultProps} />);
  //   fireEvent.click(screen.getByRole('button'));

  //   await waitFor(() => {
  //     const redirect = (window.location as any).href;
  //     expect(redirect).toContain('https://fhir.epic.com/authorize');
  //     expect(redirect).toContain('client_id=test-client-id');
  //     expect(redirect).toContain('response_type=code');
  //     expect(redirect).toContain('code_challenge_method=S256');
  //   });
  // });

  it('calls onError when fetching auth endpoint fails', async () => {
    (getAuthorizationEndpoint as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    const onError = jest.fn();
    render(<EpicLoginButton {...defaultProps} onError={onError} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(onError).toHaveBeenCalled());
  });

  it('does not trigger click when disabled', async () => {
    const onStart = jest.fn();
    render(<EpicLoginButton {...defaultProps} disabled onStart={onStart} />);

    fireEvent.click(screen.getByRole('button'));
    expect(onStart).not.toHaveBeenCalled();
  });

  it('has proper aria-label and type', () => {
    render(<EpicLoginButton {...defaultProps} buttonLabel="Connect Epic" />);
    const button = screen.getByRole('button', { name: /connect epic/i });
    expect(button).toHaveAttribute('aria-label', 'Connect Epic');
    expect(button).toHaveAttribute('type', 'button');
  });
});