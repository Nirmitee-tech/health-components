import { STORAGE_KEYS } from "../constant";

export interface StorageProvider {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

class SessionStorageProvider implements StorageProvider {
  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}

export const storageProvider = new SessionStorageProvider();

export interface AuthData {
  verifier: string | null;
  state: string | null;
}

export const storeAuthData = (
  verifier: string,
  state: string,
  storage: StorageProvider = storageProvider
): void => {
  storage.setItem(STORAGE_KEYS.VERIFIER, verifier);
  storage.setItem(STORAGE_KEYS.STATE, state);
};

export const retrieveAuthData = (
  storage: StorageProvider = storageProvider
): AuthData => {
  return {
    verifier: storage.getItem(STORAGE_KEYS.VERIFIER),
    state: storage.getItem(STORAGE_KEYS.STATE)
  };
};

export const clearAuthData = (
  storage: StorageProvider = storageProvider
): void => {
  storage.removeItem(STORAGE_KEYS.VERIFIER);
  storage.removeItem(STORAGE_KEYS.STATE);
  storage.removeItem(STORAGE_KEYS.CLIENT_ID);
};
