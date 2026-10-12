import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">Movie Booking</Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/">Movies</Link>
            {user.role === "ADMIN" && <Link to="/admin/movies">Manage Movies</Link>}
            <span className="nav-user">{user.email}</span>
            <button onClick={handleSignOut}>Sign Out</button>
          </>
        ) : (
          <Link to="/login">Sign In</Link>
        )}
      </div>
    </nav>
  );
}