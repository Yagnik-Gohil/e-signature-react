import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <AlertTriangle className="mx-auto h-24 w-24 text-zinc-400" />
          <h1 className="text-4xl font-extrabold text-zinc-900">404</h1>
          <h2 className="mt-2 text-3xl font-bold text-zinc-900">
            Page not found
          </h2>
          <p className="mt-2 text-lg text-zinc-600">
            Oops! It seems like you've ventured into uncharted territory.
          </p>
        </div>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-zinc-600 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500 transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Link>
        </div>
        <div className="mt-6">
          <p className="text-sm text-zinc-500">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
