import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import { register as registerService } from '../services/register';
import { backendErrorMessage } from '../helpers/backendError';
import Card from '../../shared/components/Card';

function RegisterForm() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: { username: '', email: '', role: 'USER', password: '', confirmPassword: '' }
    });
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
        setServerError('Las contraseñas no coinciden');
        return;
    }

    try {
        setLoading(true);
        const { data, error } = await registerService({
            username: values.username,
            email: values.email,
            role: values.role,
            password: values.password,
        });
        if (error) {
            setServerError(error);
            return;
        }
        alert(data || 'Usuario creado');
        navigate('/'); 
    } catch (err) {
        console.error(err);

        const code = err?.response?.data?.code;

        if (code) {
            setServerError(backendErrorMessage[code] || err?.response?.data?.message || 'Error al crear usuario');
        } else {
            setServerError(err?.response?.data || 'Error al crear usuario');
        }

        console.error(err);
    } finally {
        setLoading(false);
    }
    };

    return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Card>
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
            <label className="block">
            Rol
            <select {...register('role')} className="block w-full mt-1">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
            </select>
            </label>
            <Input 
                label="Contraseña" 
                type="password" 
                {...register(
                    'password', 
                    { 
                        required: 'Contraseña obligatoria', 
                        minLength: { value: 6, message: 'Mínimo 6 caracteres' } 
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
                        required: 'Confirmación obligatoria' 
                    })
                } 
                error={errors.confirmPassword?.message} 
            />
            <Button 
                type="submit" 
                disabled={loading}>
                    {loading ? 'Creando...' : 'Crear usuario'}
            </Button>
            {serverError && <p className="text-red-500">{serverError}</p>}
        </Card>
    </form>
    );
}

export default RegisterForm;