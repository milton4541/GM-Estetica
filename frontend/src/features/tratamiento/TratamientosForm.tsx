import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import type { Tratamiento } from "./types/tratamiento";
import type { insumoWithId } from "../insumo/types/insumo";

interface TratamientoFormProps {
  onSubmit: (tratamiento: Tratamiento) => void;
  insumos: insumoWithId[];                  // lista de insumos disponibles
}

// Aprovechamos exactamente tu tipo Tratamiento (incluye insumos: Insumo[])
type TratamientoFormValues = Tratamiento;

const TratamientoForm: React.FC<TratamientoFormProps> = ({
  onSubmit,
  insumos: availableInsumos,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TratamientoFormValues>({
    defaultValues: { descripcion: "", duracion: 0, precio: 0, insumo: [] },
  });

  const onFormSubmit = (data: TratamientoFormValues) => {
    // conviertes strings a number si hiciera falta, aunque aquí ya los manejas como number
    onSubmit(data);
    reset();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Agregar Tratamiento</h3>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="p-4">
        <div className="grid gap-4 mb-4 grid-cols-2">
 <div className="col-span-2">
            <label htmlFor="descripcion" className="block mb-2 text-sm font-medium text-gray-900">
              Descripción
            </label>
            <input
              type="text"
              {...register("descripcion", { required: "Descripción obligatoria" })}
              className={`bg-gray-50 border ${
                errors.descripcion ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="Descripción del tratamiento"
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Duración */}
          <div>
            <label htmlFor="duracion" className="block mb-2 text-sm font-medium text-gray-900">
              Duración (min)
            </label>
            <input
              type="number"
              {...register("duracion", {
                required: "Duración obligatoria",
                min: { value: 1, message: "Debe ser al menos 1 minuto" },
              })}
              className={`bg-gray-50 border ${
                errors.duracion ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="0"
            />
            {errors.duracion && (
              <p className="text-red-500 text-sm mt-1">{errors.duracion.message}</p>
            )}
          </div>

          {/* Precio */}
          <div>
            <label htmlFor="precio" className="block mb-2 text-sm font-medium text-gray-900">
              Precio ($)
            </label>
            <input
              type="number"
              step="0.01"
              {...register("precio", {
                required: "Precio obligatorio",
                min: { value: 0, message: "Debe ser mayor o igual a 0" },
              })}
              className={`bg-gray-50 border ${
                errors.precio ? "border-red-500" : "border-gray-300"
              } text-gray-900 text-sm rounded-lg block w-full p-2.5`}
              placeholder="0.00"
            />
            {errors.precio && (
              <p className="text-red-500 text-sm mt-1">{errors.precio.message}</p>
            )}
          </div>        </div>

        {/* ————— Select múltiple con react-select ————— */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Insumos</label>
          <Controller
            name="insumo"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                isMulti
                options={availableInsumos}
                getOptionLabel={(i: insumoWithId) => i.nombre}
                getOptionValue={(i) => i.id_insumo.toString()}
                classNamePrefix="react-select"
                placeholder="Selecciona uno o más insumos..."
              />
            )}
          />
          {errors.insumo && (
            <p className="text-red-500 text-sm mt-1">
              {errors.insumo.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="inline-flex items-center px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-medium"
        >
          {/* ícono + texto */}
          <svg className="me-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Agregar Tratamiento
        </button>
      </form>
    </div>
  );
};

export default TratamientoForm;
