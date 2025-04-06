import { useAuthContext } from "../hook/useAuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white dark:bg-[#111827] text-gray-900 dark:text-gray-100">
        <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-4"></div>
        <h2 className="text-xl font-semibold">Loading</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Please wait while we verify your credentials...
        </p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
