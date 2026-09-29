import { createBrowserRouter, RouterProvider, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/AdminAuth/model/useAuth";
import { getRouteAuth } from '@/shared/lib';
import { Suspense } from "react";
import { routeConfig } from "../lib/data";

interface AppRouteProps {
  authOnly?: boolean;
  path: string;
  page: React.JSX.Element;
}

const ProtectedRoute = ({ children, authOnly }: { children: React.JSX.Element; authOnly?: boolean }) => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (authOnly && !isLoggedIn) {
    return <Navigate to={getRouteAuth()} state={{ from: location }} replace />;
  }

  return children;
};

export const AppRouter = () => {
  const routesArray = (Object.values(routeConfig) as AppRouteProps[]).map((route) => ({
    path: route.path,
    element: (
      <ProtectedRoute authOnly={route.authOnly}>
        {route.page}
      </ProtectedRoute>
    ),
  }));

  const router = createBrowserRouter(routesArray);

  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  );
};
