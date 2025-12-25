import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { APP_NAME } from "../constants";
import { SparklesIcon, UserCircleIcon } from "../components/IconComponents";

const LoginPage: React.FC = () => {
  const { currentUser, login, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    document.title = `Login | ${APP_NAME}`;
  }, []);

  // If user is already logged in (and not a guest), redirect them from /login.
  // Guest users might be directed here to "fully" log in.
  if (currentUser && currentUser.accountType !== "guest") {
    const from = (location.state as any)?.from?.pathname || "/dashboard";
    return <Navigate to={from} replace />;
  }

  if (isLoading && !currentUser) {
    // Show loading only if initial auth check is in progress
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background-light to-blue-100 dark:from-background-dark dark:to-blue-900 p-4">
      <div className="w-full max-w-md p-8 bg-card-light dark:bg-card-dark rounded-xl shadow-2xl space-y-8">
        <div className="text-center">
          <SparklesIcon
            size={48}
            className="mx-auto text-primary-DEFAULT mb-4"
          />
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark">
            Welcome to {APP_NAME}
          </h1>
          <p className="mt-2 text-text-muted-light dark:text-text-muted-dark">
            Sign in to access your dashboard and models.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => login("consumer")}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-DEFAULT hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-DEFAULT transition-colors"
            >
              <UserCircleIcon className="mr-2" size={20} />
              Login as Consumer
            </button>
            <button
              onClick={() => login("creator")}
              className="w-full flex items-center justify-center px-6 py-3 border border-secondary-DEFAULT text-secondary-DEFAULT rounded-md shadow-sm text-base font-medium hover:bg-secondary-DEFAULT/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-DEFAULT transition-colors"
            >
              <SparklesIcon className="mr-2" size={20} />
              Login as Creator
            </button>
          </div>
        )}
        <p className="text-center text-xs text-text-muted-light dark:text-text-muted-dark">
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
