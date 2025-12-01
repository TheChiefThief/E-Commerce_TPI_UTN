import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { backendErrorMessage } from '../helpers/backendError';

function LoginForm({ openSignup }) {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { username: '', password: '' } });

  const navigate = useNavigate();

  const { singin } = useAuth();

  const onValid = async (formData) => {
    try {
      const { error } = await singin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error.backendErrorMessage);

        return;
      }

      navigate('/admin/home');
    } catch (error) {
      if (error?.response?.data?.code) {
        setErrorMessage(backendErrorMessage[error?.response?.data?.code]);
      } else {
        setErrorMessage('Llame a soporte');
      }
    }
  };

  return (
    <form className='
        flex
        flex-col
        gap-4
        
      '
      onSubmit={handleSubmit(onValid)}
    >
      <Input
        label='Usuario'
        {...register('username', {
          required: 'Usuario es obligatorio',
        })}
        error={errors.username?.message}
      />
      <Input
        label='Contraseña'
        {...register('password', {
          required: 'Contraseña es obligatorio',
        })}
        type='password'
        error={errors.password?.message}
      />

      <Button type='submit' className="w-full py-2 rounded-md font-medium text-sm sm:text-base">Iniciar Sesión</Button>

      <div className="w-full text-center mt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={openSignup || (() => navigate('/signup'))}
          className="w-full py-2 rounded-md font-medium text-sm sm:text-base"
        >
          Registrar Usuario
        </Button>
        {errorMessage && <p className='text-red-500 mt-2 text-sm sm:text-base'>{errorMessage}</p>}
      </div>
    </form>
  );
};

export default LoginForm;
