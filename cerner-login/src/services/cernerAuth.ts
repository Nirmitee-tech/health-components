// src/services/cernerAuth.ts

export const CERNER_CONFIG = {
  client_id: import.meta.env.VITE_CERNER_CLIENT_ID,
  redirect_uri: import.meta.env.VITE_CERNER_REDIRECT_URI,
  base_url: import.meta.env.VITE_CERNER_AUTH_BASE,       // authorize URL
  token_url: import.meta.env.VITE_CERNER_TOKEN_URL,      // NEW: token URL
  scope: "launch/patient patient.read openid profile offline_access",
};

console.log("CERNER CONFIG:", CERNER_CONFIG);

// Build Cerner Authorization URL
export const getCernerAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: CERNER_CONFIG.client_id,
    redirect_uri: CERNER_CONFIG.redirect_uri,
    response_type: "code",
    scope: CERNER_CONFIG.scope,
    state: crypto.randomUUID(),
  });

  return `${CERNER_CONFIG.base_url}?${params.toString()}`;
};

// ⭐ Manual token exchange using fetch
export async function exchangeCodeForToken(code: string) {
  const form = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: CERNER_CONFIG.redirect_uri,
    client_id: CERNER_CONFIG.client_id,
  });

  const response = await fetch(CERNER_CONFIG.token_url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: form
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Token Exchange Error:", errorBody);
    throw new Error("Token exchange failed");
  }

  const tokenResponse = await response.json();
  return tokenResponse;
}
