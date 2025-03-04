import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FileText, Menu, X, PenTool, BookUser, CircleUser } from "lucide-react";
import { Button } from "./button";
import { logout } from "@/api/auth.service";

const navItems = [
  { name: "Documents", path: "/", icon: FileText },
  { name: "Request E-Signature", path: "/upload", icon: PenTool },
  { name: "Contacts list", path: "/contact", icon: BookUser },
  { name: "My Profile", path: "/profile", icon: CircleUser },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);


  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="w-0 lg:w-64 h-full flex">
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-zinc-200 rounded-md lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-zinc-100 transition-transform duration-300 ease-in-out transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-center h-16 bg-zinc-200">
            <NavLink to={"/"} className="text-2xl font-bold text-zinc-800">
              E Signature
            </NavLink>
          </div>

          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-2 px-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-md transition-colors ${
                        isActive
                          ? "bg-zinc-200 text-zinc-900"
                          : "text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 border-t border-zinc-200">
            <Button className="w-full" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
