import { useState, useMemo, type ReactNode } from 'react';
import { AuthContext } from './auth-context';

export interface UserData {
    username: string;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserData | null>(() => {
        const savedUser = localStorage.getItem('authUser');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const isLoggedIn = Boolean(user);

    const login = (userData: UserData) => {
        setUser(userData);
        localStorage.setItem('authUser', JSON.stringify(userData));
    };

    const logout = () => {
        localStorage.removeItem('authUser');
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
