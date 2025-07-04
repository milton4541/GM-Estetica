import React from "react";
type modalProps = {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
}

const Modal: React.FC<modalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div
            aria-hidden={!isOpen}
            tabIndex={-1}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
        >
            <div className="relative bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <button
                    type="button"
                    className="z-50 absolute top-2 right-2 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={onClose} // Cierra el modal
                >
                    <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                    </svg>
                    <span className="sr-only">Cerrar modal</span>
                </button>
                {children}
            </div>
        </div>
    
    )
}
export default Modal;