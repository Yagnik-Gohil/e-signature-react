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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IContacts } from "@/types";
import { useEffect, useState } from "react";
import { createContact, editContact, getContacts } from "@/api/contact.service";
import { Button } from "@/components/ui/button";
import { CirclePlus, Pencil } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";

const ContactList = () => {
  const [list, setList] = useState<IContacts[]>([]);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchList = async () => {
    const result = await getContacts(limit, offset);
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

  // Handle Add Contact
  const handleSaveContact = async () => {
    if (!name || !email) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (isEditing && editingId) {
      await editContact(editingId, { recipient_name: name, email });
    } else {
      await createContact({ recipient_name: name, email });
    }

    setOpenDialog(false);
    setName("");
    setEmail("");
    setIsEditing(false);
    fetchList(); // Refresh list
  };
  // Open Edit Modal
  const handleEdit = (contact: IContacts) => {
    setEditingId(contact.id);
    setName(contact.recipient_name);
    setEmail(contact.recipient.email);
    setIsEditing(true);
    setOpenDialog(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-6 text-zinc-900">My Contacts</h1>
        <div className="flex flex-row gap-2">
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setName("");
                  setEmail("");
                }}
              >
                <CirclePlus className="mr-2" />
                Add Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? "Update" : "Add"} Details</DialogTitle>
                <DialogDescription>
                  Enter name and email
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    email
                  </Label>
                  <Input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveContact}>
                  {isEditing ? "Update Contact" : "Save Contact"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <Table className="w-full border rounded-lg shadow-sm">
        <TableHeader className="bg-gray-100">
          <TableRow>
            <TableHead className="text-left text-gray-700 uppercase px-4 py-3">
              Name
            </TableHead>
            <TableHead className="text-left text-gray-700 uppercase px-4 py-3">
              Email
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
                <TableCell className="px-4 py-3 font-medium">
                  {item.recipient_name}
                </TableCell>
                <TableCell className="px-4 py-3 font-medium">
                  {item.recipient.email}
                </TableCell>
                <TableCell className="px-4 py-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
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

export default ContactList;
