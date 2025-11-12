import { CernersandboxConfig } from "./cernerConfig";

export const buildCernerAuthUrl = (clientId: string, redirectUri: string) => {
  const { authorizeUrl, fhirAudience } = CernersandboxConfig;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid profile user/Patient.read",
    state: "secureRandomState123",
    aud: fhirAudience,
  });

  return `${authorizeUrl}?${params.toString()}`;
};
