import React from 'react';



export const LoadingSpinner = () => {
  return (
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" mx-auto></div>
  );
};

const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center space-y-4">
        <LoadingSpinner/>
        <p className="text-lg font-medium text-gray-700">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingPage;