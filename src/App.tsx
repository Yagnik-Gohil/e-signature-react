import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/ui/Sidebar";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";

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
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LogIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
