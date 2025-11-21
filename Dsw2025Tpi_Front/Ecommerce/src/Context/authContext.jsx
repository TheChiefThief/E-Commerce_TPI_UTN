// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authApi from '../api/auth'; // Las funciones de llamada a la API
import { jwtDecode } from 'jwt-decode'; // Utilidad para decodificar el token

const AuthContext = createContext();

const TOKEN_KEY = 'authToken';

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // 1. Cargar el token desde localStorage al iniciar la app
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (storedToken) {
            decodeToken(storedToken);
        }
    }, []);

    // Función auxiliar para decodificar y establecer el estado del usuario
    const decodeToken = (t) => {
        try {
            const decoded = jwtDecode(t);
            // Asume que el token contiene 'id', 'name' y 'role'
            setUser({ id: decoded.id, name: decoded.name }); 
            setUserRole(decoded.role); // Rol: 'Administrador' o 'Cliente'
            setToken(t);
            setIsAuthenticated(true);
            localStorage.setItem(TOKEN_KEY, t);
        } catch (error) {
            console.error("Token inválido o expirado:", error);
            // Si el token es inválido, borra los datos
            logout();
        }
    };

    // 2. Lógica de Login: Llama a la API y almacena el token
    const login = async (credentials) => {
        try {
            // Llama a la API: POST /api/auth/login [cite: 345]
            const response = await authApi.login(credentials); 
            const newToken = response.token; // Asume que la respuesta tiene un campo 'token'
            decodeToken(newToken);
            return true;
        } catch (error) {
            console.error("Fallo de autenticación:", error);
            throw error;
        }
    };

    // 3. Lógica de Logout
    const logout = () => {
        setToken(null);
        setUser(null);
        setUserRole(null);
        setIsAuthenticated(false);
        localStorage.removeItem(TOKEN_KEY);
        // Opcional: Podrías borrar el carrito si el logout debe implicarlo
    };

    const value = {
        token,
        user,
        isAuthenticated,
        userRole,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom Hook para consumir el contexto fácilmente
export const useAuth = () => {
    return useContext(AuthContext);
};