import React from 'react';
import BookCard from './BookCard';

const BookList = ({ books, onBorrow }) => {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-5">
        <p className="lead text-muted">No books found.</p>
      </div>
    );
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
      {books.map((book) => (
        <div className="col" key={book.id}>
          <BookCard book={book} onBorrow={onBorrow} />
        </div>
      ))}
    </div>
  );
};

export default BookList;
