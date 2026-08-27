import { Navigate, Outlet } from "react-router-dom";
import { getAuth } from "../auth/AuthStorage";

const ProtectedRoute = () => {
  const auth = getAuth();

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;