"use client";

import type React from "react";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  FileText,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";

export default function Editor() {
  const [file, setFile] = useState<File | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Mock data for demonstration
  const mockPages = [
    { id: 1, thumbnail: "/placeholder.svg?height=150&width=120" },
    { id: 2, thumbnail: "/placeholder.svg?height=150&width=120" },
    { id: 3, thumbnail: "/placeholder.svg?height=150&width=120" },
  ];

  const mockRecipients = [
    { id: 1, name: "John Doe", email: "john@example.com" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      // In a real app, you would process the PDF here
      setTotalPages(mockPages.length);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-zinc-50">
      {file ? (
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column - Page Thumbnails */}
          <div className="w-64 border-r border-zinc-200 bg-white overflow-y-auto flex flex-col">
            <div className="p-3 border-b border-zinc-200">
              <h2 className="font-medium text-zinc-900">Pages</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {mockPages.map((page) => (
                <div
                  key={page.id}
                  className={`border-2 ${
                    currentPage === page.id
                      ? "border-blue-500"
                      : "border-zinc-200"
                  } rounded-md cursor-pointer hover:border-blue-300 transition-colors`}
                  onClick={() => setCurrentPage(page.id)}
                >
                  <img
                    src={page.thumbnail || "/placeholder.svg"}
                    alt={`Page ${page.id}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column - PDF Viewer */}
          <div className="flex-1 flex flex-col bg-zinc-100 overflow-hidden">
            <div className="bg-white border-b border-zinc-200 p-2 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded hover:bg-zinc-100">
                  <ArrowLeft className="w-5 h-5 text-zinc-600" />
                </button>
                <span className="text-zinc-700">
                  {currentPage} of {totalPages}
                </span>
                <button className="p-1 rounded hover:bg-zinc-100">
                  <ArrowRight className="w-5 h-5 text-zinc-600" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto relative">
              {/* PDF Content */}
              <div className="flex justify-center p-8 min-h-full">
                <div className="bg-white shadow-lg rounded-md w-[595px] h-[842px] relative">
                  {/* This would be your actual PDF renderer */}
                  <div className="absolute inset-0 p-8 overflow-auto">
                    <h2 className="text-xl font-bold mb-4">
                      DUMMY AGREEMENT FOR E-SIGNATURE WORKFLOW
                    </h2>
                    <p className="mb-2">
                      <strong>Agreement Title:</strong> Sample Contract for
                      E-Sign Workflow
                    </p>
                    <p className="mb-4">
                      <strong>
                        This Agreement is made on this 1st day of March, 2025
                      </strong>
                      , by and between:
                    </p>

                    <ol className="list-decimal pl-5 mb-4 space-y-1">
                      <li>
                        <strong>Party A:</strong> John Doe Enterprises
                      </li>
                      <li>
                        <strong>Party B:</strong> Jane Smith Consulting
                      </li>
                      <li>
                        <strong>Party C:</strong> Acme Solutions Ltd.
                      </li>
                    </ol>

                    <h3 className="font-bold mb-2">Terms and Conditions:</h3>
                    <ol className="list-decimal pl-5 mb-4 space-y-2">
                      <li>
                        <strong>Purpose:</strong> This document is a sample
                        agreement to demonstrate an electronic signature
                        workflow.
                      </li>
                      <li>
                        <strong>Scope:</strong> The parties agree to use this
                        document solely for testing e-signature functionality.
                      </li>
                      <li>
                        <strong>Validity:</strong> This document has no legal
                        binding and is used for demonstration purposes only.
                      </li>
                    </ol>

                    <h3 className="font-bold mb-2">Signature Section:</h3>
                    <div className="mb-4">
                      <p className="mb-1">
                        <strong>Party A</strong>
                      </p>
                      <p>Signature: _________________________</p>
                    </div>
                    <div className="mb-4">
                      <p className="mb-1">
                        <strong>Party B</strong>
                      </p>
                      <p>Signature: _________________________</p>
                    </div>
                    <div className="mb-4">
                      <p className="mb-1">
                        <strong>Party C</strong>
                      </p>
                      <p>Signature: _________________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recipients and Fields */}
          <div className="w-80 border-l border-zinc-200 bg-white overflow-hidden flex flex-col">
            {/* Recipients Section */}
            <div className="border-b border-zinc-200">
              <div className="p-3 border-b border-zinc-200">
                <h2 className="font-medium text-zinc-900">Recipients</h2>
              </div>
              <div className="p-3 space-y-3">
                {mockRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center justify-between bg-blue-50 rounded-md p-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700">
                        {recipient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{recipient.name}</p>
                        <p className="text-xs text-zinc-500">
                          {recipient.email}
                        </p>
                      </div>
                    </div>
                    <button className="text-zinc-400 hover:text-zinc-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button className="w-full border border-zinc-300 rounded-md py-2 px-4 text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center justify-center">
                  <Plus className="w-4 h-4 mr-2" />
                  <span>Add recipients</span>
                </button>
              </div>
            </div>

            {/* Fields Section */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 border-b border-zinc-200">
                <h2 className="font-medium text-zinc-900">Fields</h2>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between border border-zinc-200 rounded-md p-2 cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-center">
                    <span className="w-8 h-8 flex items-center justify-center">
                    ✍️
                    </span>
                    <span className="text-sm">Signature</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Upload a PDF to get started
            </h2>
            <p className="text-zinc-600 mb-6">
              Upload a PDF document to add e-signature fields and assign
              recipients.
            </p>
            <label className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md cursor-pointer transition-colors inline-flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}
    </div>
  );
}
