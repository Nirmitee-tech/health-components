import type { EpicLoginButtonProps } from "../types";
import { createValidationError } from "../errors/epicErrors";
import type { CallbackParams } from "./urlBuilder";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateEpicLoginProps = (props: EpicLoginButtonProps): ValidationResult => {
  const errors: string[] = [];
  
  if (!props.clientId) errors.push("clientId is required");
  if (!props.redirectUri) errors.push("redirectUri is required");
  if (!props.wellKnown && !props.authorizationEndpoint) {
    errors.push("Either wellKnown or authorizationEndpoint must be provided");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateCallbackParams = (params: CallbackParams): void => {
  if (params.error) {
    throw createValidationError(
      params.errorDescription || `OAuth error: ${params.error}`,
      params.error
    );
  }

  if (!params.code) {
    throw createValidationError("No authorization code found in URL");
  }

  if (!params.state) {
    throw createValidationError("No state parameter found in URL");
  }
};

export const validateStoredAuthData = (
  verifier: string | null,
  storedState: string | null,
  urlState: string
): void => {
  if (!storedState) {
    throw createValidationError("No 'state' found in storage.");
  }
  
  if (!verifier) {
    throw createValidationError("No 'code_verifier' found.");
  }
  
  if (urlState !== storedState) {
    throw createValidationError("State mismatch (CSRF).");
  }
};
