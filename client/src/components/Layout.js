import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-book me-2"></i> Group-Two Library
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              {currentUser ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/search">
                      Search
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/borrowed">
                      My Books
                    </Link>
                  </li>
                  {currentUser.isAdmin && (
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin">
                        <i className="bi bi-gear-fill me-1"></i> Admin
                      </Link>
                    </li>
                  )}
                  <li className="nav-item">
                    <button className="nav-link btn btn-link" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">
        <div className="container py-4">{children}</div>
      </main>

      <footer className="bg-light py-4 mt-auto">
        <div className="container text-center">
          <p className="mb-0 text-muted">
            &copy; {new Date().getFullYear()} Group-Two Library
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
