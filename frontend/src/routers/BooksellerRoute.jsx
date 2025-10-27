// BooksellerRoute.jsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Loading";

const BooksellerRoute = ({ children }) => {
    const location = useLocation();
    
    // Use auth with try-catch for safety
    let auth = null;
    try {
        auth = useAuth();
    } catch (error) {
        console.error('Auth context error in BooksellerRoute:', error);
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If auth context is not available yet, show loading
    if (!auth || auth.loading) {
        return <Loading />;
    }

    const { backendUser } = auth;

    // Check token
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Get user role from multiple sources
    let userRole = backendUser?.role;
    
    if (!userRole) {
        // Try localStorage
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                userRole = userData.role;
            }
        } catch (error) {
            console.error('Error parsing stored user:', error);
        }
    }

    if (!userRole) {
        // Try JWT token
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            userRole = payload.role;
        } catch (error) {
            console.error('Error parsing JWT:', error);
        }
    }

    // Check if user is bookseller
    if (userRole !== 'bookseller') {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default BooksellerRoute;