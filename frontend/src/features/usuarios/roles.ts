// src/auth/roles.ts
export const ROLES = { ADMIN: 1, SECRETARIO: 2, EMPLEADO: 3 } as const;
export type RoleId = (typeof ROLES)[keyof typeof ROLES];

export function roleNameFromId(id?: number) {
  switch (Number(id)) {
    case ROLES.ADMIN: return 'admin';
    case ROLES.SECRETARIO: return 'secretario';
    case ROLES.EMPLEADO: return 'empleado';
    default: return 'desconocido';
  }
}
