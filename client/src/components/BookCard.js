import React, { useState } from 'react';
import { borrowService } from '../services/api';

const BookCard = ({ book, onBorrow }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBorrow = async () => {
    setError(null);
    setLoading(true);

    try {
      await borrowService.borrowBook(book.id);
      if (onBorrow) {
        onBorrow();
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      // Extract error message from the API response
      const errorMessage = error.response?.data?.detail || 'Failed to borrow book';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{book.title}</h5>
        <p className="card-text text-muted mb-1">{book.author}</p>
        <span className="badge bg-info text-white mb-2">{book.genre}</span>

        {error && (
          <div className="alert alert-danger py-2 mt-2 mb-2" role="alert">
            <small>{error}</small>
          </div>
        )}

        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {book.available_copies} of {book.total_copies} available
            </small>
            {book.available_copies > 0 ? (
              <button
                className="btn btn-primary btn-sm"
                onClick={handleBorrow}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                    Borrowing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-book-fill me-1"></i> Borrow
                  </>
                )}
              </button>
            ) : (
              <button className="btn btn-secondary btn-sm" disabled>
                <i className="bi bi-x-circle me-1"></i> Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
