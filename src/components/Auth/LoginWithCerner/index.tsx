import React from "react";
import { buildCernerAuthUrl } from "./utils";
import { buttonStyle } from "./LoginWithCerner.styles";
import type { CernerLoginProps} from "./LoginWithCerner.types";

const LoginWithCerner: React.FC<CernerLoginProps> = ({
  clientId,
  redirectUri,
  buttonText = "Login with Cerner",
  style,
}) => {
  const handleLogin = () => {
    const authUrl = buildCernerAuthUrl(clientId, redirectUri);
    window.location.href = authUrl;
  };

  return (
    <button onClick={handleLogin} style={{ ...buttonStyle, ...style }}>
      {buttonText}
    </button>
  );
};

export default LoginWithCerner;
