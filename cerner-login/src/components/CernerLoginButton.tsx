// src/components/CernerLoginButton.tsx
import React from "react";
import { getCernerAuthUrl } from "../services/cernerAuth";

const CernerLoginButton: React.FC = () => {
  const handleLogin = () => {
    const url = getCernerAuthUrl();
    window.location.href = url;
  };

  return (
    <button
      onClick={handleLogin}
      style={{
        padding: "10px 20px",
        background: "#007FFF",
        color: "white",
        borderRadius: "8px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Login with Cerner
    </button>
  );
};

export default CernerLoginButton;
