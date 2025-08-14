// src/usuarios/UsuarioForm.tsx
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Select from 'react-select';
import LoadingSpinner from '../../components/LoadingSpinner';

// Tipos
export type Rol = { id: number; nombre_rol: string };

export type RegisterPayload = {
  nombre: string;
  apellido: string;
  nombre_usuario: string;
  id_rol: number | null;            // puede ser null
  email: string;
  password: string;
  password_confirmation: string;    // requerido por "confirmed"
};

type UsuarioFormProps = {
  onSubmit: (payload: RegisterPayload) => Promise<void>;
  roles: Rol[];
};

const UsuarioForm: React.FC<UsuarioFormProps> = ({ onSubmit, roles }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
    watch,
  } = useForm<RegisterPayload>({
    defaultValues: {
      nombre: '',
      apellido: '',
      nombre_usuario: '',
      id_rol: null,
      email: '',
      password: '',
      password_confirmation: '',
    },
  });

  const [loading, setLoading] = useState(false);

  const onFormSubmit = async (data: RegisterPayload) => {
    setLoading(true);
    try {
      await onSubmit(data);
      reset();
    } catch (err: any) {
      // Mapear errores 422 del backend a los campos
      const fieldErrors = err?.response?.data?.errors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        Object.entries(fieldErrors).forEach(([field, msgs]) => {
          const text = Array.isArray(msgs) ? msgs[0] : String(msgs);
          setError(field as keyof RegisterPayload, { type: 'server', message: text });
        });
      } else {
        // error general
        setError('nombre', { type: 'server', message: 'No se pudo registrar el usuario.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordValue = watch('password');

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Agregar Usuario</h3>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-4">
        <div className="grid gap-4 mb-4 grid-cols-1 md:grid-cols-2">
          {/* Nombre */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Nombre</label>
            <input
              type="text"
              {...register('nombre', { required: 'Nombre obligatorio' })}
              className={`bg-gray-50 border ${errors.nombre ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Nombre"
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          {/* Apellido */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Apellido</label>
            <input
              type="text"
              {...register('apellido', { required: 'Apellido obligatorio' })}
              className={`bg-gray-50 border ${errors.apellido ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Apellido"
            />
            {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>}
          </div>

          {/* Usuario */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Nombre de usuario</label>
            <input
              type="text"
              {...register('nombre_usuario', {
                required: 'Usuario obligatorio',
                maxLength: { value: 144, message: 'Máximo 144 caracteres' },
              })}
              className={`bg-gray-50 border ${errors.nombre_usuario ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="usuario123"
            />
            {errors.nombre_usuario && <p className="text-red-500 text-sm mt-1">{errors.nombre_usuario.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <input
              type="email"
              {...register('email', {
                required: 'Email obligatorio',
                pattern: { value: /\S+@\S+\.\S+/, message: 'Formato de email inválido' },
              })}
              className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="correo@dominio.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 text-sm font-medium text-gray-900">Rol</label>
            <Controller
              name="id_rol"
              control={control}
              render={({ field }) => (
                <Select
                  placeholder="Seleccione un rol "
                  isClearable
                  options={roles}
                  getOptionLabel={(r: Rol) => r.nombre_rol}
                  getOptionValue={(r: Rol) => String(r.id)}
                  value={roles.find(r => r.id === field.value) ?? null}
                  onChange={(opt) => field.onChange(opt ? Number((opt as Rol).id) : null)}
                  classNamePrefix="react-select"
                  //   required: 'Usuario obligatorio',
                />
              )}
            />
            {errors.id_rol && <p className="text-red-500 text-sm mt-1">{errors.id_rol.message as string}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Contraseña</label>
            <input
              type="password"
              {...register('password', {
                required: 'Contraseña obligatoria',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              })}
              className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="********"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Confirmación */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Confirmar contraseña</label>
            <input
              type="password"
              {...register('password_confirmation', {
                required: 'Confirmación obligatoria',
                validate: (v) => v === passwordValue || 'Las contraseñas no coinciden',
              })}
              className={`bg-gray-50 border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="********"
            />
            {errors.password_confirmation && (
              <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
            )}
          </div>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="inline-flex items-center px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Agregar Usuario'}
        </button>
      </form>
    </div>
  );
};

export default UsuarioForm;
