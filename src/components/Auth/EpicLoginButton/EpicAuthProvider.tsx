import React, { createContext, useEffect } from 'react';
import {
    emrRegistry,
    EPIC_TEMPLATE,
    useAuth as useSDKAuth,
    FHIRError
} from '@nirmiteeio/fhir-sdk';
import type { EpicAuthProviderProps, EpicAuthContextType } from './types';

export const EpicAuthContext = createContext<EpicAuthContextType | null>(null);

export const EpicAuthProvider: React.FC<EpicAuthProviderProps> = ({
    clientId,
    redirectUri,
    scopes = ['openid', 'fhirUser', 'patient/*.read'],
    onSuccess,
    onError,
    children,
}) => {

    React.useMemo(() => {
        emrRegistry.registerProvider({
            ...EPIC_TEMPLATE,
            clientId,
            redirectUri,
            scopes,
        });
    }, [clientId, redirectUri, scopes]);

    const authData = useSDKAuth('epic');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const hasCode = urlParams.has('code');
        const hasState = urlParams.has('state');

        if (hasCode && hasState && !authData.isAuthenticated && !authData.isLoading) {

            authData.handleCallback(window.location.href)
                .then(() => {
                    onSuccess?.({ patientId: authData.patientId || undefined });
                    window.history.replaceState({}, document.title, window.location.pathname);
                })
                .catch((err) => {
                    onError?.(err as FHIRError);
                });
        }
    }, [
        authData.handleCallback,
        authData.isAuthenticated,
        authData.isLoading,
        authData.patientId,
        onSuccess,
        onError
    ]);

    return (
        <EpicAuthContext.Provider value={authData}>
            {children}
        </EpicAuthContext.Provider>
    );
};