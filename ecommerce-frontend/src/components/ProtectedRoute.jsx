import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const role = localStorage.getItem("role"); // Ambil role dari storage

    // Jika bukan admin, tendang ke login
    if (role !== "admin") {
        return <Navigate to="/login" replace />;
    }

    return role === "admin" ? <Outlet /> : <Navigate to="/login" />
};

export default ProtectedRoute;  