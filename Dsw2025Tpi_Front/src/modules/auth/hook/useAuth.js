import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth no debe ser usado por fuera de AuthProvider');
  }

  return {
    isAuthenticated: context.isAuthenticated,
    isAdmin: context.isAdmin,
    singin: context.singin,
    singout: context.singout,
    signout: context.singout,
  };

};

export default useAuth;
