export interface CernerAuthConfig {
  authorizeUrl: string;
  clientId: string;
  redirectUri: string;
  scope?: string;
  responseType?: string;
  aud?: string;
  state?: string;
}

/**
 * Builds the Cerner OAuth authorization URL with all required parameters
 * @param config - Configuration object containing OAuth parameters
 * @returns Complete authorization URL string
 */
export const buildCernerAuthUrl = (config: CernerAuthConfig): string => {
  const {
    authorizeUrl,
    clientId,
    redirectUri,
    scope = "openid",
    responseType = "code",
    aud,
    state,
  } = config;

  const url = new URL(authorizeUrl);
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", responseType);
  url.searchParams.set("scope", scope);

  if (aud) {
    url.searchParams.set("aud", aud);
  }

  if (state) {
    url.searchParams.set("state", state);
  }
  console.log (url.toString)
   return url.toString();
};
  