import { Link } from "react-router-dom";

const Unauthorised = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center p-6 max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        <h1 className="text-4xl font-bold text-red-600 dark:text-red-500">🚫 Access Denied</h1>
        <p className="text-gray-700 dark:text-gray-300 mt-2">
          You do not have permission to view this page.
        </p>
        <div className="mt-4">
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

export default Unauthorised;
