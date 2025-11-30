import { createContext, useState, useEffect } from 'react';
import { login } from '../services/login';

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const t = typeof window !== 'undefined' ? (window.localStorage.getItem('token') || window.localStorage.getItem('userToken')) : null;
      return Boolean(t);
    } catch (e) {
      return false;
    }
  });

  const singout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('userToken');
      localStorage.removeItem('customerId');
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(false);
  };

  const singin = async (username, password) => {
    const { data, error } = await login(username, password);

    if (error) {
      return { error };
    }

    try {
      localStorage.setItem('token', data);
      // keep compatibility with other parts of the app that use 'userToken'
      localStorage.setItem('userToken', data);
    } catch (e) {
      // ignore
    }
    setIsAuthenticated(true);

    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={ {
        isAuthenticated,
        singin,
        singout,
      } }
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};
