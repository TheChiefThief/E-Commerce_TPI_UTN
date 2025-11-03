import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

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
            // Llama a la lógica centralizada de useAuth, que llama a la API.
            await login({ email, password });

            // Si el login es exitoso, navega al Home (o al Dashboard si es Admin, 
            // aunque el useAuth podría manejar la redirección basada en el rol).
            navigate('/'); 

        } catch (err) {
            // Manejo de errores de autenticación (ej. credenciales inválidas)
            const errorMessage = err.response?.data?.message || "Credenciales inválidas. Inténtelo de nuevo.";
            setError(errorMessage);
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
                            type="email"
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
                    ¿No tienes cuenta? <Link to="/signup">Regístrate aquí</Link>
                </p>
            </div>
        </Layout>
    );
};

export default LoginPage;