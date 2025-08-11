// src/auth/RequireRole.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { RoleId } from './roles';

type Props = { roles: RoleId[]; children: React.ReactNode };

export default function RequireRole({ roles, children }: Props) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;

  const role = Number(user?.id_rol ?? user?.role_id) as RoleId | undefined;
  if (!role || !roles.includes(role)) return <Navigate to="/403" replace />;

  return <>{children}</>;
}
