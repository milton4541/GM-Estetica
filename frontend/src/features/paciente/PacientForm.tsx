import { useForm } from "react-hook-form";
import type { Pacient } from "./types/pacient";

interface PacientFormProps {
  onSubmit: (pacient: Pacient) => void;
}

const PacientForm: React.FC<PacientFormProps> = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Pacient>();

  const onFormSubmit = (data: Pacient) => {
    onSubmit(data);
    reset();
  };

  return (
    <div className="relative bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Agregar Paciente</h3>
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
                pattern: { value: /^\d{7,8}$/, message: "DNI inválido" },
              })}
              className={`bg-gray-50 border ${
                errors.dni_paciente ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="12345678"
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
              placeholder="Mario"
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
              placeholder="Mendez"
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
                pattern: { value: /^\d{7,15}$/, message: "Teléfono inválido" },
              })}
              className={`bg-gray-50 border ${
                errors.telefono ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="3434655099"
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
                pattern: { value: /\S+@\S+\.\S+/, message: "Email inválido" },
              })}
              className={`bg-gray-50 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="paciente@example.com"
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
              placeholder="IOSPER, OSDE, etc."
            />
            {errors.obra_social && (
              <p className="text-red-500 text-sm mt-1">{errors.obra_social.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
          <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Agregar Paciente
        </button>
      </form>
    </div>
  );
};

export default PacientForm;
