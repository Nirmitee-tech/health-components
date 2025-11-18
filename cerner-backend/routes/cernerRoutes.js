import express from "express";
import { exchangeCodeForToken } from "../utils/exchangeToken.js";

const router = express.Router();

const getConfig = () => ({
  AUTH_URL: process.env.AUTH_URL || process.env.CERNER_AUTHORIZE_URL,
  CLIENT_ID: process.env.CLIENT_ID || process.env.CERNER_CLIENT_ID,
  REDIRECT_URI: process.env.REDIRECT_URI,
  SCOPE: process.env.SCOPE || "openid",
  RESPONSE_TYPE: process.env.RESPONSE_TYPE || "code",
  AUD: process.env.AUD || process.env.CERNER_FHIR_AUDIENCE,
});

router.get("/login", (req, res) => {
  const { AUTH_URL, CLIENT_ID, REDIRECT_URI, SCOPE, RESPONSE_TYPE, AUD } =
    getConfig();

  if (!AUTH_URL || !CLIENT_ID || !REDIRECT_URI) {
    return res.status(500).json({
      error:
        "Missing AUTH_URL, CLIENT_ID, or REDIRECT_URI environment variables.",
    });
  }

  // Validate AUTH_URL is sandbox (not production)
  if (!AUTH_URL.includes("sandboxcerner.com")) {
    console.warn("Warning: AUTH_URL does not appear to be sandbox URL. Using:", AUTH_URL);
  }

  const authorizeUrl = new URL(AUTH_URL);
  authorizeUrl.searchParams.set("client_id", CLIENT_ID);
  authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authorizeUrl.searchParams.set("response_type", RESPONSE_TYPE);
  authorizeUrl.searchParams.set("scope", SCOPE);

  // AUD is required for Cerner OAuth - always include it
  if (AUD) {
    authorizeUrl.searchParams.set("aud", AUD);
  } else {
    // Default to sandbox FHIR audience if not provided
    authorizeUrl.searchParams.set("aud", "https://fhir.sandboxcerner.com/r4");
    console.warn("AUD not set in environment, using default sandbox FHIR audience");
  }

  console.log("Redirecting to Cerner authorization URL:", authorizeUrl.toString());
  res.redirect(authorizeUrl.toString());
});

router.get("/callback", async (req, res) => {
  const { code, error, error_description } = req.query;
  
  // Handle OAuth errors
  if (error) {
    console.error("OAuth error:", error, error_description);
    return res.status(400).json({ 
      error: error,
      error_description: error_description || "Authorization failed"
    });
  }

  if (!code) {
    return res.status(400).json({ error: "No authorization code found in URL" });
  }

  try {
    const tokenData = await exchangeCodeForToken(code);
    res.json(tokenData);
  } catch (error) {
    console.error("Token exchange failed:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Token exchange failed",
      details: error.response?.data || error.message 
    });
  }
});

export default router;
