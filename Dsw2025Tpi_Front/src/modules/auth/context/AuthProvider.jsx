import { createContext, useState } from 'react';
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

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  const [userRole, setUserRole] = useState(() => {
    try {
      const t = typeof window !== 'undefined' ? (window.localStorage.getItem('token') || window.localStorage.getItem('userToken')) : null;
      if (!t) return null;
      const payload = parseJwt(t);
      const role = payload && (payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']);
      return role || null;
    } catch (e) {
      return null;
    }
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    try {
      const t = typeof window !== 'undefined' ? (window.localStorage.getItem('token') || window.localStorage.getItem('userToken')) : null;
      if (!t) return false;
      const payload = parseJwt(t);
      // Check for common role claims
      const role = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      return role === 'Admin' || role === 'admin' || role === 'Administrator';
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
    setIsAdmin(false);
    setUserRole(null);
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

        const payload = parseJwt(token);
        const role = payload['role'] || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
        setIsAdmin(role === 'Admin' || role === 'admin' || role === 'Administrator');
        setUserRole(role || null);
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
      value={{
        isAuthenticated,
        isAdmin,
        singin,
        singout,
        // aliases to reduce bugs from typos
        signIn: singin,
        signOut: singout,
        userRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export {
  AuthProvider,
  AuthContext,
};
