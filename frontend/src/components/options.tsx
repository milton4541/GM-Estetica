import React from 'react';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
}

const Options: React.FC<MenuItemProps> = ({ icon, label }) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="leading-none">{label}</span>
    </div>
  );
};

export default Options;