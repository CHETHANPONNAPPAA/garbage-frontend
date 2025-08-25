import GarbageRequests from "./GarbageRequests";
import { useAuth } from "./AuthContext";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-blue-200">
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
        </nav>
      <div className="flex justify-between items-center bg-white/80 backdrop-blur-md text-green-900 px-8 py-4 rounded-b-2xl shadow-lg border-b border-green-100">
        <span className="font-semibold">
          Logged in as <b>{user.name}</b> (User)
        </span>
        <button
          onClick={logout}
          className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-5 py-2 rounded-lg font-bold shadow hover:from-green-600 hover:to-blue-600 transition"
        >
          Logout
        </button>
      </div>
      <div className="flex justify-center items-start p-8">
        <GarbageRequests />
      </div>
    </div>
  );
}
