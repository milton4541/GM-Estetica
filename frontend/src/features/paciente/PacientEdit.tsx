import { useForm } from "react-hook-form";
import type {PacientWithId } from "./types/pacient";

type PacientEditFormProps = {
  pacient: PacientWithId;
  onSubmit: (updated: PacientWithId) => void;
};

const PacientEditForm: React.FC<PacientEditFormProps> = ({ pacient, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PacientWithId>({ defaultValues: pacient });

  const onFormSubmit = (data: PacientWithId) => {
    onSubmit(data);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Editar Paciente</h3>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-4 md:p-5">
        <div className="grid gap-4 mb-4 grid-cols-2">
          {/* DNI */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="dni" className="block mb-2 text-sm font-medium text-gray-900">
              DNI
            </label>
            <input
              type="text"
              {...register("dni_paciente", {
                required: "DNI obligatorio",
                pattern: { value: /^\d{7,8}$/, message: "DNI inválido" }
              })}
              className={`bg-gray-50 border ${
                errors.dni_paciente ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
            />
            {errors.dni_paciente && (
              <p className="text-red-500 text-sm mt-1">{errors.dni_paciente.message}</p>
            )}
          </div>

          {/* Nombre */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="nombre" className="block mb-2 text-sm font-medium text-gray-900">
              Nombre
            </label>
            <input
              type="text"
              {...register("nombre", { required: "Nombre obligatorio" })}
              className={`bg-gray-50 border ${
                errors.nombre ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
            />
            {errors.nombre && <p className="text-red-500 text-sm mt-1">{errors.nombre.message}</p>}
          </div>

          {/* Apellido */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="apellido" className="block mb-2 text-sm font-medium text-gray-900">
              Apellido
            </label>
            <input
              type="text"
              {...register("apellido", { required: "Apellido obligatorio" })}
              className={`bg-gray-50 border ${
                errors.apellido ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
            />
            {errors.apellido && <p className="text-red-500 text-sm mt-1">{errors.apellido.message}</p>}
          </div>

          {/* Teléfono */}
          <div className="col-span-2 sm:col-span-1">
            <label htmlFor="telefono" className="block mb-2 text-sm font-medium text-gray-900">
              Teléfono
            </label>
            <input
              type="tel"
              {...register("telefono", {
                required: "Teléfono obligatorio",
                pattern: { value: /^\d{7,15}$/, message: "Teléfono inválido" }
              })}
              className={`bg-gray-50 border ${
                errors.telefono ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
            />
            {errors.telefono && <p className="text-red-500 text-sm mt-1">{errors.telefono.message}</p>}
          </div>

          {/* Email */}
          <div className="col-span-2">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email obligatorio",
                pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" }
              })}
              className={`bg-gray-50 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Obra Social */}
          <div className="col-span-2">
            <label htmlFor="obra_social" className="block mb-2 text-sm font-medium text-gray-900">
              Obra Social
            </label>
            <input
              type="text"
              {...register("obra_social", { required: "Campo obligatorio" })}
              className={`bg-gray-50 border ${
                errors.obra_social ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
            />
            {errors.obra_social && (
              <p className="text-red-500 text-sm mt-1">{errors.obra_social.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="text-white inline-flex items-center bg-green-600 hover:bg-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 00-1.414 0L9 11.586 6.707 9.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l7-7a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
          Actualizar Paciente
        </button>
      </form>
    </div>
  );
};

export default PacientEditForm;
