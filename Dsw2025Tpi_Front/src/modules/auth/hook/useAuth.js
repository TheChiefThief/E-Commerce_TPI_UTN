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
    // aliases for consistency
    signIn: context.signIn || context.singin,
    signOut: context.signOut || context.singout,
    userRole: context.userRole,
    userName: context.userName,
  };

};

export default useAuth;
