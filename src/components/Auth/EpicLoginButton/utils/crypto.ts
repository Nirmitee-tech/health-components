import { CRYPTO_CONSTANTS } from "../constant";

export interface PKCEData {
  codeVerifier: string;
  codeChallenge: string;
  state: string;
}

// Generate cryptographically strong random string
export const generateRandomString = (length: number = CRYPTO_CONSTANTS.CODE_VERIFIER_LENGTH): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => (b % 36).toString(36))
    .join("");
};

// Generate SHA256 + Base64URL-encoded PKCE challenge
export const generatePKCEChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hash);
  let base64 = btoa(String.fromCharCode(...bytes));
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const generatePKCEData = async (): Promise<PKCEData> => {
  const codeVerifier = generateRandomString(CRYPTO_CONSTANTS.CODE_VERIFIER_LENGTH);
  const codeChallenge = await generatePKCEChallenge(codeVerifier);
  const state = generateRandomString(CRYPTO_CONSTANTS.STATE_LENGTH);

  return {
    codeVerifier,
    codeChallenge,
    state
  };
};
