export interface EpicLoginButtonProps {
  clientId: string;
  redirectUri: string;
  wellKnown?: string | undefined;
  authorizationEndpoint?: string | undefined;
  fhirBase?: string | undefined;
  scope?: string | undefined;
  buttonLabel?: string | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  disabled?: boolean | undefined;
  onStart?: (() => void) | undefined;
  onError?: ((error: Error) => void) | undefined;
  onSuccess?: (tokens: AuthResponse) => void;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  patient?: string;
  encounter?: string;
  fhirUser?: string;
}

export interface EpicAuthError extends Error {
  error?: string;
  code?: string;
  description?: string;
}

export interface EpicCallbackProps {
  clientId: string;
  wellKnown: string;
  redirectUri: string;
  onSuccess?: (data: AuthResponse) => void;
  onError?: (error: EpicAuthError) => void;
}

export interface EpicCallbackState {
  data: AuthResponse | null;
  error: EpicAuthError | null;
  isLoading: boolean;
}