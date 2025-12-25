import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const HomePage = lazy(() => import('./pages/HomePage.tsx'));
const ModelDetailPage = lazy(() => import('./pages/ModelDetailPage.tsx'));
const DeveloperToolsPage = lazy(() => import('./pages/DeveloperToolsPage.tsx'));
const DashboardPage = lazy(() => import('./pages/DashboardPage.tsx'));
const CreatorPortalPage = lazy(() => import('./pages/CreatorPortalPage.tsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.tsx'));


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedAccountTypes?: Array<'consumer' | 'creator'>; // If not provided, any authenticated user is allowed
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedAccountTypes }) => {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]"><LoadingSpinner size="lg" /></div>;
  }

  if (!currentUser || currentUser.accountType === 'guest') {
    return <Navigate to="/login" replace state={{ from: window.location.hash.substring(1) || '/' }} />;
  }
  
  if (allowedAccountTypes && !allowedAccountTypes.includes(currentUser.accountType)) {
    // User is logged in but not of the allowed type, redirect to dashboard or home
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};


const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
            <Header />
            <main className="flex-grow">
              <Suspense fallback={<div className="flex justify-center items-center min-h-[calc(100vh-8rem)]"><LoadingSpinner size="lg" text="Loading page..." /></div>}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/models/:modelId" element={<ModelDetailPage />} />
                  <Route path="/developer-tools" element={<DeveloperToolsPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/creator-portal" 
                    element={
                      <ProtectedRoute allowedAccountTypes={['creator']}>
                        <CreatorPortalPage />
                      </ProtectedRoute>
                    } 
                  />
                  
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;