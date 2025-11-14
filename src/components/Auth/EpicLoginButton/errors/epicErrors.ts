import type { EpicAuthError } from "../types";

export class EpicConfigurationError extends Error implements EpicAuthError {
  public readonly error?: string;
  public readonly code?: string;
  
  constructor(message: string, error?: string, code?: string) {
    super(message);
    this.name = 'EpicConfigurationError';
    if (error !== undefined) this.error = error;
    if (code !== undefined) this.code = code;
  }
}

export class EpicAuthenticationError extends Error implements EpicAuthError {
  public readonly error?: string;
  public readonly code?: string;
  
  constructor(message: string, error?: string, code?: string) {
    super(message);
    this.name = 'EpicAuthenticationError';
    if (error !== undefined) this.error = error;
    if (code !== undefined) this.code = code;
  }
}

export class EpicValidationError extends Error implements EpicAuthError {
  public readonly error?: string;
  public readonly code?: string;
  
  constructor(message: string, error?: string, code?: string) {
    super(message);
    this.name = 'EpicValidationError';
    if (error !== undefined) this.error = error;
    if (code !== undefined) this.code = code;
  }
}


export const createEpicError = (
  message: string,
  error?: string,
  code?: string | number
): EpicAuthError => {
  const epicError: EpicAuthError = new Error(message);
  if (error) epicError.error = error;
  if (code) epicError.code = String(code);
  return epicError;
};

export const createConfigurationError = (message: string, error?: string, code?: string): EpicConfigurationError => {
  return new EpicConfigurationError(message, error, code);
};

export const createAuthenticationError = (message: string, error?: string, code?: string): EpicAuthenticationError => {
  return new EpicAuthenticationError(message, error, code);
};

export const createValidationError = (message: string, error?: string, code?: string): EpicValidationError => {
  return new EpicValidationError(message, error, code);
};


export const handleAuthError = (
  error: unknown,
  context: string,
  onError?: (error: EpicAuthError) => void
): EpicAuthError => {
  const epicError = error instanceof Error 
    ? (error as EpicAuthError) 
    : createEpicError(String(error));
  
  console.error(`${context} Error:`, epicError);
  onError?.(epicError);
  
  return epicError;
};