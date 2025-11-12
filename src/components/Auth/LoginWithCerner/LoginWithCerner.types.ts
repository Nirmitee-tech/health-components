export interface CernerLoginProps {
    clientId: string;
    redirectUri: string;
    authorizeUrl?: string; // Optional custom Cerner endpoint
    scope?: string;
    buttonText?: string;
    buttonColor?: string;
    onSuccess?: (tokenData: any) => void;
    onError?: (error: any) => void;
    className?: string; // custom styling
    style?: React.CSSProperties;
  }
  