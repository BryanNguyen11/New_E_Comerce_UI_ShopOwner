"use client";

import keycloak from '@/lib/keycloak';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

// const defaultToken = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJKcGNvM1ZIeFJTMVhrSm1mcVN3WXp4NHZLenFPUUhoTUlmaXJoRFYtVUZVIn0.eyJleHAiOjE3NDcwNTQ2NjMsImlhdCI6MTc0NzAxODY2NiwianRpIjoib25ydGFjOmUyMmU4OTllLTUxMmUtNDQwZC1hYTNiLWI2YTUzNjJlNzRiZCIsImlzcyI6Imh0dHA6Ly81ZWFjLTEyNS0yMzUtMjM5LTE5Ni5uZ3Jvay1mcmVlLmFwcC9yZWFsbXMvZGVtbyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImZyb250ZW5kLWNsaWVudCIsInNpZCI6ImUyOTI5ZTZkLWI1OTktNDk4Zi05NWEzLWQwN2I5YTQ1ZDZkMiIsInNjb3BlIjoib3BlbmlkIHJvbGVzIHBob25lIiwicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJWRU5ET1IiLCJkZWZhdWx0LXJvbGVzLWRlbW8iLCJ1bWFfYXV0aG9yaXphdGlvbiIsIlVTRVIiXSwibGFzdF9uYW1lIjoicGhhbSIsInBob25lX251bWJlciI6IjA5NDQ3MTMwMTUiLCJmaXJzdF9uYW1lIjoibWFuaCIsImVtYWlsIjoicG1hbmhoMTdAZ21haWwuY29tIiwidXNlcm5hbWUiOiJoZWdvcGxheSJ9.3A1gU2TfZ5yrcm4j0QAx8zG6qnL_OI5UjvzGztFbLm4tS9vE0GmTR-UlmC1JYtitQKKh0f-7Z6BKfunrWeJ6VAU6EzZbtDpOa-fr-wZeE30E_lEYgqFYdDsMXvD-AEpiSkF1UWSZ8HjPZe4l5JfQHQxd_jpP6ZFsoUWOOZPPDqpdCV9X8p27F7-ietIly2iLkPr15AdywDggQBur9llfbpqsF8nIvGX4mtAOz_NZliqMecoH9rCuGL9DtD2KhZQAdo3BbYQPIaqLI_bLzTsywr_H3Prhi5p3j558pO-KmoN-4dAZ6j5oNibI31KV0gMN9BWBbeFBMPHpy_QZYijutQ";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    isLoading: true
  })

  useEffect(() => {
    keycloak.onAuthSuccess = () => {
      console.log('Authenticated');
      const keycloakToken = keycloak.token;
      console.log('Keycloak token:', keycloakToken); // Debug trạng thái
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${keycloak.token}`,
          'Content-Type': 'application/json'
        }
      }).then(response => {
        if (!response.ok) {
          throw new Error('fetch whoami failed');
        }
        return response.json();
      }).then(userData => {
        console.log('User data:', userData); // Debug trạng thái
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }).catch(error => {
        console.error('Error fetching user data:', error);
        setUser(null);
      });
      setAuthState({
        isAuthenticated: true,
        user: keycloak.tokenParsed,
        token: keycloak.token,
        isLoading: false
      });
    };

    keycloak.onAuthLogout = () => {
      setUser(null);
      localStorage.removeItem("user");
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false
      });
      setUser(null);
      localStorage.removeItem("user");
    };
    const initializeKeycloak = async () => {
      try {
        console.log('Initializing Keycloak...'); // Debug trạng thái
        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        });
    
        console.log('Keycloak init result:', authenticated); // Debug trạng thái
    
        setAuthState({
          isAuthenticated: authenticated,
          user: authenticated ? keycloak.tokenParsed : null,
          token: authenticated ? keycloak.token : null,
          isLoading: false,
        });
      } catch (error) {
        console.error('Keycloak initialization error:', error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
        });
      }
    };

    initializeKeycloak();
    // console.log('Keycloak initialized');


    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      // You might also want to set the token if it's not already set
        if (!localStorage.getItem("accessToken")) {
          localStorage.setItem("accessToken", defaultToken);
        }
      } catch (error) {
        console.error("Failed to parse stored user data", error);
        localStorage.removeItem("user");
      }
    }

    return () => {
      keycloak.onAuthSuccess = null
      keycloak.onAuthLogout = null
    }
  }, []);

  const kcLogin = () => keycloak.login()
  const kcLogout = () => keycloak.logout({ redirectUri: window.location.origin })
  const kcRegister = () => keycloak.register()
  const kcRefreshToken = () => keycloak.updateToken(30)

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("accessToken", defaultToken);
  };

  const logout = () => {
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, login, logout,
      authState, kcLogin, kcLogout, kcRegister, kcRefreshToken,
      hasRole: (role) => keycloak.hasRealmRole(role)
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}