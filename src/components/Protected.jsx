import { useAuth } from "../libs/contexts/AuthConexts";
import { Navigate } from "react-router-dom";
import Loader from "./Loader";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <Loader label="Checking authentication..." />;

  if (!user) {
    return <Navigate to="/auth/signin" />;
  }

  return children;
}