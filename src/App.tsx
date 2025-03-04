import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/ui/Sidebar";
import NotFound from "./pages/NotFound";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import FileUpload from "./pages/FileUpload";
import DocumentList from "./pages/DocumentList";
import ContactList from "./pages/ContactList";
import Editor from "./pages/Editor";

function App() {
  const location = useLocation();

  const publicRoutes = ["/login", "/signup"];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 select-none">
      <Toaster position="top-right" reverseOrder={false} />

      {!isPublicRoute && <Sidebar />}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DocumentList />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/upload" element={<FileUpload />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/contact" element={<ContactList />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
