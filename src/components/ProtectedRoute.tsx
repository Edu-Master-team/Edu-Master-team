import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token =
    useSelector((state: any) => state.auth.token) ||
    localStorage.getItem("token");

  if (!token) {
    // لو مفيش توكن → يرجع للصفحة login
    return <Navigate to="/login" replace />;
  }

  // لو فيه توكن → يكمّل عادي
  return <Outlet />;
}
