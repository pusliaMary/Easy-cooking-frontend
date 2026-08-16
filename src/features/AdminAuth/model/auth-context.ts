import { createContext } from 'react';

import { type UserData } from './AuthProvider'

export interface AuthContextType {
    isLoggedIn: boolean;
    user: UserData | null;
    login: (userData: UserData, token?: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

