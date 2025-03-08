import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDocumentById } from "@/api/document.service";
import SignatureCanvas from "react-signature-canvas";
import { Loader2 } from "lucide-react";
import { IDocuments, IContacts } from "@/types";
import { getContacts } from "@/api/contact.service";
import { uploadSignature } from "@/api/upload.service";

const Editor = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [document, setDocument] = useState<IDocuments>();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState<IContacts[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [isSignatureAdded, setIsSignatureAdded] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const currentUser = localStorage.getItem("user_id");

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

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getContacts();
        if (response.status === 1) {
          setContacts(response.data);
        } else {
          console.error("Error fetching contacts:", response.message);
        }
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      }
    };

    fetchContacts();
  }, []);

  const pdfUrl = document
    ? `${document.base_url}${document.root}${document.folder}${document.name}`
    : "";

  const clearSignature = () => {
    signatureRef.current?.clear();
    setIsSignatureAdded(false);
  };

  const handleSignatureEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setIsSignatureAdded(true);
    }
  };

  const signDocument = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      alert("Please add a signature.");
      return;
    }

    if (document && document?.user_document.length < 3 && !selectedUser) {
      alert("Please select the next user.");
      return;
    }

    const dataUrl = signatureRef.current.toDataURL("image/png");
    const blob = await (await fetch(dataUrl)).blob();
    const file = new File([blob], "signature.png", { type: "image/png" });

    setIsUploading(true);

    try {
      const response = await uploadSignature(file, id!, selectedUser);
      if (response.status === 1) {
        navigate("/");
        // Handle success (e.g., navigate to another page or show a success message)
      } else {
        console.error("Error uploading signature:", response.message);
      }
    } catch (error) {
      console.error("Failed to upload signature:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const getNextRoleLabel = () => {
    const userCount = document?.user_document.length || 0;
    if (userCount === 1) return "Add Role 2 Signer";
    if (userCount === 2) return "Add Role 3 Signer";
    return "";
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6">
      <div className="flex space-x-6">
        {/* PDF Viewer */}
        <div
          className="relative w-[700px] h-[80vh] border-4 border-gray-300 rounded-lg bg-white p-2"
          ref={pdfContainerRef}
        >
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
        <div className="w-[400px] flex flex-col items-center bg-gray-100 p-6 rounded-lg shadow space-y-4 relative">
          <h2 className="text-lg font-semibold">Signature Panel</h2>

          <SignatureCanvas
            ref={signatureRef}
            penColor="black"
            onEnd={handleSignatureEnd}
            canvasProps={{
              width: 250,
              height: 100,
              className: "bg-white border rounded",
            }}
          />

          <div className="flex space-x-2">
            <button
              onClick={clearSignature}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>

          <h3 className="text-md font-semibold">User List</h3>
          <ul className="w-full border p-2 rounded bg-white shadow">
            {document?.user_document.map((userDoc) => (
              <li
                key={userDoc.user.id}
                className="flex justify-between items-center p-2 border-b last:border-b-0"
              >
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {userDoc.user.name}
                    {currentUser === userDoc.user.id && (
                      <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                        Me
                      </span>
                    )}
                  </span>
                  <span className="text-sm text-gray-600">{userDoc.role}</span>
                </div>
                <span className="text-sm text-gray-600">
                  {userDoc.user.email}
                </span>
              </li>
            ))}
          </ul>

          {document && document?.user_document.length < 3 && (
            <div className="w-full mt-4">
              <label className="block text-sm font-medium text-gray-700">
                {getNextRoleLabel()}
              </label>
              {contacts.length === 0 ? (
                <div className="text-center mt-2">
                  <p className="text-red-500 text-sm">
                    No contacts found. Please add contacts first.
                  </p>
                  <button
                    onClick={() => navigate("/contact")}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Go to Contacts
                  </button>
                </div>
              ) : (
                <select
                  className="w-full border p-2 rounded mt-2"
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">-- Select a User --</option>
                  {contacts.map((contact) => (
                    <option key={contact.id} value={contact.recipient.id}>
                      {contact.recipient_name} ({contact.recipient.email})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          <div className="mt-auto w-full">
            <button
              disabled={
                isUploading ||
                !isSignatureAdded ||
                (document &&
                  document?.user_document.length < 3 &&
                  !selectedUser)
              }
              onClick={signDocument}
              className={`w-full px-4 py-2 rounded ${
                isUploading ||
                !isSignatureAdded ||
                (document &&
                  document?.user_document.length < 3 &&
                  !selectedUser)
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-blue-500 text-white"
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Uploading...
                </div>
              ) : (
                "Sign"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;