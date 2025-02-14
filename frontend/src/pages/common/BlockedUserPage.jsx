import React from 'react'
import { Link } from "react-router-dom";

const BlockedUserPage = () => {
  return (
    <div className="flex flex-col items-center justify-center bg-muted  md:p-10">
    <div className="flex flex-col items-center justify-center h-full w-full my-16 ">
      <div className="text-center p-6 max-w-md bg-background shadow-lg rounded-2xl">
        <h1 className="text-3xl font-bold text-red-500">🚫 Account Blocked</h1>
        <p className="text-foreground mt-2">
          Your account has been blocked. Please contact support for assistance.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
    </div>
  );
}

export default BlockedUserPage