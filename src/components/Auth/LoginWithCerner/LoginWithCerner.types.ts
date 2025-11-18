export interface TokenData {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token?: string;
  id_token?: string;
  scope?: string;
}

export interface CernerLoginProps {
  clientId: string;
  redirectUri: string;
  authorizeUrl?: string; // Optional custom Cerner endpoint (defaults to sandbox)
  scope?: string;
  aud?: string; // FHIR audience URL
  backendUrl?: string; // Optional backend URL for token exchange (e.g., "http://localhost:5000")
  useBackend?: boolean; // Whether to use backend for OAuth flow (default: false)
  buttonText?: string;
  buttonColor?: string;
  onSuccess?: (tokenData: TokenData) => void;
  onError?: (error: Error | string) => void;
  className?: string;
  style?: React.CSSProperties;
  showSuccessMessage?: boolean; // Whether to show success message after login
  successMessage?: string; // Custom success message
}
  