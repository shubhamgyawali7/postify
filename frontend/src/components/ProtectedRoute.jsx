import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import Loading from "./Loading.jsx";
import { LOGIN_ROUTE, HOME_ROUTE } from "../routes/route.js";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) return <Loading />;

  if (!isAuthenticated) return <Navigate to={LOGIN_ROUTE} replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={HOME_ROUTE} replace />;
  }

  return children;
};

export default ProtectedRoute;
