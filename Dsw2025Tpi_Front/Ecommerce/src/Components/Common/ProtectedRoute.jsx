// src/components/common/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 

/**
 * Componente que protege las rutas.
 * Verifica si el usuario está autenticado y si tiene el 'requiredRole'.
 */
const ProtectedRoute = ({ allowedRoles }) => {
    // Obtenemos los datos del hook de autenticación
    const { isAuthenticated, userRole } = useAuth(); 

    // 1. Verificar Autenticación
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // 2. Verificar Autorización (Roles permitidos)
    // Si se pasó un arreglo `allowedRoles`, verificamos que el role del usuario
    // esté incluido. Si no hay `allowedRoles`, permitimos por defecto.
    if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
        // Normalizar valores para evitar problemas de mayúsculas/minúsculas
        const normalizedAllowed = allowedRoles.map(r => String(r).toLowerCase());
        const normalizedUserRole = String(userRole || '').toLowerCase();
        if (!normalizedAllowed.includes(normalizedUserRole)) {
            return <Navigate to="/" replace />;
        }
    }

    // Si está autenticado y autorizado, renderiza las rutas anidadas.
    return <Outlet />;
};

export default ProtectedRoute;