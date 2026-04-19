import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const token = window.localStorage.getItem('_bb_key') || null;
  
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
