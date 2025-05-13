import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { borrowService } from '../services/api';
import BorrowTable from '../components/BorrowTable';

const BorrowedBooks = () => {
  const [borrowRecords, setBorrowRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasActiveBooks, setHasActiveBooks] = useState(false);

  const fetchBorrowedBooks = async () => {
    setLoading(true);
    try {
      const response = await borrowService.getBorrowedBooks();
      setBorrowRecords(response.data);
      
      // Check if user has any active (non-returned) books
      const activeBooks = response.data.some(record => !record.is_returned);
      setHasActiveBooks(activeBooks);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
      setError('Failed to load borrowed books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowedBooks();
  }, []);

  const handleReturn = () => {
    // Refresh the borrow records after returning a book
    fetchBorrowedBooks();
  };

  return (
    <div>
      <div className="card shadow-sm">
        <div className="card-body p-4">
          <h1 className="h3 mb-4 text-primary">
            <i className="bi bi-bookmark-check-fill me-2"></i> My Borrowing History
          </h1>
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          ) : (
            <BorrowTable borrowRecords={borrowRecords} onReturn={handleReturn} />
          )}
          
          {borrowRecords.length === 0 && !loading && !error && (
            <div className="text-center py-5">
              <p className="lead mb-3">You don't have any borrowing history yet.</p>
              <Link to="/search" className="btn btn-primary btn-lg">
                <i className="bi bi-search me-2"></i> Find a Book
              </Link>
            </div>
          )}
        </div>
      </div>

      {hasActiveBooks && (
        <div className="card shadow-sm mt-4">
          <div className="card-body p-4">
            <h2 className="h5 mb-3 text-info">
              <i className="bi bi-info-circle-fill me-2"></i> Borrowing Guidelines
            </h2>
            <div className="row row-cols-1 row-cols-md-3 g-3">
              <div className="col">
                <div className="card bg-light border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-secondary">
                      <i className="bi bi-calendar-event me-2"></i> Return Dates
                    </h5>
                    <p className="card-text small">
                      Please return your books by the due date to avoid any late fees. Timely
                      returns help us keep our collection accessible to everyone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card bg-light border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-secondary">
                      <i className="bi bi-stack me-2"></i> Maximum Books
                    </h5>
                    <p className="card-text small">
                      You are welcome to borrow up to 5 books at any given time. This allows more
                      users to enjoy our diverse collection.
                    </p>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card bg-light border-0 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-secondary">
                      <i className="bi bi-hourglass-split me-2"></i> Borrowing Period
                    </h5>
                    <p className="card-text small">
                      Each book can be borrowed for a period of 14 days. If you need more time,
                      please consider renewing your loan if the book is not on hold.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowedBooks;
