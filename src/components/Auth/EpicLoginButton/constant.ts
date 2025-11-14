export const STORAGE_KEYS = {
  VERIFIER: "epic_code_verifier",
  STATE: "epic_oauth_state", 
  CLIENT_ID: "epic_client_id",
} as const;

export const VERIFIER_KEY = STORAGE_KEYS.VERIFIER;
export const STATE_KEY = STORAGE_KEYS.STATE;
export const CLIENT_ID_KEY = STORAGE_KEYS.CLIENT_ID;

export const CRYPTO_CONSTANTS = {
  CODE_VERIFIER_LENGTH: 64,
  STATE_LENGTH: 24,
  CODE_CHALLENGE_METHOD: 'S256',
} as const;

export const OAUTH_PARAMS = {
  RESPONSE_TYPE: 'code',
  GRANT_TYPE: 'authorization_code',
} as const;

export const EPIC_CONFIG = {
  WELL_KNOWN_URL: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/.well-known/smart-configuration",
  FHIR_BASE: "https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4",
  DEFAULT_SCOPE: "openid fhirUser patient/*.read",
  BUTTON_LABEL: "Sign in with Epic",
  LOGO_URL: "https://upload.wikimedia.org/wikipedia/commons/2/24/Epic_Systems.svg",
} as const;

export const DEFAULT_SCOPE = EPIC_CONFIG.DEFAULT_SCOPE;
export const EPIC_WELL_KNOWN_URL = EPIC_CONFIG.WELL_KNOWN_URL;
export const EPIC_FHIR_BASE = EPIC_CONFIG.FHIR_BASE;
export const BUTTON_LABEL = EPIC_CONFIG.BUTTON_LABEL;

export const DEMO_CONFIG = {
  REDIRECT_URI: "http://localhost:3000",
} as const;

export const REDIRECT_URI = DEMO_CONFIG.REDIRECT_URI;

export const EPIC_SANDBOX_CONFIG = {
  wellKnown: EPIC_CONFIG.WELL_KNOWN_URL,
  fhirBase: EPIC_CONFIG.FHIR_BASE,
  scope: EPIC_CONFIG.DEFAULT_SCOPE,
  buttonLabel: EPIC_CONFIG.BUTTON_LABEL,
} as const;