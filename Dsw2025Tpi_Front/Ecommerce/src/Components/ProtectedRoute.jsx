import { Navigate, Outlet} from 'react-router-dom';
import { useAuth } from '../Hooks/useAuth';

const ProtectedRoute = ({ allowedRoles }) => {
    const { isAuthenticated, userRole } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" replace />;
    }

    if (!allowedRoles.includes(admin)) {
        return <Navigate to="/adminDashboard" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;