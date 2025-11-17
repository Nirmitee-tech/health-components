import { useContext } from 'react';
import { EpicAuthContext } from './EpicAuthProvider';
import type { EpicAuthContextType } from './types';

export const useEpicAuth = (): EpicAuthContextType => {
  const context = useContext(EpicAuthContext);
  if (!context) {
    throw new Error(
        'useEpicAuth must be used within an EpicAuthProvider' + 
        'Please ensure that your component is wrapped with EpicAuthProvider.');
  }
  return context;
};