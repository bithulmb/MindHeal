
import React from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center bg-background text-foreground">
      <h2 className="text-3xl font-bold text-red-600">Something went wrong!</h2>
      <p className="my-4 text-lg">{error.message}</p>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 mt-2 text-white bg-red-500 rounded hover:bg-red-600"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorFallback;
