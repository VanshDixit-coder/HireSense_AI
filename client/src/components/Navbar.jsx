import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-navy/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="font-heading text-xl font-bold text-white">
          HireSense <span className="text-primary">AI</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/jobs" className={linkClass}>Jobs</NavLink>
              <NavLink to="/resume" className={linkClass}>Resume</NavLink>
              <NavLink to="/profile" className={linkClass}>Profile</NavLink>
            </>
          ) : (
            <>
              <a href="/#features" className="text-sm font-semibold text-white/60 transition hover:text-white">Features</a>
              <a href="/#how" className="text-sm font-semibold text-white/60 transition hover:text-white">How it works</a>
            </>
          )}
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-white/60 sm:inline">{user?.name}</span>
              <button type="button" onClick={handleLogout} className="btn-secondary px-4 py-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary px-4 py-2">Login</Link>
              <Link to="/register" className="btn-primary px-4 py-2">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
