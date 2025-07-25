import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import type { TratamientoWithId } from "./types/tratamiento";
import type { insumoWithId } from "../insumo/types/insumo";
import { getInsumoTratamientoApi } from "./apiTratamientoInsumo/getTratInsumoById";

interface TratamientoEditFormProps {
  onSubmit: (updatedTratamiento: TratamientoWithId) => void;
  insumos: insumoWithId[];       // lista completa de insumos disponibles
  tratamiento: TratamientoWithId; // tratamiento a editar
}

type FormValues = Omit<TratamientoWithId, "id_tratamiento">;

const TratamientoEditForm: React.FC<TratamientoEditFormProps> = ({
  onSubmit,
  insumos: availableInsumos,
  tratamiento,
}) => {
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      descripcion: "",
      duracion: 0,
      precio: 0,
      insumo: [],
    },
  });

useEffect(() => {
  getInsumoTratamientoApi(tratamiento.id_tratamiento)
    .then(detalles => {
      // `detalles` es tu array de objetos { id_insumo, cantidad, … }
      const insumosPre = detalles
        .map(d => {
          // buscamos en `availableInsumos` el objeto completo
          const ins = availableInsumos.find(i => i.id_insumo === d.id_insumo);
          return ins ? { ...ins, cantidad: d.cantidad } : null;
        })
        .filter((i): i is insumoWithId => i !== null);

      reset({
        descripcion: tratamiento.descripcion,
        duracion:    tratamiento.duracion,
        precio:      tratamiento.precio,
        insumo:      insumosPre,   // aquí puebla el select
      });
    })
    .finally(() => setLoading(false));
}, [tratamiento.id_tratamiento, availableInsumos, reset]);


  const onFormSubmit = (data: FormValues) => {
    onSubmit({
      ...data,
      id_tratamiento: tratamiento.id_tratamiento,
    });
  };

  if (loading) return <div>Cargando insumos...</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Editar Tratamiento</h3>
      </div>
      <form onSubmit={handleSubmit(onFormSubmit)} className="p-4">
        {/* Descripción */}
        <div className="mb-4">
          <label htmlFor="descripcion" className="block mb-2 text-sm font-medium">Descripción</label>
          <input
            type="text"
            {...register("descripcion", { required: "Descripción obligatoria" })}
            className={`bg-gray-50 border ${errors.descripcion ? "border-red-500" : "border-gray-300"} rounded-lg p-2.5 w-full`}
          />
          {errors.descripcion && <p className="text-red-500 text-sm mt-1">{errors.descripcion.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Duración */}
          <div>
            <label htmlFor="duracion" className="block mb-2 text-sm font-medium">Duración (min)</label>
            <input
              type="number"
              {...register("duracion", { required: "Duración obligatoria", min: { value: 1, message: "Mínimo 1 minuto" } })}
              className={`bg-gray-50 border ${errors.duracion ? "border-red-500" : "border-gray-300"} rounded-lg p-2.5 w-full`}
            />
            {errors.duracion && <p className="text-red-500 text-sm mt-1">{errors.duracion.message}</p>}
          </div>
          {/* Precio */}
          <div>
            <label htmlFor="precio" className="block mb-2 text-sm font-medium">Precio ($)</label>
            <input
              type="number"
              step="0.01"
              {...register("precio", { required: "Precio obligatorio", min: { value: 0, message: "Debe ser ≥ 0" } })}
              className={`bg-gray-50 border ${errors.precio ? "border-red-500" : "border-gray-300"} rounded-lg p-2.5 w-full`}
            />
            {errors.precio && <p className="text-red-500 text-sm mt-1">{errors.precio.message}</p>}
          </div>
        </div>

        {/* Select múltiple con valores pre­seleccionados */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">Insumos</label>
          <Controller
            name="insumo"
            control={control}
            render={({ field }) => {
              const selectedOptions = availableInsumos.filter(opt =>
                field.value.some(v => v.id_insumo === opt.id_insumo)
              );
              return (
                <Select
                  options={availableInsumos}
                  getOptionLabel={i => i.nombre}
                  getOptionValue={i => i.id_insumo.toString()}
                  isMulti
                  value={selectedOptions}
                  onChange={opts => field.onChange(opts)}
                  classNamePrefix="react-select"
                />
              );
            }}
          />
          {errors.insumo && <p className="text-red-500 text-sm mt-1">{errors.insumo.message}</p>}
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default TratamientoEditForm;
