import GarbageRequests from "./GarbageRequests";
import { useAuth } from "./AuthContext";
import { Link } from "react-router-dom";

export default function AdminRequestManagement() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-green-100 to-green-200">
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 bg-blue-100/80 backdrop-blur-md shadow-md relative z-50">
        <div className="flex items-center gap-2">
          <img
            src="/image.png"
            alt="Recycle Logo"
            className="w-10 h-10 md:w-12 md:h-12 object-contain"
            style={{ background: "none" }}
          />
          <span className="text-lg md:text-2xl font-bold text-blue-700">
            Garbage Management System
          </span>
        </div>
        <div className="flex gap-4">
          <Link
            to="/admin/users"
            className="text-blue-700 font-semibold hover:underline"
          >
            Users
          </Link>
          <button
            onClick={logout}
            className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-5 py-2 rounded-lg font-bold shadow hover:from-blue-600 hover:to-green-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="p-8">
        <GarbageRequests />
      </div>
    </div>
  );
}
