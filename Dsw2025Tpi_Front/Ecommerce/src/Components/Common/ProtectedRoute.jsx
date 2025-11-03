// src/components/common/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 

/**
 * Componente que protege las rutas.
 * Verifica si el usuario está autenticado y si tiene el 'requiredRole'.
 */
const ProtectedRoute = ({ requiredRole }) => {
    // Obtenemos los datos del hook de autenticación
    const { isAuthenticated, userRole } = useAuth(); 

    // 1. Verificar Autenticación
    if (!isAuthenticated) {
        // Si no está logeado, lo enviamos al login. 'replace' evita que
        // la ruta protegida se guarde en el historial del navegador.
        return <Navigate to="/login" replace />;
    }

    // 2. Verificar Autorización (Rol)
    if (requiredRole && userRole !== requiredRole) {
        // Si no tiene el rol requerido (ej. no es 'Administrador'),
        // lo enviamos al Home o a una página de acceso denegado (403).
        alert('Acceso denegado: No tienes permisos para ver esta página.');
        return <Navigate to="/" replace />;
    }

    // Si está autenticado y autorizado, renderiza las rutas anidadas.
    // Outlet es necesario cuando se usa como un componente de ruta padre en react-router-dom.
    return <Outlet />;
};

export default ProtectedRoute;