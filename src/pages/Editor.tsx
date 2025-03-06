import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDocumentById } from "@/api/document.service";
import SignatureCanvas from "react-signature-canvas";
import { Loader2 } from "lucide-react";
import { IDocuments } from "@/types";

const A4_WIDTH = 595; // A4 standard width in points
const A4_HEIGHT = 842; // A4 standard height in points

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<IDocuments>();
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [pdfSize, setPdfSize] = useState({ width: 0, height: 0 });

  const signatureRef = useRef<SignatureCanvas | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDocument = async () => {
      try {
        const response = await getDocumentById(id);
        if (response.status === 1) {
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

  const pdfUrl = document
    ? `${document.base_url}${document.root}${document.folder}${document.name}`
    : "";

  useEffect(() => {
    const updatePdfSize = () => {
      if (iframeRef.current) {
        const rect = iframeRef.current.getBoundingClientRect();
        setPdfSize({ width: rect.width, height: rect.height });
      }
    };

    setTimeout(updatePdfSize, 1000);
    window.addEventListener("resize", updatePdfSize);
    return () => window.removeEventListener("resize", updatePdfSize);
  }, []);

  const clearSignature = () => {
    signatureRef.current?.clear();
  };

  const placeSignature = () => {
    if (!document || !selectedUser) return;
    
    const userDoc = document.user_document.find(user => user.user.id === selectedUser);
    if (!userDoc || !signatureRef.current) return;

    const signatureData = signatureRef.current.toDataURL("image/png");

    const img = new Image();
    img.src = signatureData;
    img.onload = () => {
      const scaleX = pdfSize.width / A4_WIDTH;
      const scaleY = pdfSize.height / A4_HEIGHT;

      const xPos = userDoc.signature_box.x * scaleX;
      const yPos = userDoc.signature_box.y * scaleY;
      const width = userDoc.signature_box.width * scaleX;
      const height = userDoc.signature_box.height * scaleY;

      const imgElement = window.document.createElement("img");

      imgElement.src = signatureData;
      imgElement.style.position = "absolute";
      imgElement.style.left = `${xPos}px`;
      imgElement.style.top = `${yPos}px`;
      imgElement.style.width = `${width}px`;
      imgElement.style.height = `${height}px`;
      imgElement.style.pointerEvents = "none";

      pdfContainerRef.current?.appendChild(imgElement);
    };
  };

  return (
    <div className="flex flex-col items-center p-6">
      <h1 className="text-lg font-semibold flex items-center space-x-3">
        <Loader2 className="w-6 h-6 text-gray-600" />
        <span>PDF Signature</span>
      </h1>

      <div className="flex mt-5 space-x-6">
        {/* PDF Viewer */}
        <div className="relative w-[700px] h-[80vh] border-4 border-gray-300 rounded-lg bg-white p-2" ref={pdfContainerRef}>
          {loading ? (
            <div className="flex items-center space-x-2 text-gray-600 justify-center h-full">
              <Loader2 className="animate-spin w-6 h-6" />
              <span>Loading document...</span>
            </div>
          ) : document ? (
            <iframe ref={iframeRef} src={pdfUrl} className="w-full h-full" />
          ) : (
            <p className="text-red-500 text-center">Document not found</p>
          )}
        </div>

        {/* Signature Input Panel */}
        <div className="w-[300px] flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-md font-semibold mb-2">Draw Your Signature</h2>
          
          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            canvasProps={{
              width: 250,
              height: 100,
              className: "bg-white border rounded",
            }}
          />

          <div className="flex space-x-2 mt-2">
            <button onClick={clearSignature} className="bg-red-500 text-white px-3 py-1 rounded">
              Clear
            </button>
          </div>

          <h3 className="text-sm font-semibold mt-4">Select User</h3>
          <select
            className="w-full border p-2 rounded mt-2"
            value={selectedUser || ""}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Select a User --</option>
            {document?.user_document.map((userDoc) => (
              <option key={userDoc.user.id} value={userDoc.user.id}>
                {userDoc.user.name} ({userDoc.role})
              </option>
            ))}
          </select>

          <button
            onClick={placeSignature}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign
          </button>
        </div>
      </div>
    </div>
  );
};

export default Editor;
