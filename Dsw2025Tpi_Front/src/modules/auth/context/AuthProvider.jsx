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
      // data may be either a token string or an object containing token and other info
      const token = data && (data.token || data.accessToken) ? (data.token || data.accessToken) : (typeof data === 'string' ? data : null);
      if (token) {
        localStorage.setItem('token', token);
        // keep compatibility with other parts of the app that use 'userToken'
        localStorage.setItem('userToken', token);
      }
      // if response includes customer id or user payload, store it for usage by orders
      const customerId = data && (data.customerId || (data.user && data.user.id) || (data.customer && data.customer.id));
      if (customerId) {
        localStorage.setItem('customerId', customerId);
      }
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
