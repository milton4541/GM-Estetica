import React from 'react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
}

const Options: React.FC<MenuItemProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-2 p-2">
      {/* Contenedor para el icono con ancho fijo */}
      <div className="w-6 flex-shrink-0 flex justify-center items-center">
        {icon}
      </div>
      {/* Contenedor para el texto */}
      <span className="leading-none">{label}</span>
    </div>
  );
};

export default Options;