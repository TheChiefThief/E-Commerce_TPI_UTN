import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { register as registerService } from '../services/register';
import { backendErrorMessage } from '../helpers/backendError';
import useAuth from '../hook/useAuth';

function RegisterForm() {
    const { register, handleSubmit, watch, setError, formState: { errors } } = useForm({
        defaultValues: { username: '', email: '', role: 'USER', password: '', confirmPassword: '' }
    });
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();
    const { signIn } = useAuth();

    const password = watch('password');

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                // Recargar la página para limpiar estados y asegurar que el usuario esté logueado
                window.location.href = '/';
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess]);

    const onSubmit = async (values) => {
        try {
            setLoading(true);
            setServerError('');

            // 1. Registrar usuario
            const { error } = await registerService({
                username: values.username,
                email: values.email,
                role: 'User',
                password: values.password,
            });

            if (error) {
                // Si el error es un string simple
                if (typeof error === 'string') {
                    if (error.toLowerCase().includes('user') || error.toLowerCase().includes('usuario')) {
                        setError('username', { type: 'manual', message: error });
                    } else if (error.toLowerCase().includes('email') || error.toLowerCase().includes('correo')) {
                        setError('email', { type: 'manual', message: error });
                    } else {
                        setServerError(error);
                    }
                } else {
                    setServerError('Error al registrar usuario');
                }
                return;
            }

            // 2. Auto-login
            const { error: loginError } = await signIn(values.username, values.password);

            if (loginError) {
                // Si falla el login automático, redirigir al login manual o mostrar éxito de registro
                console.error("Auto-login failed", loginError);
                // Aún así mostramos éxito de registro, el usuario tendrá que loguearse manualmente si esto falla
            }

            setIsSuccess(true);
        } catch (err) {
            console.error(err);

            const data = err?.response?.data;
            const code = data?.code;
            const message = data?.message || data?.detail || JSON.stringify(data);

            // Intentar mapear errores comunes de backend a campos específicos
            if (message) {
                const msgLower = message.toLowerCase();
                if (msgLower.includes('username') || msgLower.includes('usuario')) {
                    setError('username', { type: 'manual', message: 'El nombre de usuario ya está en uso' });
                } else if (msgLower.includes('email') || msgLower.includes('correo') || msgLower.includes('mail')) {
                    setError('email', { type: 'manual', message: 'El correo electrónico ya está registrado' });
                } else if (code && backendErrorMessage[code]) {
                    setServerError(backendErrorMessage[code]);
                } else {
                    setServerError(message || 'Error al crear usuario');
                }
            } else {
                setServerError('Error al crear usuario');
            }
        } finally {
            setLoading(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Registro Exitoso!</h2>
                <p className="text-gray-600">Tu cuenta ha sido creada correctamente.</p>
                <p className="text-sm text-gray-500 mt-4">Redirigiendo al inicio...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <Input
                label="Usuario"
                {...register(
                    'username',
                    { required: 'Usuario es obligatorio' }
                )}
                error={errors.username?.message}
            />
            <Input
                label="Email"
                {...register(
                    'email',
                    {
                        required: 'Email es obligatorio',
                        pattern: { value: /^\S+@\S+$/i, message: 'Email inválido' }
                    }
                )
                }
                error={errors.email?.message}
            />
            <Input
                label="Contraseña"
                type="password"
                {...register(
                    'password',
                    {
                        required: 'Contraseña obligatoria',
                        minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                        pattern: {
                            value: /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
                            message: 'Debe tener 1 mayúscula, 1 número y 1 símbolo'
                        }
                    }
                )
                } error={errors.password?.message}
            />
            <Input
                label="Confirmar Contraseña"
                type="password"
                {...register(
                    'confirmPassword',
                    {
                        required: 'Confirmación obligatoria',
                        validate: (val) => {
                            if (!val) return "Confirmación obligatoria";
                            if (watch('password') != val) return "Las contraseñas no coinciden";
                        },
                    })
                }
                error={errors.confirmPassword?.message}
            />
            <Button
                type="submit"
                disabled={loading}
                className="w-full py-2 rounded-md font-medium text-sm sm:text-base">
                {loading ? 'Creando...' : 'Crear usuario'}
            </Button>
            {serverError && <p className="text-red-500 text-sm sm:text-base">{serverError}</p>}

        </form>
    );
}

export default RegisterForm;