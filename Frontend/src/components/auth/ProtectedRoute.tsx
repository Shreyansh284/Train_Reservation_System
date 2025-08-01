import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { ReactNode } from 'react';

type ProtectedRouteProps = {
  children?: ReactNode;
  roles?: UserRole[];
  redirectTo?: string;
  onlyUnauthenticated?: boolean;
};

export const ProtectedRoute = ({
  children,
  roles = [],
  redirectTo = '/login',
  onlyUnauthenticated = false,
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Handle onlyUnauthenticated routes (like login/register)
  if (onlyUnauthenticated) {
    return isAuthenticated ? (
      <Navigate to={from} replace />
    ) : (
      <>{children}</>
    );
  }

  // Handle protected routes
  if (!isAuthenticated) {
    // Only redirect if we're not already on the login page to prevent loops
    if (location.pathname !== '/login') {
      // Preserve the full URL including search parameters
      const from = location.pathname + location.search;
      return (
        <Navigate 
          to={redirectTo} 
          state={{ 
            from: from || '/',
            search: location.search 
          }} 
          replace 
        />
      );
    }
    return null;
  }

  // Check roles if specified
  if (roles.length > 0 && user && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export const AdminRoute = (props: Omit<ProtectedRouteProps, 'roles'>) => (
  <ProtectedRoute {...props} roles={['Admin']} />
);

export const AgentRoute = (props: Omit<ProtectedRouteProps, 'roles'>) => (
  <ProtectedRoute {...props} roles={['Agent']} />
);

export const CustomerRoute = (props: Omit<ProtectedRouteProps, 'roles'>) => (
  <ProtectedRoute {...props} roles={['Customer']} />
);
