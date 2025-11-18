import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const getEnv = () => ({
  TOKEN_URL: process.env.TOKEN_URL || process.env.CERNER_TOKEN_URL,
  CLIENT_ID: process.env.CLIENT_ID || process.env.CERNER_CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  REDIRECT_URI: process.env.REDIRECT_URI,
});

export async function exchangeCodeForToken(code) {
  const { TOKEN_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = getEnv();

  const data = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });

  const response = await axios.post(TOKEN_URL, data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  return response.data;
}
