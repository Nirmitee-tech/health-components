import { useState, useEffect } from "react";
import type { AuthResponse, EpicAuthError, EpicCallbackProps, EpicCallbackState } from "../types";
import { fetchSmartConfiguration } from "../services/epicAuth";
import { VERIFIER_KEY, STATE_KEY, CLIENT_ID_KEY, EPIC_FHIR_BASE, EPIC_WELL_KNOWN_URL, DEFAULT_SCOPE, REDIRECT_URI } from "../constant";

export const useEpicCallback = ({
  clientId,
  wellKnown,
  redirectUri,
  onSuccess,
  onError
}: EpicCallbackProps): EpicCallbackState => {
  const [data, setData] = useState<AuthResponse | null>(null);
  const [error, setError] = useState<EpicAuthError | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const exchangeCodeForToken = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const state = params.get("state");
        const error = params.get("error");
        const errorDescription = params.get("error_description");
        
        // Check for OAuth errors from Epic
        if (error) {
          const oauthError: EpicAuthError = new Error(
            errorDescription || `OAuth error: ${error}`
          );
          oauthError.error = error;
          throw oauthError;
        }

        // Validate required parameters
        if (!code) throw new Error("No authorization code found in URL");
        if (!state) throw new Error("No state parameter found in URL");

        const storedState = sessionStorage.getItem(STATE_KEY);
        const codeVerifier = sessionStorage.getItem(VERIFIER_KEY);

        if (!storedState) throw new Error("No 'state' found in storage.");
        if (!codeVerifier) throw new Error("No 'code_verifier' found.");
        if (state !== storedState) throw new Error("State mismatch (CSRF).");

        sessionStorage.removeItem(STATE_KEY);
        sessionStorage.removeItem(VERIFIER_KEY);

        const config = await fetchSmartConfiguration(wellKnown);
        const { token_endpoint } = config;

        if(!token_endpoint) throw new Error("No 'token_endpoint' found.");

        const tokenResponse = await fetch(token_endpoint, {
          method: "POST",
          headers: { 
            "Content-Type": "application/x-www-form-urlencoded" ,
            "accept": "application/json"
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: code,
            redirect_uri: redirectUri,
            client_id: clientId,
            code_verifier: codeVerifier,
          }),
        });

        const responseData = await tokenResponse.json();

        if (!tokenResponse.ok) {
          const err: EpicAuthError = new Error(
            responseData.error_description || `Token exchange failed with status ${tokenResponse.status}`,
          );
          err.error = responseData.error;
          err.code = responseData.code;
          throw err;
        }

        if(!responseData.access_token) {
          throw new Error("No access token received from EPIC");
        }

        setData(responseData as AuthResponse);
        onSuccess && onSuccess(responseData as AuthResponse);
      } catch (err) {
        console.error("Token exchange failed");

        sessionStorage.removeItem(STATE_KEY);
        sessionStorage.removeItem(VERIFIER_KEY);
        sessionStorage.removeItem(CLIENT_ID_KEY);
        
        const authErr =
          err instanceof Error ? (err as EpicAuthError) : new Error(String(err));
        setError(authErr);
        onError && onError(authErr);
      } finally {
        setIsLoading(false);
      }
    };

    exchangeCodeForToken();
  }, [clientId, wellKnown, redirectUri]);

  return { data, error, isLoading };
};