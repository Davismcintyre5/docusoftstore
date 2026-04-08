import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="spinner"></div>
      <p className="mt-4 text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
};

export default LoadingSpinner;