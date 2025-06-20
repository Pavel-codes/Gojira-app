import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, onlyAdmin = false, onlyUser = false }) => {
    const { isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (onlyAdmin && !isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    if (onlyUser && isAdmin) {
        return <Navigate to="/admindashboard" replace />;
    }
    
    return children;
};

export default ProtectedRoute;
