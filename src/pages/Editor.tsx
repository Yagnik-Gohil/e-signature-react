import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDocumentById } from "@/api/document.service";
import { IDocuments } from "@/types";
import { Loader2 } from "lucide-react";

const Editor = () => {
  const { id } = useParams<{ id: string }>(); // Get document ID from URL
  const [document, setDocument] = useState<IDocuments | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDocument = async () => {
      try {
        const response = await getDocumentById(id);
        if (response.status === 1) { // Check API success status
          setDocument(response.data);
        } else {
          console.error("Error fetching document:", response.message);
        }
      } catch (error) {
        console.error("Failed to fetch document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  // Construct full PDF URL
  const pdfUrl = document
    ? `${document.base_url}${document.root}${document.folder}${document.name}`
    : "";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {loading ? (
        <div className="flex items-center space-x-2 text-gray-600">
          <Loader2 className="animate-spin w-6 h-6" />
          <span>Loading document...</span>
        </div>
      ) : document ? (
        <iframe
          src={pdfUrl}
          className="w-full h-full border rounded-lg shadow"
        />
      ) : (
        <p className="text-red-500">Document not found</p>
      )}
    </div>
  );
};

export default Editor;
