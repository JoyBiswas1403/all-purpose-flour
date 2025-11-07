import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <nav className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/70 bg-neutral-900/90 border-b border-neutral-800">
      <div className="container-page h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-extrabold text-xl tracking-tight text-white">ShiftSwap</Link>
          {user && (
            <div className="hidden md:flex gap-4 text-sm text-neutral-300">
              <Link to="/" className="hover:text-white">Dashboard</Link>
              <Link to="/marketplace" className="hover:text-white">Marketplace</Link>
              <Link to="/requests" className="hover:text-white">Requests</Link>
            </div>
          )}
        </div>
        {user ? (
          <div className="flex items-center gap-4 text-sm">
            <span className="text-neutral-300">Hi, {user.name}</span>
            <button
              onClick={() => { logout(); nav('/login'); }}
              className="btn-secondary"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-3 text-sm">
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}