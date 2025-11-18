import React, { useEffect, useState, useCallback } from "react";
import { buildCernerAuthUrl } from "./utils/buildAuthUrl";
import { CernersandboxConfig } from "./utils/cernerConfig";
import { buttonStyle, successMessageStyle } from "./LoginWithCerner.styles";
import type { CernerLoginProps, TokenData } from "./LoginWithCerner.types";

const LoginWithCerner: React.FC<CernerLoginProps> = ({
  clientId,
  redirectUri,
  authorizeUrl,
  scope = "openid",
  aud,
  backendUrl,
  useBackend = false,
  buttonText = "Login with Cerner",
  buttonColor,
  onSuccess,
  onError,
  className,
  style,
  showSuccessMessage = true,
  successMessage = "Login successful! You have been authenticated with Cerner.",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate a random state for CSRF protection
  const generateState = useCallback(() => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }, []);

  // Handle OAuth callback - check for authorization code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const errorParam = urlParams.get("error");
    const state = urlParams.get("state");

    // Check for error in callback
    if (errorParam) {
      const errorMessage = urlParams.get("error_description") || errorParam;
      setError(errorMessage);
      if (onError) {
        onError(new Error(errorMessage));
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    // If we have a code, handle the token exchange
    if (code) {
      setIsLoading(true);
      handleTokenExchange(code);
    }
  }, [onSuccess, onError, backendUrl, useBackend]);

  const handleTokenExchange = async (code: string) => {
    try {
      let tokenData: TokenData;

      if (useBackend && backendUrl) {
        // Use backend for token exchange
        const response = await fetch(`${backendUrl}/cerner/callback?code=${encodeURIComponent(code)}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: "Token exchange failed" }));
          throw new Error(errorData.error || errorData.error_description || "Token exchange failed");
        }
        tokenData = await response.json();
      } else {
        // For client-side only, we just mark as successful
        // In a real implementation, you might want to exchange the token client-side
        // but typically this should be done server-side for security
        tokenData = { access_token: "received" };
      }

      setLoginSuccess(true);
      setError(null);
      
      if (onSuccess) {
        onSuccess(tokenData);
      }

      // Clean up URL parameters
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to complete login";
      setError(errorMessage);
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    try {
      setIsLoading(true);
      setError(null);
      setLoginSuccess(false);

      const authUrl = useBackend && backendUrl
        ? `${backendUrl}/cerner/login`
        : buildCernerAuthUrl({
            authorizeUrl: authorizeUrl || CernersandboxConfig.authorizeUrl,
            clientId,
            redirectUri,
            scope,
            aud: aud || CernersandboxConfig.fhirAudience,
            state: generateState(),
          });

      // Redirect to Cerner authorization URL
      window.location.href = authUrl;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to initiate login";
      setError(errorMessage);
      setIsLoading(false);
      if (onError) {
        onError(err instanceof Error ? err : new Error(errorMessage));
      }
    }
  };

  const combinedButtonStyle = {
    ...buttonStyle(buttonColor),
    ...style,
    ...(isLoading && { opacity: 0.7, cursor: "not-allowed" }),
  };

  return (
    <div className={className}>
      <button
        onClick={handleLogin}
        disabled={isLoading}
        style={combinedButtonStyle}
        aria-label={buttonText}
        data-testid="login-with-cerner-button"
      >
        {isLoading ? "Redirecting..." : buttonText}
      </button>
      
      {error && (
        <div
          style={{
            ...successMessageStyle,
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderColor: "#f5c6cb",
          }}
          data-testid="login-error-message"
        >
          {error}
        </div>
      )}

      {loginSuccess && showSuccessMessage && (
        <div
          style={successMessageStyle}
          data-testid="login-success-message"
        >
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default LoginWithCerner;