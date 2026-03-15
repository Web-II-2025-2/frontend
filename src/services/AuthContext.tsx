import React, { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from './api';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

type RoleType = 'GUEST' | 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

interface User {
  name: string;
  role: RoleType;
}

interface MyJwtPayload extends JwtPayload {
  sub: string;
  role: RoleType;
}

interface AuthContextData {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    setIsAuthenticated(false);
    delete api.defaults.headers.common['Authorization'];
  };

  const fetchUserData = async (role: RoleType): Promise<User> => {
    const endpoint = role === 'GUEST' ? '/api/guest' : '/api/employee';
    
    const { data } = await api.get<User>(endpoint);
    return data;
  };

  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const decoded = jwtDecode<MyJwtPayload>(token);
          
          const userData = await fetchUserData(decoded.role);
          userData.role = decoded.role;
          
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Erro na autenticação:", error);
          logout();
        }
      }
      setIsLoading(false);
    };
    loadUserFromToken();
  }, []);

  const login = async (token: string) => {
    try {
      Cookies.set('token', token, { secure: false, sameSite: 'strict', expires: 1 });
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const decoded = jwtDecode<MyJwtPayload>(token);
      const userData = await fetchUserData(decoded.role);
      
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      logout();
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);