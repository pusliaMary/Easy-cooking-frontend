import { createContext } from 'react';

import { type userData } from './AuthProvider'

export interface AuthContextType {
    isLoggedIn: boolean;
    user: userData | null;
    login: (userData: userData, token?: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

