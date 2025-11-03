import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import './Login.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            setIsLoading(false);
            return;
        }

        try {
            // Llama a la API: POST /api/auth/register (asumiendo este endpoint)
            await authApi.register({ name, email, password }); 

            // Registro exitoso: redirige al usuario a la página de login
            alert("Registro exitoso. ¡Ahora puedes iniciar sesión!");
            navigate('/login');

        } catch (err) {
            // Manejo de errores (ej. email ya registrado)
            const errorMessage = err.response?.data?.message || "Error al registrar. Inténtelo de nuevo.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Layout>
            <div className="auth-form-container">
                <h2>Registrarse</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    
                    {error && <div className="error-message">{error}</div>}

                    {/* Campo Nombre/Name */}
                    <div className="form-group">
                        <label htmlFor="name">Nombre Completo</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Campo Email */}
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
                    
                    {/* Campo Contraseña */}
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

                    {/* Campo Confirmar Contraseña */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrar'}
                    </button>
                </form>

                <p>
                    ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión</Link>
                </p>
            </div>
        </Layout>
    );
};

export default Register;