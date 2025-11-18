import React from "react";
import { LoginWithCerner } from "health-components";
import Callback from "./callback";

function App() {
  // Simple routing based on pathname
  const pathname = window.location.pathname;

  // If we're on the callback page, show the Callback component
  if (pathname === "/callback" || pathname === "/callback/") {
    return <Callback />;
  }

  // Otherwise show the main login page
  const handleSuccess = (tokenData) => {
    console.log("Login successful!", tokenData);
    // You can store the token, redirect user, etc.
  };

  const handleError = (error) => {
    console.error("Login error:", error);
  };

  // Exact redirect URI as registered in Cerner portal
  const redirectUri = "http://localhost:3000/callback";

  return (
    <div style={{ margin: "50px", maxWidth: "600px" }}>
      <h2>Test Cerner Login</h2>
      <p>Click the button below to login with Cerner credentials.</p>
      
      {/* Client-side login - uses props directly, no backend needed */}
      <div>
        <LoginWithCerner
          clientId={process.env.REACT_APP_CERNER_CLIENT_ID || "your-client-id"}
          redirectUri={redirectUri}
          authorizeUrl="https://authorization.cerner.com/tenants/ec2458f2-1e24-41c8-b71b-0e701af7583d/protocols/oauth2/profiles/smart-v1/personas/patient/authorize"
          scope="openid"
          aud="https://fhir.sandboxcerner.com/r4"
          useBackend={false}
          onSuccess={handleSuccess}
          onError={handleError}
          buttonText="Login with Cerner"
          buttonColor="#006778"
        />
      </div>
    </div>
  );
}

export default App;
