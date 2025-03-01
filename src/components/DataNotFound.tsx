import { AlertCircle } from "lucide-react";

const DataNotFound = ({ message }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-80 p-6 text-center space-y-4 bg-white border border-gray-200 rounded-lg">
      <AlertCircle className="w-12 h-12 text-gray-400" />
      <h1 className="text-xl font-semibold text-gray-700">
        {message || "No Data Found"}
      </h1>
      <p className="text-gray-500">
        There’s nothing to display here right now. Try refreshing or check back later.
      </p>
    </div>
  );
};

export default DataNotFound;
