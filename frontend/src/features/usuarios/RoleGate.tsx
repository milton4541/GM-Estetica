import { useAuth } from "./AuthContext";
import type { RoleId } from './roles';

export default function RoleGate({ roles, children }: { roles: RoleId[]; children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return null;
  return roles.includes(user.id_rol) ? <>{children}</> : null;
}
