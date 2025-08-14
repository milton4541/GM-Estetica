// src/auth/AuthContext.tsx
import React from 'react';
import axios from 'axios';
import { roleNameFromId } from './roles';
import type { RoleId } from './roles';

const API_BASE =
  (import.meta as any)?.env?.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:8000/api';

type User = {
  id_usuario: number;
  nombre_usuario: string;
  email?: string;
  id_rol: 1 | 2 | 3;
  role_id?: 1 | 2 | 3;
};

type RegisterPayload = {
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  id_rol: RoleId;
  email: string;
  password: string;
  password_confirmation: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: any; // viene del backend
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  roleId: RoleId | null;
  roleName: string | null;
  register: (data: RegisterPayload) => Promise<void>;
  applyLoginResponse: (data: LoginResponse) => void; // 👈 nuevo
  logout: () => void;
  hasRole: (roles: RoleId[]) => boolean;
};

const AuthContext = React.createContext<AuthContextType | null>(null);

const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function normalizeUser(raw: any): User {
  const id_rol = Number(raw?.id_rol ?? raw?.role_id);
  return { ...raw, id_rol, role_id: id_rol };
}

function setSession(token?: string | null, user?: User | null) {
  if (token) localStorage.setItem('authToken', token);
  if (user) localStorage.setItem('authUser', JSON.stringify(user));
}

function getStoredUser(): User | null {
  const s = localStorage.getItem('authUser');
  return s ? (JSON.parse(s) as User) : null;
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(
    !!localStorage.getItem('authToken') && !!getStoredUser()
  );

  React.useEffect(() => {
    const storedUser = getStoredUser();
    setUser(storedUser);
    setIsAuthenticated(!!localStorage.getItem('authToken') && !!storedUser);
  }, []);

  const register = React.useCallback(async (payload: RegisterPayload) => {
    const r = await api.post('/register', payload);
    const token: string | undefined = r.data?.token || r.data?.access_token;
    const rawUser = r.data?.user;

    if (rawUser) {
      const u = normalizeUser(rawUser);
      setUser(u);
      setSession(token ?? null, u);
      setIsAuthenticated(!!token);
    } else {
      const u = normalizeUser({
        id_usuario: 0,
        nombre_usuario: payload.nombre_usuario,
        email: payload.email,
        id_rol: payload.id_rol,
      });
      setUser(u);
      if (token) setSession(token, u);
      else localStorage.setItem('authUser', JSON.stringify(u));
      setIsAuthenticated(!!token);
    }
  }, []);

  const applyLoginResponse = React.useCallback((data: LoginResponse) => {
    const token = data?.access_token;
    const rawUser = data?.user;
    if (!token || !rawUser) {
      console.error('Login response incompleta:', data);
      return;
    }
    const u = normalizeUser(rawUser);
    setSession(token, u);
    setUser(u);
    setIsAuthenticated(true);
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const roleId = ((user?.id_rol ?? user?.role_id) as RoleId | undefined) ?? null;
  const roleName = roleId ? roleNameFromId(roleId) : null;

  const hasRole = React.useCallback(
    (roles: RoleId[]) => {
      const r = Number(user?.id_rol ?? user?.role_id) as RoleId | undefined;
      return !!r && roles.includes(r);
    },
    [user]
  );

  const value: AuthContextType = {
    user,
    isAuthenticated,
    roleId,
    roleName,
    register,
    applyLoginResponse,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
