import React from 'react';
import { borrowService } from '../services/api';

const BorrowTable = ({ borrowRecords, onReturn }) => {
  const handleReturn = async (borrowId) => {
    try {
      await borrowService.returnBook(borrowId);
      if (onReturn) {
        onReturn();
      }
    } catch (error) {
      console.error('Error returning book:', error);
    }
  };

  if (!borrowRecords || borrowRecords.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="lead text-muted">You don't have any borrowing history yet.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-light">
          <tr>
            <th>Book Title</th>
            <th>Author</th>
            <th>Borrow Date</th>
            <th>Due Date</th>
            <th>Return Date</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrowRecords.map((record) => (
            <tr key={record.id} className={record.is_returned ? 'table-light' : ''}>
              <td>{record.book.title}</td>
              <td>{record.book.author}</td>
              <td>{new Date(record.borrow_date).toLocaleDateString()}</td>
              <td>{new Date(record.due_date).toLocaleDateString()}</td>
              <td>
                {record.return_date
                  ? new Date(record.return_date).toLocaleDateString()
                  : '-'}
              </td>
              <td className="text-center">
                {!record.is_returned ? (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleReturn(record.id)}
                  >
                    <i className="bi bi-arrow-return-left me-1"></i> Return
                  </button>
                ) : (
                  <button className="btn btn-outline-secondary btn-sm" disabled>
                    <i className="bi bi-arrow-return-left me-1"></i> Returned
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BorrowTable;
