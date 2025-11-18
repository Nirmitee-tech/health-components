import React, { useEffect, useState } from "react";
import { LoginWithCerner } from "health-components";

function Callback() {
  const [tokenData, setTokenData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authorization code or error in URL
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const errorParam = urlParams.get("error");
    const errorDescription = urlParams.get("error_description");

    if (errorParam) {
      setError(errorDescription || errorParam);
      setLoading(false);
      return;
    }

    if (code) {
      // Use backend for token exchange (secure - client secret stays on server)
      const backendUrl = "http://localhost:5000";
      
      fetch(`${backendUrl}/cerner/callback?code=${encodeURIComponent(code)}`)
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.error || err.error_description || "Token exchange failed");
            });
          }
          return response.json();
        })
        .then((data) => {
          setTokenData(data);
          setLoading(false);
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleGoHome = () => {
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.spinner}>⏳</div>
          <h2>Processing your login...</h2>
          <p>Please wait while we complete your authentication.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={{ ...styles.icon, backgroundColor: "#f8d7da", color: "#721c24" }}>
            <img src="/assets/images/cerner-logo.png" alt="Cerner Logo" />
          </div>
          <h2>Login Failed</h2>
          <p style={{ color: "#721c24", marginBottom: "20px" }}>{error}</p>
          <button onClick={handleGoHome} style={styles.button}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (tokenData) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon}>
            <img src="/assets/images/cerner-logo.png" alt="Cerner Logo" />
          </div>
          <h2 style={styles.successTitle}>Successfully Logged In!</h2>
          <p style={styles.successMessage}>
            You have successfully authenticated with Cerner.
          </p>
          
          <div style={styles.tokenInfo}>
            <h3>Authentication Details:</h3>
            <div style={styles.tokenDetails}>
              <p><strong>Token Type:</strong> {tokenData.token_type || "Bearer"}</p>
              <p><strong>Expires In:</strong> {tokenData.expires_in ? `${tokenData.expires_in} seconds` : "N/A"}</p>
              <p><strong>Scope:</strong> {tokenData.scope || "N/A"}</p>
            </div>
          </div>

          <div style={styles.actions}>
            <button onClick={handleGoHome} style={styles.button}>
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.icon}>
          <img src="/assets/images/cerner-logo.png" alt="Cerner Logo" />
        </div>
        <h2>Callback Page</h2>
        <p>No authorization code found in URL.</p>
        <button onClick={handleGoHome} style={styles.button}>
          Go to Home
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    padding: "40px",
    maxWidth: "600px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  icon: {
    fontSize: "64px",
    marginBottom: "20px",
    backgroundColor: "#d4edda",
    color: "#155724",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  successTitle: {
    color: "#155724",
    marginBottom: "10px",
  },
  successMessage: {
    color: "#155724",
    fontSize: "18px",
    marginBottom: "30px",
  },
  tokenInfo: {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
    textAlign: "left",
  },
  tokenDetails: {
    marginTop: "15px",
  },
  actions: {
    marginTop: "20px",
  },
  button: {
    backgroundColor: "#006778",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "500",
    transition: "background-color 0.2s ease",
  },
  spinner: {
    fontSize: "48px",
    animation: "spin 1s linear infinite",
  },
};

export default Callback;