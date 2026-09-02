import { useMemo, useCallback, type ReactNode } from 'react';
import { AuthContext } from './auth-context';
import { useLogoutAdminMutation, useCheckMeQuery } from '../api/authApi';

export interface UserData {
  username: string;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [logoutAdmin] = useLogoutAdminMutation();
  
  
  const { data: checkedUser, isLoading, isError, refetch } = useCheckMeQuery(undefined, {
    refetchOnMountOrArgChange: false, 
  });

  const user = isError ? null : (checkedUser || null);
  const isLoggedIn = Boolean(user?.username);

  
  const login = useCallback((userData: UserData) => {
    
    console.log(`Welcome back, ${userData.username}`); 
    refetch(); 
  }, [refetch]);

  const logout = useCallback(async () => {
    try {
      await logoutAdmin().unwrap();
    } catch (e) {
      console.error("Backend logout failed", e);
    }
  }, [logoutAdmin]);

  const value = useMemo(
    () => ({
      isLoggedIn,
      user,
      login,
      logout,
    }),
    [isLoggedIn, user, login, logout]
  );

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <span>Checking session...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
