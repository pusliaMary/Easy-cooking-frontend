import AuthPage from '@/pages/AuthPage'
import MainPage from '@/pages/MainPage'
import AdminPage from '@/pages/AdminPage'
import { getRouteMain, getRouteAuth, getRouteAdmin } from '@/shared'

export interface routeConfig {
    path: string;
    page: React.JSX.Element;
    authOnly: boolean;
}

export const routeConfig = {
    main: {
        path: getRouteMain(),
        page: <MainPage/>,
        auth: false
    },

    auth: {
        path: getRouteAuth(),
        page: <AuthPage />,
        auth: false
    },

    admin: {
        path: getRouteAdmin(),
        page: <AdminPage />,
        authOnly: true,
    },
}