import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-8 border-b-8 border-indigo-600 animate-spin"></div>
        <div className="absolute top-0 left-0 h-24 w-24 rounded-full border-t-8 border-b-8 border-indigo-300 animate-spin" style={{ animationDirection: 'reverse', opacity: 0.5 }}></div>
      </div>
      <p className="ml-4 text-xl font-medium text-gray-700">Loading...</p>
    </div>
  );
};

export default Loader; 