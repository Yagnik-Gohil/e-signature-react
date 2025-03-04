import { getDocuments } from "@/api/document.service";
import DataNotFound from "@/components/DataNotFound";
import Pagination from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IDocuments, SignatureStatus, UserDocumentType } from "@/types";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const DocumentList = () => {
  const [list, setList] = useState<IDocuments[]>([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("user_id");

  const fetchList = async () => {
    const result = await getDocuments(limit, offset);
    setList(result.data);
    setTotal(result.total);
  };

  useEffect(() => {
    fetchList();
  }, [limit, offset]);

  const handleNextPage = () => {
    if (offset + limit < total) {
      setOffset((prevOffset) => prevOffset + limit);
    }
  };

  const handlePreviousPage = () => {
    if (offset > 0) {
      setOffset((prevOffset) => prevOffset - limit);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-zinc-900">My Documents</h1>
      </div>
      <Table className="w-full border rounded-lg shadow-sm">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-left text-gray-700 uppercase px-4 py-3">
              Title
            </TableHead>
            <TableHead className="text-left text-gray-700 uppercase px-4 py-3">
              File
            </TableHead>
            <TableHead className="text-left text-gray-700 uppercase px-4 py-3">
              Status
            </TableHead>
            <TableHead className="text-left text-gray-700 uppercase px-4 py-3">
              Owner
            </TableHead>
            <TableHead className="text-left text-gray-700 uppercase px-4 py-3">
              Signers
            </TableHead>
            <TableHead className="text-left text-gray-700 uppercase px-4 py-3">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {list.length > 0 ? (
            list.map((item) => (
              <TableRow
                key={item.id}
                className="border-b hover:bg-gray-50 transition"
              >
                {/* Title */}
                <TableCell className="px-4 py-3 font-medium">
                  {item.title}
                </TableCell>

                {/* File Link */}
                <TableCell className="px-4 py-3">
                  <Link
                    to={item.base_url + item.root + item.folder + item.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline hover:text-blue-700"
                  >
                    View
                  </Link>
                </TableCell>

                {/* Status with Badge */}
                <TableCell className="px-4 py-3 capitalize">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      item.status === "signed"
                        ? "bg-green-100 text-green-700"
                        : item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>

                {/* Owner Name */}
                <TableCell className="px-4 py-3 capitalize font-medium">
                  {item.user_documents.find(
                    (user) => user.type === UserDocumentType.OWNER
                  )?.user.name || "N/A"}
                </TableCell>

                {/* Signers Dropdown */}
                <TableCell className="px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="px-3 py-1 text-sm font-medium bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                      View Signers
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-80 p-3 bg-white shadow-lg rounded-lg border">
                      {item.user_documents.map((data, index) => (
                        <DropdownMenuItem
                          key={index}
                          className="flex flex-col items-start p-4 border-b last:border-0 hover:bg-gray-50 transition"
                        >
                          {/* User Name & Type */}
                          <div className="flex flex-col w-full">
                            <span className="font-semibold text-gray-900">
                              {data.user.name}
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-gray-200 text-gray-700">
                                {data.type}
                              </span>
                            </span>
                            <span className="text-sm text-gray-500">
                              {data.user.email}
                            </span>
                          </div>

                          {/* Role */}
                          <div className="w-full mt-2 text-sm text-gray-600">
                            <strong>Role:</strong> {data.role}
                          </div>

                          {/* Signature Status */}
                          <div className="w-full mt-2 flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">
                              Signature Status:
                            </span>
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full capitalize
                                ${
                                  data.status === SignatureStatus.SIGNED
                                    ? "bg-green-100 text-green-700"
                                    : data.status === SignatureStatus.PENDING
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                            >
                              {data.status}
                            </span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>

                <TableCell className="px-4 py-3 capitalize font-medium">
                  <Button
                    disabled={
                      currentUser !=
                      item.user_documents.find(
                        (user) => user.type === UserDocumentType.OWNER
                      )?.user.id
                    }
                    onClick={() => navigate(`editor/${item.id}`)}
                    variant="outline"
                  >
                    <Edit></Edit> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4">
                <DataNotFound />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination
        offset={offset}
        limit={limit}
        total={total}
        setOffset={setOffset}
        setLimit={setLimit}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
      />
    </div>
  );
};

export default DocumentList;
