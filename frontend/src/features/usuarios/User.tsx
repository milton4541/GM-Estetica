import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
 Tabs, Tab, CircularProgress
} from '@mui/material';
import { FaPlus } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../components/modal';
import api from '../../utils/axios';
import UsuarioForm, { type RegisterPayload } from './UserAddModal';
// -------------------- Tipos --------------------
type Rol = {
  id: number;
  nombre_rol: string;
};

type Usuario = {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  nombre_usuario: string;
  id_rol: number;
  created_at?: string;
  updated_at?: string;
};
type ApiListResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const authHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};


// -------------------- Hooks de datos --------------------
export function useRoles() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);

      const resp = await api.get<ApiListResponse<Rol[]>>('/getRol', {
        headers: authHeaders(),
      });
      console.log('API /getRol ->', resp.data);

      setRoles(resp.data.data ?? []);
    } catch (err: any) {
      console.error('Error /getRol', err?.response?.data || err);
      setError(err?.response?.data?.message || 'No se pudieron cargar los roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return { roles, loading, error };
}

function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
  try {
    setLoading(true);
    setError(null);

    const resp = await api.get<ApiListResponse<Usuario[]>>('/getUsuarios', { headers: authHeaders() });
    console.log('API /getUsuarios ->', resp.data); // <-- log de la respuesta real

    setUsuarios(resp.data.data ?? []);             // <-- usar el array
  } catch (err: any) {
    console.error('Error /getUsuarios', err?.response?.data || err);
    setError(err?.response?.data?.message || 'No se pudieron cargar los usuarios');
    setUsuarios([]); // evita quedar con shape inválido
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return { usuarios, loading, error, refreshUsuarios: fetchUsuarios };
}

export default function UsuariosView() {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [tab, setTab] = useState<'usuarios' | 'roles'>('usuarios');

  const { usuarios, loading: loadingUsuarios, error: errorUsuarios, refreshUsuarios } = useUsuarios();
  const { roles, loading: loadingRoles, error: errorRoles } = useRoles();

  const roleMap = useMemo(() => {
    const m = new Map<number, string>();
    roles.forEach(r => m.set(r.id, r.nombre_rol));
    return m;
  }, [roles]);

  const handleAddUser = async (payload: RegisterPayload) => {
  // Si usás token:
  const headers: any = {};
  const token = localStorage.getItem('authToken');
  if (token) headers.Authorization = `Bearer ${token}`;

  // POST /register  -> { message, user }
  await api.post('/register', payload, { headers });
  await refreshUsuarios();
  setIsOpenAdd(false);
};
  const handleOpenAdd = () => setIsOpenAdd(true);

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Usuarios & Roles</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
            >
              Agregar usuario <FaPlus />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-4">
          <Tabs
            value={tab === 'usuarios' ? 0 : 1}
            onChange={(_, v) => setTab(v === 0 ? 'usuarios' : 'roles')}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab label="Usuarios" />
            <Tab label="Roles" />
          </Tabs>
        </div>

        {/* Contenido Usuarios */}
        {tab === 'usuarios' && (
          <div>
            {loadingUsuarios ? (
              <div className="flex items-center gap-3 text-gray-600">
                <CircularProgress size={20} /> Cargando usuarios...
              </div>
            ) : errorUsuarios ? (
              <div className="text-red-600">{errorUsuarios}</div>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead className="bg-gray-50 uppercase">
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Nombre</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Usuario</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Rol</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usuarios.map((u) => (
                      <TableRow key={u.id_usuario}>
                        <TableCell sx={{ padding: '8px 16px' }}>
                          {u.nombre} {u.apellido}
                        </TableCell>
                        <TableCell sx={{ padding: '8px 16px' }}>{u.nombre_usuario}</TableCell>
                        <TableCell sx={{ padding: '8px 16px' }}>{u.email}</TableCell>
                        <TableCell sx={{ padding: '8px 16px' }}>
                          {roleMap.get(u.id_rol) ?? `Rol #${u.id_rol}`}
                        </TableCell>
                      </TableRow>
                    ))}
                    {usuarios.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} sx={{ padding: '16px', textAlign: 'center', color: 'text.secondary' }}>
                          No hay usuarios para mostrar.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        )}

        {/* Contenido Roles */}
        {tab === 'roles' && (
          <div>
            {loadingRoles ? (
              <div className="flex items-center gap-3 text-gray-600">
                <CircularProgress size={20} /> Cargando roles...
              </div>
            ) : errorRoles ? (
              <div className="text-red-600">{errorRoles}</div>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead className="bg-gray-50 uppercase">
                    <TableRow>
                      <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Nombre del Rol</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell sx={{ padding: '8px 16px' }}>{r.id}</TableCell>
                        <TableCell sx={{ padding: '8px 16px' }}>{r.nombre_rol}</TableCell>
                      </TableRow>
                    ))}
                    {roles.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={2} sx={{ padding: '16px', textAlign: 'center', color: 'text.secondary' }}>
                          No hay roles para mostrar.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </div>
        )}
      </div>

      {/* Modal Agregar Usuario (placeholder) */}
<Modal isOpen={isOpenAdd} onClose={() => setIsOpenAdd(false)}>
  <UsuarioForm onSubmit={handleAddUser} roles={roles} />
</Modal>
    </div>
  );
}
