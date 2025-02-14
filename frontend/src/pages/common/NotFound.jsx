import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-6 max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-200">404</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">Oops! Page not found.</p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="px-4 py-2 text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
