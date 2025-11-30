import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hook/useAuth';

// Helper to try extracting a role from a JWT token or localStorage
function getUserRoleFromToken() {
  try {
    const token = typeof window !== 'undefined' ? (window.localStorage.getItem('token') || window.localStorage.getItem('userToken')) : null;
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1]));
    // common claim names
    if (payload.role) return payload.role;
    if (payload.roles) return Array.isArray(payload.roles) ? payload.roles[0] : payload.roles;
    // Microsoft style claim
    const msRole = Object.keys(payload).find(k => k.toLowerCase().includes('role'));
    if (msRole) return payload[msRole];
    return null;
  } catch (e) {
    return null;
  }
}

/**
 * Componente que protege las rutas.
 * Verifica si el usuario está autenticado y (opcionalmente) si tiene el rol permitido.
 */
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated } = useAuth();

  // 1. Verificar Autenticación
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. Obtener role del usuario (si está disponible)
  const userRole = getUserRoleFromToken();

  // 3. Verificar Autorización (Roles permitidos)
  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const normalizedAllowed = allowedRoles.map(r => String(r).toLowerCase());
    const normalizedUserRole = String(userRole || '').toLowerCase();
    if (!normalizedAllowed.includes(normalizedUserRole)) {
      return <Navigate to="/" replace />;
    }
  }

  // Si está autenticado y autorizado, renderiza children (si se pasan) o rutas anidadas (Outlet)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
