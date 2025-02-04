import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background"> {/* bg-background from shadcn theme */}
      <div className="bg-card p-12 rounded-lg shadow-md text-center max-w-md"> {/* bg-card from shadcn theme */}
        <h1 className="text-5xl font-bold text-primary mb-4">404</h1> {/* text-primary from shadcn theme */}
        <p className="text-lg text-muted-foreground mb-6"> {/* text-muted-foreground from shadcn theme */}
          Oops! The page you're looking for doesn't exist.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-300"
          >
            Go Home
          </Link>
         
        </div>
      </div>
    </div>
  );
};

export default NotFound;