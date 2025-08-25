import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Tabs, Tab, CircularProgress, IconButton, Tooltip,
  Chip,Typography, Card,CardContent,List,ListItem, ListItemText, Box, Divider
} from '@mui/material';
import { FaPlus, FaTrash, FaLock, FaUnlock } from 'react-icons/fa';
import { useEffect, useMemo, useState } from 'react';
import Modal from '../../components/modal';
import ConfirmAction from '../../components/confirmAction'; // 👈 tu modal de confirmar
import api from '../../utils/axios';
import UsuarioForm, { type RegisterPayload } from './UserAddModal';
import { showNotification } from '../../utils/showNotification';
import axios from 'axios';

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
  bloqueado?: boolean;
  is_bloqueado?: boolean;
  estado?: string;
  created_at?: string;
  updated_at?: string;
};

type ApiListResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};


async function deleteUsuarioAPI(id: number) {
  try {
    const token = localStorage.getItem('authToken');
    console.log('token', token?.slice(0, 12)); // debug
    const res = await api.patch(`/users/${id}/eliminar`, null, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
    throw new Error('Ocurrió un error inesperado');
  }
}

async function toggleBloqueadoAPI(id: number) {
  const token = localStorage.getItem('authToken');
  return api.patch(`/users/${id}/toggle-bloqueado`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });
}

// -------------------- Hooks de datos --------------------
 function useRoles() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('authToken');
      setLoading(true);
      setError(null);
      const resp = await api.get<ApiListResponse<Rol[]>>('/getRol', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

      setRoles(resp.data.data ?? []);
    } catch (err: any) {
      console.error('Error /getRol', err?.response?.data || err);
      setError(err?.response?.data?.message || 'No se pudieron cargar los roles');
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);
  return { roles, loading, error };
}

function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem('authToken');
      setLoading(true);
      setError(null);
      const resp = await api.get<ApiListResponse<Usuario[]>>('/getUsuarios',{ headers: {
        Authorization: `Bearer ${token}`,
      },
    });
      setUsuarios(resp.data.data ?? []);
    } catch (err: any) {
      console.error('Error /getUsuarios', err?.response?.data || err);
      setError(err?.response?.data?.message || 'No se pudieron cargar los usuarios');
      setUsuarios([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsuarios(); }, []);
  return { usuarios, loading, error, refreshUsuarios: fetchUsuarios };
}

export default function UsuariosView() {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  type TabKey = 'usuarios' | 'roles' | 'backups';
  const [tab, setTab] = useState<TabKey>('usuarios');
  const tabIndex = tab === 'usuarios' ? 0 : tab === 'roles' ? 1 : 2;

  const { usuarios, loading: loadingUsuarios, error: errorUsuarios, refreshUsuarios } = useUsuarios();
  const { roles, loading: loadingRoles, error: errorRoles } = useRoles();

  // Acciones (delete/toggle)
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });

  const roleMap = useMemo(() => {
    const m = new Map<number, string>();
    roles.forEach(r => m.set(r.id, r.nombre_rol));
    return m;
  }, [roles]);

  const handleAddUser = async (payload: RegisterPayload) => {
    const token = localStorage.getItem('authToken');
    await api.post('/register', payload,             {
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                }
            })
    await refreshUsuarios();
    setIsOpenAdd(false);
  };
  const handleOpenAdd = () => setIsOpenAdd(true);

const isUsuarioBloqueado = (u: Usuario) => Number(u.bloqueado) === 1;

  // Acciones
  const askDelete = (id: number) => setConfirm({ open: true, id });
  const cancelDelete = () => setIsOpenDelete(false);

  const confirmDelete = async () => {
    if (confirm.id == null) return;
    setLoadingId(confirm.id);
    try {
      await deleteUsuarioAPI(confirm.id);
      showNotification('success', 'Usuario Eliminado Correctamente')
      await refreshUsuarios();
      setIsOpenDelete(false)
    } catch (e: any) {
      console.error('Error al eliminar usuario', e?.response?.data || e);
    } finally {
      setLoadingId(null);
      setConfirm({ open: false, id: null });
    }
  };

  const onToggleBloqueado = async (id: number) => {
    setLoadingId(id);
    try {
      const { data } = await toggleBloqueadoAPI(id);
      const blocked = data?.bloqueado ?? data?.is_bloqueado ?? null;
      console.log(blocked ? 'Usuario bloqueado' : 'Usuario desbloqueado');
      await refreshUsuarios();
    } catch (e: any) {
      console.error('Error al cambiar estado', e?.response?.data || e);
    } finally {
      setLoadingId(null);
    }
  };

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
          value={tabIndex}
          onChange={(_, v) => setTab(v === 0 ? 'usuarios' : v === 1 ? 'roles' : 'backups')}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Usuarios" />
          <Tab label="Roles" />
          <Tab label="Backups" />
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
                      <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }}>Estado</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', padding: '12px 16px' }} align="right">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usuarios.map((u) => {
                      const blocked = isUsuarioBloqueado(u);
                      const busy = loadingId === u.id_usuario;
                      return (
                        <TableRow key={u.id_usuario}>
                          <TableCell sx={{ padding: '8px 16px' }}>
                            {u.nombre} {u.apellido}
                          </TableCell>
                          <TableCell sx={{ padding: '8px 16px' }}>{u.nombre_usuario}</TableCell>
                          <TableCell sx={{ padding: '8px 16px' }}>{u.email}</TableCell>
                          <TableCell sx={{ padding: '8px 16px' }}>
                            {roleMap.get(u.id_rol) ?? `Rol #${u.id_rol}`}
                          </TableCell>
                          <TableCell sx={{ padding: '8px 16px' }}>
                            <Chip
                              label={isUsuarioBloqueado(u) ? 'Bloqueado' : 'Activo'}
                              size="small"
                              sx={{
                                bgcolor: isUsuarioBloqueado(u) ? 'error.main' : 'success.main',
                                color: 'common.white',
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ padding: '8px 16px' }} align="right">
                            {/* Bloquear / Desbloquear */}
                            <Tooltip title={blocked ? 'Desbloquear' : 'Bloquear'}>
                              <span>
                                <IconButton
                                  size="small"
                                  onClick={() => onToggleBloqueado(u.id_usuario)}
                                  disabled={busy}
                                >
                                  {blocked ? <FaUnlock /> : <FaLock />}
                                </IconButton>
                              </span>
                            </Tooltip>

                            {/* Eliminar */}
                            <Tooltip title="Eliminar">
                              <span>
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => {askDelete(u.id_usuario) 
                                                  setIsOpenDelete(true);
                                  }}
                                  disabled={busy}
                                >
                                  <FaTrash />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {usuarios.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} sx={{ padding: '16px', textAlign: 'center', color: 'text.secondary' }}>
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

        {tab === 'backups' && (
        <Card variant="outlined" sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Copia de seguridad automática de la base de datos
            </Typography>

            <Box mb={2}>
              <Chip label="Frecuencia: Semanal" sx={{ mr: 1 }} />
              <Chip label="Día y hora: Lunes 22:00" sx={{ mr: 1 }} />
              <Chip label="Ubicación: C:\\backups_sql" sx={{ mr: 1 }} />
              <Chip label="Formato: .bak" />
            </Box>

            <Typography variant="subtitle1" gutterBottom>
              ¿Cómo funciona?
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Programación"
                  secondary="Cada lunes a las 22:00 se ejecuta el proceso automático de backup."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Destino"
                  secondary="El archivo se guarda en C:\backups_sql con extensión .bak."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Alcance"
                  secondary="Es un backup completo de la base de datos (Full)."
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              Consejos rápidos
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText
                  primary="Espacio en disco"
                  secondary="Verificá que C: tenga espacio suficiente antes del lunes a las 22:00."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Permisos"
                  secondary="Asegurate de que el usuario del servicio de SQL/Job tenga permiso de escritura en C:\backups_sql."
                />
              </ListItem>
            </List>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" gutterBottom>
              ¿Cómo restaurar la base desde un .bak? (SQL Server)
            </Typography>

            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', p: 1, bgcolor: 'action.hover', borderRadius: 1 }}>
{`-- 1) Opcional: ver los archivos lógicos dentro del .bak
RESTORE FILELISTONLY
FROM DISK = 'C:\\backups_sql\\MiBase_YYYYMMDD.bak';

-- 2) Restaurar (ajustá nombres de DB y rutas MDF/LDF)
RESTORE DATABASE MiBase
FROM DISK = 'C:\\backups_sql\\MiBase_YYYYMMDD.bak'
WITH
  MOVE 'MiBase_Data' TO 'C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\DATA\\MiBase.mdf',
  MOVE 'MiBase_Log'  TO 'C:\\Program Files\\Microsoft SQL Server\\MSSQL16.MSSQLSERVER\\MSSQL\\DATA\\MiBase_log.ldf',
  REPLACE,    -- ¡Cuidado! Sobrescribe si ya existe
  RECOVERY;   -- Deja la DB operativa`}
            </Typography>

            <Typography variant="body2" sx={{ mt: 1 }}>
              Alternativa por GUI (SSMS): <em>Object Explorer → Databases (botón derecho) → Restore Database…</em> &rarr; <em>Device</em> &rarr; seleccioná el <code>.bak</code> &rarr; en <em>Files</em> ajustá las rutas si hace falta &rarr; <em>OK</em>.
            </Typography>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Nota: Si el nombre de la base o los archivos lógicos difieren, usá <code>RESTORE FILELISTONLY</code> para obtener los nombres correctos y actualizá las cláusulas <code>MOVE</code>.
            </Typography>
          </CardContent>
        </Card>
      )}

      <Modal isOpen={isOpenAdd} onClose={() => setIsOpenAdd(false)}>
        <UsuarioForm onSubmit={handleAddUser} roles={roles} />
      </Modal>

      {isOpenDelete &&(
        <ConfirmAction
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
