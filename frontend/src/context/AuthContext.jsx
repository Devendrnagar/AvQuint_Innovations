import { createContext, useContext, useEffect, useState } from 'react';
import { authApi, setAuthToken } from '../api/client';

const AuthContext = createContext(null);
const STORAGE_KEY = 'task-manager-auth';

function readStoredAuth() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    return { user: null, token: null };
  }

  try {
    return JSON.parse(stored);
  } catch {
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => readStoredAuth());

  useEffect(() => {
    if (auth.token) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
      setAuthToken(auth.token);
      return;
    }

    localStorage.removeItem(STORAGE_KEY);
    setAuthToken(null);
  }, [auth]);

  async function login(credentials) {
    const data = await authApi.login(credentials);
    setAuth(data);
    return data;
  }

  async function register(credentials) {
    const data = await authApi.register(credentials);
    setAuth(data);
    return data;
  }

  function logout() {
    setAuth({ user: null, token: null });
  }

  const value = {
    user: auth.user,
    token: auth.token,
    isAuthenticated: Boolean(auth.token),
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
