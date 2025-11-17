import React, { useState } from "react";
import { useEpicAuth } from "./useEpicAuth";
import type { EpicLoginButtonProps } from "./types";
import { useAuth, FHIRError } from "@nirmiteeio/fhir-sdk";
import { EPIC_CONFIG } from "./constant";

export const EpicLoginButton: React.FC<EpicLoginButtonProps> = ({
  buttonLabel = EPIC_CONFIG.BUTTON_LABEL,
  className = "",
  style,
  disabled = false,
  onStart,
  onError,
}) => {
const { login, isLoading } = useEpicAuth();
  const handleEpicLogin = async () => {
    if (disabled || isLoading) return;

    onStart?.();

    try {
      await login(); 
    } catch (err) {
      console.error("EpicLoginButton Setup Error:", err);
      onError?.(err as FHIRError);
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