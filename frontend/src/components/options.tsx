import React from 'react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
}

const Options: React.FC<MenuItemProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded-md">
      {icon}
      <span className="ml-2">{label}</span>
    </div>
  );
};

export default Options;