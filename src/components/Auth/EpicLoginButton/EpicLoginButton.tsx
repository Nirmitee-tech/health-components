import React, { useState } from "react";
import type { EpicLoginButtonProps } from "./types";
import { generatePKCEData } from "./utils/crypto";
import { getAuthorizationEndpoint } from "./services/epicAuth";
import { storeAuthData } from "./utils/storage";
import { buildAuthorizationUrl } from "./utils/urlBuilder";
import { validateEpicLoginProps } from "./utils/validation";
import { handleAuthError, createValidationError } from "./errors/epicErrors";
import { EPIC_CONFIG } from "./constant";

export const EpicLoginButton: React.FC<EpicLoginButtonProps> = ({
  clientId,
  redirectUri,
  wellKnown = EPIC_CONFIG.WELL_KNOWN_URL,
  authorizationEndpoint,
  fhirBase = EPIC_CONFIG.FHIR_BASE,
  scope = EPIC_CONFIG.DEFAULT_SCOPE,
  buttonLabel = EPIC_CONFIG.BUTTON_LABEL,
  className = "",
  style,
  disabled = false,
  onStart,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEpicLogin = async () => {
    if (disabled || isLoading) return;

    const validation = validateEpicLoginProps({
      clientId,
      redirectUri,
      wellKnown,
      authorizationEndpoint,
      fhirBase,
      scope,
      buttonLabel,
      className,
      style,
      disabled,
      onStart,
      onSuccess,
      onError,
    } as EpicLoginButtonProps);

    if (!validation.isValid) {
      const error = createValidationError(`Configuration errors: ${validation.errors.join(", ")}`);
      handleAuthError(error, "EpicLoginButton Validation", onError);
      return;
    }

    try {
      setIsLoading(true);
      onStart?.();

      const authEndpoint = await getAuthorizationEndpoint(
        authorizationEndpoint, 
        wellKnown
      );

      const pkceData = await generatePKCEData();

      storeAuthData(pkceData.codeVerifier, pkceData.state);

      const authUrl = buildAuthorizationUrl({
        authEndpoint,
        clientId,
        redirectUri,
        scope,
        state: pkceData.state,
        codeChallenge: pkceData.codeChallenge,
        fhirBase,
      });

      window.location.href = authUrl;
    } catch (error) {
      handleAuthError(error, "EpicLoginButton", onError);
      setIsLoading(false);
    }
  };

  const buttonClasses = [
    "flex items-center justify-center gap-3",
    "border border-gray-300 rounded-md px-4 py-2",
    "font-medium transition-all",
    "hover:bg-gray-100 focus:ring focus:ring-red-200 active:bg-gray-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    className,
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      onClick={handleEpicLogin}
      disabled={disabled || isLoading}
      aria-label={buttonLabel}
      className={buttonClasses}
      style={style}
    >
      <img
        src={EPIC_CONFIG.LOGO_URL}
        alt="Epic logo"
        className="m-0"
        loading="lazy"
        width="72"
        height="24"
      />
      <span>{isLoading ? "Redirecting..." : buttonLabel}</span>
    </button>
  );
};

export default EpicLoginButton;