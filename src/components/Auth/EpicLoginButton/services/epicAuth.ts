export interface SmartConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
  scopes_supported?: string[];
  token_endpoint_auth_methods_supported?: string[];
}

// Fetch SMART configuration from Epic's well-known endpoint
export const fetchSmartConfiguration = async (wellKnown: string): Promise<SmartConfiguration> => {
  const response = await fetch(wellKnown);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch .well-known SMART configuration: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.authorization_endpoint) {
    throw new Error("authorization_endpoint not found in .well-known configuration.");
  }
  return data;
};

// Get authorization endpoint from either direct URL or well-known endpoint
export const getAuthorizationEndpoint = async (
  authorizationEndpoint?: string,
  wellKnown?: string
): Promise<string> => {
  if (authorizationEndpoint) return authorizationEndpoint;
  
  if (!wellKnown) {
    throw new Error("Either wellKnown or authorizationEndpoint must be provided.");
  }
  
  const config = await fetchSmartConfiguration(wellKnown);
  return config.authorization_endpoint;
};