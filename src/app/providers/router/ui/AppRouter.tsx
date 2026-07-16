import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/AdminAuth/model/useAuth"
import { getRouteAuth } from "@/shared";
import { Suspense } from "react";
import { routeConfig } from "../lib/data";

interface AppRouteProps {
    auth: boolean,
    path: string,
    page: React.JSX.Element
    
}

export const AppRouter = () => {

    
    const { isLoggedIn } = useAuth();
    const location = useLocation();

    const renderRouteElement = (route: AppRouteProps) => {
        if (route.auth && !isLoggedIn) {
            return (
                <Navigate 
                    to={getRouteAuth()}
                    state={{from: location}}
                    replace
                />
            )
        }

        return route.page
    }

    return (
        <Suspense>
            <Routes>
                {(Object.values(routeConfig) as AppRouteProps[]).map((route) => (
                    <Route 
                        key={route.path}  
                        path={route.path}
                        element={renderRouteElement(route)} 
                    />
                ))}
            </Routes>
        </Suspense>
    )
}

