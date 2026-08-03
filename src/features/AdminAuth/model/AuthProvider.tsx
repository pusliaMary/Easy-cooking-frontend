import { useState, useMemo, type ReactNode } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from './auth-context';

export interface userData {
    id: string,
    email: string,
    userName: string
}

interface AuthProviderProps {
    children: ReactNode;
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoggedIn, setIsLoggedIn] = useState(() =>
        Boolean(Cookies.get('authToken'))
    );
    const [user, setUser] = useState<userData | null>(null)

    const login = (userData: userData, token?: string) => {
        if (token) {
            Cookies.set('authToken', token, { expires: 7 });
        }
        setIsLoggedIn(true);
        setUser(userData);
    }

    const logout = () => {
        Cookies.remove('authToken');
        setIsLoggedIn(false);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            isLoggedIn,
            user,
            login,
            logout,
        }),
        [isLoggedIn, user]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};