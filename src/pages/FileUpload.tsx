import { useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { uploadFile } from "@/api/upload.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState(""); // User-inputted file name
  const navigate = useNavigate();

  const handleFileUpload = async () => {
    if (!file) {
      toast.error("Please select a file first!");
      return;
    }

    if (!fileName.trim()) {
      toast.error("Please enter a name for the file.");
      return;
    }

    setUploading(true);

    try {
      const result = await uploadFile(file, "pdf", fileName.trim());

      if (result?.status) {
        toast.success("File uploaded successfully!");
        setFile(null);
        setFileName("");
        navigate(`editor/${result?.data?.id}`);
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload file. Please try again.");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelection = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const selectedFile = e.target.files[0];

    if (selectedFile.type !== "application/pdf") {
      toast.error("Only PDF files are allowed!");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name.replace(".pdf", "")); // Default file name
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName("");
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md p-8">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-gray-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Upload a PDF to get started
          </h2>
          <p className="text-zinc-600 mb-6">
            Upload a PDF document, name it, and assign recipients.
          </p>

          {/* File Input OR Selected File Preview */}
          {!file ? (
            // Show file selection button if no file is selected
            <label className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-md cursor-pointer transition-colors inline-flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Select PDF
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelection}
                className="hidden"
              />
            </label>
          ) : (
            // Show selected file preview (icon + name)
            <div className="flex items-center justify-between bg-gray-200 px-4 py-2 rounded-md">
              <div className="flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-600" />
                <span className="text-gray-800">{file.name}</span>
              </div>
              <button onClick={handleRemoveFile}>
                <X className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          )}

          {/* File Name Input */}
          {file && (
            <div className="mt-4">
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 w-full text-center"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
          )}

          {/* Upload Button */}
          {file && (
            <button
              onClick={handleFileUpload}
              disabled={uploading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md mt-4 transition-colors disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
