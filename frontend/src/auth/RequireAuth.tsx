import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RequireAuth({
  children,
  role,
}: {
  children: JSX.Element;
  role?: "candidate" | "company";
}) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) return <Navigate to="/" replace />;

  if (role && user.Role !== role) return <Navigate to="/" replace />;

  return children;
}
