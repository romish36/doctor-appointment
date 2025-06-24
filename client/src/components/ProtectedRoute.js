import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    console.log("Token:", token);
    console.log("User:", user);
    console.log("Expected Role:", role);

    if (!token) {
        console.log("🔴 No token found, redirecting to login");
        return <Navigate to="/login" />;
    }

    if (role && user?.role !== role) {
        console.log("🔴 Role mismatch, redirecting to login");
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
