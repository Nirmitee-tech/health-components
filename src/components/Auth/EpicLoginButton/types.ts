import { FHIRError, SMARTAuthClient } from "@nirmiteeio/fhir-sdk";

export interface EpicAuthProviderProps {
  clientId: string;
  redirectUri: string;
  scopes?: string[];
  children: React.ReactNode;
  onSuccess?: (data: any) => void;
  onError?: (error: FHIRError) => void;
}

export interface EpicAuthContextType{
  isAuthenticated: boolean;
  isLoading: boolean;
  patientId: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  authClient: SMARTAuthClient;
}

export interface EpicLoginButtonProps {
  buttonLabel?: string | undefined;
  className?: string | undefined;
  style?: React.CSSProperties | undefined;
  disabled?: boolean | undefined;
  onStart?: (() => void) | undefined;
  onError?: ((error: Error) => void) | undefined;
}
