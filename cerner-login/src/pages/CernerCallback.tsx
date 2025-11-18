// src/pages/CernerCallback.tsx
import React, { useEffect, useState } from "react";
import { exchangeCodeForToken } from "../services/cernerAuth";
import { useNavigate } from "react-router-dom";

const CernerCallback: React.FC = () => {
  const [message, setMessage] = useState("Processing...");
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        setMessage("No authorization code found.");
        return;
      }

      try {
        const { client, tokenResponse } = await exchangeCodeForToken(code);

        // Save token
        localStorage.setItem("cerner_token", tokenResponse.access_token);

        // Fetch patient info if available in token
        if (tokenResponse.patient) {
          const patient = await client.read("Patient", tokenResponse.patient);
          console.log("Patient Data:", patient);
        }

        navigate("/thank-you");
      } catch (err) {
        console.error(err);
        setMessage("Authentication failed.");
      }
    };

    handleAuth();
  }, [navigate]);

  return <p>{message}</p>;
};

export default CernerCallback;
