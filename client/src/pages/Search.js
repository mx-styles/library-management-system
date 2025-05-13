import React, { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import BookList from '../components/BookList';

const Search = () => {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const fetchBooks = async (searchQuery = '') => {
    setLoading(true);
    try {
      const response = await bookService.getAllBooks(searchQuery);
      setBooks(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching books:', error);
      setError('Failed to load books. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Search on keypress with debounce
  const handleQueryChange = (e) => {
    const searchValue = e.target.value;
    setQuery(searchValue);

    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Set a new timeout to delay the search until typing stops
    const timeout = setTimeout(() => {
      fetchBooks(searchValue);
    }, 300); // 300ms delay

    setTypingTimeout(timeout);
  };

  // For form submission (when user presses Enter)
  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(query);
  };

  const handleBorrow = () => {
    // Refresh the book list after borrowing
    fetchBooks(query);
  };

  return (
    <div>
      <div className="text-center mb-4">
        <h1 className="h1 fw-bold text-primary">
          <i className="bi bi-search me-2"></i> Our Book Collection
        </h1>
        <p className="lead text-muted">Explore our extensive library. Find your next adventure!</p>
        <form onSubmit={handleSearch} className="mt-4">
          <div className="input-group">
            <input
              id="searchInput"
              type="text"
              className="form-control form-control-lg"
              placeholder="Search by title, author, or genre..."
              aria-label="Search"
              value={query}
              onChange={handleQueryChange}
            />
            <button className="btn btn-primary" type="submit" id="search-button">
              <i className="bi bi-search me-1"></i> Search
            </button>
          </div>
        </form>
      </div>

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
        <BookList books={books} onBorrow={handleBorrow} />
      )}
    </div>
  );
};

export default Search;
