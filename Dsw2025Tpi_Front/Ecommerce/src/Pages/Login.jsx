import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';
import Layout from '../Components/Layout.jsx';


import './Login.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const { login } = useAuth(); // Función de login del contexto
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (!email || !password) {
            setError("Por favor, ingrese un email y una contraseña.");
            setIsLoading(false);
            return;
        }

        try {
            console.debug('LoginPage: handleSubmit credentials', { email, password });
            // Llama a la lógica centralizada de useAuth, que llama a la API.
            // El backend espera un campo 'Username' en el DTO, por eso enviamos
            // 'username' (usualmente usamos el email como username en la app)
            const result = await login({ username: email, password });
            console.debug('LoginPage: login result', result);

            // Si el login es exitoso, navega al Home (o al Dashboard si es Admin, 
            // aunque el useAuth podría manejar la redirección basada en el rol).
            navigate('/'); 

        } catch (err) {
            // Manejo de errores de autenticación (ej. credenciales inválidas)
            const errorMessage = err.response?.data?.message || "Credenciales inválidas. Inténtelo de nuevo.";
            setError(errorMessage);
            console.error('LoginPage: login error', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="auth-form-container">
                <h2>Iniciar Sesión</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="username"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Ingresando...' : 'Ingresar'}
                    </button>
                </form>
                
                <p>
                    ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
                </p>
            </div>
        </Layout>
    );
};

export default LoginPage;