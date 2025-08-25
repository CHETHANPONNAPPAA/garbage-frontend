import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./AuthContext";
import Login from "./Login";
import Register from "./Register";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import AdminUserManagement from "./AdminUserManagement";
import AdminRequestManagement from "./AdminRequestManagement";
import Landing from "./Landing";

function RequireAuth({ children, role }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  if (role && user.role !== role)
    return <Navigate to={user.role === "admin" ? "/admin" : "/user"} replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          !user ? (
            <Login />
          ) : (
            <Navigate to={user.role === "admin" ? "/admin" : "/user"} />
          )
        }
      />
      <Route
        path="/register"
        element={
          !user ? (
            <Register />
          ) : (
            <Navigate to={user.role === "admin" ? "/admin" : "/user"} />
          )
        }
      />
      <Route
        path="/user"
        element={
          <RequireAuth role="user">
            <UserDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin"
        element={
          <RequireAuth role="admin">
            <AdminDashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/users"
        element={
          <RequireAuth role="admin">
            <AdminUserManagement />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/requests"
        element={
          <RequireAuth role="admin">
            <AdminRequestManagement />
          </RequireAuth>
        }
      />
      <Route path="/" element={<Landing />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
