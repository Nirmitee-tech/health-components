import { CRYPTO_CONSTANTS, OAUTH_PARAMS } from "../constant";

// Callback URL Parsing
export interface CallbackParams {
  code: string | null;
  state: string | null;
  error: string | null;
  errorDescription: string | null;
}

export const parseCallbackUrl = (url: string = window.location.search): CallbackParams => {
  const params = new URLSearchParams(url);
  
  return {
    code: params.get("code"),
    state: params.get("state"),
    error: params.get("error"),
    errorDescription: params.get("error_description")
  };
};

export interface AuthUrlConfig {
  authEndpoint: string;
  clientId: string;
  redirectUri: string;
  scope: string;
  state: string;
  codeChallenge: string;
  fhirBase?: string;
}

export const buildAuthorizationUrl = (config: AuthUrlConfig): string => {
  const authUrl = new URL(config.authEndpoint);
  
  authUrl.searchParams.set('response_type', OAUTH_PARAMS.RESPONSE_TYPE);
  authUrl.searchParams.set('client_id', config.clientId);
  authUrl.searchParams.set('redirect_uri', config.redirectUri);
  authUrl.searchParams.set('scope', config.scope);
  authUrl.searchParams.set('state', config.state);
  authUrl.searchParams.set('code_challenge', config.codeChallenge);
  authUrl.searchParams.set('code_challenge_method', CRYPTO_CONSTANTS.CODE_CHALLENGE_METHOD);
  
  if (config.fhirBase) {
    authUrl.searchParams.set('aud', config.fhirBase);
  }

  return authUrl.toString();
};
