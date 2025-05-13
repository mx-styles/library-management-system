import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { borrowService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { currentUser } = useAuth();
  const [activeBorrows, setActiveBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBorrowedBooks = async () => {
      try {
        const response = await borrowService.getBorrowedBooks();
        // Filter only active (not returned) borrows
        const active = response.data.filter(record => !record.is_returned);
        setActiveBorrows(active);
      } catch (error) {
        console.error('Error fetching borrowed books:', error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchBorrowedBooks();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="text-center py-5">
        <h1 className="display-5 fw-bold text-primary mb-4">
          <i className="bi bi-book-fill me-2"></i> Welcome to the Library
        </h1>
        <p className="lead mb-4">
          Explore a world of knowledge and stories. Log in or register to get started.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <Link to="/login" className="btn btn-primary btn-lg px-4 gap-3">
            Login
          </Link>
          <Link to="/register" className="btn btn-outline-secondary btn-lg px-4">
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="card shadow-lg mb-5">
        <div className="card-body p-4 p-md-5">
          <h1 className="h2 mb-4 text-primary">
            <i className="bi bi-emoji-smile me-2"></i> Welcome back, {currentUser.username}!
          </h1>
          <p className="lead mb-4">
            It's great to see you again! Explore the library and discover your next read.
          </p>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card bg-light border-0 shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="h5 mb-2 text-info">
                      <i className="bi bi-search me-2"></i> Search for Books
                    </h3>
                    <p className="small text-muted">
                      Find books by title, author, or keywords. Our advanced search helps you
                      pinpoint exactly what you're looking for.
                    </p>
                  </div>
                  <Link to="/search" className="btn btn-primary mt-3">
                    <i className="bi bi-book-search me-2"></i> Start Searching
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card bg-light border-0 shadow-sm h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <h3 className="h5 mb-2 text-info">
                      <i className="bi bi-book-half me-2"></i> Your Books
                    </h3>
                    <p className="small text-muted">
                      View your currently borrowed books, their due dates, and manage your loans.
                      Keep track of your reading history.
                    </p>
                  </div>
                  <Link to="/borrowed" className="btn btn-outline-secondary mt-3">
                    <i className="bi bi-book-fill me-2"></i> View Your Books
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h2 className="h4 mb-4 text-success">
            <i className="bi bi-activity me-2"></i> Your Recent Activity
          </h2>
          {activeBorrows.length > 0 ? (
            <>
              <p className="mb-3">
                You currently have{' '}
                <span className="fw-semibold">{activeBorrows.length}</span>{' '}
                {activeBorrows.length === 1 ? 'book' : 'books'} borrowed:
              </p>
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Book Title</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBorrows.map((record) => (
                      <tr key={record.id}>
                        <td>{record.book.title}</td>
                        <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
                        <td>{new Date(record.due_date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Link to="/borrowed" className="btn btn-sm btn-outline-secondary mt-3">
                <i className="bi bi-arrow-right me-2"></i> See All Your Books
              </Link>
            </>
          ) : (
            <div className="text-center py-3">
              <p className="text-muted mb-3">You haven't borrowed any books yet.</p>
              <Link to="/search" className="btn btn-primary">
                <i className="bi bi-search me-2"></i> Find a Book
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
