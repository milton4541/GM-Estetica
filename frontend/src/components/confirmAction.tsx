interface ConfirmActionProps {

    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmAction = ({ onConfirm, onCancel }: ConfirmActionProps) => {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            {/* Contenedor del modal */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-96 animate-fadeIn">
                {/* Botón de cerrar */}
                <button
                    onClick={onCancel}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    &times;
                </button>

                {/* Título */}
                <h2 className="text-xl font-semibold text-gray-800 text-center">
                    ¿Estás seguro?
                </h2>

                {/* Mensaje */}
                <p className="text-gray-600 text-center mt-2">
                    Esta acción no se puede deshacer. ¿Deseas continuar?
                </p>

                {/* Botones */}
                <div className="flex justify-center space-x-4 mt-4">
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        onClick={onConfirm}
                    >
                        Aceptar
                    </button>
                    <button
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                        onClick={onCancel}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmAction;