import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <nav className="border-b border-[#1e1e1e] px-6 py-3.5 flex items-center justify-between">
      <Link to="/home" className="text-white font-semibold text-sm tracking-tight">
        DevDocks
      </Link>

      <div className="flex items-center gap-4">
        <Link
          to="/dashboard"
          className="text-sm text-[#888] hover:text-white transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/invites"
          className="text-sm text-[#888] hover:text-white transition-colors"
        >
          Invites
        </Link>

        {user ? (
          <div className="flex items-center gap-3 ml-2 pl-4 border-l border-[#222]">
            <span className="text-xs text-[#555]">{user.name || user.email}</span>
            <button
              onClick={handleLogout}
              className="text-xs text-[#666] hover:text-white transition-colors"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-xs text-[#666] hover:text-white transition-colors ml-2"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}
