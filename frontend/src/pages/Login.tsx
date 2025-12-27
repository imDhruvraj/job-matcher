import { GoogleLogin } from "@react-oauth/google";
import api from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"candidate" | "company">("candidate");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate(user.Role === "candidate" ? "/candidate" : "/company");
    }
  }, [user, navigate]);

  const handleSuccess = async (cred: any) => {
    setError("");
    setIsLoading(true);
    
    try {
      const res = await api.post("/auth/google", {
        token: cred.credential,
        role,
      });

      if (res.data.token && res.data.user) {
        login(res.data.token, res.data.user);
        // Navigation will happen via useEffect when user state updates
      } else {
        setError("Invalid response from server");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Login failed. Please try again."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    setError("Google login failed. Please try again.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">JobMatch</h1>
          <p className="text-gray-600">Sign in to continue</p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            I want to sign in as:
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "candidate" | "company")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="candidate">Candidate</option>
            <option value="company">Company</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex justify-center">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-600">Signing in...</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={handleSuccess}
              onError={handleError}
              useOneTap={false}
            />
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
