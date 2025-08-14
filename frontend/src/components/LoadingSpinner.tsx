import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-4">
      <div 
        className="
          h-8 w-8 rounded-full border-4 border-t-4 border-solid border-gray-200 
          border-t-blue-500 animate-spin
        "
      ></div>
    </div>
  );
};

export default LoadingSpinner;