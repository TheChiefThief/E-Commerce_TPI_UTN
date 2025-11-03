import {createContext, useContext, useState, useEffect} from "react";
import * as authApi from "../Api/authApi";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext();

const TOKENKEY = "auth_token";

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const[isAuthenticated, setIsAuthenticated] = useState(false);
    const[useRole, setUserRole] = useState(null);
}

useEffect(() => {
    const storedToken = localStorage.getItem(TOKENKEY);
    if(storedToken){
        const decodedToken = jwtDecode(storedToken);
    }
}, []);
    const decodedToken = (t) => {
        try {
            const decoded = jwtDecode(t);
            setUser({id: decoded.id, name: decoded.name});
            setUserRole(decoded.role);
            setToken(t);
            setIsAuthenticated(true);
            localStorage.setItem(TOKENKEY, t);
        } catch (error) {
            console.error("Error decoding token:", error);
            logout();
        }
        };

    const login = async (credentials) => {
        try {
            const response = await authApi.login(credentials);
            const newToken = response.token;
            decodedToken(newToken);
            return true;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    const logout = () => {
        setUser(null);
        setUserRole(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem(TOKENKEY);
    }

    const value = {
        user,
        token,
        isAuthenticated,
        useRole,
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );

    export const useAuth = () => {
        return useContext(AuthContext);
    };
