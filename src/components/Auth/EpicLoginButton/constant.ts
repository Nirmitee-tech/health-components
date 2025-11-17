export const EPIC_CONFIG = {
  BUTTON_LABEL: "Sign in with Epic",
  LOGO_URL: "https://upload.wikimedia.org/wikipedia/commons/2/24/Epic_Systems.svg",
} as const;

export const BUTTON_LABEL = EPIC_CONFIG.BUTTON_LABEL;

export const EPIC_SANDBOX_CONFIG = {
  buttonLabel: EPIC_CONFIG.BUTTON_LABEL,
} as const;